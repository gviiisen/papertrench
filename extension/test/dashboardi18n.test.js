const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const extensionDir = path.join(__dirname, '..');
const html = fs.readFileSync(path.join(extensionDir, 'dashboard.html'), 'utf8');
const dashboard = fs.readFileSync(path.join(extensionDir, 'dashboard.js'), 'utf8');

test('dashboard exposes a top-right EN/CN switch and loads i18n before its renderer', () => {
  assert.match(html, /id="dashboard-language"/);
  assert.match(html, /data-locale="en"[^>]*>EN</);
  assert.match(html, /data-locale="zh-CN"[^>]*>CN</);
  assert.ok(
    html.indexOf('<script src="dashboard-i18n.js"></script>')
      < html.indexOf('<script src="dashboard.js"></script>'),
    'the translator must observe markup before dashboard.js starts rendering',
  );
});

test('Chinese locale translates exact UI text and common dynamic dashboard labels', () => {
  const i18n = require('../dashboard-i18n.js');
  assert.equal(i18n.translateText('Overview', 'zh-CN'), '概览');
  assert.equal(i18n.translateText('Open positions', 'zh-CN'), '当前持仓');
  assert.equal(i18n.translateText('Save settings', 'zh-CN'), '保存设置');
  assert.equal(i18n.translateText('3 fills · 0.02 SOL fees', 'zh-CN'), '3 笔成交 · 手续费 0.02 SOL');
  assert.equal(i18n.translateText('Step 2 of 4', 'zh-CN'), '第 2 步，共 4 步');
  assert.equal(i18n.translateText('Overview', 'en'), 'Overview');
});

test('Chinese locale covers onboarding, ranks and every game card visible in the dashboard', () => {
  const i18n = require('../dashboard-i18n.js');
  const cases = new Map([
    ['Six things worth doing once. Each checks itself off from your real record, and this card leaves for good when you’re done with it.', '六件值得完成一次的事。每项都会根据真实记录自动勾选，全部完成后此卡片将永久消失。'],
    ['Make your first paper buy', '完成第一笔模拟买入'],
    ['Write a thesis while a position is open', '持仓期间写下交易逻辑'],
    ['Close your first round trip', '完成第一轮完整交易'],
    ['See The After', '查看卖出后走势'],
    ['Review a closed round', '复盘一轮已结束交易'],
    ['50 rounds toward the graduation bar', '完成 50 轮达到毕业门槛'],
    ['Best round', '最佳交易轮次'],
    ['Worst round', '最差交易轮次'],
    ['No closed rounds yet', '还没有已结束的交易轮次'],
    ['Trench Rank', '训练等级'],
    ['Trench profile', '训练档案'],
    ['The Gauntlet', '连续纪律挑战'],
    ['One-Shot', '单次决策'],
    ['Score Attack', '评分挑战'],
    ['Trench Season', '训练赛季'],
    ['Survival Season', '生存赛季'],
    ['Start game', '开始训练'],
    ['Process, last 30 graded rounds', '执行表现：最近 30 轮已评分交易'],
  ]);
  for (const [english, chinese] of cases) {
    assert.equal(i18n.translateText(english, 'zh-CN'), chinese, english);
  }
  assert.equal(
    i18n.translateText("Six things worth doing once. Each checks itself off from your real record, and this card leaves for good when you're done with it.", 'zh-CN'),
    '六件值得完成一次的事。每项都会根据真实记录自动勾选，全部完成后此卡片将永久消失。',
  );
  assert.equal(i18n.translateText('TIER 0 · FRESH MEAT', 'zh-CN'), '等级 0 · 新手');
  assert.equal(i18n.translateText('Next: Journaler', 'zh-CN'), '下一步：记录者');
  assert.equal(i18n.translateText('Today’s drill: Stop-respect day', 'zh-CN'), '今日训练：遵守止损日');
  assert.equal(i18n.translateText('Process, last 12 graded rounds', 'zh-CN'), '执行表现：最近 12 轮已评分交易');
  assert.equal(
    i18n.translateText('LVL 0 · 0 reps — 0 of 10 full-credit reps used today.', 'zh-CN'),
    '等级 0 · 累计 0 次训练——今天已使用 0/10 次完整计分机会。',
  );
  assert.equal(
    i18n.translateText('“PAPER TRENCH” · SIMULATED FUNDS · “PAPER TRENCH” · SIMULATED FUNDS · ', 'zh-CN'),
    '“PAPER TRENCH” · 虚拟资金 · “PAPER TRENCH” · 虚拟资金 · ',
  );
});

test('locale choice uses a stable browser-local storage key', () => {
  const i18n = require('../dashboard-i18n.js');
  assert.equal(i18n.STORAGE_KEY, 'pt_dashboard_locale');
  assert.deepEqual(i18n.SUPPORTED_LOCALES, ['en', 'zh-CN']);
});

test('staged dashboard sections compare in-locale but retain English source nodes', () => {
  assert.match(
    dashboard,
    /comparable\s*=\s*staged\.cloneNode\(true\)[\s\S]{0,220}translateTree\(comparable\)[\s\S]{0,300}el\.innerHTML === comparable\.innerHTML/,
    'otherwise Chinese live markup never equals freshly staged English markup and repaints continuously',
  );
  assert.match(
    dashboard,
    /replaceChildren\(\.\.\.staged\.childNodes\)[\s\S]{0,220}translateTree\(el\)/,
    'the English source nodes must enter the live tree before translation so switching back to EN can restore them',
  );
});
