# 我的知识库

用[轻维基（lightwiki）](https://github.com/summerset-zz/lightwiki)建的知识库。

内容就是 markdown + frontmatter，产物是一组**静态文件**：没有服务器依赖、没有 SPA、没有外部 CDN，丢到任何静态托管上就能跑。

> 这个仓库来自官方模板 [`lightwiki-starter`](https://github.com/summerset-zz/lightwiki-starter)：
> 点 **Use this template** 建的，或者用 `npx @lightwiki/cli init` 生成的，结构完全一样。

主站文档在 <https://summerset-zz.github.io/lightwiki/>。这份 README 只讲怎么开始；语法、字段、皮肤这些细节会随时增补，以主站为准。

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

目录已存在也不要紧，只会补上缺的文件，**不会覆盖**你已有的内容；确实要覆盖就加 `--force`。

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

**没有 `package.json`，也不用 `npm install`。** 内容仓库不需要装任何东西，工具在用的时候现取。

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

`index.md` 就是首页。没有自动生成的目录页这回事，目录写什么由你决定（正文里放 `{{catalog}}` 或 `{{pages(section: ...)}}` 就会列出来）。**每种语言都得有一个 `index.md`**，缺了那个语言的首页会 404。

想把 `index.md` 改名成 `home.md`，地址就跟着变成 `/docs/home/`，而 `/docs/` 会没人管（构建能过，但 `wiki check` 会报缺首页）。所以：改文件名等于改地址。

### frontmatter

每页开头一段 `---` 包住的 YAML。只有 `title` 是必填的：

```yaml
---
title: 页面标题
section: guide
---
```

其余字段（`description`、`keywords`、`order`、`updated`、`draft`、`layout`、`styles`、`scripts`、`categories` 等）与各自的写法见主站：

- frontmatter 全部字段 <https://summerset-zz.github.io/lightwiki/docs/basics/frontmatter/>
- 正文语法 <https://summerset-zz.github.io/lightwiki/docs/basics/markdown/>

`section` 写错了构建不会失败，但 `wiki check` 会点名告诉你。提交前跑一次：

```bash
npx @lightwiki/cli check .
```

### 会什么语法

正文是 markdown，在此之上多了几样：双链 `[[页面标题]]`、模板 `{{名字(...)}}`、显式锚点 `## 小节 {#anchor}`、给元素加 class（`![](/assets/x.png){.my-class}`）。代码块带语言名就会高亮。

模板、皮肤、分类、页面级样式与脚本这些都有单独一页，入口在上面的主站地址里。

### 让 AI 帮你写

仓库根的 **`AGENTS.md`** 就是给 AI 助手的说明书（内容约定、frontmatter 字段、可用语法、构建命令）。

GitHub Copilot、Cursor、Codex 这类工具会自动读它，你什么都不用做。如果用的工具不自动读，把 `AGENTS.md` 的内容贴进对话开头即可。

### 想改样式 / 皮肤

| 想改 | 放哪 |
|---|---|
| 站点名、语言、分组 | `wiki.config.ts` |
| 图片与自定义样式 | `assets/`，正文写 `![说明](/assets/图.png)` |
| 版面 | 建 `layouts/<名字>.eta`，该页 frontmatter 写 `layout: 名字` |
| 正文里反复出现的结构 | 建 `macros/<名字>.eta`，正文写 `{{名字(...)}}` |

皮肤是一整页 HTML，模板是产出 markdown 的片段，两者都是**可选**的：不建这些目录就用默认主题；建了也只覆盖你写的那几个，升级工具时不会被冲掉。

写法与能用的数据见主站：皮肤 <https://summerset-zz.github.io/lightwiki/docs/basics/skins/>，模板 <https://summerset-zz.github.io/lightwiki/docs/basics/templates/>。

---

## 3. 构建

```bash
npx @lightwiki/cli build .      # 产物在 ./dist
```

产物长这样：

```
dist/
├── index.html                  一行跳转，进默认语言首页
├── 404.html                    静态托管约定的 404 页（没有 404.md 时用主题的兑底页）
├── docs/index.html             首页（来自 content/zh/index.md）
├── docs/start/index.html       其余每一页，一页一个目录
├── categories/…                页面写了 categories 才有这一层
├── assets/                     样式、脚本、图片
├── meta.json                   构建时间、页数、产物形态
└── search-index.json           站内搜索的索引
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

不想装依赖就一直用 `npx @lightwiki/cli@0.3.0 build .`。

> 版本号建议**写死**（CI 里也一样），构建才是可复现的；升级工具时改这一处就行。
> 别写成 `^0.3.0`：0.x 的 caret 只覆盖 `0.3.x`，下个 minor 就取不到了（这个坑踩过）。
> 想在本地锁定，就 `npm i -D @lightwiki/cli`，版本锁在 `package.json` 里。

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
  run: npx --yes @lightwiki/cli@0.3.0 build .
```

所以本地是 `/`，线上自动变成 `/你的仓库名/`，**仓库改名也不用动配置**。

### 换成自己的域名

1. `wiki.config.ts` 里把 `basePath` 改回 `'/'`，`siteUrl` 改成正式地址
2. 仓库 Settings → Pages → Custom domain 填域名
3. 把 workflow 里 `LIGHTWIKI_BASE_PATH` 那两行删掉

### 部署失败怎么看

Actions 页面看 `Pages` 这个 workflow。构建步骤会直接给出原因。最常见的是忘了第 4 节开头那一步设置（Source 没选成 GitHub Actions）。

---

## 许可

内容由你自己决定；工具与主题是 MIT。
