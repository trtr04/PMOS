const UPDATED_AT = "2026-07-18";
const AUTHOR = "待团队确认";

const articles = [
  {
    id: "pcos-to-pmos",
    tag: "名称更新",
    title: "从 PCOS 到 PMOS：为什么疾病改名了？",
    summary: "新名称把关注点从“卵巢囊肿”扩展到内分泌、代谢、生殖与全生命周期健康。",
    minutes: 5,
    sections: [
      { heading: "新名称是什么？", paragraphs: ["2026 年 5 月 12 日，原来的多囊卵巢综合征（Polycystic Ovary Syndrome，PCOS）正式启用新名称 Polyendocrine Metabolic Ovarian Syndrome（PMOS）。本项目采用中文名“多内分泌代谢性卵巢综合征”。在名称过渡期，PMOS 与 PCOS 仍会同时出现，它们指向的是同一种健康状况，并不是发现了一种新疾病。"] },
      { heading: "为什么旧名称容易造成误解？", paragraphs: ["“多囊卵巢”容易让人以为疾病的核心是卵巢里长了很多囊肿。但临床所说的多囊卵巢形态主要是较多的小卵泡，并不等同于通常意义上的卵巢囊肿；而且并非每位患者都具有这种超声表现。旧名称也可能弱化它对代谢、心理、皮肤和长期健康的影响。"], callout: "PMOS 不是简单的“卵巢长囊肿”，也不只是一种生育问题。" },
      { heading: "新名称强调了什么？", paragraphs: ["“Polyendocrine”提示多个激素或内分泌环节可能参与其中；“Metabolic”强调胰岛素抵抗、血糖、血脂等代谢健康；“Ovarian”保留其与排卵和生殖系统的联系。这个名称希望帮助公众与医疗人员更完整地理解疾病，而不是把注意力只放在卵巢。"] },
      { heading: "改名会改变诊断和治疗吗？", paragraphs: ["改名首先改变的是理解与沟通方式，并不意味着患者需要因为名称变化而重新诊断。具体诊断、检查与治疗仍应由专业医疗人员根据循证指南和个人情况决定。国际推广预计存在过渡期，因此就医、检索资料时同时使用“PMOS / PCOS”会更容易找到完整信息。"] }
    ],
    sources: [
      ["Monash University：PMOS 新名称公告（2026）", "https://www.monash.edu/news/articles/polyendocrine-metabolic-ovarian-syndrome-new-name-to-improve-diagnosis-and-care-of-condition-affecting-170-million-women-worldwide"],
      ["American Society for Reproductive Medicine：PCOS is Now PMOS", "https://www.asrm.org/news-and-events/asrm-news/latest-news/may-27-2026-pcos-is-now-pmos-understanding-the-name-change/"],
      ["Monash University：国际循证指南页面", "https://www.monash.edu/medicine/mchri/pcos/guideline"]
    ]
  },
  {
    id: "understand-pmos",
    tag: "基础认识",
    title: "认识 PMOS：它不只是月经或生育问题",
    summary: "PMOS 的表现因人而异，可能涉及月经、雄激素、代谢、皮肤、生殖和情绪健康。",
    minutes: 6,
    sections: [
      { heading: "PMOS 是什么？", paragraphs: ["PMOS 是一种常见且复杂的内分泌代谢性健康状况，可从青春期开始，并持续影响成年后的健康。它可能涉及激素信号、排卵、代谢和心理健康，但每个人的表现与困扰程度并不相同。世界卫生组织估计，原 PCOS 影响约 10%～13% 的育龄女性，许多人尚未被识别。"] },
      { heading: "可能出现哪些表现？", paragraphs: ["常见表现包括月经稀发、不规律或缺失，排卵异常，面部或身体毛发增多，痤疮、油性皮肤，以及头发稀疏。部分人会遇到受孕困难，但患有 PMOS 并不等于一定不孕。症状可能随年龄和生活阶段变化。"], list: ["月经周期或排卵变化", "雄激素相关表现，如多毛、痤疮或脱发", "代谢方面的风险", "生育与妊娠方面的困扰", "焦虑、抑郁、身体形象或进食方面的困扰"] },
      { heading: "为什么要关注长期健康？", paragraphs: ["PMOS 与糖代谢异常、2 型糖尿病、血脂异常、阻塞性睡眠呼吸暂停和子宫内膜健康风险升高相关。风险升高不等于一定会发生这些问题，也不能通过单一症状自行判断。定期随访和根据个人情况进行筛查，有助于更早发现并管理风险。"], callout: "风险信息的意义是帮助及时管理健康，而不是制造恐慌。" },
      { heading: "它是谁的错吗？", paragraphs: ["不是。PMOS 的成因复杂，可能与遗传和多种生物学因素有关。它不是由“不够自律”造成的。健康生活方式可以支持整体健康，但不应把体重、症状或治疗效果归咎于个人意志。"] }
    ],
    sources: [
      ["World Health Organization：Polycystic ovary syndrome fact sheet", "https://www.who.int/news-room/fact-sheets/detail/polycystic-ovary-syndrome"],
      ["2023 International Evidence-based Guideline（开放全文）", "https://pmc.ncbi.nlm.nih.gov/articles/PMC10477934/"],
      ["Monash University：PMOS 新名称与疾病影响", "https://www.monash.edu/news/articles/polyendocrine-metabolic-ovarian-syndrome-new-name-to-improve-diagnosis-and-care-of-condition-affecting-170-million-women-worldwide"]
    ]
  },
  {
    id: "diagnosis",
    tag: "就医诊断",
    title: "PMOS 如何诊断？为什么不能只看一次超声",
    summary: "诊断需要综合月经、雄激素和卵巢表现，并排除其他可能原因；不能依靠自测或单项检查。",
    minutes: 6,
    sections: [
      { heading: "诊断不是看见“囊肿”就可以", paragraphs: ["PMOS 的表现具有差异性。根据国际循证指南，成人诊断通常需要在排除其他原因后，符合三类特征中的至少两类：临床或生化高雄激素表现；排卵功能障碍或月经不规律；多囊卵巢形态。成人在适当条件下，抗米勒管激素（AMH）可作为评估卵巢形态的一种选择，但不应被当作单独诊断工具。"] },
      { heading: "为什么需要排除其他原因？", paragraphs: ["甲状腺疾病、泌乳素异常、非经典型先天性肾上腺皮质增生等情况也可能出现月经或雄激素相关表现。医生会结合病史、体格检查和必要的实验室检查进行判断。具体检查项目应由医疗人员决定。"] },
      { heading: "青少年的诊断有什么不同？", paragraphs: ["青春期早期月经不规律和痤疮较常见，卵巢形态也可能与成人不同，因此青少年诊断需要更谨慎。国际指南不建议仅凭超声或 AMH 诊断青少年 PMOS；若有相关表现但暂不满足标准，医疗人员可能标记为“风险增加”并安排随访。"], callout: "不要使用网络问卷、一次 AMH 检测或一次超声给自己下诊断。" },
      { heading: "就诊前可以准备什么？", list: ["记录近几个月的月经日期和变化", "整理皮肤、毛发、体重或睡眠等困扰及出现时间", "列出正在使用的药物和补充剂", "准备既往检查结果和家族健康史", "写下最想向医生确认的问题"], paragraphs: ["这些记录用于帮助沟通，不代表记录越多越能自行确定诊断。"] }
    ],
    sources: [
      ["2023 International Evidence-based Guideline（开放全文）", "https://pmc.ncbi.nlm.nih.gov/articles/PMC10477934/"],
      ["World Health Organization：PCOS 诊断概述", "https://www.who.int/news-room/fact-sheets/detail/polycystic-ovary-syndrome"],
      ["PubMed：2023 国际循证指南摘要", "https://pubmed.ncbi.nlm.nih.gov/37580037/"]
    ]
  },
  {
    id: "lifestyle",
    tag: "生活管理",
    title: "生活管理不等于减重：从可持续的小行动开始",
    summary: "健康饮食、身体活动与行为支持对整体健康有益，即使体重没有变化，也可能带来价值。",
    minutes: 7,
    sections: [
      { heading: "生活管理的目标是什么？", paragraphs: ["国际指南建议所有 PMOS 人群关注健康生活方式，以支持代谢健康、一般健康和生活质量。生活管理不应只用体重变化来衡量，也不应把它描述为替代医疗的“治愈方法”。对一些人而言，维持体重、改善睡眠、增加体力活动或建立稳定饮食节奏，已经是有意义的目标。"] },
      { heading: "饮食：没有一种方案适合所有人", paragraphs: ["现有指南没有证据证明某一种特定饮食结构对所有 PMOS 人群都优于其他方案。更实际的方向是遵循一般健康饮食原则，并结合文化、偏好、预算、过敏情况和个人健康目标。避免极端节食，也要留意饮食规则是否引发焦虑、暴食或内疚。"], list: ["优先选择可长期坚持的饮食方式", "关注整体结构，而非把单一食物贴上“好”或“坏”的标签", "如有糖尿病、进食障碍或特殊营养需要，寻求专业支持"] },
      { heading: "运动：选择愿意重复的活动", paragraphs: ["有氧运动、抗阻训练或两者结合都可以成为选择。起点应与当前体能和健康状况相匹配，例如从散步、拉伸或短时居家训练开始，再逐渐增加。一般人群的身体活动建议可作为方向，但存在疼痛、妊娠、心血管问题或长期不运动时，应先咨询专业人员。"] },
      { heading: "把目标变得更容易执行", list: ["把“我要更健康”改成“晚饭后散步 10 分钟”", "一次只改变一项习惯", "记录完成情况，而不是追求每天完美", "提前准备遇到忙碌或疲惫时的简化版本", "用睡眠、精力和情绪等多维体验观察变化"], callout: "可持续的小行动，比短期极端计划更适合作为生活管理的起点。" }
    ],
    sources: [
      ["2023 International Evidence-based Guideline：Lifestyle management", "https://pmc.ncbi.nlm.nih.gov/articles/PMC10477934/"],
      ["World Health Organization：PCOS 治疗与健康生活方式", "https://www.who.int/news-room/fact-sheets/detail/polycystic-ovary-syndrome"],
      ["Medical Journal of Australia：2023 指南澳大利亚综述", "https://www.mja.com.au/journal/2024/221/7/summary-2023-international-evidence-based-guideline-assessment-and-management"]
    ]
  },
  {
    id: "mental-health",
    tag: "心理健康",
    title: "情绪与身体形象：这些困扰值得被认真对待",
    summary: "焦虑、抑郁、身体形象和进食困扰在 PMOS 人群中更常见，寻求支持不是软弱。",
    minutes: 6,
    sections: [
      { heading: "心理健康也是 PMOS 管理的一部分", paragraphs: ["PMOS 可能伴随月经、皮肤、毛发、体重和生育等变化，这些经历可能影响自我评价、关系和生活质量。国际指南指出，PMOS 人群出现抑郁和焦虑症状的风险较高，也需要关注身体形象、进食障碍和紊乱进食。心理困扰不是“想太多”，也不应被身体症状掩盖。"] },
      { heading: "什么时候可以主动求助？", paragraphs: ["如果低落、焦虑、羞耻、对身体的不满或饮食困扰持续存在，影响睡眠、学习、工作、人际关系或日常照顾自己，可以向心理健康专业人员或医疗人员求助。循证心理治疗可能有帮助；是否需要药物，应由合格医疗人员结合个人情况评估。"] },
      { heading: "日常可以怎样支持自己？", list: ["减少把健康等同于体重或外貌的内容输入", "选择尊重、不指责体重的医疗与支持环境", "把感受告诉可信任的人", "保持现实的小目标，允许状态有波动", "若记录饮食或体重增加焦虑，可暂停并寻求专业建议"] },
      { heading: "紧急情况下不要独自承担", paragraphs: ["如果出现自伤或自杀想法、计划，或认为自己无法保持安全，请立即联系当地急救服务、危机干预热线，或前往最近的急诊，并尽可能让可信任的人陪伴。网页内容不能提供危机干预。"], callout: "你的安全比完成任何健康计划都重要。紧急风险需要即时、现实世界中的专业支持。" }
    ],
    sources: [
      ["2023 International Evidence-based Guideline：心理健康建议", "https://pmc.ncbi.nlm.nih.gov/articles/PMC10477934/"],
      ["World Health Organization：PCOS 对情绪健康与生活质量的影响", "https://www.who.int/news-room/fact-sheets/detail/polycystic-ovary-syndrome"],
      ["Medical Journal of Australia：心理社会风险与指南建议", "https://www.mja.com.au/journal/2024/221/7/summary-2023-international-evidence-based-guideline-assessment-and-management"]
    ]
  },
  {
    id: "seek-care",
    tag: "就医支持",
    title: "什么时候需要就医？把问题带到专业支持中",
    summary: "持续的月经、皮肤、代谢、生育或心理困扰，都可以成为寻求医疗支持的理由。",
    minutes: 6,
    sections: [
      { heading: "哪些情况值得预约就诊？", paragraphs: ["如果月经长期不规律或缺失，毛发、痤疮或脱发变化明显，正在备孕但遇到困难，或担心血糖、血压、睡眠和心理状态，可以预约医疗评估。即使症状没有达到“严重”程度，只要它持续困扰你，也有理由寻求帮助。"], list: ["月经长期稀发、无月经，或出血模式明显改变", "雄激素相关表现快速出现或明显加重", "存在糖尿病、PMOS 等家族史并担心自身风险", "备孕困难或希望获得生育规划建议", "焦虑、抑郁、身体形象或进食问题影响生活"] },
      { heading: "哪些情况需要更及时的处理？", paragraphs: ["大量或持续出血并伴随头晕、乏力，剧烈或突然发生的腹痛，怀孕期间出现明显不适，或出现自伤、自杀想法等情况，不适合等待普通科普建议。请联系当地急救服务或及时前往医疗机构。具体紧急程度应由专业人员判断。"], callout: "当症状突然、严重或让你感觉不安全时，优先寻求即时医疗帮助。" },
      { heading: "如何让就诊沟通更有效？", list: ["说明最影响生活的症状和持续时间", "带上月经记录、用药清单和既往检查", "主动询问需要哪些代谢和心理健康评估", "请医生解释每项检查的目的和结果", "共同讨论方案的收益、风险、费用和个人偏好"] },
      { heading: "治疗需要个体化", paragraphs: ["PMOS 目前没有适用于所有人的单一治疗。管理可能涉及生活方式支持、月经和皮肤症状处理、代谢风险管理、心理支持或生育治疗。用药存在适应证、禁忌证和副作用，本模块不提供用药选择、剂量、停药或换药建议。"] }
    ],
    sources: [
      ["World Health Organization：PCOS 诊断与治疗概述", "https://www.who.int/news-room/fact-sheets/detail/polycystic-ovary-syndrome"],
      ["2023 International Evidence-based Guideline（开放全文）", "https://pmc.ncbi.nlm.nih.gov/articles/PMC10477934/"],
      ["Monash University：国际循证指南资源", "https://www.monash.edu/medicine/mchri/pcos/guideline"]
    ]
  }
];

const main = document.querySelector("#main");

function escapeHtml(value) {
  return String(value).replace(/[&<>'"]/g, char => ({"&":"&amp;","<":"&lt;",">":"&gt;","'":"&#39;",'"':"&quot;"}[char]));
}

function renderHome(activeTag = "全部") {
  const tags = ["全部", ...new Set(articles.map(article => article.tag))];
  const visible = activeTag === "全部" ? articles : articles.filter(article => article.tag === activeTag);
  main.innerHTML = `
    <section class="hero">
      <p class="eyebrow">PMOS · 原称 PCOS</p>
      <h1>了解身体，<br>从可靠的信息开始</h1>
      <p class="hero-copy">用清晰、克制、有来源的内容认识多内分泌代谢性卵巢综合征。这里不替你下诊断，而是帮助你更有准备地照顾自己、与专业人员沟通。</p>
      <div class="hero-chips"><span class="chip">6 篇核心科普</span><span class="chip">权威来源链接</span><span class="chip">约 5–7 分钟阅读</span></div>
    </section>
    <section class="container">
      <div class="section-heading"><div><p class="eyebrow">LEARNING PATH</p><h2>从这里开始了解 PMOS</h2></div><p>按自己的节奏阅读，不必一次看完。</p></div>
      <div class="filter-row" aria-label="文章分类筛选">${tags.map(tag => `<button class="filter-btn ${tag === activeTag ? "active" : ""}" data-tag="${tag}">${tag}</button>`).join("")}</div>
      <div class="article-grid">
        ${visible.length ? visible.map((article, index) => `
          <article class="article-card">
            <span class="card-number">0${articles.indexOf(article) + 1}</span>
            <span class="card-tag">${article.tag}</span>
            <h3>${article.title}</h3>
            <p>${article.summary}</p>
            <div class="card-meta"><span>${article.minutes} 分钟</span><span>更新于 ${UPDATED_AT}</span></div>
            <a class="card-link" href="#/article/${article.id}" aria-label="阅读《${article.title}》">阅读全文 →</a>
          </article>`).join("") : `<div class="empty">该分类暂时没有文章。</div>`}
      </div>
      <div class="notice"><strong>阅读提示</strong><span>内容仅用于健康教育，不能替代医生的诊断、治疗或个体化建议。如有健康困扰，请咨询合格医疗人员。</span></div>
    </section>`;
  document.querySelectorAll(".filter-btn").forEach(button => button.addEventListener("click", () => renderHome(button.dataset.tag)));
}

function renderArticle(article) {
  const currentIndex = articles.indexOf(article);
  const next = articles[(currentIndex + 1) % articles.length];
  main.innerHTML = `
    <header class="article-hero">
      <a class="back-link" href="/education">← 返回主站科普</a>
      <span class="card-tag">${article.tag}</span>
      <h1>${article.title}</h1>
      <p class="article-summary">${article.summary}</p>
      <div class="meta-line"><span>作者：${AUTHOR}</span><span>更新时间：${UPDATED_AT}</span><span>阅读约 ${article.minutes} 分钟</span></div>
    </header>
    <article class="article-body">
      <div class="notice"><strong>重要说明</strong><span>内容仅用于健康教育，不能替代医生的诊断、治疗或个体化建议。如有健康困扰，请咨询合格医疗人员。</span></div>
      ${article.sections.map(section => `
        <section>
          <h2>${section.heading}</h2>
          ${(section.paragraphs || []).map(paragraph => `<p>${paragraph}</p>`).join("")}
          ${section.list ? `<ul>${section.list.map(item => `<li>${item}</li>`).join("")}</ul>` : ""}
          ${section.callout ? `<div class="key-point"><strong>请记住</strong>${section.callout}</div>` : ""}
        </section>`).join("")}
      <section class="sources">
        <h2>参考来源</h2>
        <p class="source-note">以下链接均为本页撰写时参考的机构或学术资料。链接内容可能更新，访问时间：${UPDATED_AT}。</p>
        <ol>${article.sources.map(([name, url]) => `<li><a href="${url}" target="_blank" rel="noopener noreferrer">${name}</a></li>`).join("")}</ol>
      </section>
      <aside class="next-reading"><span class="eyebrow">继续阅读</span><h3>${next.title}</h3><a href="#/article/${next.id}">阅读下一篇 →</a></aside>
    </article>`;
}

function renderAbout() {
  main.innerHTML = `<section class="about-panel">
    <a class="back-link" href="/education">← 返回主站科普</a>
    <p class="eyebrow">ABOUT PMOS</p>
    <h1>关于这个科普模块</h1>
    <p>PMOS 是多内分泌代谢性卵巢综合征（Polyendocrine Metabolic Ovarian Syndrome）的英文缩写，原称 PCOS（多囊卵巢综合征）。本模块以疾病更名、基础认识、诊断、生活管理、心理健康和就医支持为六个核心主题。</p>
    <p>我们尽量以世界卫生组织、国际循证指南、Monash University 和专业医学学会的信息为依据，并在每篇文章末尾列出来源链接。内容仅用于健康教育，不能针对个人情况提供诊断或治疗建议。</p>
    <div class="notice"><strong>医疗免责声明</strong><span>本站不提供诊断、处方、药物调整或紧急医疗服务。若症状突然、严重或让你感到不安全，请及时联系当地急救服务或医疗机构。</span></div>
  </section>`;
}

function route() {
  const hash = location.hash || "#/";
  if (hash === "#about") return renderAbout();
  const match = hash.match(/^#\/article\/([^/]+)$/);
  if (match) {
    const article = articles.find(item => item.id === match[1]);
    if (article) { renderArticle(article); window.scrollTo(0, 0); return; }
  }
  renderHome();
  window.scrollTo(0, 0);
}

window.addEventListener("hashchange", route);
route();
