---
title: 开始
keywords: 开始, 首页, start
description: 你的知识库的第一页。
section: guide
order: 0
updated: 2026-11-17
draft: false
---

这一页在 `content/zh/index.md` —— **它就是站点的首页**（`/docs/`）。

改一下这段文字，如果 `npx @lightwiki/cli dev .` 开着，浏览器会自动刷新。

## 首页没有「自动生成」这回事 {#home}

`index.md` 就是 `/docs/`，写什么就是什么。两种常见玩法：

- 想要一张纯 HTML 的封面：给这一页配 `layout: landing`，正文留空，全部写在 `layouts/landing.eta` 里。
- 想要「目录页」：正文里放下面两样东西，它们会按分类 / 按分组把页面列出来。

```text
{{catalog}}
```

```text
{{pages(section: guide)}}
```

（上面两段是为了让你看见写法，所以放进了代码块；去掉围栏就会真的展开。）

## 接下来 {#next}

- 在 `content/zh/` 里加新的 `.md` 文件，它就是新页面；**文件名就是地址**
- 想加分组就在 `wiki.config.ts` 的 `sections` 里加，然后页面 frontmatter 写 `section: 那组`
- 完整语法（双链、宏、分类、代码高亮）见语法手册
