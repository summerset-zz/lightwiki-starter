---
title: 开始
keywords: 开始, 首页, start
description: 你的知识库的第一页。
section: guide
order: 0
updated: 2026-11-15
draft: false
---

这一页在 `content/zh/start.md`。

改一下这段文字，如果 `npx @lightwiki/cli dev` 开着，浏览器会自动刷新。

## 注意首页不是这一页 {#home}

`/docs/` 是自动生成的目录页，会列出所有页面。这一页的地址是 `/docs/start/`。

## 接下来 {#next}

- 在 `content/zh/` 里加新的 `.md` 文件，它就是新页面
- 想加分组就在 `wiki.config.ts` 的 `sections` 里加，然后页面 frontmatter 写 `section: 那组`
- 想看完整的语法（双链、宏、分类、代码高亮），去读 `examples/mini`
