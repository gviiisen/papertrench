const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const root = path.join(__dirname, '..');
const Q = require('../quote.js');
const address = '0xeb9e768c42d6f5b08d34980c6f721494372a7777';
const checksummed = '0xEb9E768C42D6f5b08D34980C6f721494372A7777';

test('the service worker accepts the bsc slug emitted by Debot', () => {
  const background = fs.readFileSync(path.join(root, 'background.js'), 'utf8');
  const start = background.indexOf('const KNOWN_CHAINS');
  const block = background.slice(start, background.indexOf('];', start) + 2);
  assert.match(block, /['"]bsc['"]/, 'bsc must not fall through to the Solana validator');
});

test('the page bridge groups EVM price records under their contract address', () => {
  const bridge = fs.readFileSync(path.join(root, 'price-bridge.js'), 'utf8');
  assert.match(bridge, /const EVM_RE\s*=\s*\/\^0x/);
  assert.match(bridge, /!\(BASE58_RE\.test\(value\) \|\| EVM_RE\.test\(value\)\)/,
    'Debot BSC payloads must not be flattened into an unowned top-level price');
});

test('the Debot bridge emits the exact visible USD title as a mint-owned fallback', () => {
  const bridge = fs.readFileSync(path.join(root, 'price-bridge.js'), 'utf8');
  assert.match(bridge, /function\s+debotVisibleUsdPrice\s*\(/);
  assert.match(bridge, /价格\|Price/);
  assert.match(bridge, /source:\s*['"]debot-dom-price['"]/);
  assert.match(bridge, /mint:\s*currentSymbolInfo\.mint/);
});

test('a pending Debot token retains its chain before the resolver answers', () => {
  const content = fs.readFileSync(path.join(root, 'content.js'), 'utf8');
  const start = content.indexOf('mint: candidate.address, srcAddress: candidate.address');
  const block = content.slice(start, start + 500);
  assert.ok(start >= 0, 'pending Debot token stand-in must exist');
  assert.match(block, /chain:\s*candidate\.chain\s*\|\|\s*['"]solana['"]/,
    'otherwise the panel says SOL and bootstrapping applies Solana rules to BSC');
  assert.match(block, /pending:\s*true/);
});

test('paired Debot native and USD candidates bootstrap a BSC price without Dexscreener', () => {
  const result = Q.bootstrapTick(
    { mint: address, chain: 'bsc' },
    {
      mint: checksummed,
      source: 'debot-ws',
      candidates: [
        { value: 0.0000004, unit: 'native', key: 'priceNative' },
        { value: 0.00024, unit: 'usd', key: 'priceUsd' },
      ],
    },
    0,
  );
  assert.equal(result.accepted, true);
  assert.ok(Math.abs(result.priceNative - 0.0000004) < 1e-18);
  assert.equal(result.priceUsd, 0.00024);
  assert.equal(result.basis, 'native+usd');
});

test('a Debot USD DOM tick bootstraps BSC with a real BNB/USD rate', () => {
  const result = Q.bootstrapTick(
    { mint: address, chain: 'bsc' },
    {
      mint: checksummed,
      source: 'debot-dom-price',
      candidates: [{ value: 0.00024, unit: 'usd', key: 'visiblePriceTitle' }],
    },
    600,
  );
  assert.equal(result.accepted, true);
  assert.ok(Math.abs(result.priceNative - 0.0000004) < 1e-18);
  assert.equal(result.priceUsd, 0.00024);
  assert.equal(result.basis, 'usd');
});

test('the content worker requests the correct native/USD rate for Debot chain', () => {
  const content = fs.readFileSync(path.join(root, 'content.js'), 'utf8');
  const background = fs.readFileSync(path.join(root, 'background.js'), 'utf8');
  assert.match(content, /type:\s*['"]pt_native_usd['"]/);
  assert.match(content, /nativeUsd\(candidate\.chain\)/);
  assert.match(background, /case\s+['"]pt_native_usd['"]/);
  assert.match(background, /R\.nativeUsd\(message\.chain\)/);
});

test('the BSC quote header labels its native price in BNB', () => {
  const fields = Q.headerFields({
    mint: address,
    chain: 'bsc',
    nativeSymbol: 'BNB',
    priceNative: 0.0000004,
  });
  assert.match(fields.priceText, / BNB$/);
  assert.doesNotMatch(fields.priceText, / SOL$/);
});
