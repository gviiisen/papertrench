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
