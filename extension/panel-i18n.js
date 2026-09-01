/* PaperTrench in-page trading panel language layer.
 *
 * It deliberately shares the dashboard's storage key. Choosing CN/EN in the
 * dashboard therefore updates every open trading tab without duplicating the
 * trade renderers or storing a second preference.
 */
(function initPanelI18n(root, factory) {
  const api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  if (root) root.PTPanelI18n = api;
})(typeof globalThis !== 'undefined' ? globalThis : this, () => {
  'use strict';

  const STORAGE_KEY = 'pt_dashboard_locale';
  const SUPPORTED_LOCALES = Object.freeze(['en', 'zh-CN']);

  const ZH = Object.freeze({
    'Paper Trading': '模拟交易',
    'Simulated Funds': '虚拟资金',
    '· Simulated Funds': '· 虚拟资金',
    'Paper Trading · Simulated Funds': '模拟交易 · 虚拟资金',
    'Quick paper buy box': '模拟交易快捷面板',
    'waiting for token': '等待识别代币',
    'Open a token page': '请打开代币页面',
    'Open a token page to begin': '打开代币页面后开始',
    'Position size': '持仓数量',
    'Avg entry': '平均买入价',
    'Value': '持仓价值',
    'Unrealized P&L': '未实现盈亏',
    'Invested': '已投入',
    'Sold': '已卖出',
    'Remaining': '剩余仓位',
    'P&L change': '盈亏变化',
    'Quick sell': '快捷卖出',
    'Take profit / Stop loss': '止盈 / 止损',
    'TAKE PROFIT': '止盈',
    'STOP LOSS': '止损',
    'BUY': '买入',
    'PAPER': '模拟盘',
    'POSITIONS': '持仓',
    'ARM ↓': '挂单 ↓',
    'Sell init': '卖出回本',
    'Settings': '设置',
    'Save': '保存',
    'Cancel': '取消',
    'Buy SOL': '买入 SOL',
    'Sell %': '卖出 %',
    'Fee %': '手续费 %',
    'Gas': 'Gas',
    'Tip': '小费',
    'Slip %': '滑点 %',
    'Price': '价格',
    'Closed P&L': '已实现盈亏',
    'Fetching live price…': '正在获取实时价格…',
    'Fetching live price···': '正在获取实时价格…',
    'POSITION CLOSED': '仓位已平',
    'PARTIAL EXIT': '部分卖出',
    'Thesis': '交易逻辑',
    'Why this trade?': '为什么买入？',
    '＋ Why this trade?': '＋ 记录买入理由',
    'Edit': '编辑',
    '(no note)': '（没有备注）',
    'Market cap alert': '市值提醒',
    'ALERT ABOVE': '突破提醒',
    'ALERT BELOW': '跌破提醒',
    'ALERT ME': '创建提醒',
    'Alert market cap': '提醒市值',
    'narrative': '叙事',
    'volume-spike': '放量',
    'chart-setup': '图表形态',
    'insider-wallets': '聪明钱钱包',
    'social-buzz': '社交热度',
    'dip-buy': '回调买入',
    'momentum': '动量',
    'fomo': '追涨',
    'revenge': '报复性交易',
    'gut': '直觉',
    'scalp': '超短线',
    'swing': '波段',
    'runner': '长线仓',
    'scratch': '保本退出',
    'Tap a level, then drag the line on the chart to place it exactly.': '点击目标档位后，可在图表上拖动线条精确调整。',
    'This chart cannot carry a draggable line — levels are set here.': '当前图表不支持拖动线条，请在此选择目标档位。',
    'Drag to move': '拖动面板',
    'Resize': '调整大小',
    'Open dashboard': '打开数据面板',
    'Minimize': '最小化',
    'Edit presets & fees right here': '编辑快捷金额和费用',
    'Edit presets and fees': '编辑快捷金额和费用',
    'Reset paper wallet (tap twice)': '重置模拟钱包（点击两次）',
    'Quick reset': '快速重置',
    'Toggle auto-hide when no token': '切换无代币时自动隐藏',
    'Toggle visibility': '切换显示状态',
    'Jump to take-profit / stop-loss presets': '跳转到止盈止损',
    'Jump to take-profit and stop-loss': '跳转到止盈止损',
    'Jump to the market-cap alert': '跳转到市值提醒',
    'Jump to market-cap alert': '跳转到市值提醒',
    'Cycle panel theme — trench / axiom / padre / lute / solana': '切换面板主题',
    'Cycle panel theme': '切换面板主题',
    'Toggle focus mode — the minimal panel': '切换精简模式',
    'Toggle focus mode': '切换精简模式',
    'Your simulated costs — click to edit': '模拟交易成本——点击编辑',
    'Buy this amount instantly': '立即按此金额买入',
    'Select this amount': '选择此金额',
    'Write the setup before you know how it ends': '在结果未知前写下交易依据',
    'What is the setup? Write it before you know how it ends.': '交易依据是什么？请在结果未知前写下来。',
    'target %': '止盈 %',
    'stop %': '止损 %',
    '📸 snap chart with save': '📸 保存时记录图表',
    'Capture this chart as it looks right now and file it with the thesis — no other tab needed': '保存当前图表画面并附在交易逻辑中',
    'Clear this alert': '清除该提醒',
    'Cancel this alert': '取消该提醒',
    'Nothing held yet — this sells just enough to take back what you put in.': '当前没有持仓；此按钮会卖出刚好足以收回本金的数量。',
  });

  const DYNAMIC_ZH = Object.freeze([
    [/^(?:Quick )?Buy \(([^)]+)\)(?: · (.+) cash)?$/i, (_all, currency, cash) => cash ? `买入 (${currency}) · 可用 ${cash}` : `买入 (${currency})`],
    [/^Fee (.+)$/i, '手续费 $1'],
    [/^Tip (.+)$/i, '小费 $1'],
    [/^Slip (.+)$/i, '滑点 $1'],
    [/^Price (.+)$/i, '价格 $1'],
    [/^Or type a custom (.+) amount…$/i, '或输入自定义 $1 金额…'],
    [/^Buy (SOL|BNB)$/i, '买入 $1'],
    [/^Paper wallet (SOL|BNB) — free to deploy$/i, '模拟钱包 $1——可用余额'],
    [/^Limit price \((SOL|BNB)\)…$/i, '限价（$1）…'],
    [/^Debot · live feed connected$/i, 'Debot · 实时行情已连接'],
    [/^Debot · connecting…$/i, 'Debot · 正在连接…'],
    [/^conviction (.+)\/5$/i, '信心 $1/5'],
    [/^target \+(.+)$/i, '止盈 +$1'],
    [/^stop -(.+)$/i, '止损 -$1'],
    [/^Now (.+)\. Fires once, from any open terminal tab, whatever chart you are on\.$/i, '当前 $1。达到条件时仅提醒一次，任一打开的交易页面均可触发。'],
    [/^Fires once, from any open terminal tab, whatever chart you are on\.$/i, '达到条件时仅提醒一次，任一打开的交易页面均可触发。'],
    [/^Now (.+)\. This site blocked notifications — alerts will show in the panel instead\.$/i, '当前 $1。网站通知已被禁用，提醒将在面板内显示。'],
  ]);

  function translateCore(value, locale) {
    if (locale !== 'zh-CN' || typeof value !== 'string') return value;
    const normalized = value.replace(/\s+/g, ' ').trim();
    if (!normalized) return value;
    let translated = ZH[normalized];
    if (!translated) {
      for (const [pattern, replacement] of DYNAMIC_ZH) {
        if (!pattern.test(normalized)) continue;
        translated = typeof replacement === 'function'
          ? normalized.replace(pattern, replacement)
          : normalized.replace(pattern, replacement);
        break;
      }
    }
    if (!translated) return value;
    return /^\s*/.exec(value)[0] + translated + /\s*$/.exec(value)[0];
  }

  function translateText(value, locale) {
    return translateCore(value, SUPPORTED_LOCALES.includes(locale) ? locale : 'en');
  }

  function inferredLocale(doc) {
    const hints = [
      doc && doc.documentElement && doc.documentElement.lang,
      typeof navigator !== 'undefined' && navigator.language,
    ];
    return hints.some((hint) => /^zh(?:-|$)/i.test(String(hint || ''))) ? 'zh-CN' : 'en';
  }

  function start(shadowRoot) {
    if (!shadowRoot) return { setLocale() {}, getLocale: () => 'en', disconnect() {} };
    const doc = shadowRoot.ownerDocument || (typeof document !== 'undefined' ? document : null);
    const textRecords = new WeakMap();
    const attrRecords = new WeakMap();
    const translatedAttrs = ['title', 'aria-label', 'placeholder'];
    let locale = inferredLocale(doc);

    function translateTextNode(node) {
      const current = node.nodeValue || '';
      const old = textRecords.get(node);
      const source = old && current === old.rendered ? old.source : current;
      const rendered = translateCore(source, locale);
      textRecords.set(node, { source, rendered });
      if (current !== rendered) node.nodeValue = rendered;
    }

    function translateElementAttrs(el) {
      let records = attrRecords.get(el);
      if (!records) { records = new Map(); attrRecords.set(el, records); }
      for (const attr of translatedAttrs) {
        if (!el.hasAttribute || !el.hasAttribute(attr)) continue;
        const current = el.getAttribute(attr) || '';
        const old = records.get(attr);
        const source = old && current === old.rendered ? old.source : current;
        const rendered = translateCore(source, locale);
        records.set(attr, { source, rendered });
        if (current !== rendered) el.setAttribute(attr, rendered);
      }
    }

    function translateTree(nodeRoot) {
      if (!nodeRoot || !doc || !doc.createTreeWalker) return;
      if (nodeRoot.nodeType === 3) { translateTextNode(nodeRoot); return; }
      if (nodeRoot.nodeType === 1) translateElementAttrs(nodeRoot);
      const walker = doc.createTreeWalker(nodeRoot, 1 | 4);
      let node;
      while ((node = walker.nextNode())) {
        if (node.nodeType === 3) translateTextNode(node);
        else translateElementAttrs(node);
      }
    }

    function setLocale(next) {
      locale = SUPPORTED_LOCALES.includes(next) ? next : inferredLocale(doc);
      translateTree(shadowRoot);
    }

    const observer = typeof MutationObserver !== 'undefined'
      ? new MutationObserver((mutations) => {
        for (const mutation of mutations) {
          if (mutation.type === 'characterData') translateTextNode(mutation.target);
          else if (mutation.type === 'attributes') translateElementAttrs(mutation.target);
          else for (const node of mutation.addedNodes) translateTree(node);
        }
      })
      : null;
    if (observer) observer.observe(shadowRoot, {
      subtree: true,
      childList: true,
      characterData: true,
      attributes: true,
      attributeFilter: translatedAttrs,
    });

    translateTree(shadowRoot);

    const storageListener = (changes, area) => {
      if (area === 'local' && changes && changes[STORAGE_KEY]) {
        setLocale(changes[STORAGE_KEY].newValue);
      }
    };
    try {
      if (typeof chrome !== 'undefined' && chrome.storage && chrome.storage.local) {
        chrome.storage.local.get([STORAGE_KEY], (stored) => {
          if (chrome.runtime && chrome.runtime.lastError) return;
          const saved = stored && stored[STORAGE_KEY];
          if (SUPPORTED_LOCALES.includes(saved)) setLocale(saved);
        });
        if (chrome.storage.onChanged) chrome.storage.onChanged.addListener(storageListener);
      }
    } catch (_) { /* inferred locale remains active */ }

    return {
      setLocale,
      getLocale: () => locale,
      translateTree,
      disconnect() {
        if (observer) observer.disconnect();
        try {
          if (chrome.storage && chrome.storage.onChanged) chrome.storage.onChanged.removeListener(storageListener);
        } catch (_) {}
      },
    };
  }

  return { STORAGE_KEY, SUPPORTED_LOCALES, translateText, inferredLocale, start };
});
