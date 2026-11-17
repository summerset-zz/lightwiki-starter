# 我的知识库

用[轻维基（lightwiki）](https://github.com/summerset-zz/lightwiki)建的知识库。

内容就是 markdown + frontmatter，产物是一组**静态文件** —— 没有服务器依赖、没有 SPA、没有外部 CDN，丢到任何静态托管上就能跑。

> 这个仓库来自官方模板 [`lightwiki-starter`](https://github.com/summerset-zz/lightwiki-starter)：
> 点 **Use this template** 建的，或者用 `npx @lightwiki/cli init` 生成的，结构完全一样。

---

## 1. 初始化

选一种，得到的目录结构一模一样。

### 命令行

```bash
npx @lightwiki/cli init my-wiki
```

用 yarn / pnpm 的话：

```bash
yarn dlx @lightwiki/cli init my-wiki
pnpm dlx @lightwiki/cli init my-wiki
```

目录已存在也不要紧 —— 只会补上缺的文件，**不会覆盖**你已有的内容；确实要覆盖就加 `--force`。

### GitHub 上点按钮

打开 [lightwiki-starter](https://github.com/summerset-zz/lightwiki-starter) → **Use this template** → 起个名字。好处是仓库、`main` 分支、Pages 一步到位。

### 生成出来的东西

```
my-wiki/
├── wiki.config.ts               站点配置（标题、语言、目录、分组）
├── content/zh/index.md          首页（就是 /docs/），也可以再添别的页
├── AGENTS.md                    给 AI 助手看的写作说明（见第 2 节）
├── README.md                    本文件
└── .github/workflows/pages.yml  push 到 main 就构建并发布到 GitHub Pages
```

**没有 `package.json`，也不用 `npm install`。** 内容仓库不需要装任何东西 —— 工具在用的时候现取。

### 第一次看到效果

```bash
cd my-wiki
npx @lightwiki/cli dev .
```

打开 <http://127.0.0.1:5173> 。改 `content/zh/index.md`，浏览器会自动刷新。

---

## 2. 写内容

### 文档放在哪

`content/zh/` 下面，一个 `.md` 一页。

**文件名就是地址**，和标题无关：

| 文件 | 地址 |
|---|---|
| `content/zh/index.md` | `/docs/`（**首页**） |
| `content/zh/标准/术语.md` | `/docs/标准/术语/` |

`index.md` 就是首页 —— 没有「自动生成的目录页」这回事，目录写什么由你决定（正文里放 `{{catalog}}` 或 `{{pages(section: ...)}}` 就会列出来）。**每种语言都得有一个 `index.md`**，缺了那个语言的首页会 404。

想把 `index.md` 改名成 `home.md`，地址就跟着变成 `/docs/home/`，而 `/docs/` 会没人管（构建能过，但 `wiki check` 会报缺首页）。所以：改文件名等于改地址。

`/docs/` 是自动生成的目录页，不用手写。

### frontmatter

每页开头一段 `---` 包住的 YAML，决定这页怎么被索引、排在侧栏哪里：

```yaml
---
title: 页面标题          # 必填。双链 [[页面标题]] 靠它找到这一页
description: 一句话摘要   # 搜索结果与 <meta> 里用
keywords: 关键词, keyword # 逗号分隔或数组都行，搜索时权重高于正文
section: guide           # 侧栏分组，取值要和 wiki.config.ts 的 sections 一致
order: 1                 # 组内排序，小的在前
updated: 2026-11-16      # 只接受 YYYY-MM-DD
draft: false             # true 则构建时不产出这一页
---
```

其余字段（`categories`、`sidebarCategory`、`hint`、`source*`、`license*`）见语法手册的「frontmatter」一页。

`section` 写错了构建不会失败，但 `wiki check` 会点名告诉你 —— 提交前跑一次：

```bash
npx @lightwiki/cli check .
```

### 会什么语法

正文是 markdown，在此之上多了几样：

- **双链** —— `[[页面标题]]` 或 `[[slug]]`，也可以 `[[页面|显示文字]]`
- **宏** —— `{{note}}…{{/note}}`，自带 `note` / `card` / `glossary` 等
- **锚点** —— `## 小节 {#anchor}`，会进页内目录
- **属性** —— `![](/assets/x.png){.wide}`，零散地给元素加 class
- 代码高亮、表格、脚注、任务列表

完整语法、每个宏的用法、布局能改哪几处：**语法手册 <https://summerset-zz.github.io/lightwiki/>**

### 让 AI 帮你写

仓库根的 **`AGENTS.md`** 就是给 AI 助手的说明书（内容约定、frontmatter 字段、可用语法、构建命令）。

GitHub Copilot、Cursor、Codex 这类工具会自动读它，你什么都不用做。如果用的工具不自动读，把 `AGENTS.md` 的内容贴进对话开头即可。

### 想改样式 / 布局

| 想改 | 放哪 |
|---|---|
| 站点名、语言、分组 | `wiki.config.ts` |
| 图片 | `assets/`，正文写 `![说明](/assets/图.png)` |
| 自定义样式 | `assets/*.css` 或 `assets/*.less` |
| 覆盖某个页面的布局 | `layouts/doc.eta` 等，只写要改的那个 |
| 让某一页用别的布局 | 该页 frontmatter 写 `layout: landing`，再建 `layouts/landing.eta` |
| 自定义宏 | `macros/note.eta` 等 |

布局就是完整的 HTML 骨架，`<style>` 与 `<script>` 都可以直接写在里面；换了布局之后能用的数据仍然是 `page` / `site` / `nav` 那一套。

布局和宏都是**可选的**：不建这些目录就用默认主题；建了也只覆盖你写的那几个，升级工具时不会被冲掉。

---

## 3. 构建

```bash
npx @lightwiki/cli build .      # 产物在 ./dist
```

产物长这样：

```
dist/
├── index.html                  首页（跳到默认语言）
├── docs/index.html             目录页
├── docs/start/index.html       每一页
├── categories/…                分类页
├── assets/                     样式、脚本
└── meta.json / sitemap.xml     给搜索与爬虫
```

影响地址形态的开关（`basePath`、`urlStyle`）都在 `wiki.config.ts` 里，默认是目录式（`/docs/start/`），适合所有静态托管。

几个常用变体：

```bash
npx @lightwiki/cli build . --inline    # 内联样式与图片，产物只剩 .html（适合单文件分发）
npx @lightwiki/cli build . -o out      # 换输出目录
```

### 固定工具版本

CI 里建议钉版本，本地反复构建也建议：

```bash
npm i -D @lightwiki/cli     # 或者 yarn add -D @lightwiki/cli
npx wiki build .            # 装成依赖后命令就叫 wiki
```

不想装依赖就一直用 `npx @lightwiki/cli build .`（不写版本就是 latest）。

> 0.x 阶段别写 `@^0.1.0` 这种锁 —— semver 里 `^0.1.0` 只覆盖 `0.1.x`，升级到 0.2 就失效了。要锁版本就装成依赖（`npm i -D @lightwiki/cli`），锁在 `package.json` 里。

---

## 4. 发布到 GitHub Pages

仓库里已经带了 workflow，**只需要在 GitHub 上做一次设置**：

> Settings → Pages → **Source** 选 **GitHub Actions**

之后每次 push 到 `main` 就自动构建并部署到 `https://<用户名>.github.io/<仓库名>/`。

### basePath 为什么不用改

项目站点挂在 `/<仓库名>/` 子路径下，产物里的链接必须带这个前缀，否则整站 404。

`wiki.config.ts` 里写的是：

```ts
basePath: env.LIGHTWIKI_BASE_PATH ?? '/',
```

workflow 会把仓库名注入进去：

```yaml
- name: 构建
  env:
    LIGHTWIKI_BASE_PATH: /${{ github.event.repository.name }}/
  run: npx --yes @lightwiki/cli build .
```

所以本地是 `/`，线上自动变成 `/你的仓库名/` —— **仓库改名也不用动配置**。

### 换成自己的域名

1. `wiki.config.ts` 里把 `basePath` 改回 `'/'`，`siteUrl` 改成正式地址
2. 仓库 Settings → Pages → Custom domain 填域名
3. 把 workflow 里 `LIGHTWIKI_BASE_PATH` 那两行删掉

### 部署失败怎么看

Actions 页面看 `Pages` 这个 workflow。构建步骤会直接给出原因 —— 最常见的是忘了第 4 节开头那一步设置（Source 没选成 GitHub Actions）。

---

## 许可

内容由你自己决定；工具与主题是 MIT。
