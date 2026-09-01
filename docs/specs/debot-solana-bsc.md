# Debot Solana + BSC paper trading

## Supported token routes

- `https://debot.ai/token/solana/<base58>`
- `https://debot.ai/token/solana/<numeric-id>_<base58>`
- `https://debot.ai/token/sol/<base58>` and the numeric-prefixed form
- `https://debot.ai/token/bsc/<0x40-hex>`
- `https://debot.ai/token/bsc/<numeric-id>_<0x40-hex>`

Chain/address mismatches are refused. A Solana route accepts only a 32–44
character base58 address; a BSC route accepts only an exact 20-byte hex
address.

## Live-price contract

- A pending Debot token retains the chain parsed from its URL before any
  resolver responds; a BSC contract is never retried as a Solana mint.
- BSC/EVM contract matching is case-insensitive, while Solana base58 matching
  remains case-sensitive.
- BSC page ticks remain BNB-native. An explicit matching native+USD pair may
  establish the first quote without waiting for an aggregator, but a cached
  SOL/USD rate is never used to convert a BSC price.
- If no chain-matching quote can be established from the resolver or Debot's
  own mint-tagged feed, the panel continues to report that it is fetching a
  price and refuses to fabricate a fill.

## Accounting contract

- Solana buys, sells, open positions, and realized P&L are denominated in SOL.
- BSC buys, sells, open positions, and realized P&L are denominated in BNB.
- Every denomination-sensitive panel control and position-ledger value redraws
  after asynchronous token detection: BSC shows BNB, Solana shows SOL, and the
  Solana-only pending-limit row is hidden on BSC.
- The two cash accounts are isolated. A BSC fill cannot debit or credit SOL,
  and a Solana fill cannot debit or credit BNB.
- Every fill, position, and closed round records its chain and native currency.

## Debot panel presentation

- The in-page panel shares the dashboard `EN` / `CN` locale choice. With no
  saved choice, it follows the page or browser language; changing the dashboard
  locale updates open trading tabs through extension storage.
- Debot alone receives a venue-matched visual skin: flat near-black surfaces,
  hairline separators, restrained green/red direction cues, and no decorative
  amber rim, sheen, or action-button glow. Other venue themes are unchanged.
- Mixed-chain position summaries show one result per currency; SOL and BNB are
  never added into a fabricated total.

Legacy Solana state remains compatible through the existing `cashSol`,
`pnlSol`, and `returnedSol` aliases. New chain-native fields are authoritative
for BSC.

## Debot chart contract

Debot can switch between TradingView and Lightweight Charts. The content
script posts each marker/line specification to both native adapters; the
implementation that is present owns the visible draw. In Lightweight mode,
the MAIN-world bridge finds the visible candlestick series under `#chart`, then:

- preserves Debot's existing B/S markers and merges paper markers with them;
- draws paper buys below bars and sells above bars;
- draws average buy/sell levels with native `createPriceLine` objects;
- snaps a fill timestamp to the nearest known chart bar;
- reattaches markers and price lines after Debot remounts the chart;
- leaves TradingView discovery available for pages where Debot makes that
  iframe the visible chart.

If the visible series cannot be found, the bridge reports that native chart
support is unavailable instead of inventing chart coordinates.

## Current limits

- Debot market buys/sells and fixed TP/SL evaluation are chain-native.
- Pending limit buys remain Solana-only, so that control is hidden on BSC.
- Solana-only on-chain risk probes are not run against BSC contracts.

## Verification

The regression suite covers strict URL parsing, pending-chain retention,
case-tolerant EVM feed matching, first-price bootstrapping without a SOL
conversion, isolated SOL/BNB accounts, native-currency position rows and
closed P&L, marker merging, average price lines, and chart remount recovery.

<!-- repo-context-ledger:changes:start -->
## Related changes

- [Implement Debot.ai paper trading for Solana and BSC](../changes/2026/09/20260901224410-gviiisen-949a04ecae-implement-debot-ai-paper-trading-for-solana-and-.md)
<!-- repo-context-ledger:changes:end -->
