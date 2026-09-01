const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const ROOT = path.join(__dirname, '..');
const i18n = require('../panel-i18n.js');
const content = fs.readFileSync(path.join(ROOT, 'content.js'), 'utf8');
const manifest = JSON.parse(fs.readFileSync(path.join(ROOT, 'manifest.json'), 'utf8'));

test('the trading overlay shares the dashboard locale and translates its core surface', () => {
  assert.equal(i18n.STORAGE_KEY, 'pt_dashboard_locale');
  assert.equal(i18n.translateText('Paper Trading · Simulated Funds', 'zh-CN'), '模拟交易 · 虚拟资金');
  assert.equal(i18n.translateText(' · Simulated Funds', 'zh-CN'), ' · 虚拟资金');
  assert.equal(i18n.translateText('Position size', 'zh-CN'), '持仓数量');
  assert.equal(i18n.translateText('Unrealized P&L', 'zh-CN'), '未实现盈亏');
  assert.equal(i18n.translateText('Quick sell', 'zh-CN'), '快捷卖出');
  assert.equal(i18n.translateText('TAKE PROFIT', 'zh-CN'), '止盈');
  assert.equal(i18n.translateText('STOP LOSS', 'zh-CN'), '止损');
  assert.equal(i18n.translateText('BUY', 'zh-CN'), '买入');
  assert.equal(i18n.translateText('Market cap alert', 'zh-CN'), '市值提醒');
  assert.equal(i18n.translateText('＋ Why this trade?', 'zh-CN'), '＋ 记录买入理由');
});

test('dynamic BSC labels retain their numbers and native currency in Chinese', () => {
  assert.equal(i18n.translateText('Quick buy (BNB) · 9.9 cash', 'zh-CN'), '买入 (BNB) · 可用 9.9');
  assert.equal(i18n.translateText('Fee 1%', 'zh-CN'), '手续费 1%');
  assert.equal(i18n.translateText('Price $0.0002502', 'zh-CN'), '价格 $0.0002502');
});

test('panel i18n loads before content and watches the same saved dashboard choice', () => {
  const isolated = manifest.content_scripts.find((entry) => entry.js && entry.js.includes('content.js'));
  assert.ok(isolated);
  assert.ok(isolated.js.indexOf('panel-i18n.js') < isolated.js.indexOf('content.js'));
  assert.match(content, /PTPanelI18n/);
  assert.match(content, /panelI18n\.start\(shadow/);
});

test('Debot receives a restrained venue-matched skin without changing other sites', () => {
  assert.match(content, /classList\.toggle\('pt-debot', Boolean\(site && site\.id === 'debot'\)\)/);
  assert.match(content, /\.pt-box\.pt-debot\s*\{/);
  assert.match(content, /\.pt-box\.pt-debot::before\s*\{[^}]*display:\s*none/s);
  assert.match(content, /\.pt-box\.pt-debot \.pt-buy\s*\{[^}]*box-shadow:\s*none/s);
  assert.match(content, /\.pt-box\.pt-debot \.pt-sell\s*\{[^}]*background:\s*transparent/s);
});

test('Debot centers a larger yellow honesty banner and uses clean sans-serif position figures', () => {
  assert.match(content, /\.pt-box\.pt-debot \.pt-banner\s*\{[^}]*justify-content:\s*center;[^}]*color:\s*#f4c96b;[^}]*font-size:\s*10\.5px;/s);
  assert.match(content, /\.pt-box\.pt-debot \.pt-pos \.v\s*\{[^}]*font-family:\s*var\(--pt-sans\)/s);
  assert.match(content, /\.pt-box\.pt-debot \.pt-pos \.pnl\s*\{[^}]*font-family:\s*var\(--pt-sans\)/s);
  assert.match(content, /\.pt-box\.pt-debot \.pt-led \.v\s*\{[^}]*font-family:\s*var\(--pt-sans\)/s);
});
