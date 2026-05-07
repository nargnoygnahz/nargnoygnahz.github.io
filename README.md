# 张永然的个人博客

这是一个可以直接部署到 GitHub Pages 的纯静态个人博客，包含算法、数学和随笔三个栏目。

## 本地预览

因为文章正文是从独立 Markdown 文件加载的，本地预览请用一个小服务器：

```bash
python3 -m http.server 8000
```

然后访问 `http://localhost:8000`。

## 添加 Markdown 文章

1. 把 Markdown 文件放进 `posts/`，例如 `posts/my-note.md`。
2. 在 `posts.js` 里加一条记录：

```js
{
  slug: "my-note",
  title: "我的笔记",
  category: "math",
  type: "markdown",
  source: "posts/my-note.md",
  date: "2026-05-07",
  tags: ["例子"],
  excerpt: "这一篇的简短摘要。"
}
```

Markdown 里可以直接写 `$...$` 和 `$$...$$` 数学公式。

## 添加 PDF 文章

1. 把 TeX 生成的 PDF 放进 `pdfs/`，例如 `pdfs/my-paper.pdf`。
2. 在 `posts.js` 里加一条记录：

```js
{
  slug: "my-paper",
  title: "我的 PDF 笔记",
  category: "math",
  type: "pdf",
  source: "pdfs/my-paper.pdf",
  date: "2026-05-07",
  tags: ["tex", "pdf"],
  excerpt: "由 TeX 生成的 PDF。"
}
```

## 部署

仓库名是 `nargnoygnahz.github.io`，推送到 GitHub 后，在仓库的 Pages 设置里选择从 `master` 分支根目录发布。
