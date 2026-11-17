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
layouts/           （可选）覆盖主题的皮肤，只写要改的那几个 .eta
macros/            （可选）自定义模板
```

## 硬规则

1. **页面身份是文件名（slug），不是标题。** `content/zh/start.md` → `/docs/start/`。
   改文件名等于改地址，会让外部链接和内部 `[[...]]` 失效；改 `title` 只影响显示。
2. **每种语言都必须有 `content/<语言>/index.md`**。它就是首页 `/docs/`，没有自动生成的目录页。
   缺了首页，`wiki check` 直接报错。
3. **不要给这个仓库加 `package.json` 或安装依赖**，除非用户明确要求（那是高级用法）。
4. **不要删 `content/` 里没有要求的文件**，也不要批量重命名。

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
- 可选字段：`layout`（换这一页的皮肤）、`styles` / `scripts`（单独挂 css/js，相对 `assets/`）、
  `categories`、`sidebarCategory`、`hintTitle`/`hint`、`source*`、`license*`。

脚本要 ES module 就写成 `scripts: [{ src: x.js, module: true }]`，两种写法可以混用。

`layout: landing` 会让这一页改用 `layouts/landing.eta`（不写就是 `doc`）。皮肤名只能是一段文件名，文件不存在时构建直接报错；换皮肤不换数据，皮肤里能用的仍是 `page` / `site` / `nav` / `sidebar` / `index`。

## 正文语法

标准 markdown 之外，还有：

| 写法 | 作用 |
|---|---|
| `[[页面标题]]` / `[[slug]]` / `[[目标\|显示文字]]` | 双链，构建时转成真实链接 |
| `{{catalog}}` | 主题自带：所有分类的列表 |
| `{{pages(section: guide)}}` | 主题自带：某分组下的页面列表（也支持 `category: xxx`） |
| `{{name(...)}}` | 自定义模板，定义在 `macros/*.eta`；参数写成 `键: 值`，不是 `key="value"` |
| `## 小节 {#anchor}` | 显式锚点，会进页内目录 |
| `![图](/assets/x.png){.my-class}` | 给元素加属性/class（class 只是加上，样式要自己写） |
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

不确定某个模板、某个 frontmatter 字段怎么用时，先查手册，不要猜。
