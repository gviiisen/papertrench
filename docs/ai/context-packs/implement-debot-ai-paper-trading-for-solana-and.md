# Debot.ai paper trading for Solana and BSC context pack

Status: current
Feature: implement-debot-ai-paper-trading-for-solana-and
Aliases: Debot Solana BSC simulation | debot chart markers
Quality profile: evidence-v1
Language: en
Detail: standard
Source commit: a0e3b7b0e776f3b57624cb0280d9c7f77a2dccd0
Base branch: main
Base commit: a0e3b7b0e776f3b57624cb0280d9c7f77a2dccd0
Last refreshed: 2026-09-01T23:13:53+08:00

## Purpose

PaperTrench injects paper-trading controls into supported token pages and records fills without signing or sending real transactions. This feature adds Debot.ai token pages on Solana and BSC, keeps each chain's native virtual cash in a separate account, and renders paper fills and average-price lines in either TradingView or Lightweight Charts, matching the chart implementation Debot mounts.

## Load order

- Read first: `extension/sites.js`, `extension/content.js`, `extension/price-bridge.js`, and their targeted tests for URL detection and chart routing.
- Read if needed: `extension/engine.js` and `extension/quote.js` when native cash, quote currency, or PnL behavior changes; manifest and permissions files when adding the Debot host.
- Do not load by default: leaderboard server, website, bot, perps, prediction-market, and recording code unless a failing boundary test establishes a dependency.

## Entry points and code map

| Path / symbol | Role |
| --- | --- |
| `extension/sites.js` | Defines supported host adapters and extracts chain and contract identity from token-page URLs. |
| `extension/content.js` | Routes price ticks, fills, and average-line state between the page UI and the MAIN-world chart bridge. |
| `extension/price-bridge.js` | Supports Debot's runtime-selected chart: standard TradingView discovery plus a dedicated Lightweight Charts series bridge that preserves Debot's own markers. |
| `extension/engine.js` | Owns balances, positions, fills, and PnL; chain-native virtual accounts must remain isolated here. |
| `extension/quote.js` | Normalizes chain-aware live quotes used for fills and PnL. |
| `extension/test/sitescontract.test.js` | Public seam for supported URL shapes, chain IDs, and address extraction. |
| `extension/test/nativecharts.test.js` | Static/behavior seam for native chart integration and message routing. |
| `extension/test/multichain.test.js` | Public seam proving per-chain balance and currency isolation. |

## Contracts and boundaries

- Invariants and contracts: Solana positions spend and return SOL; BSC positions spend and return BNB. Balances, exposure, realized PnL, and displayed units must not be combined across those accounts. Debot URL parsing accepts canonical and numeric-prefix token routes. Paper chart markers must preserve Debot's existing on-chain B/S markers.
- Failure / recovery: If a live chart series is temporarily unavailable during SPA navigation or chart remount, queue the latest marker/line state and retry discovery; paper trading must remain usable even when embedded rendering is unavailable.
- Non-goals: No wallet connection, transaction signing, real order submission, automated trading, or manipulation of Debot's own trades and annotations. Other EVM chains are not enabled by this change.

## Verification

- `node --test extension/test/sitescontract.test.js` proves supported Debot URL shapes resolve the expected chain and contract.
- `node --test extension/test/nativecharts.test.js` proves both Debot chart implementations use native markers/lines and Lightweight mode preserves the site's own markers.
- `node --test extension/test/multichain.test.js` proves SOL and BNB cash and PnL stay isolated.
- `npm test --prefix extension` runs the complete extension regression suite when the targeted seams pass.

<!-- repo-context-ledger:pack-specs:start -->
## Stable context

- [Debot Solana + BSC paper trading](../../specs/debot-solana-bsc.md)
<!-- repo-context-ledger:pack-specs:end -->

<!-- repo-context-ledger:pack-files:start -->
## Tracked file fingerprints

- `extension/sites.js` — `sha256:3ac8f7c179c071fd16df3f4978c9013303038f8571e8d15bcf5d652a5e024b03`
- `extension/manifest.json` — `sha256:8b6e05794bc6a3602cccc149ddb6692fb13910e02ad357879189e11d256ae9d5`
- `extension/package.json` — `sha256:1591d7965f995140b1cec36193b4b514d33187fd33b64325f88831abd8804347`
- `extension/content.js` — `sha256:f82f60256a19214c437dfd7a0b700c5651a036078452d08a5f75f543a4e79eed`
- `extension/price-bridge.js` — `sha256:201042733b64568065d95381d92cb147be82f7c53cd14e6bccf441e7be354bff`
- `extension/engine.js` — `sha256:85c18e6284b44e867a5d6c0b31ee6efdada7c9e0010c57d7d882662fa2998050`
- `extension/quote.js` — `sha256:8c0a529dd676137e2ffb30420b73d550217cb2a7e8081b1a6204d1c4f49f4e9e`
- `extension/resolver.js` — `sha256:8a3a67a0def6bb637a459c0cbce38f7c87911f069edec6088571fd6c983e754c`
- `extension/test/sitescontract.test.js` — `sha256:1b526dfcf120321f11c423db49ad4f88ccb9fb3109ac294ef78c24848a0bcc3d`
- `extension/test/nativecharts.test.js` — `sha256:201c7ced83b28af6d8539d6ab3ce5412f80cf6581894f72d7d392702c7cef95a`
- `extension/test/multichain.test.js` — `sha256:896ac54dbe315ee54535c7bfa10bc7611cf2ff3de41e8ceb0637fd0191832b09`
<!-- repo-context-ledger:pack-files:end -->
