# Implement Debot.ai paper trading for Solana and BSC

Status: completed
Feature: implement-debot-ai-paper-trading-for-solana-and-
Quality profile: evidence-v1
Language: en
Detail: standard
Scope: repository
Handoff ID: 20260901224410-gviiisen-949a04ecae
Session ID: 20260901224410-gviiisen-949a04ecae
Actor: gviiisen
Branch: main
Started: 2026-09-01T22:44:10+08:00
Completed: 2026-09-01T23:15:52+08:00
Paused:
Resumed:
Checkpointed:
Checkpoint actor:
Base commit: a0e3b7b0e776f3b57624cb0280d9c7f77a2dccd0
Dirty paths: none
Resume summary:
Next step:
Specs: docs/specs/debot-solana-bsc.md
Spec exception: none

## Intent

Add Debot.ai as a supported paper-trading venue for both Solana and BSC. The observable result is a simulated SOL account on Solana pages and a separate simulated BNB account on BSC pages, with paper fills and average levels embedded in whichever chart implementation Debot mounts, without connecting a wallet or sending a real transaction.

## Changed behavior

Before: Debot token pages were outside the manifest and site adapter list, so the overlay never injected and no Debot chart could display paper fills.

After: strict Debot Solana/BSC token routes inject the overlay; BSC quotes remain BNB-native; SOL and BNB cash/P&L stay isolated; mixed position summaries retain currency labels; and both Debot TradingView and Lightweight Charts modes draw native paper markers and average lines with remount recovery.

## Code paths

| Path / symbol | Responsibility | Actual change |
| --- | --- | --- |
| `extension/sites.js` / Debot adapter | Converts Debot token URLs into a trusted chain and contract identity. | Added canonical and numeric-prefixed Solana/BSC routes with strict address-shape validation. |
| `extension/engine.js` / `nativeAccount` | Owns virtual cash, fills, positions, rounds, and P&L. | Added isolated SOL and BNB accounts plus chain-native fill and round fields while retaining Solana compatibility aliases. |
| `extension/price-bridge.js` / Debot bridge | Connects paper markers and average lines to the site's chart. | Added dual TradingView/Lightweight Charts support, marker preservation, native price lines, visible-frame filtering, and remount recovery. |
| `extension/content.js` / `sendNativeChart` | Renders the panel and routes chart state into the MAIN world. | Added chain-aware BNB/SOL controls and dual-posted Debot chart specifications without mixing currency totals. |

## Boundaries and risks

- Invariant: Paper trading never signs or sends a transaction, and a BSC fill can never debit or credit the Solana account (or vice versa).
- Failure / recovery: Missing or remounted Debot chart instances retain the latest marker/line specifications and retry discovery; unavailable price evidence remains an honest no-fill/no-line state.
- Not changed: Other gated EVM venues, real wallet behavior, and the Solana-only pending-limit-buy book were not enabled. The BSC panel hides that unsupported limit-buy control.

## Verification

Record checks with `ledger.py verify`; do not type claimed results manually.

<!-- repo-context-ledger:checks:start -->
- Command: `node --test extension/test/sitescontract.test.js extension/test/multichain.test.js extension/test/nativecharts.test.js extension/test/marketcap.test.js extension/test/quickbuy.test.js extension/test/statepersist.test.js extension/test/threesites.test.js extension/test/d06_anchor.test.js extension/test/wiring.test.js`
  - Status: passed
  - Exit code: 0
  - Duration: 0.55s
  - Recorded: 2026-09-01T23:13:15+08:00
  - Output evidence: sha256:c3b743f9d558abd1d95452f8a4c2563152d21f46327e56b7de574598f6d6b183 (40534 characters captured; content not persisted; last=# duration_ms 466.159)
- Command: `node --test <REPO_ROOT>\extension\test\afterguard.test.js <REPO_ROOT>\extension\test\attest.test.js <REPO_ROOT>\extension\test\attestsegments.test.js <REPO_ROOT>\extension\test\attestworker.test.js <REPO_ROOT>\extension\test\background.test.js <REPO_ROOT>\extension\test\barstore.test.js <REPO_ROOT>\extension\test\basisflap.test.js <REPO_ROOT>\extension\test\chaincommit.test.js <REPO_ROOT>\extension\test\chainrouting.test.js <REPO_ROOT>\extension\test\chartlinesettings.test.js <REPO_ROOT>\extension\test\chartmarkers.test.js <REPO_ROOT>\extension\test\chartorderlines.test.js <REPO_ROOT>\extension\test\chartorders.test.js <REPO_ROOT>\extension\test\cocrown.test.js <REPO_ROOT>\extension\test\contextinvalidated.test.js <REPO_ROOT>\extension\test\d06_anchor.test.js <REPO_ROOT>\extension\test\d06_backfill.test.js <REPO_ROOT>\extension\test\d09_mcap.test.js <REPO_ROOT>\extension\test\d31_canvas.test.js <REPO_ROOT>\extension\test\d37_liveapply.test.js <REPO_ROOT>\extension\test\d62_gma_fallback.test.js <REPO_ROOT>\extension\test\d63_linelevel.test.js <REPO_ROOT>\extension\test\d64_gmgnlines.test.js <REPO_ROOT>\extension\test\dashboardfixes.test.js <REPO_ROOT>\extension\test\dashboardperps.test.js <REPO_ROOT>\extension\test\engine.test.js <REPO_ROOT>\extension\test\errors.test.js <REPO_ROOT>\extension\test\everywhere.test.js <REPO_ROOT>\extension\test\fees.test.js <REPO_ROOT>\extension\test\feewiring.test.js <REPO_ROOT>\extension\test\filldurability.test.js <REPO_ROOT>\extension\test\fillprovenance.test.js <REPO_ROOT>\extension\test\fillreceipts.test.js <REPO_ROOT>\extension\test\fillwitness.test.js <REPO_ROOT>\extension\test\flexcard.test.js <REPO_ROOT>\extension\test\flowstats.test.js <REPO_ROOT>\extension\test\fomo.test.js <REPO_ROOT>\extension\test\fomodraws.test.js <REPO_ROOT>\extension\test\forge.test.js <REPO_ROOT>\extension\test\forgeui.test.js <REPO_ROOT>\extension\test\formatting.test.js <REPO_ROOT>\extension\test\freshlaunch.test.js <REPO_ROOT>\extension\test\gamify.test.js <REPO_ROOT>\extension\test\gamifyui.test.js <REPO_ROOT>\extension\test\integration.test.js <REPO_ROOT>\extension\test\listquickopen.test.js <REPO_ROOT>\extension\test\livepnl.test.js <REPO_ROOT>\extension\test\load.test.js <REPO_ROOT>\extension\test\lute.test.js <REPO_ROOT>\extension\test\marketcap.test.js <REPO_ROOT>\extension\test\masterswitch.test.js <REPO_ROOT>\extension\test\mastery.test.js <REPO_ROOT>\extension\test\mcalerts.test.js <REPO_ROOT>\extension\test\microdensity.test.js <REPO_ROOT>\extension\test\migratedprice.test.js <REPO_ROOT>\extension\test\migration.test.js <REPO_ROOT>\extension\test\multichain.test.js <REPO_ROOT>\extension\test\nativecharts.test.js <REPO_ROOT>\extension\test\onchain.test.js <REPO_ROOT>\extension\test\onchainfeed.test.js <REPO_ROOT>\extension\test\orderlinewidth.test.js <REPO_ROOT>\extension\test\orderrace.test.js <REPO_ROOT>\extension\test\overlaytiles.test.js <REPO_ROOT>\extension\test\padrebridge.test.js <REPO_ROOT>\extension\test\paneldata.test.js <REPO_ROOT>\extension\test\paneleditor.test.js <REPO_ROOT>\extension\test\paneltheme.test.js <REPO_ROOT>\extension\test\perfpass.test.js <REPO_ROOT>\extension\test\permissionsdoc.test.js <REPO_ROOT>\extension\test\perps.test.js <REPO_ROOT>\extension\test\perpschart.test.js <REPO_ROOT>\extension\test\perpsreconcile.test.js <REPO_ROOT>\extension\test\perpssites.test.js <REPO_ROOT>\extension\test\perpsticket.test.js <REPO_ROOT>\extension\test\perpsvenues.test.js <REPO_ROOT>\extension\test\perpswiring.test.js <REPO_ROOT>\extension\test\pnlcalendar.test.js <REPO_ROOT>\extension\test\pnlcard.test.js <REPO_ROOT>\extension\test\positionledger.test.js <REPO_ROOT>\extension\test\positionsbar.test.js <REPO_ROOT>\extension\test\positionslinks.test.js <REPO_ROOT>\extension\test\predict-engine.test.js <REPO_ROOT>\extension\test\predict-isolation.test.js <REPO_ROOT>\extension\test\predict-kalshi.test.js <REPO_ROOT>\extension\test\predict-score.test.js <REPO_ROOT>\extension\test\predict-sites.test.js <REPO_ROOT>\extension\test\predict-venues.test.js <REPO_ROOT>\extension\test\quickbuy.test.js <REPO_ROOT>\extension\test\quicksettings.test.js <REPO_ROOT>\extension\test\quietscreen.test.js <REPO_ROOT>\extension\test\quote.test.js <REPO_ROOT>\extension\test\railfade.test.js <REPO_ROOT>\extension\test\recordings.test.js <REPO_ROOT>\extension\test\reinject.test.js <REPO_ROOT>\extension\test\rekey.test.js <REPO_ROOT>\extension\test\replaysync.test.js <REPO_ROOT>\extension\test\resolver.test.js <REPO_ROOT>\extension\test\roundattribution.test.js <REPO_ROOT>\extension\test\roundlevels.test.js <REPO_ROOT>\extension\test\rowchipcollision.test.js <REPO_ROOT>\extension\test\rowchipdedupe.test.js <REPO_ROOT>\extension\test\rpcpool.test.js <REPO_ROOT>\extension\test\rugguard.test.js <REPO_ROOT>\extension\test\rugmark.test.js <REPO_ROOT>\extension\test\scalestep.test.js <REPO_ROOT>\extension\test\seasoncard.test.js <REPO_ROOT>\extension\test\sellinitial.test.js <REPO_ROOT>\extension\test\settingssave.test.js <REPO_ROOT>\extension\test\shortcuts.test.js <REPO_ROOT>\extension\test\sidepanel.test.js <REPO_ROOT>\extension\test\signlock.test.js <REPO_ROOT>\extension\test\sitebridge.test.js <REPO_ROOT>\extension\test\sitegating.test.js <REPO_ROOT>\extension\test\sitescontract.test.js <REPO_ROOT>\extension\test\slippage.test.js <REPO_ROOT>\extension\test\spark.test.js <REPO_ROOT>\extension\test\sparkmount.test.js <REPO_ROOT>\extension\test\statepersist.test.js <REPO_ROOT>\extension\test\strandedbag.test.js <REPO_ROOT>\extension\test\tacore.test.js <REPO_ROOT>\extension\test\thesis.test.js <REPO_ROOT>\extension\test\threesites.test.js <REPO_ROOT>\extension\test\titlefeed.test.js <REPO_ROOT>\extension\test\trajectory.test.js <REPO_ROOT>\extension\test\trenchgrid.test.js <REPO_ROOT>\extension\test\trenchgridmount.test.js <REPO_ROOT>\extension\test\turbojank.test.js <REPO_ROOT>\extension\test\u5-jump-themes-rug.test.js <REPO_ROOT>\extension\test\u6-lute-instantlinks.test.js <REPO_ROOT>\extension\test\u7-brand-ux.test.js <REPO_ROOT>\extension\test\updatebanner.test.js <REPO_ROOT>\extension\test\warmdest.test.js <REPO_ROOT>\extension\test\warmlinks.test.js <REPO_ROOT>\extension\test\whatsnew.test.js <REPO_ROOT>\extension\test\wiring.test.js <REPO_ROOT>\extension\test\workerglobals.test.js <REPO_ROOT>\extension\test\wrapped.test.js <REPO_ROOT>\extension\test\wrappedmount.test.js <REPO_ROOT>\extension\test\xray.test.js <REPO_ROOT>\extension\test\xrayobserve.test.js <REPO_ROOT>\extension\test\xraypanel.test.js`
  - Status: passed
  - Exit code: 0
  - Duration: 7.06s
  - Recorded: 2026-09-01T23:13:29+08:00
  - Output evidence: sha256:3f6cf365803c4c5f39da61c63b735c3cc8ff45d6940fe74d8ee60647a0c5ca6c (390973 characters captured; content not persisted; last=# duration_ms 6946.3466)
- Command: `node --test <REPO_ROOT>\extension\test\afterguard.test.js <REPO_ROOT>\extension\test\attest.test.js <REPO_ROOT>\extension\test\attestsegments.test.js <REPO_ROOT>\extension\test\attestworker.test.js <REPO_ROOT>\extension\test\background.test.js <REPO_ROOT>\extension\test\barstore.test.js <REPO_ROOT>\extension\test\basisflap.test.js <REPO_ROOT>\extension\test\chaincommit.test.js <REPO_ROOT>\extension\test\chainrouting.test.js <REPO_ROOT>\extension\test\chartlinesettings.test.js <REPO_ROOT>\extension\test\chartmarkers.test.js <REPO_ROOT>\extension\test\chartorderlines.test.js <REPO_ROOT>\extension\test\chartorders.test.js <REPO_ROOT>\extension\test\cocrown.test.js <REPO_ROOT>\extension\test\contextinvalidated.test.js <REPO_ROOT>\extension\test\d06_anchor.test.js <REPO_ROOT>\extension\test\d06_backfill.test.js <REPO_ROOT>\extension\test\d09_mcap.test.js <REPO_ROOT>\extension\test\d31_canvas.test.js <REPO_ROOT>\extension\test\d37_liveapply.test.js <REPO_ROOT>\extension\test\d62_gma_fallback.test.js <REPO_ROOT>\extension\test\d63_linelevel.test.js <REPO_ROOT>\extension\test\d64_gmgnlines.test.js <REPO_ROOT>\extension\test\dashboardfixes.test.js <REPO_ROOT>\extension\test\dashboardperps.test.js <REPO_ROOT>\extension\test\engine.test.js <REPO_ROOT>\extension\test\errors.test.js <REPO_ROOT>\extension\test\everywhere.test.js <REPO_ROOT>\extension\test\fees.test.js <REPO_ROOT>\extension\test\feewiring.test.js <REPO_ROOT>\extension\test\filldurability.test.js <REPO_ROOT>\extension\test\fillprovenance.test.js <REPO_ROOT>\extension\test\fillreceipts.test.js <REPO_ROOT>\extension\test\fillwitness.test.js <REPO_ROOT>\extension\test\flexcard.test.js <REPO_ROOT>\extension\test\flowstats.test.js <REPO_ROOT>\extension\test\fomo.test.js <REPO_ROOT>\extension\test\fomodraws.test.js <REPO_ROOT>\extension\test\forge.test.js <REPO_ROOT>\extension\test\forgeui.test.js <REPO_ROOT>\extension\test\formatting.test.js <REPO_ROOT>\extension\test\freshlaunch.test.js <REPO_ROOT>\extension\test\gamify.test.js <REPO_ROOT>\extension\test\gamifyui.test.js <REPO_ROOT>\extension\test\integration.test.js <REPO_ROOT>\extension\test\listquickopen.test.js <REPO_ROOT>\extension\test\livepnl.test.js <REPO_ROOT>\extension\test\load.test.js <REPO_ROOT>\extension\test\lute.test.js <REPO_ROOT>\extension\test\marketcap.test.js <REPO_ROOT>\extension\test\masterswitch.test.js <REPO_ROOT>\extension\test\mastery.test.js <REPO_ROOT>\extension\test\mcalerts.test.js <REPO_ROOT>\extension\test\microdensity.test.js <REPO_ROOT>\extension\test\migratedprice.test.js <REPO_ROOT>\extension\test\migration.test.js <REPO_ROOT>\extension\test\multichain.test.js <REPO_ROOT>\extension\test\nativecharts.test.js <REPO_ROOT>\extension\test\onchain.test.js <REPO_ROOT>\extension\test\onchainfeed.test.js <REPO_ROOT>\extension\test\orderlinewidth.test.js <REPO_ROOT>\extension\test\orderrace.test.js <REPO_ROOT>\extension\test\overlaytiles.test.js <REPO_ROOT>\extension\test\padrebridge.test.js <REPO_ROOT>\extension\test\paneldata.test.js <REPO_ROOT>\extension\test\paneleditor.test.js <REPO_ROOT>\extension\test\paneltheme.test.js <REPO_ROOT>\extension\test\perfpass.test.js <REPO_ROOT>\extension\test\permissionsdoc.test.js <REPO_ROOT>\extension\test\perps.test.js <REPO_ROOT>\extension\test\perpschart.test.js <REPO_ROOT>\extension\test\perpsreconcile.test.js <REPO_ROOT>\extension\test\perpssites.test.js <REPO_ROOT>\extension\test\perpsticket.test.js <REPO_ROOT>\extension\test\perpsvenues.test.js <REPO_ROOT>\extension\test\perpswiring.test.js <REPO_ROOT>\extension\test\pnlcalendar.test.js <REPO_ROOT>\extension\test\pnlcard.test.js <REPO_ROOT>\extension\test\positionledger.test.js <REPO_ROOT>\extension\test\positionsbar.test.js <REPO_ROOT>\extension\test\positionslinks.test.js <REPO_ROOT>\extension\test\predict-engine.test.js <REPO_ROOT>\extension\test\predict-isolation.test.js <REPO_ROOT>\extension\test\predict-kalshi.test.js <REPO_ROOT>\extension\test\predict-score.test.js <REPO_ROOT>\extension\test\predict-sites.test.js <REPO_ROOT>\extension\test\predict-venues.test.js <REPO_ROOT>\extension\test\quickbuy.test.js <REPO_ROOT>\extension\test\quicksettings.test.js <REPO_ROOT>\extension\test\quietscreen.test.js <REPO_ROOT>\extension\test\quote.test.js <REPO_ROOT>\extension\test\railfade.test.js <REPO_ROOT>\extension\test\recordings.test.js <REPO_ROOT>\extension\test\reinject.test.js <REPO_ROOT>\extension\test\rekey.test.js <REPO_ROOT>\extension\test\replaysync.test.js <REPO_ROOT>\extension\test\resolver.test.js <REPO_ROOT>\extension\test\roundattribution.test.js <REPO_ROOT>\extension\test\roundlevels.test.js <REPO_ROOT>\extension\test\rowchipcollision.test.js <REPO_ROOT>\extension\test\rowchipdedupe.test.js <REPO_ROOT>\extension\test\rpcpool.test.js <REPO_ROOT>\extension\test\rugguard.test.js <REPO_ROOT>\extension\test\rugmark.test.js <REPO_ROOT>\extension\test\scalestep.test.js <REPO_ROOT>\extension\test\seasoncard.test.js <REPO_ROOT>\extension\test\sellinitial.test.js <REPO_ROOT>\extension\test\settingssave.test.js <REPO_ROOT>\extension\test\shortcuts.test.js <REPO_ROOT>\extension\test\sidepanel.test.js <REPO_ROOT>\extension\test\signlock.test.js <REPO_ROOT>\extension\test\sitebridge.test.js <REPO_ROOT>\extension\test\sitegating.test.js <REPO_ROOT>\extension\test\sitescontract.test.js <REPO_ROOT>\extension\test\slippage.test.js <REPO_ROOT>\extension\test\spark.test.js <REPO_ROOT>\extension\test\sparkmount.test.js <REPO_ROOT>\extension\test\statepersist.test.js <REPO_ROOT>\extension\test\strandedbag.test.js <REPO_ROOT>\extension\test\tacore.test.js <REPO_ROOT>\extension\test\thesis.test.js <REPO_ROOT>\extension\test\threesites.test.js <REPO_ROOT>\extension\test\titlefeed.test.js <REPO_ROOT>\extension\test\trajectory.test.js <REPO_ROOT>\extension\test\trenchgrid.test.js <REPO_ROOT>\extension\test\trenchgridmount.test.js <REPO_ROOT>\extension\test\turbojank.test.js <REPO_ROOT>\extension\test\u5-jump-themes-rug.test.js <REPO_ROOT>\extension\test\u6-lute-instantlinks.test.js <REPO_ROOT>\extension\test\u7-brand-ux.test.js <REPO_ROOT>\extension\test\updatebanner.test.js <REPO_ROOT>\extension\test\warmdest.test.js <REPO_ROOT>\extension\test\warmlinks.test.js <REPO_ROOT>\extension\test\whatsnew.test.js <REPO_ROOT>\extension\test\wiring.test.js <REPO_ROOT>\extension\test\workerglobals.test.js <REPO_ROOT>\extension\test\wrapped.test.js <REPO_ROOT>\extension\test\wrappedmount.test.js <REPO_ROOT>\extension\test\xray.test.js <REPO_ROOT>\extension\test\xrayobserve.test.js <REPO_ROOT>\extension\test\xraypanel.test.js`
  - Status: passed
  - Exit code: 0
  - Duration: 6.98s
  - Recorded: 2026-09-01T23:13:44+08:00
  - Output evidence: sha256:3afa54e3732c805709596d6388fa0184760b4d60282f1b7d67d586a77480a7a9 (390940 characters captured; content not persisted; last=# duration_ms 6884.2182)
<!-- repo-context-ledger:checks:end -->

## Documentation updates

Updated: `README.md`, `docs/MULTICHAIN.md`, `docs/PERMISSIONS.md`, `docs/specs/debot-solana-bsc.md`, and `docs/ai/context-packs/implement-debot-ai-paper-trading-for-solana-and.md`.

Reason: Debot adds a new host permission, a stable dual-chain accounting contract, and a dual chart-integration boundary that future changes must preserve.

## Open questions

The extension management page is blocked from browser automation by Chrome security policy, so the unpacked extension still needs one manual Reload click before the final live-page smoke test.

<!-- repo-context-ledger:evidence:start -->
## Git change evidence

- Base commit: `a0e3b7b0e776f3b57624cb0280d9c7f77a2dccd0`
- Current commit: `a0e3b7b0e776f3b57624cb0280d9c7f77a2dccd0`
- Changed paths:
  - `README.md`
  - `docs/MULTICHAIN.md`
  - `docs/PERMISSIONS.md`
  - `docs/ai/context-packs/implement-debot-ai-paper-trading-for-solana-and.md`
  - `docs/specs/debot-solana-bsc.md`
  - `extension/content.js`
  - `extension/engine.js`
  - `extension/manifest.json`
  - `extension/package.json`
  - `extension/price-bridge.js`
  - `extension/quote.js`
  - `extension/resolver.js`
  - `extension/sites.js`
  - `extension/test/marketcap.test.js`
  - `extension/test/multichain.test.js`
  - `extension/test/nativecharts.test.js`
  - `extension/test/quickbuy.test.js`
  - `extension/test/sitescontract.test.js`
  - `extension/test/statepersist.test.js`
  - `extension/test/threesites.test.js`
<!-- repo-context-ledger:evidence:end -->
