/* PaperTrench dashboard language layer.
 *
 * The dashboard is intentionally rendered by the existing feature modules.
 * This layer translates their final DOM output so every current and future
 * renderer follows one locale switch without duplicating business logic.
 */
(function initDashboardI18n(root, factory) {
  const api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  if (!root || !root.document) return;
  root.PTDashboardI18n = api;
  api.controller = api.start(root.document);
})(typeof globalThis !== 'undefined' ? globalThis : this, () => {
  'use strict';

  const STORAGE_KEY = 'pt_dashboard_locale';
  const SUPPORTED_LOCALES = Object.freeze(['en', 'zh-CN']);

  // Exact strings are deliberately English-keyed: English remains the source
  // language and switching back never depends on a lossy reverse translation.
  const ZH = Object.freeze({
    // Header, navigation, global actions.
    'PAPER ONLY': '仅模拟盘',
    'Overview': '概览',
    'Game': '训练游戏',
    'Calendar': '日历',
    'Trench Grid': '交易热力图',
    'Daily Spark': '每日练习',
    'Wrapped': '年度总结',
    'Journal': '交易日志',
    'Rounds': '交易轮次',
    'Perps': '合约模拟',
    'Replay': '复盘',
    'Leaderboard': '排行榜',
    'AI Coach': 'AI 教练',
    'Settings': '设置',
    '🎥 Stream overlay': '🎥 直播叠加层',
    'Open the capture-ready stream overlay window for OBS': '打开可供 OBS 捕获的直播叠加窗口',
    'Dashboard language': '面板语言',
    'Close': '关闭',
    'Copy': '复制',
    'Copied ✓': '已复制 ✓',
    'Customize': '自定义',
    'Download PNG': '下载 PNG',
    'Save': '保存',
    'Save now': '立即保存',
    'Save note': '保存备注',
    'Save settings': '保存设置',
    'Cancel': '取消',
    'Delete': '删除',
    'Refresh': '刷新',
    'Try again': '重试',
    'Open settings': '打开设置',
    'Clear the search': '清除搜索',
    'Export CSV': '导出 CSV',
    'Export record (JSON)': '导出记录（JSON）',
    'Share': '分享',
    'Share card': '分享卡片',
    'Share P&L card': '分享盈亏卡片',
    'Share Wrapped card': '分享年度总结卡片',
    'All patch notes ↗': '全部更新说明 ↗',
    'Get the new version →': '获取新版本 →',
    'Got it': '知道了',
    'Check for new versions': '检查新版本',
    'Reload dashboard': '重新加载面板',
    'Dashboard failed to load': '面板加载失败',

    // Common states, table headings and metrics.
    'All': '全部',
    'Open': '进行中',
    'closed': '已结束',
    'Closed': '已结束',
    'Completed': '已完成',
    'DONE': '完成',
    'CLEARED': '已通关',
    'MISSED': '错过',
    'BUSTED': '爆仓',
    'LIQUIDATED': '已强平',
    'WON': '获胜',
    'YOU': '你',
    'Today': '今天',
    'Week': '本周',
    'Days': '天数',
    'When': '时间',
    'Side': '方向',
    'Site': '网站',
    'Token': '代币',
    'Qty': '数量',
    'Entry': '入场',
    'Exit': '出场',
    'Entry → Exit': '入场 → 出场',
    'Market': '市场',
    'Market cap': '市值',
    'Last mark': '最新标记价',
    'Gross': '毛额',
    'Net': '净额',
    'Fees': '费用',
    'Fee': '费用',
    'Fees paid': '已付费用',
    'Funding paid': '已付资金费',
    'Borrow paid': '已付借贷费',
    'Margin': '保证金',
    'Liq.': '强平价',
    'P&L SOL': '盈亏 SOL',
    'Realized': '已实现',
    'unrealized': '未实现',
    'Realized P&L': '已实现盈亏',
    'ROI': '收益率',
    'Win rate': '胜率',
    'Wins / Losses': '盈利 / 亏损',
    'Best': '最佳',
    'Worst': '最差',
    'Best run': '最佳连续表现',
    'High score': '最高分',
    'Average size': '平均仓位',
    'Avg hold time': '平均持仓时间',
    'Largest single trade': '最大单笔交易',
    'Peak/Worst': '最高 / 最差',
    'Outcome': '结果',
    'Grade': '评分',
    'Notes': '备注',
    'Thesis': '交易逻辑',
    'Review': '复盘评价',
    'AI review': 'AI 复盘',
    'AI': 'AI',
    'Video': '视频',
    'Frame': '截图',
    'Captured frames': '已捕获画面',
    'All fills': '全部成交',
    'Committed fills': '已承诺成交',
    'Closed rounds': '已结束轮次',
    'Closed round trips': '完整交易轮次',
    'Round trips': '交易轮次',
    'Recent round trips': '最近交易轮次',
    'Open / Rounds': '持仓 / 轮次',
    'Open positions': '当前持仓',
    'Live open positions': '实时持仓',
    'Paper balance': '模拟余额',
    'Paper equity': '模拟净值',
    'Equity': '净值',
    'Equity curve': '净值曲线',
    'Starting paper balance (SOL)': '模拟初始余额（SOL）',
    'Declared starting bankroll': '声明的初始本金',
    'return on bankroll': '本金收益率',
    'Invested': '投入',
    'Returned': '回收',
    'Symbol': '代币简称',
    'Date': '日期',
    'P&L %': '盈亏 %',
    'USD sub-lines': '美元副信息',
    'After-exit line': '卖出后走势',
    'Rank & grade': '排名和评分',
    'Trim': '主题色',
    'Amber': '琥珀色',
    'Blue': '蓝色',
    'Violet': '紫色',
    'Teal': '青绿色',

    // Overview, process and coaching.
    'Finding your way around': '快速上手',
    'I know my way around': '我已经会用了',
    'PaperTrench is three tools in one — turn on only what you came for.': 'PaperTrench 包含三类工具——只开启你需要的功能即可。',
    'Paper trading lives in Overlay settings; the speed features (Instant links, warm viewers) live in Turbo — both below.': '模拟交易在“叠加层”设置中；快速链接和页面预热在“加速”设置中。',
    'Session stats': '本次会话统计',
    'Setups traded': '已交易策略',
    'Latest reviews': '最近复盘',
    'Trade theses': '交易逻辑记录',
    'No theses logged yet': '还没有记录交易逻辑',
    'No paper trades yet — your daily results will fill in as you buy and sell.': '还没有模拟交易；买卖后每日结果会显示在这里。',
    'Nothing open.': '当前没有持仓。',
    'No trades committed yet': '还没有已承诺的交易',
    'Your first paper fill will start the chain.': '第一笔模拟成交会启动记录链。',
    'No graded rounds yet — close a round and the receipt starts here.': '还没有可评分的轮次；完成一轮交易后会在这里生成记录。',
    'Plan discipline': '计划执行力',
    'Exit discipline': '卖出纪律',
    'Hold symmetry': '持仓一致性',
    'Clean exits': '按计划卖出',
    'Exited on plan': '按计划出场',
    'Broke the plan': '违反计划',
    'Won anyway (luck)': '违规但盈利（运气）',
    'Went green, closed red': '曾经盈利，最终亏损',
    'Left on the table': '少赚的利润',
    'Dumps dodged (−30%+ after you sold)': '成功躲过暴跌（卖后跌幅 ≥30%）',
    'Trades over 25%': '仓位超过 25% 的交易',
    'Rounds with a thesis': '有交易逻辑的轮次',
    'With AI review': '有 AI 复盘',
    'Average of peak captured': '平均抓住最高利润比例',
    'After (1h)': '卖出后（1小时）',
    'After your exits (1h, observed)': '卖出后走势（观察 1 小时）',
    'The After — track the hour after each exit': '卖出后追踪——观察每次卖出后一小时',
    'Records what the coin actually did after you sold (observed extremes, on the round). Measured truth instead of FOMO guesswork.': '记录卖出后代币的真实走势和极值，用数据代替“是不是卖早了”的猜测。',
    'One that got away': '卖飞的一笔',
    'median further upside': '卖出后继续上涨中位数',

    // Game, grid, spark and wrapped.
    'Trading games — played on the live charts you already trade': '交易训练游戏——直接在你使用的实时图表上练习',
    'Gaming on the charts': '图表训练',
    'Challenges': '挑战',
    'Today’s drill': '今日训练',
    'Next gate': '下一关',
    'Graduation bar →': '毕业进度 →',
    'Graduated — the bar is passed. The next step is not in this extension.': '已毕业——你已通过训练。下一步不在这个扩展内进行。',
    'Graduated. The bar is passed — the next step is a small, careful real start, not another level here.': '已毕业。下一步应该是谨慎、小额地开始真实交易，而不是继续刷等级。',
    'Gates': '关卡条件',
    'Discipline (co-crown)': '纪律（并列核心）',
    'Process grade, lifetime — the co-crown next to PnL': '长期执行评分——与盈亏同等重要',
    'There are no badges for profit, win streaks, or volume — those train the habits this trainer exists to break.': '这里不奖励利润、连胜或交易量徽章，因为这些会强化本训练器想纠正的坏习惯。',
    'Six things worth doing once. Each checks itself off from your real record, and this card leaves for good when you’re done with it.': '六件值得完成一次的事。每项都会根据真实记录自动勾选，全部完成后此卡片将永久消失。',
    "Six things worth doing once. Each checks itself off from your real record, and this card leaves for good when you're done with it.": '六件值得完成一次的事。每项都会根据真实记录自动勾选，全部完成后此卡片将永久消失。',
    'Make your first paper buy': '完成第一笔模拟买入',
    'Open a coin on a supported site and hit BUY (PAPER). Fake money, real price.': '在支持的网站打开代币并点击“模拟买入”。使用虚拟资金，价格来自真实市场。',
    'Write a thesis while a position is open': '持仓期间写下交易逻辑',
    'Say why, before you know the outcome. Nobody grades the prose.': '在结果未知前写下买入理由；文字好坏不会影响评分。',
    'Close your first round trip': '完成第一轮完整交易',
    'Sell all the way out and the round lands in Rounds, graded.': '全部卖出后，这轮交易会进入“交易轮次”并获得评分。',
    'See The After': '查看卖出后走势',
    'An hour after an exit, what the coin actually did lands on the round.': '卖出一小时后，代币的真实走势会记录到该轮交易中。',
    'Review a closed round': '复盘一轮已结束交易',
    'Add a note (or run an AI review) on a round — the lesson is the point.': '为交易添加备注或运行 AI 复盘；重点是总结经验。',
    '50 rounds toward the graduation bar': '完成 50 轮达到毕业门槛',
    'Ten trades prove nothing. The honest sample starts at 50.': '十笔交易说明不了什么，至少 50 轮才算可靠样本。',
    'Best round': '最佳交易轮次',
    'Worst round': '最差交易轮次',
    'No closed rounds yet': '还没有已结束的交易轮次',
    'Trench Rank': '训练等级',
    'Trench profile': '训练档案',
    'Fresh Meat': '新手',
    'Journaler': '记录者',
    'Survivor': '生存者',
    'Operator': '操盘手',
    'Veteran': '老手',
    'Graduated': '已毕业',
    'Journal streak': '连续记录',
    'Clean exits': '纪律卖出',
    'No revenge': '无报复性交易',
    '10+ closed rounds': '至少 10 轮已结束交易',
    'Thesis on 60% of recent rounds': '最近交易中至少 60% 有交易逻辑',
    '25+ closed rounds': '至少 25 轮已结束交易',
    'Average loss smaller than average win': '平均亏损小于平均盈利',
    '35+ closed rounds': '至少 35 轮已结束交易',
    'No revenge re-entries in the window': '统计周期内没有报复性再次入场',
    'Losers not held 3x longer than winners': '亏损仓持有时间不超过盈利仓的 3 倍',
    '50+ closed rounds': '至少 50 轮已结束交易',
    'Survived a cold streak without sizing up': '连续亏损期间没有加大仓位',
    'The full graduation bar': '完成全部毕业条件',
    'The Gauntlet': '连续纪律挑战',
    'One-Shot': '单次决策',
    'Score Attack': '评分挑战',
    'Trench Season': '训练赛季',
    'Survival Season': '生存赛季',
    'Ten straight rounds, each with a written thesis and no revenge entry. Break one rule and the run resets.': '连续 10 轮都写下交易逻辑且没有报复性入场；违反任一规则，进度归零。',
    'One entry, one exit for the whole day, capturing 50%+ of what the trade offered. A second round busts the day.': '全天只允许一轮完整交易，并抓住至少 50% 的可得涨幅；进行第二轮即判失败。',
    'Average capture across 3+ closed rounds in one day. The high score is a day, not a lucky exit.': '一天内完成至少 3 轮交易，以平均利润捕获率计分；评分看整天表现，而不是一次幸运卖出。',
    'A 7-day league over discipline, never profit: 10+ rounds, 80%+ journaled, avg grade B or better. Qualify and the belt is yours — the window stays open to raise the score.': '为期 7 天的纪律赛季，不按利润评分：至少 10 轮、80% 以上有记录、平均评分达到 B。达标后仍可继续提高成绩。',
    'The Trench Season at real stakes: blow your equity down to 20% of where the season started and you are eliminated — the season ends, busted, on the spot. Same three gates, no second chances.': '高风险版训练赛季：净值跌至赛季初的 20% 即被淘汰并立即结束。毕业条件相同，但没有第二次机会。',
    'Start game': '开始训练',
    'Running…': '训练中…',
    'Switch to this': '切换到此训练',
    'Run': '当前连续轮数',
    'Completed': '已完成',
    'Journal Week': '记录周',
    'Clean Sweep': '纪律清仓',
    'Sniper Five': '精准卖出五次',
    'Cold Blood': '冷静应对',
    'Badge case': '徽章陈列',
    'On the record': '开始记录',
    'Ten on the record': '连续记录十轮',
    'Cold-blooded': '冷静应对',
    'Fifty club': '五十轮俱乐部',
    'Sniper exit': '精准卖出',
    'Ten clean exits': '十次纪律卖出',
    'Held the line': '守住纪律',
    'Plan master': '计划执行者',
    'Stop-respect day': '遵守止损日',
    'Capture day': '利润捕获日',
    'Journal day': '交易记录日',
    'Flat-size day': '固定仓位日',
    'No closed round trips yet': '还没有已结束的完整交易',
    'Complete a paper trade to see it here.': '完成一轮模拟交易后会显示在这里。',
    'Grid module failed to load.': '交易热力图模块加载失败。',
    'Spark module failed to load.': '每日练习模块加载失败。',
    'Wrapped module failed to load.': '年度总结模块加载失败。',
    "Loading today's puzzle…": '正在加载今日练习…',
    "Couldn't load today's puzzle just now.": '暂时无法加载今日练习。',
    'BUY': '买入',
    'SELL': '卖出',
    'REVEAL GRADE': '查看评分',
    'Days won': '盈利天数',
    'Seasons won': '盈利季度',
    'Longest recovery': '最长回本周期',
    'Flow — bought / held / sold': '资金流——买入 / 持有 / 卖出',
    'Lifetime: what went in, what\'s still on, what came back out': '全部历史：投入多少、还持有多少、收回多少',

    // Journal, rounds, perps and replay.
    'Journaled': '已记录',
    'logged': '已记录',
    'reviewed': '已复盘',
    'on plan': '按计划',
    'off plan': '偏离计划',
    'lucky': '侥幸',
    'After (observed)': '卖出后（已观察）',
    'Levels': '价位',
    'Held': '持有时长',
    'Session replay': '会话复盘',
    'Session tape': '会话时间线',
    'Timestamped sessions': '带时间戳的会话',
    'No timestamped replay captured yet': '还没有捕获带时间戳的复盘',
    'No captured events': '没有捕获事件',
    '▶ Play': '▶ 播放',
    '❚❚ Pause': '❚❚ 暂停',
    '▶ Replay': '▶ 复盘',
    'Capture warnings': '捕获警告',
    'Chart at this moment': '此刻图表',
    'Run session review': '运行会话复盘',
    'Session-level AI review': '会话级 AI 复盘',
    'Analyzing…': '分析中…',
    'No closed perps rounds yet.': '还没有已结束的合约模拟轮次。',
    '— a separate book': '——独立账本',

    // Leaderboard and verifiable record.
    'Live standings': '实时排名',
    'Loading the board…': '正在加载排行榜…',
    'Your row': '你的排名',
    'The evidence behind your row': '你的排名依据',
    'How ranking is kept honest': '排行榜如何保证可信',
    'Your declared starting balance is part of the committed data, so results are compared by return on bankroll — not by absolute SOL.': '声明的初始余额也属于承诺数据，因此按本金收益率比较，而不是按 SOL 绝对利润比较。',
    'Results compare return on your declared bankroll, not absolute SOL — a bigger starting balance buys no rank.': '排名比较本金收益率，而不是 SOL 绝对利润；更大的初始本金不会带来排名优势。',
    'Entries are pre-committed.': '入场记录会预先承诺。',
    'Ordering is provable.': '成交顺序可验证。',
    'Prices are re-checkable.': '价格可以复查。',
    'Bankroll travels with the record.': '本金与记录一起被验证。',
    'A fill is hashed when it is made, before the outcome is known, so a winning entry cannot be backdated.': '成交发生时、结果尚未知之前就会被哈希，因此无法事后篡改盈利交易的入场时间。',
    'Every fill is hashed when made, before the outcome is known, so a winning entry cannot be backdated.': '每笔成交都会在结果未知时被哈希，因此无法事后篡改盈利交易的入场时间。',
    'Each fill commits to the hash of the one before it, so a trade cannot be inserted, removed, or reordered afterwards.': '每笔成交都承诺上一笔的哈希，因此之后无法插入、删除或重排交易。',
    'Every fill records mint, price and timestamp, so a verifier can re-fetch real price history and reject fills at prices that never existed.': '每笔成交都记录合约地址、价格和时间戳，验证者可重新获取真实价格历史并拒绝不存在的成交价。',
    'Standings are recomputed server-side from the chain, never from a number this app reports.': '排名由服务器根据记录链重新计算，不采信此应用直接上报的结果。',
    'Checking your trade chain…': '正在检查交易记录链…',
    'Re-deriving your result from committed fills.': '正在根据已承诺成交重新计算结果。',
    'Not started — your first paper fill anchors the chain.': '尚未开始——第一笔模拟成交会成为记录链锚点。',
    'Claimed realized P&L': '声明的已实现盈亏',
    'Derived from chain': '根据记录链计算',
    'Chain head': '记录链头',
    'Identity costs something.': '身份绑定需要付出成本。',
    'One ranked record per verified X account.': '每个已验证的 X 账号只能有一份排名记录。',
    'X handle': 'X 用户名',
    'Link this handle': '绑定此用户名',
    'Linked': '已绑定',
    'Without the @. The service verifies ownership before you rank either way.': '不要输入 @。参与排名前，服务会验证账号所有权。',
    'Sign in on papertrench.com →': '前往 papertrench.com 登录 →',
    'Sign in with X on papertrench.com →': '前往 papertrench.com 使用 X 登录 →',
    'Leaderboard ↗': '排行榜 ↗',
    'Duels ↗': '对战 ↗',
    'Weekly Sprint ↗': '每周冲刺 ↗',

    // AI Coach / Forge.
    'Run': '运行',
    'AI model': 'AI 模型',
    'AI server address': 'AI 服务地址',
    'API key': 'API 密钥',
    'Test AI endpoint': '测试 AI 服务',
    'Testing…': '测试中…',
    'Allow local/private AI endpoints': '允许本地/私有 AI 服务',
    'AI coach is off — no endpoint set. Paste one above (and enable the local toggle for localhost/LAN), then Save.': 'AI 教练未启用——尚未设置服务地址。请在上方粘贴地址；若为本机或局域网服务，还需开启本地服务开关，然后保存。',
    'Narrative AI': '叙事分析 AI',
    'Narrative endpoint': '叙事 AI 服务地址',
    'Narrative API key': '叙事 AI 密钥',
    'Narrative model': '叙事 AI 模型',
    'Image AI': '图像 AI',
    'Image endpoint': '图像 AI 服务地址',
    'Image API key': '图像 AI 密钥',
    'Image model': '图像 AI 模型',
    'Default style': '默认风格',
    'Generate': '生成',
    'Forge — generate the banner inside the dex\'s own box': 'Forge——直接在交易网站的图片框中生成横幅',
    'Show the Generate chip on image upload boxes': '在图片上传框上显示“生成”按钮',
    'Let Grok search X for the narrative': '允许 Grok 搜索 X 获取叙事',
    'Auto-run AI review when a round closes': '每轮交易结束后自动运行 AI 复盘',
    'Only if your AI server needs a key.': '仅当你的 AI 服务需要密钥时填写。',
    'Optional override. Blank uses the endpoint\'s own default.': '可选。留空时使用服务端默认模型。',
    'Stored on this machine only, never synced, and only ever sent to the endpoint above.': '仅保存在本机，不会同步，只会发送到上方填写的服务地址。',
    'Off by default. Nothing is generated, and no key is used, until you click Generate yourself.': '默认关闭。只有你主动点击“生成”后才会生成内容并使用密钥。',

    // Settings groups and switches.
    'Changes save automatically.': '更改会自动保存。',
    'Saving…': '正在保存…',
    'Auto-save failed — press Save settings to retry.': '自动保存失败——请点击“保存设置”重试。',
    'No setting matches that.': '没有匹配的设置。',
    'Interface': '界面',
    'Overlay': '叠加层',
    'Trading': '交易',
    'Safety': '安全',
    'Fees & costs': '手续费与成本',
    'Feedback & alerts': '反馈与提醒',
    'Price connection': '价格连接',
    'Speed': '加速',
    'Turbo receipts': '加速性能记录',
    'Main-thread stalls': '主线程卡顿',
    'AI & Recording': 'AI 与录制',
    'Wallet & Trading': '钱包与交易',
    'Enable PaperTrench': '启用 PaperTrench',
    'Enable overlay': '启用叠加层',
    'Hide overlay when no token is detected': '未检测到代币时隐藏叠加层',
    'Focus mode — minimal trade panel': '专注模式——精简交易面板',
    'Panel theme': '面板主题',
    'Trench — PaperTrench default (amber on slate)': 'Trench——PaperTrench 默认主题（深灰配琥珀色）',
    'Axiom — dark slate, cyan accents': 'Axiom——深灰配青色',
    'Padre — warm near-black, amber accents': 'Padre——暖黑配琥珀色',
    'Lute — deep indigo, violet accents': 'Lute——深靛蓝配紫色',
    'Solana — void green, terminal phosphor': 'Solana——终端荧光绿',
    'Positions bar': '持仓栏',
    'Buy section in the trade tab': '交易面板中的买入区域',
    'Quick-buy preset buttons': '快捷买入预设按钮',
    'Custom amount box': '自定义金额输入框',
    'One-click quick buy': '单击预设立即买入',
    'Average entry/exit lines on the chart': '图表平均买入/卖出线',
    'Take profit / stop loss on the chart': '图表止盈 / 止损',
    'Exits — take profit & stop loss': '出场——止盈与止损',
    'Order-line thickness': '订单线粗细',
    'Thin (1px)': '细（1px）',
    'Standard (2px)': '标准（2px）',
    'Thick (3px)': '粗（3px）',
    'Extra thick (4px)': '特粗（4px）',
    'Market cap alerts': '市值提醒',
    'Desktop notification when one fires': '触发时发送桌面通知',
    'Trade sounds': '交易音效',
    'Buy/sell screen effects': '买卖屏幕动效',
    'Profit sound when the tab is hidden': '标签页在后台时播放盈利提示音',
    'Profit bell interval (%)': '盈利铃声间隔（%）',
    'Position sizing': '仓位管理',
    'Max position size (% of book)': '最大仓位（占总资金 %）',
    'Daily loss limit (SOL)': '每日最大亏损（SOL）',
    'Loss-streak cooldown': '连亏冷静期',
    'Tilt: losses in a row': '上头保护：连续亏损次数',
    'Tilt: cooldown minutes': '上头保护：冷静分钟数',
    'Rug guard (on by default)': '貔貅/砸盘保护（默认开启）',
    'Rug guard — block when the top 10 wallets hold over this %': '当十大钱包持仓超过此比例时禁止买入',
    'No costs (pure price practice)': '不计成本（纯价格练习）',
    'Fee': '手续费',
    'Platform fee per side (bps — 100 = 1%)': '单边平台费（基点；100 = 1%）',
    'Slippage (bps — 100 = 1%)': '滑点（基点；100 = 1%）',
    'Network fee per trade (SOL)': '每笔网络费（SOL）',
    'Validator tip per trade (SOL)': '每笔验证者小费（SOL）',
    'Extra price impact on fills. 0 fills at the live tick.': '额外价格冲击；设为 0 时按实时价格成交。',
    'Charged on every buy AND sell, like real gas.': '每次买入和卖出都会收取，模拟真实 Gas。',
    'Quick-buy presets (SOL)': '快捷买入预设（SOL）',
    'Quick-sell presets (%)': '快捷卖出预设（%）',
    'One box per button in the overlay. Up to 8.': '叠加面板中每个数值对应一个按钮，最多 8 个。',
    'One box per button in the overlay. Up to 8, each 1–100%.': '叠加面板中每个数值对应一个按钮，最多 8 个，每个为 1–100%。',
    'Keyboard shortcuts': '键盘快捷键',
    'Off by default. When on: P shows or hides the trade panel, B the positions bar, A jumps to the amount box — on trading pages only, and never while you are typing in a field.': '默认关闭。开启后：P 显示/隐藏交易面板，B 显示/隐藏持仓栏，A 跳到金额输入框；仅在交易页面生效，输入文字时不会触发。',
    'Instant terminal links': '即时交易终端链接',
    'Instant links': '即时链接',
    'Instant X links': '即时 X 链接',
    'Instant links on Discord': 'Discord 即时链接',
    'Instant links on Telegram Web': 'Telegram 网页版即时链接',
    'Instant links on every site': '在所有网站启用即时链接',
    'Tweet preview card on hover': '悬停显示推文预览卡',
    'X-Ray account intel on x.com': '在 x.com 显示 X-Ray 账号分析',
    'One-tap buy buttons on token lists': '代币列表一键买入按钮',
    'Buy-button position on lists': '列表买入按钮位置',
    'Buy-button size on lists': '列表买入按钮大小',
    'Preview from anywhere on the row': '悬停列表任意位置预览',
    'Open the chart tab after a list buy': '列表买入后打开图表标签页',
    'Auto — next to each row (moves if it covers something)': '自动——位于每行旁边（遮挡内容时会移动）',
    'Corner — always bottom-right of the row': '右下角——始终固定在每行右下角',
    'Record screen while a position is open': '持仓期间录制屏幕',
    'Capture key frames on fills': '成交时捕获关键画面',
    'Chrome asks for screen permission once per session.': 'Chrome 每次会话只请求一次屏幕权限。',
    'Site sync': '网站同步',
    'Reset wallet & history': '重置钱包与历史记录',
    'Starting paper balance (SOL)': '模拟初始余额（SOL）',
    'Options per click': '每次点击生成数量',
    'Custom': '自定义',
    'Custom: extra headers (JSON)': '自定义：额外请求头（JSON）',
    'Custom: request body template': '自定义：请求体模板',
    'Custom: where the image is in the reply': '自定义：响应中的图片路径',
    'Model names change often — the placeholder is a hint, not a promise. Use whatever your account can call.': '模型名称经常变化；占位提示仅供参考，请填写你的账号实际可调用的模型。',
    'Blank turns the AI coach off. Paste any OpenAI-compatible endpoint; if it runs on localhost or your LAN, also tick the local toggle below, then Save.': '留空会关闭 AI 教练。可填写任何兼容 OpenAI 的服务地址；若服务运行在本机或局域网，还需开启下方的本地服务开关，然后保存。',
    'Blank uses that provider\'s usual address.': '留空时使用该服务商的默认地址。',
    'Required for a custom provider; blank uses the provider\'s usual address otherwise.': '自定义服务商必须填写；其他服务商留空时使用默认地址。',
    'Only used by the Custom provider. Leave blank to send just': '仅用于自定义服务商。留空时只发送',
    'and paste the request shape.': '并粘贴请求格式。',
    'A dotted path to a base64 string or an image URL. Blank means PaperTrench guesses from the shapes it already knows.': '填写指向 Base64 字符串或图片网址的点分路径。留空时 PaperTrench 会根据已知响应格式自动识别。',
    'Rendered in parallel, so four is barely slower than one — but it is four times the bill.': '图片会并行生成，因此生成四张不会慢很多，但费用是四倍。',
    'Changeable per generation from the panel.': '每次生成时都可在面板中修改。',

    // Share-card modal and errors.
    'Click or drop an image (max 2 MB) — it joins your gallery below; a GIF renders as a still (its first frame)': '点击或拖入图片（最大 2 MB）；图片会加入下方图库，GIF 只渲染第一帧静态图',
    'Upload image': '上传图片',
    'Delete this background': '删除此背景',
    'The PAPER watermark and the PaperTrench brand bar are always drawn — no setting turns them off — so a shared paper trade can never be mistaken for a real one.': 'PAPER 水印和 PaperTrench 品牌条始终显示，无法关闭，确保分享的模拟交易不会被误认为真实交易。',
    'The': '此',
    'watermark and the PaperTrench brand bar are always drawn — no': '水印和 PaperTrench 品牌条始终显示——没有任何',
    'setting turns them off — so a shared paper trade can never be mistaken for a real one.': '设置可以关闭它们，从而确保分享的模拟交易不会被误认为真实交易。',
    'Error': '错误',
    'Update available —': '发现可用更新——',
    'Updated': '已更新',
  });

  // Additional copy-heavy descriptions. Kept separate so the compact label
  // dictionary above stays scannable during feature work.
  const ZH_EXTRA = Object.freeze({
    'DAILY SPARK': '每日练习',
    'SHARE CARD': '分享卡片',
    'Unrealized': '未实现',
    'Recording': '录制中',
    'Buying': '买入中',
    'Carry': '持仓成本',
    'In': '流入',
    'Out': '流出',
    'Off': '关闭',
    'NOT MET': '未达成',
    'Guardrails': '风险护栏',
    'Elimination line': '淘汰线',
    'Modes': '模式',
    'Intel': '信息分析',
    'Quick fill-in': '快速填充',
    'Badge case': '徽章样式',
    'Deep scan (read further back)': '深度扫描（读取更早记录）',
    'Preview on the terminal\'s quick-buy button': '在终端快捷买入按钮上预览',
    'Alt + key': 'Alt + 按键',
    'Ctrl + Shift + key': 'Ctrl + Shift + 按键',
    'of starting book': '占初始本金',
    'process': '执行过程',
    'process grade, worst letter wins the day — never P&L': '执行评分以最差一项为准，绝不根据盈亏评分',
    'no round yet': '还没有交易轮次',
    'watching…': '监控中…',
    '20% of season equity': '季度净值的 20%',
    '10+ rounds · 80% journaled · avg B': '至少 10 轮 · 80% 有日志 · 平均 B 级',
    'same three gates, real stakes': '相同三道关卡，换成真实资金',
    'A single buy larger than this share of your equity is refused.': '单笔买入超过净值的此比例时会被拒绝。',
    'Oversized entries make one bad read expensive enough to end a run. Consistent size is what makes a win rate meaningful.': '仓位过大会让一次判断错误直接终结训练；保持仓位一致，胜率才有意义。',
    'Once today\'s realized paper losses reach this, buying stops until tomorrow.': '当日已实现模拟亏损达到此数值后，暂停买入直到明天。',
    'After a streak of straight losses, buying pauses for a cooldown. Revenge trades are how small losses become big ones.': '连续亏损后暂停买入一段时间，避免报复性交易把小亏损变成大亏损。',
    'Profitable trades that broke their own plan are counted separately — repeating them is a habit, not an edge.': '盈利但违反计划的交易会单独统计；重复这种做法形成的是坏习惯，不是交易优势。',
    'Round-tripping a winner is the costliest habit on this list — the trade was profitable and the exit gave it back.': '把盈利单坐回亏损是代价最大的坏习惯——交易一度盈利，却因卖点不当把利润全部还回去。',
    'The three rules every surviving trader eventually adopts — practicable here while the money is fake. Each blocks the buy with an honest message; each is yours to switch off.': '长期生存的交易者最终都会遵守这三条规则。趁资金还是虚拟的先练习；触发规则时会明确阻止买入，你也可以自行关闭。',
    'The reasoning behind every line: docs/GRADUATION.md in the repo.': '每条规则的依据见仓库中的 docs/GRADUATION.md。',
    'A top rail on every trading page showing all open paper positions and their live P&L. Click a position to jump to its chart.': '在每个交易页面顶部显示所有模拟持仓及实时盈亏；点击持仓即可跳转到对应图表。',
    'Shows the quick-buy presets, custom amount and BUY button in the overlay. Off makes the trade tab view-only.': '在叠加面板中显示快捷买入预设、自定义金额和买入按钮；关闭后交易面板仅供查看。',
    'The trade panel itself. Off hides the panel on all pages (the switch above outranks this one).': '控制交易面板本身；关闭后所有页面都不显示面板（上方总开关优先级更高）。',
    'The panel disappears on home pages and screeners, then pops back when you open a coin.': '在首页和筛选页自动隐藏面板，打开具体代币后重新显示。',
    'The one-tap SOL amount buttons. Off keeps the custom amount and BUY button.': '一键选择 SOL 金额的按钮；关闭后仍保留自定义金额和买入按钮。',
    'Tapping a preset amount fires the buy immediately, like Axiom and Padre. Off makes presets only select the amount for the BUY button.': '点击预设金额后像 Axiom 和 Padre 一样立即买入；关闭后预设仅选择金额，仍需点击买入按钮。',
    'Native “Avg. Fill Price” and “Avg. Exit Price” lines from your paper fills.': '根据模拟成交在原生图表上显示“平均成交价”和“平均卖出价”线。',
    'Adds a TP/SL section to the trade panel and draggable order lines to the chart. Costs nothing until a level is actually armed.': '在交易面板中加入止盈/止损区域，并在图表中显示可拖动订单线；只有真正设置价位后才会产生模拟成本。',
    'Arm a level on the chart and the position exits itself when the market gets there. Drag the line to place it exactly, the way a terminal does it.': '在图表上设置价位，市场到达后自动模拟卖出；可像交易终端一样拖动线条精确调整。',
    'How a paper stop fills:': '模拟止损如何成交：',
    'When a level is watched:': '价位监控条件：',
    'Width of TP/SL and average-cost lines on the chart. Thicker lines are easier to grab and drag.': '设置图表止盈/止损线和平均成本线的宽度；线越粗越容易拖动。',
    '10 rings at +10%, +20%, +30%. Crossed levels never repeat.': '在 +10%、+20%、+30% 等十个盈利档位响铃；已越过的档位不会重复提醒。',
    'Rings once per new profit threshold while the tab is in the background.': '标签页在后台时，每突破一个新的盈利档位响铃一次。',
    'Synthesized locally — no audio files, no network calls.': '声音在本机合成，不加载音频文件，也不发起网络请求。',
    'Confetti burst and a brief color flash on each fill.': '每次成交时显示彩纸和短暂颜色闪烁。',
    'Make paper fills cost what real fills cost. Copy YOUR settings from the site you trade on — on small entries the flat costs below matter more than the percentage.': '让模拟成交计入接近真实交易的成本。请复制你常用交易网站的设置；小额交易中，固定费用往往比百分比费用影响更大。',
    '≈ Aggressive sniper (1% + 0.003 gas + 0.005 tip)': '≈ 激进狙击设置（1% + 0.003 Gas + 0.005 小费）',
    '≈ Axiom/Padre-style bot (1% + 0.001 gas + 0.001 tip)': '≈ Axiom/Padre 风格机器人（1% + 0.001 Gas + 0.001 小费）',
    'Fills the fields below — they stay yours to edit. Real fees drift; the site\'s own settings are the truth.': '自动填充下方字段，你仍可自行修改。真实费用会变化，应以交易网站当前设置为准。',
    'Jito-style inclusion tip. Flat, per transaction.': '类似 Jito 的打包小费，按每笔交易固定收取。',
    'Same treatment on web.telegram.org.': '同样适用于 web.telegram.org。',
    'Rest the cursor about a third of a second anywhere on a token row and its X preview appears — no need to find the icon at all. Needs Instant X links on.': '鼠标停在代币行任意位置约三分之一秒即可显示 X 预览，无需寻找图标；需要先开启即时 X 链接。',
    'A "P" button on every token row of Axiom Pulse, Padre Trenches and GMGN Trenches — buys the first preset amount without opening the chart.': '在 Axiom Pulse、Padre Trenches 和 GMGN Trenches 的每个代币行显示 P 按钮，不打开图表即可按第一个预设金额买入。',
    'Make the list buy buttons larger or smaller to fit your screen density.': '根据屏幕信息密度调整列表买入按钮大小。',
    'Corner pins the P button to the row\'s bottom-right, clear of the market-cap readout on compact/ultra list formats.': '将 P 按钮固定在每行右下角，避免遮挡紧凑/超紧凑列表中的市值。',
    'When a one-tap list buy opens a NEW position, its chart opens in a background tab so the position is one click away. Turn off for list-only trading.': '列表一键买入建立新持仓后，会在后台标签页打开对应图表，方便一键查看；只想在列表交易时可关闭。',
    'Nothing leaves this machine until the last step is on, and then only when you click Sync on the site.': '在开启最后一步之前，任何数据都不会离开本机；开启后也只有在网站上点击同步时才会发送。',
    'Off means the site asks you for the exported file instead — the board still works, it just costs you a download each time.': '关闭后网站会要求你上传导出文件；排行榜仍可使用，只是每次都要手动下载并上传。',
    'Strips the banner, sparkline, thesis and last-close card from the trade tab — only token, price, balance and buy/sell controls remain. For distraction-free execution.': '隐藏横幅、迷你曲线、交易逻辑和最近平仓卡片，只保留代币、价格、余额及买卖控件，减少执行干扰。',
    'Skins the PaperTrench overlay to match your dex. The site\'s own page is never touched — only the panel\'s colors. Or cycle them live with the ◍ button on the panel header.': '让 PaperTrench 面板配色匹配交易网站；不会修改网站本身，只改变面板颜色。也可点击面板标题栏的 ◍ 实时切换。',
    'Measured on this machine, stored locally, never sent anywhere. Speed claims get receipts or they do not get made.': '性能数据在本机测量并保存，绝不发送。只有可验证的数据才会形成速度结论。',
    'No pages watched long enough yet — at least 30 seconds of visible time on a trading site is needed before a rate is shown.': '还没有观察足够久的页面；交易网站需保持可见至少 30 秒后才会显示比率。',
    'No warm opens recorded yet — Instant X links and terminal hops will record here as you use them.': '还没有页面预热记录；使用即时 X 链接和终端跳转后会在这里记录。',
    'Honest limits:': '可信度边界：',
    'Stated plainly:': '坦白说明：',
    'What the board does with it': '排行榜如何使用这些数据',
    'What PaperTrench will not do here:': 'PaperTrench 在这里不会做什么：',
    'What the number is:': '这个数字代表什么：',
    'this is evidence, not proof. Anyone can run modified code locally, so final standings must be recomputed server-side from the chain — never from the number this app displays.': '这只是证据，不是最终证明。任何人都能在本地运行修改后的代码，因此最终排名必须由服务器根据记录链重新计算。',
    '1 · The narrative AI (optional).': '1 · 叙事分析 AI（可选）',
    '2 · The image AI (required).': '2 · 图像 AI（必需）',
    'Draws the picture. Anything with an OpenAI-style': '负责生成图片。任何兼容 OpenAI 风格',
    'endpoint works as-is; Gemini and Stability have their own adapters. For anything else — Higgsfield, a private model, next month\'s release — pick': '的服务地址都可直接使用；Gemini 和 Stability 有专用适配器。对于其他服务，请选择',
    'When a paid upload box appears on a dex — fund, boost, enhance token info — PaperTrench puts a': '当交易网站出现付费图片上传框时，PaperTrench 会放入一个',
    'tool on': '工具启用',
    'Uses xAI\'s server-side': '使用 xAI 服务端的',
    'x_search': 'X 搜索',
    'X-Ray': 'X-Ray 分析',
    'entry': '入场',
    'exit': '出场',
    'less': '收起',
    'the 2-minute guide': '2 分钟教程',
    'Every day you closed rounds this year, colored by your': '今年每个完成交易轮次的日期，颜色代表当天的',
    'Blank uses the free public pool — fine for most. If new coins feel slow where you live (public endpoints throttle by region), paste a free personal endpoint: two minutes, no card —': '留空时使用免费公共节点，通常已经足够。如果你所在地区的新币报价较慢（公共节点会按地区限流），可粘贴个人免费节点；申请只需两分钟且不需要银行卡——',
    'Enable only if you run a self-hosted (localhost, 127.0.0.1, or LAN) AI server. Off blocks requests to private/internal addresses.': '仅当你运行自托管 AI 服务（localhost、127.0.0.1 或局域网）时开启；关闭时会阻止访问私有/内部地址。',
    '. Your endpoint stays on this machine and is only ever used to read prices.': '。节点地址只保存在本机，并且仅用于读取价格。',
    'substituted in.': '会被替换进去。',
    'What did this trade teach you?': '这笔交易教会了你什么？',
    'Storage read failed — showing the last data this page loaded. Saving is disabled until a read succeeds. Reload the dashboard if this persists.': '读取本地数据失败——当前显示的是页面上次成功加载的数据。在恢复读取之前已禁用保存；若问题持续，请重新加载面板。',
    'No models reachable. Check the endpoint URL, that the service is running, and that the local toggle is on for localhost/LAN endpoints.': '无法连接任何模型。请检查服务地址、服务是否正在运行；若使用本机或局域网地址，还要确认已开启本地服务开关。',
    '— pick a rough starting point —': '——选择一个大致起点——',
    'Authorization: Bearer <key>': 'Authorization: Bearer <密钥>',
    'JSON with': '包含以下内容的 JSON',
  });

  const RANK_ZH = Object.freeze({
    'FRESH MEAT': '新手',
    JOURNALER: '记录者',
    SURVIVOR: '生存者',
    OPERATOR: '操盘手',
    VETERAN: '老手',
    GRADUATED: '已毕业',
  });
  const DRILL_ZH = Object.freeze({
    'Capture day': '利润捕获日',
    'Journal day': '交易记录日',
    'Flat-size day': '固定仓位日',
    'Stop-respect day': '遵守止损日',
  });

  const DYNAMIC_ZH = Object.freeze([
    [/^(\d+) fills · ([\d.]+) SOL fees$/, '$1 笔成交 · 手续费 $2 SOL'],
    [/^Step (\d+) of (\d+)$/, '第 $1 步，共 $2 步'],
    [/^(\d+) tokens$/, '$1 个代币'],
    [/^(\d+) trades?$/, '$1 笔交易'],
    [/^(\d+) rounds?$/, '$1 个轮次'],
    [/^(\d+) round trips?$/, '$1 个交易轮次'],
    [/^Today \((\d+) rounds?\)$/, '今天（$1 个轮次）'],
    [/^What's new in v(.+)$/, 'v$1 更新内容'],
    [/^Next: (.+)$/, (_all, rank) => `下一步：${RANK_ZH[String(rank).toUpperCase()] || rank}`],
    [/^Next gate: (.+)$/, (_all, rank) => `下一关：${RANK_ZH[String(rank).toUpperCase()] || rank}`],
    [/^TIER (.+) · (.+)$/, (_all, tier, rank) => `等级 ${tier} · ${RANK_ZH[String(rank).toUpperCase()] || rank}`],
    [/^LVL (.+) · (.+) reps · next level at (.+)$/, '等级 $1 · $2 次训练 · 下一级需要 $3'],
    [/^LVL (.+) · (.+) reps — (.+) of (.+) full-credit reps used today\.$/, '等级 $1 · 累计 $2 次训练——今天已使用 $3/$4 次完整计分机会。'],
    [/^Process, last (\d+) graded rounds$/, '执行表现：最近 $1 轮已评分交易'],
    [/^Today’s drill: (.+)$/, (_all, drill) => `今日训练：${DRILL_ZH[drill] || drill}`],
    [/^(?:“PAPER TRENCH” · SIMULATED FUNDS · ?)+$/, (whole) => whole.replace(/SIMULATED FUNDS/g, '虚拟资金')],
    [/^(\d+) older rounds? archived out of this table\. Totals below still include them\.$/, '$1 个较早轮次已从表格隐藏，但下方总计仍包含它们。'],
    [/^Max 2 MB · (\d+)\/(\d+)$/, '最大 2 MB · $1/$2'],
    [/^Unlink @(.+)$/, '解绑 @$1'],
    [/^Review failed: (.+)$/, '复盘失败：$1'],
    [/^Reset failed: (.+)$/, '重置失败：$1'],
    [/^Error: (.+)$/, '错误：$1'],
    [/^Save failed — retry$/, '保存失败——重试'],
    [/^Couldn't grade just now — (.+)$/, '暂时无法评分——$1'],
    [/^OK — (\d+) model\(s\) found: (.+)$/, '连接成功——找到 $1 个模型：$2'],
  ]);

  function translateCore(value, locale) {
    if (locale !== 'zh-CN' || typeof value !== 'string') return value;
    const normalized = value.replace(/\s+/g, ' ').trim();
    if (!normalized) return value;
    let translated = ZH[normalized] || ZH_EXTRA[normalized];
    if (!translated) {
      for (const [pattern, replacement] of DYNAMIC_ZH) {
        if (pattern.test(normalized)) {
          translated = normalized.replace(pattern, replacement);
          break;
        }
      }
    }
    if (!translated) return value;
    const leading = /^\s*/.exec(value)[0];
    const trailing = /\s*$/.exec(value)[0];
    return leading + translated + trailing;
  }

  function translateText(value, locale) {
    return translateCore(value, SUPPORTED_LOCALES.includes(locale) ? locale : 'en');
  }

  function start(doc) {
    const textRecords = new WeakMap();
    const attrRecords = new WeakMap();
    const translatedAttrs = ['title', 'aria-label', 'placeholder'];
    let locale = 'en';

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

    function translateTree(rootNode) {
      if (!rootNode) return;
      if (rootNode.nodeType === 3) { translateTextNode(rootNode); return; }
      if (rootNode.nodeType !== 1 && rootNode.nodeType !== 9 && rootNode.nodeType !== 11) return;
      if (rootNode.nodeType === 1) translateElementAttrs(rootNode);
      const walker = doc.createTreeWalker(rootNode, 1 | 4);
      let node;
      while ((node = walker.nextNode())) {
        if (node.nodeType === 3) translateTextNode(node);
        else translateElementAttrs(node);
      }
    }

    function paintToggle() {
      doc.querySelectorAll('#dashboard-language [data-locale]').forEach((button) => {
        const active = button.dataset.locale === locale;
        button.classList.toggle('active', active);
        button.setAttribute('aria-pressed', active ? 'true' : 'false');
      });
    }

    function persist(next) {
      try {
        if (typeof chrome !== 'undefined' && chrome.storage && chrome.storage.local) {
          chrome.storage.local.set({ [STORAGE_KEY]: next });
          return;
        }
      } catch (_) { /* fall through */ }
      try { localStorage.setItem(STORAGE_KEY, next); } catch (_) {}
    }

    function setLocale(next, shouldPersist = true) {
      locale = SUPPORTED_LOCALES.includes(next) ? next : 'en';
      if (doc.documentElement) doc.documentElement.lang = locale;
      translateTree(doc.body || doc);
      paintToggle();
      if (shouldPersist) persist(locale);
      try { doc.dispatchEvent(new CustomEvent('pt:localechange', { detail: { locale } })); } catch (_) {}
    }

    function bindToggle() {
      doc.querySelectorAll('#dashboard-language [data-locale]').forEach((button) => {
        if (button.dataset.i18nBound === '1') return;
        button.dataset.i18nBound = '1';
        button.addEventListener('click', () => setLocale(button.dataset.locale));
      });
      paintToggle();
    }

    const observer = new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        if (mutation.type === 'characterData') translateTextNode(mutation.target);
        else if (mutation.type === 'attributes') translateElementAttrs(mutation.target);
        else for (const node of mutation.addedNodes) translateTree(node);
      }
      bindToggle();
    });
    observer.observe(doc.documentElement || doc, {
      subtree: true,
      childList: true,
      characterData: true,
      attributes: true,
      attributeFilter: translatedAttrs,
    });

    bindToggle();
    translateTree(doc.body || doc);

    function adoptStored(value) {
      setLocale(SUPPORTED_LOCALES.includes(value) ? value : 'en', false);
    }
    try {
      if (typeof chrome !== 'undefined' && chrome.storage && chrome.storage.local) {
        chrome.storage.local.get([STORAGE_KEY], (stored) => {
          if (chrome.runtime && chrome.runtime.lastError) return;
          adoptStored(stored && stored[STORAGE_KEY]);
        });
      } else {
        adoptStored(localStorage.getItem(STORAGE_KEY));
      }
    } catch (_) {
      try { adoptStored(localStorage.getItem(STORAGE_KEY)); } catch (_) {}
    }

    return { setLocale, getLocale: () => locale, translateTree, disconnect: () => observer.disconnect() };
  }

  return { STORAGE_KEY, SUPPORTED_LOCALES, translateText, start };
});
