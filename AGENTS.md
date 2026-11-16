# AGENTS.md

给 AI 编码助手（GitHub Copilot / Cursor / Codex 等）的说明。这个仓库是**内容仓库**，不是工具仓库。

## 这是什么

[轻维基（lightwiki）](https://github.com/summerset-zz/lightwiki) 把 markdown + frontmatter 编译成一组静态文件。
这里只放内容和少量配置，工具从 npm 现取，不需要安装。

## 目录

```
wiki.config.ts     站点配置
content/zh/*.md    内容，一个文件一页
assets/            （可选）图片、自定义样式
layouts/           （可选）覆盖主题布局，只写要改的那几个 .eta
macros/            （可选）自定义宏
```

## 硬规则

1. **页面身份是文件名（slug），不是标题。** `content/zh/start.md` → `/docs/start/`。
   改文件名等于改地址，会让外部链接和内部 `[[...]]` 失效；改 `title` 只影响显示。
2. **不要给这个仓库加 `package.json` 或安装依赖**，除非用户明确要求（那是「高级用法」）。
3. **不要手写 `/docs/` 目录页**，它由工具生成。
4. **改动内容后不要自己起 dev server**；需要预览时告诉用户跑 `npx @lightwiki/cli dev .`。
5. **不要删 `content/` 里没有要求的文件**，也不要批量重命名。

## frontmatter

每个 `.md` 开头必须是：

```yaml
---
title: 页面标题          # 必填，非空
description: 一句话摘要
keywords: 关键词, keyword
section: guide           # 必须属于 wiki.config.ts 的 sections；留空也可以
order: 1
updated: 2026-11-16      # 只接受 YYYY-MM-DD
draft: false
---
```

- `title` 必填且不能为空；双链 `[[标题]]` 靠它解析，**同一语言内标题不能重复**。
- `updated` 只接受 `YYYY-MM-DD`，写成 `2026/11/16` 会导致这一页被跳过。
- 未知字段会被放行（不报错），但不要凭空发明字段。
- 可选字段：`categories`、`sidebarCategory`、`hintTitle`/`hint`、`source*`、`license*`。

## 正文语法

标准 markdown 之外，还有：

| 写法 | 作用 |
|---|---|
| `[[页面标题]]` / `[[slug]]` / `[[目标\|显示文字]]` | 双链，构建时转成真实链接 |
| `{{note}}…{{/note}}` | 宏；内置 `note`、`card`、`glossary` 等 |
| `## 小节 {#anchor}` | 显式锚点，会进页内目录 |
| `![图](/assets/x.png){.wide}` | 给元素加属性/class |
| `<!-- source: 来源 -->` | 只借用某几节时标注出处 |

写表格、代码块、脚注、任务列表都按 CommonMark 来。代码围栏要带语言名才会高亮。

## 校验与构建

```bash
npx @lightwiki/cli check .          # 只校验，不写盘（红链、孤页、frontmatter、缺译）
npx @lightwiki/cli build .          # 产物在 ./dist
npx @lightwiki/cli check . --strict # 红链与孤页也算失败
```

改完内容至少跑一次 `check`。

## 语法手册

完整语法与配置字段：<https://summerset-zz.github.io/lightwiki/>

不确定某个宏、某个 frontmatter 字段怎么用时，先查手册，不要猜。
