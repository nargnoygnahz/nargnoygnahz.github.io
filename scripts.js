const categories = {
  all: { label: "全部" },
  algorithm: { label: "算法" },
  math: { label: "数学" },
  essay: { label: "随笔" }
};

const posts = window.BLOG_POSTS || [];
const app = document.querySelector("#app");
const categoryList = document.querySelector("#category-list");
const postCount = document.querySelector("#post-count");
const year = document.querySelector("#year");

postCount.textContent = posts.length;
year.textContent = new Date().getFullYear();

if (window.marked) {
  marked.setOptions({
    breaks: true,
    gfm: true
  });
}

function getRoute() {
  const hash = window.location.hash || "#/";
  const parts = hash.replace(/^#\/?/, "").split("/").filter(Boolean);
  if (parts[0] === "post") return { view: "post", slug: parts[1] };
  if (parts[0] === "category") return { view: "category", category: parts[1] || "all" };
  return { view: "home", category: "all" };
}

function formatDate(value) {
  return new Intl.DateTimeFormat("zh-CN", {
    year: "numeric",
    month: "long",
    day: "numeric"
  }).format(new Date(value));
}

function countByCategory(category) {
  if (category === "all") return posts.length;
  return posts.filter((post) => post.category === category).length;
}

function categoryName(key) {
  return categories[key]?.label || "文章";
}

function sourceLabel(post) {
  return post.type === "pdf" ? "PDF" : "Markdown";
}

function renderCategories(activeCategory = "all") {
  categoryList.innerHTML = Object.entries(categories)
    .map(([key, category]) => `
      <a class="category-button ${key === activeCategory ? "active" : ""}" href="#/${key === "all" ? "" : `category/${key}`}">
        <span>${category.label}</span>
        <span>${countByCategory(key)}</span>
      </a>
    `)
    .join("");
}

function postCard(post) {
  return `
    <a class="post-card" href="#/post/${post.slug}">
      <div class="post-meta">
        <span class="chip">${categoryName(post.category)}</span>
        <span class="chip source-chip">${sourceLabel(post)}</span>
        <span>${formatDate(post.date)}</span>
        <span>${post.readingTime || ""}</span>
      </div>
      <h3>${post.title}</h3>
      <p>${post.excerpt || ""}</p>
      <div class="post-tags">
        ${(post.tags || []).map((tag) => `<span>#${tag}</span>`).join("")}
      </div>
    </a>
  `;
}

function filterPosts(activeCategory = "all", query = "") {
  const normalizedQuery = query.trim().toLowerCase();
  return posts
    .filter((post) => activeCategory === "all" || post.category === activeCategory)
    .filter((post) => {
      const haystack = [
        post.title,
        post.excerpt || "",
        sourceLabel(post),
        (post.tags || []).join(" ")
      ].join(" ").toLowerCase();
      return haystack.includes(normalizedQuery);
    })
    .sort((a, b) => new Date(b.date) - new Date(a.date));
}

function renderCards(activeCategory = "all", query = "") {
  const filtered = filterPosts(activeCategory, query);
  const results = document.querySelector("#results");
  results.innerHTML = filtered.length
    ? `<div class="post-grid">${filtered.map(postCard).join("")}</div>`
    : `<div class="empty">没有找到匹配的文章。</div>`;
}

function renderList(activeCategory = "all") {
  const title = activeCategory === "all" ? "最新文章" : `${categoryName(activeCategory)}文章`;
  app.innerHTML = `
    <div class="toolbar">
      <h2>${title}</h2>
      <input class="search" id="search" type="search" placeholder="搜索标题、摘要或标签">
    </div>
    <div id="results"></div>
  `;

  document.querySelector("#search").addEventListener("input", (event) => {
    renderCards(activeCategory, event.target.value);
  });
  renderCards(activeCategory);
}

function articleShell(post, body) {
  app.innerHTML = `
    <article class="article">
      <a class="back-link" href="#/">← 返回文章列表</a>
      <div class="article-meta">
        <span class="chip">${categoryName(post.category)}</span>
        <span class="chip source-chip">${sourceLabel(post)}</span>
        <span>${formatDate(post.date)}</span>
        <span>${post.readingTime || ""}</span>
      </div>
      <h2>${post.title}</h2>
      <div class="post-tags">${(post.tags || []).map((tag) => `<span>#${tag}</span>`).join("")}</div>
      ${body}
    </article>
  `;
}

function escapeHtml(value) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function simpleHighlight(block) {
  let html = escapeHtml(block.textContent);
  html = html
    .replace(/(\/\/.*$)/gm, '<span class="code-comment">$1</span>')
    .replace(/("(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'|`(?:\\.|[^`\\])*`)/g, '<span class="code-string">$1</span>')
    .replace(/\b(const|let|var|function|return|if|else|for|while|class|new|async|await|import|export|from|def|lambda|True|False|None|int|long|double|void|auto|vector|string|public|private|include|using|namespace)\b/g, '<span class="code-keyword">$1</span>')
    .replace(/\b(\d+(?:\.\d+)?)\b/g, '<span class="code-number">$1</span>');
  block.innerHTML = html;
  block.classList.add("simple-hljs");
}

function highlightCodeBlocks() {
  document.querySelectorAll(".article-body pre code").forEach((block) => {
    if (window.hljs) {
      hljs.highlightElement(block);
    } else {
      simpleHighlight(block);
    }
  });
}

async function renderMarkdownPost(post) {
  articleShell(post, `<div class="article-body loading">正在加载文章...</div>`);

  try {
    const response = await fetch(post.source);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const markdown = await response.text();
    const html = window.marked ? marked.parse(markdown) : `<pre>${markdown}</pre>`;
    document.querySelector(".article-body").innerHTML = html;

    highlightCodeBlocks();
    if (window.MathJax?.typesetPromise) {
      window.MathJax.typesetPromise([app]);
    }
  } catch (error) {
    document.querySelector(".article-body").innerHTML = `
      <p>这篇 Markdown 暂时没有加载成功。</p>
      <p><a href="${post.source}">直接打开源文件</a></p>
    `;
  }
}

function renderPdfPost(post) {
  articleShell(post, `
    <div class="pdf-actions">
      <a class="open-source" href="${post.source}" target="_blank" rel="noreferrer">新窗口打开 PDF</a>
    </div>
    <iframe class="pdf-viewer" src="${post.source}" title="${post.title}"></iframe>
  `);
}

function renderPost(slug) {
  const post = posts.find((item) => item.slug === slug);
  if (!post) {
    app.innerHTML = `<div class="empty">这篇文章暂时不存在。<a class="back-link" href="#/">返回首页</a></div>`;
    return;
  }

  if (post.type === "pdf") {
    renderPdfPost(post);
    return;
  }

  renderMarkdownPost(post);
}

function render() {
  const route = getRoute();
  const activeCategory = route.view === "category" ? route.category : "all";
  document.body.classList.toggle("reading", route.view === "post");
  renderCategories(activeCategory);

  if (route.view === "post") {
    renderPost(route.slug);
    return;
  }

  renderList(activeCategory);
}

function drawAmbient() {
  const canvas = document.querySelector("#ambient");
  const context = canvas.getContext("2d");
  const ratio = Math.max(window.devicePixelRatio || 1, 1);
  const width = window.innerWidth;
  const height = window.innerHeight;
  canvas.width = width * ratio;
  canvas.height = height * ratio;
  canvas.style.width = `${width}px`;
  canvas.style.height = `${height}px`;
  context.scale(ratio, ratio);
  context.clearRect(0, 0, width, height);

  const points = Array.from({ length: 28 }, (_, index) => {
    const x = (Math.sin(index * 1.7) * 0.5 + 0.5) * width;
    const y = ((index * 97) % Math.max(height, 1));
    return { x, y };
  });

  context.strokeStyle = "rgba(31, 122, 104, 0.2)";
  context.lineWidth = 1;
  points.forEach((point, index) => {
    const next = points[(index + 7) % points.length];
    context.beginPath();
    context.moveTo(point.x, point.y);
    context.lineTo(next.x, next.y);
    context.stroke();
  });

  context.fillStyle = "rgba(168, 86, 47, 0.3)";
  points.forEach((point) => {
    context.beginPath();
    context.arc(point.x, point.y, 2.2, 0, Math.PI * 2);
    context.fill();
  });
}

window.addEventListener("hashchange", render);
window.addEventListener("resize", drawAmbient);
render();
drawAmbient();
