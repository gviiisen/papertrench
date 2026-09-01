/* Multichain paper trading (docs/MULTICHAIN.md as code).
 *
 * Debot's supported chains use their own native ledgers: SOL on Solana and
 * BNB on BSC. The chain filter is strict and the BSC resolver never asks a
 * Solana-only source or converts BNB fills into SOL.
 */
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const Q = require('../quote.js');

const EVM = '0x32708538A107253b51a735A724330a23106CA4Ca'; // checksummed
const EVM_LOWER = EVM.toLowerCase();

function bnbPair(overrides = {}) {
  return {
    chainId: 'bsc',
    pairAddress: '0x' + 'ab'.repeat(20),
    baseToken: { address: EVM, symbol: 'MC', name: 'MultiChain' },
    quoteToken: { address: '0x' + 'cd'.repeat(20), symbol: 'WBNB' },
    priceNative: '0.000123', // BNB-denominated — preserved for BSC fills
    priceUsd: '0.05',
    marketCap: 5_000_000,
    liquidity: { usd: 250_000 },
    dexId: 'pancakeswap',
    ...overrides,
  };
}

test('a BSC pair keeps its BNB-native price and records its native currency', () => {
  const payload = { pairs: [bnbPair()] };
  const rec = Q.tokenFromPayload(payload, EVM_LOWER, { chain: 'bsc' });
  assert.ok(rec, 'the record resolves');
  assert.equal(rec.chain, 'bsc');
  assert.equal(rec.priceNative, 0.000123, 'priceNative remains BNB-denominated');
  assert.equal(rec.nativeSymbol, 'BNB');
  assert.equal(rec.priceUsd, 0.05);
  assert.equal(rec.mcap, 5_000_000);
});

test('BSC resolution does not depend on a SOL/USD rate', () => {
  const payload = { pairs: [bnbPair()] };
  assert.ok(Q.tokenFromPayload(payload, EVM_LOWER, { chain: 'bsc', solUsd: 0 }));
  assert.ok(Q.tokenFromPayload(payload, EVM_LOWER, { chain: 'bsc' }));
});

test('the chain filter is strict: a bnb request ignores solana and ethereum pairs of the same address', () => {
  const payload = {
    pairs: [
      bnbPair({ chainId: 'solana', priceNative: '0.5' }),
      bnbPair({ chainId: 'ethereum', priceUsd: '9.99' }),
      bnbPair(), // the real one
    ],
  };
  const rec = Q.tokenFromPayload(payload, EVM_LOWER, { chain: 'bsc' });
  assert.ok(rec);
  assert.equal(rec.priceUsd, 0.05, 'only the bsc pair may answer a bnb request');
});

test('EVM address matching is case-tolerant; base58 stays case-SENSITIVE', () => {
  // Dexscreener returns checksummed addresses; page URLs are lowercase.
  const rec = Q.tokenFromPayload({ pairs: [bnbPair()] }, EVM_LOWER, { chain: 'bsc' });
  assert.ok(rec, 'lowercase URL address matches the checksummed pair base');
  assert.ok(Q.sameAddress(EVM, EVM_LOWER));
  assert.ok(!Q.sameAddress('So11111111111111111111111111111111111111112', 'so11111111111111111111111111111111111111112'),
    'base58 must never be compared case-insensitively');
});

test('pricesFromBatch groups one chain family per call and preserves BNB prices', () => {
  // The solana-variant pair here has NO SOL-native price, so neither family
  // may quote from the other's pair.
  const payload = { pairs: [bnbPair(), bnbPair({ chainId: 'solana', priceNative: '0' })] };
  const out = Q.pricesFromBatch(payload, { chain: 'bsc' });
  const rec = out[EVM];
  assert.ok(rec, 'keyed by the pair base address');
  assert.equal(rec.priceNative, 0.000123);
  // And the default call still speaks Solana only — the bsc pair, whose
  // priceNative is BNB-denominated, must never leak into a solana batch.
  assert.deepEqual(Object.keys(Q.pricesFromBatch(payload)), []);
});

test('the BSC resolver never asks Solana-only sources or fetches a SOL conversion rate', async () => {
  const urls = [];
  const realFetch = global.fetch;
  global.fetch = async (url) => {
    urls.push(String(url));
    return { ok: true, json: async () => ({ pairs: [bnbPair()] }) };
  };
  try {
    delete require.cache[require.resolve('../resolver.js')];
    const R = require('../resolver.js');
    R.clearCache();
    const rec = await R.resolve(EVM_LOWER, { chain: 'bsc' });
    assert.ok(rec, 'the foreign token resolves');
    assert.equal(rec.chain, 'bsc');
    assert.equal(rec.priceNative, 0.000123);
    assert.ok(!urls.some((u) => u.includes('/pairs/solana/')),
      'the Solana pair endpoint can never answer for a foreign chain');
    assert.ok(!urls.some((u) => u.includes('jup.ag') && u.includes(EVM_LOWER)),
      'Jupiter is never asked for a BSC token or a WSOL conversion rate');
  } finally {
    global.fetch = realFetch;
  }
});

test('engine fills and rounds carry the chain, defaulting to solana', () => {
  const E = require('../engine.js');
  const settings = E.defaultSettings();
  const state = E.defaultState(settings);
  const { trade, position } = E.buy(state, settings, {
    ts: 1_800_000_000_000, mint: EVM, symbol: 'MC', site: 'fomo',
    priceNative: 0.00025, priceUsd: 0.05, chain: 'bnb', solAmount: 1,
  });
  assert.equal(trade.chain, 'bnb');
  assert.equal(position.chain, 'bnb');
  const sold = E.sell(state, settings, {
    ts: 1_800_000_060_000, mint: EVM, site: 'fomo',
    qtyFraction: 1, priceNative: 0.0003, priceUsd: 0.06,
  });
  assert.equal(sold.trade.chain, 'bnb', 'the sell inherits the position chain');
  assert.equal(sold.round.chain, 'bnb', 'the round records where it happened');

  const sol = E.buy(state, settings, {
    ts: 1_800_000_120_000, mint: 'So11111111111111111111111111111111111111112',
    symbol: 'SOL', site: 'padre', priceNative: 1, solAmount: 1,
  });
  assert.equal(sol.trade.chain, 'solana', 'no chain passed means solana');
});

test('Solana and BSC use isolated native-currency virtual accounts', () => {
  const E = require('../engine.js');
  const settings = {
    ...E.defaultSettings(),
    balanceStartSol: 10,
    balanceStartBnb: 5,
    feeBps: 0,
    slippageBps: 0,
    gasSolPerTx: 0,
    tipSolPerTx: 0,
  };
  const state = E.defaultState(settings);

  assert.deepEqual(E.nativeAccount(state, 'solana'), { chain: 'solana', symbol: 'SOL', cash: 10, start: 10 });
  assert.deepEqual(E.nativeAccount(state, 'bsc'), { chain: 'bsc', symbol: 'BNB', cash: 5, start: 5 });

  const boughtBsc = E.buy(state, settings, {
    ts: 1_800_000_000_000,
    mint: EVM,
    symbol: 'MC',
    site: 'debot',
    chain: 'bsc',
    priceNative: 0.01,
    priceUsd: 6,
    nativeAmount: 1,
  });
  assert.equal(E.nativeAccount(state, 'bsc').cash, 4, 'BSC buy spends BNB');
  assert.equal(E.nativeAccount(state, 'solana').cash, 10, 'BSC buy cannot spend SOL');
  assert.equal(boughtBsc.trade.currency, 'BNB');
  assert.equal(boughtBsc.trade.nativeGross, 1);

  const soldBsc = E.sell(state, settings, {
    ts: 1_800_000_060_000,
    mint: EVM,
    site: 'debot',
    qtyFraction: 1,
    priceNative: 0.011,
    priceUsd: 6.6,
  });
  assert.ok(Math.abs(E.nativeAccount(state, 'bsc').cash - 5.1) < 1e-12, 'BSC proceeds return to BNB');
  assert.equal(E.nativeAccount(state, 'solana').cash, 10, 'BSC sell cannot credit SOL');
  assert.equal(soldBsc.round.currency, 'BNB');
  assert.ok(Math.abs(soldBsc.round.pnlNative - 0.1) < 1e-12);

  E.buy(state, settings, {
    ts: 1_800_000_120_000,
    mint: 'So11111111111111111111111111111111111111112',
    symbol: 'SOL',
    site: 'debot',
    chain: 'solana',
    priceNative: 1,
    nativeAmount: 2,
  });
  assert.equal(E.nativeAccount(state, 'solana').cash, 8, 'Solana buy spends SOL');
  assert.ok(Math.abs(E.nativeAccount(state, 'bsc').cash - 5.1) < 1e-12, 'Solana buy cannot spend BNB');
});

test('the overlay orders and displays BSC trades in BNB, not dollars or SOL', () => {
  const content = fs.readFileSync(path.join(__dirname, '..', 'content.js'), 'utf8');
  assert.match(content, /function panelCurrency\(\)/, 'the panel needs one chain-aware currency label');
  assert.match(content, /E\.nativeAccount\(state,\s*panelChain\(\)/,
    'the wallet readout must use the active chain account');
  assert.match(content, /nativeAmount:\s*solAmount/,
    'the fill sent to the engine must explicitly be chain-native');
  const panelUsdStart = content.indexOf('function panelUsd()');
  const panelUsdBody = content.slice(panelUsdStart, content.indexOf('\n  }', panelUsdStart) + 4);
  assert.match(panelUsdBody, /!== 'bsc'/, 'BSC must not enter the legacy dollar/SOL-conversion panel');
  assert.match(content, /\$\{a\} \$\{panelCurrency\(\)\}/,
    'BSC quick-buy presets must be labelled BNB');
});

test('recognizing BSC after panel mount redraws every denomination-sensitive control', () => {
  const content = fs.readFileSync(path.join(__dirname, '..', 'content.js'), 'utf8');
  const renderAllStart = content.indexOf('function renderAll()');
  const renderAll = content.slice(renderAllStart, content.indexOf('\n  }', renderAllStart) + 4);
  assert.match(renderAll, /renderPresets\(\)/,
    'the initial panel is rendered before token detection, so token adoption must redraw presets and hide the Solana limit row');

  const ledgerStart = content.indexOf('function renderPositionLedger(');
  const ledger = content.slice(ledgerStart, content.indexOf('\n  }', ledgerStart) + 4);
  assert.match(ledger, /panelCurrency\(\)/,
    'invested, sold, remaining and change must use the active chain currency');
  assert.doesNotMatch(ledger, /\$\{E\.fmt\(sol, 3\)\} SOL/,
    'the BSC position ledger must not append a hard-coded SOL suffix');
});

test('position rows retain their chain currency so portfolio UI cannot add SOL and BNB', () => {
  const state = {
    positions: {
      So11111111111111111111111111111111111111112: {
        chain: 'solana', symbol: 'SOLMEME', qty: 2, lastPriceNative: 1,
        costSol: 1, investedSol: 1, netInvestedSol: 1, openedAt: 1,
      },
      [EVM]: {
        chain: 'bsc', symbol: 'BSCMEME', qty: 2, lastPriceNative: 1,
        costSol: 1, investedSol: 1, netInvestedSol: 1, openedAt: 2,
      },
    },
  };
  const rows = Q.positionRows(state, {});
  const sol = rows.find((row) => row.chain === 'solana');
  const bsc = rows.find((row) => row.chain === 'bsc');
  assert.equal(sol.currency, 'SOL');
  assert.equal(bsc.currency, 'BNB');
  assert.equal(sol.pnlNative, 1);
  assert.equal(bsc.pnlNative, 1);
});

test('latest closed P&L reports the native BSC currency', () => {
  const E = require('../engine.js');
  const closed = E.latestClosedPnl({
    journal: [{ id: 's1', mint: EVM, side: 'sell', chain: 'bsc', ts: 2, pnlNative: 0.2, nativeNet: 1.2 }],
    rounds: [{ mint: EVM, chain: 'bsc', currency: 'BNB', closedAt: 2, pnlNative: 0.2, returnedNative: 1.2, investedNative: 1, pnlPct: 20 }],
  }, EVM);
  assert.equal(closed.currency, 'BNB');
  assert.equal(closed.pnlNative, 0.2);
  assert.equal(closed.returnedNative, 1.2);
});
