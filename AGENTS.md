# AGENTS.md

给 AI 编码助手（GitHub Copilot / Cursor / Codex 等）的说明。这个仓库是**内容仓库**，不是工具仓库。

## 这是什么

[轻维基（lightwiki）](https://github.com/summerset-zz/lightwiki) 把 markdown + frontmatter 编译成一组静态文件。
这里只放内容和少量配置，工具从 npm 现取，不需要安装。

## 依赖

- **Node.js 20 或更高**。先跑 `node -v` 确认。
- **`npx` 不用单独装**：它是 npm 的子命令（`npm exec` 的别名），装 Node.js 时一起就有。不确定就跑 `npx --version`，有版本号就行。
- **不要 `npm install`**。这个仓库没有 `package.json`，工具每条命令现取一次，之后走缓存。

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

每个 `.md` 开头必须有一段 YAML。常用字段：

| 字段 | 必填 | 说明 |
|---|---|---|
| `title` | **是** | 非空。进页面标题、侧栏、搜索与双链解析。同一语言内不能重复 |
| `description` | 否 | 一句话摘要，进 `<meta name="description">` |
| `keywords` | 否 | 逗号分隔或数组，进 meta 与搜索索引 |
| `section` | 否 | 侧栏分组。取值必须在 `wiki.config.ts` 的 `sections` 里，否则 `check` 报错 |
| `order` | 否 | 组内排序，小的在前 |
| `updated` | 否 | 只接受 `YYYY-MM-DD`。写成 `2026/11/16` 这一页会被跳过 |
| `draft` | 否 | `true` 时不收录 |
| `layout` | 否 | 换这一页的皮肤，写 `layouts/` 下的文件名（不带 `.eta`） |
| `styles` | 否 | 只给这一页挂 CSS，路径相对 `assets/`。写 `.css` 就认同名 `.less` |
| `scripts` | 否 | 只给这一页挂 JS，可写成 `[{ src: x.js, module: true }]` 或纯字符串混用 |
| `categories` | 否 | 分类 slug，字符串、逗号分隔或数组。构建时为每个分类生成一页 |
| `sidebarCategory` | 否 | 用某个分类的页面列表当这一页的侧栏 |
| `hintTitle` / `hint` | 否 | 整页一个术语提示。**目前只写进页面里的 JSON，没有主题去读它** |
| `source*` / `license*` | 否 | 整篇改编外部内容时标注出处 |

- 未知字段会被放行（不报错），但不要凭空发明字段。
- `styles` / `scripts` 可以写站外地址（`https://…`），会原样进产物。

## 正文语法

标准 markdown 之外，还有：

| 写法 | 作用 |
|---|---|
| `[[页面标题]]` / `[[slug]]` / `[[目标\|显示文字]]` | 双链，构建时转成真实链接 |
| `{{catalog}}` | 主题自带：所有分类的列表，带当前语言的篇数 |
| `{{pages(section: guide)}}` | 主题自带：某分组下的页面列表（也支持 `category: xxx`） |
| `{{name(...)}}` | 自定义模板，定义在 `macros/*.eta`。见下面的模板一节 |
| `## 小节 {#anchor}` | 显式锚点，会进页内目录 |
| `![图](/assets/x.png){.my-class}` | 给元素加属性/class（class 只是加上，样式要自己写） |
| `<!-- source: 域名 \| 标题 \| 修订号 \| 许可证 \| 许可证地址 \| 改动说明 -->` | 只借用某几节时标注出处，六段用 `\|` 分隔，顺序固定 |
| `<!-- hint: 标题 \| 内容 -->` | 单个术语提示，同上，没有主题消费它 |

写表格、代码块、脚注、任务列表都按 CommonMark 来。代码围栏要带语言名才会高亮，内置 `js` `ts` `html` `css` `json` `bash` `yaml` `md` `diff` 等，`eta` 也有专门的着色。

## 模板

主题**只自带两个**：`catalog` 与 `pages`。其余名字都得自己写，放在 `macros/`，一个 `.eta` 文件一个模板，文件名去掉 `.eta` 就是模板名。

`macros/term.eta`：

```eta
<%
  const word = it.args[0] ?? '';
  const gloss = it.named.gloss ?? '';
%>
**<%~ word %>**（<%~ gloss %>）
```

正文里这样调：

```md
{{term(字距, gloss: 一组字符之间的统一间距)}}
```

- 多个参数用**逗号**分隔；命名参数写成 `键: 值`，不是 `key="value"`
- 命名参数的**键只能是 ASCII 标识符**（字母或下划线开头）。写中文键会被当成位置参数，静默不生效
- `<%~ 值 %>` 原样输出，`<%= 值 %>` 会转义 HTML。要输出标记或内容里带 `&` `<`，必须用前者
- 模板产出的是 **markdown**，会再解析一遍，所以 `**粗体**`、`[[双链]]`、嵌套模板都能用；代价是要像写正文那样小心 `*` `_` `[`
- `it` 里有：`args`（位置参数）、`named`（命名参数）、`page`（当前页）、`site`（全站）、`lang`、`addCategory(名字)`、`macro(名字, ...参数)`
- 整行只有一个模板调用时按块级解析（可以产出列表、表格）；夹在段落里只当一行文字

## 皮肤

不写 `layout` 就用主题的 `doc`。要改整页结构就建 `layouts/<名字>.eta`，那是一份完整的 HTML：

```eta
<!doctype html>
<html lang="<%= it.page.lang %>">
<head>
  <meta charset="utf-8">
  <title><%= it.page.title %></title>
  <link rel="stylesheet" href="<%= it.site.base %>/assets/style.css">
</head>
<body>
<%~ it.page.html %>
</body>
</html>
```

三条最容易踩：

- 正文用 `<%~ it.page.html %>`。写成 `<%=` 会把整篇 HTML 转义成源码显示出来
- 资源路径要自己拼 `it.site.base`。皮肤里不自动加前缀，正文里的 `/assets/x.png` 才会
- 皮肤里能拿到 `it.page`、`it.site`、`it.nav`、`it.sidebar`、`it.index`、`it.partials`

主题自带四个：`doc`（内容页，首页也用它）、`category`（分类页）、`not-found`（404 兜底）、`redirect`（跳转页）。

只覆盖要改的那几个文件，其余继续跟主题走，升级工具时不会被冲掉。放一个 `layouts/nav.eta` 会被自动插到每页 `<body>` 开头，不需要覆盖 `doc`。

## 校验与构建

```bash
npx @lightwiki/cli dev .            # 本地预览，默认 http://127.0.0.1:5173，Ctrl+C 停
npx @lightwiki/cli check .          # 只校验，不写盘（红链、孤页、frontmatter、缺译）
npx @lightwiki/cli build .          # 产物在 ./dist
npx @lightwiki/cli check . --strict # 红链与孤页也算失败
```

改完内容至少跑一次 `check`。它点名的问题 `build` 不会拦，但线上就是死链。

## 文档

完整语法与配置字段：<https://summerset-zz.github.io/lightwiki/>

| 内容 | 地址 |
|---|---|
| frontmatter 全部字段 | <https://summerset-zz.github.io/lightwiki/docs/basics/frontmatter/> |
| 正文语法（双链、锚点、HTML、class） | <https://summerset-zz.github.io/lightwiki/docs/basics/markdown/> |
| 模板 | <https://summerset-zz.github.io/lightwiki/docs/basics/templates/> |
| 皮肤 | <https://summerset-zz.github.io/lightwiki/docs/basics/skins/> |
| 样式与 Less | <https://summerset-zz.github.io/lightwiki/docs/basics/styles/> |
| JavaScript | <https://summerset-zz.github.io/lightwiki/docs/basics/javascript/> |
| 静态资源 | <https://summerset-zz.github.io/lightwiki/docs/basics/assets/> |
| 分类 | <https://summerset-zz.github.io/lightwiki/docs/basics/categories/> |
| 代码高亮 | <https://summerset-zz.github.io/lightwiki/docs/basics/code-highlight/> |
| 站点配置 | <https://summerset-zz.github.io/lightwiki/docs/advanced/config/> |
| 命令行 | <https://summerset-zz.github.io/lightwiki/docs/advanced/cli/> |
| 发布到 GitHub Pages | <https://summerset-zz.github.io/lightwiki/docs/advanced/deploy-pages/> |
| 引用外部库 | <https://summerset-zz.github.io/lightwiki/docs/advanced/external-libs/> |

不确定某个模板、某个 frontmatter 字段怎么用时，先查上面这些页，不要猜。
