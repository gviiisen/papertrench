const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const content = fs.readFileSync(path.join(__dirname, '..', 'content.js'), 'utf8');

test('the visible PAPER TRADING banner is a panel drag handle', () => {
  assert.match(content, /id="pt-drag-banner"/,
    'the top banner needs a stable drag-handle identity');
  assert.match(content, /makeDraggable\(dragBanner, panelSpec\)/,
    'dragging the banner must move through the same clamped, persisted panel path');
  assert.match(content, /\.pt-banner, \.pt-header[\s\S]{0,120}cursor: grab/,
    'both intuitive drag surfaces must advertise that they can move the panel');
});

test('panel drag handles keep interactive controls clickable', () => {
  assert.match(content, /const panelDragIgnore = \(e\) =>[\s\S]{0,220}closest\('button, a, input, select, textarea'/,
    'dragging must ignore controls instead of swallowing their clicks');
});
