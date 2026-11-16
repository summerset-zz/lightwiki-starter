# 我的知识库

用 [轻维基（lightwiki）](https://github.com/summerset-zz/lightwiki) 构建的静态知识库。

内容用 markdown + frontmatter 写，构建产物是一组**可移植的静态文件** —— 没有服务器依赖、没有 SPA、没有外部 CDN。

## 目录结构

```
wiki.config.ts          站点配置（标题、语言、路径）
content/zh/*.md         内容。文件名就是地址：start.md → /docs/start/
.github/workflows/      push 到 main 自动构建并发布到 GitHub Pages
```

## 本地预览

不用装任何东西：

```bash
npx @lightwiki/cli dev .      # 打开 http://127.0.0.1:5173
```

构建：

```bash
npx @lightwiki/cli build .    # 产物在 ./dist
```

想固定工具版本（推荐，CI 里也这样用）：

```bash
npm i -D @lightwiki/cli
npx wiki dev .
```

## 部署

仓库里已经带了 workflow，**只要在 GitHub 上做一次设置**：

> Settings → Pages → Source 选 **GitHub Actions**

之后每次 push 到 `main` 就会自动构建并部署到 `https://<用户名>.github.io/<仓库名>/`。

`basePath` 不用改 —— workflow 会把仓库名通过 `LIGHTWIKI_BASE_PATH` 注入（项目站点挂在 `/<仓库名>/` 子路径下，写错会导致链接全部 404）。绑自定义域名的话，把 `wiki.config.ts` 里的 `basePath` 改回 `/`。

## 改什么

| 想改 | 改哪 |
|---|---|
| 站点名 | `wiki.config.ts` 的 `title` |
| 站点地址 | `wiki.config.ts` 的 `siteUrl` |
| 加一门语言 | 建 `content/en/`，在 `content` 里加一行 |
| 加页面 | `content/zh/<slug>.md`，文件名就是 URL |
| 图片 | `assets/`，正文写 `![说明](/assets/图.png)` |
| 自定义样式 | `assets/*.less` 或 `assets/*.css` |
| 覆盖主题布局 | `layouts/*.eta` |
| 自定义宏 | `macros/*.eta` |

页面开头的 frontmatter 是最重要的部分：

```yaml
---
title: 页面标题        # 必填，双链 [[标题]] 靠它
description: 一句话摘要
keywords: 关键词, keyword
section: guide         # 侧栏分组，要和 config 里的 sections 对应
order: 1               # 组内排序
updated: 2026-11-16
---
```

完整字段与语法见**语法手册**：https://summerset-zz.github.io/lightwiki/

## 许可

内容由你自己决定；工具与主题是 MIT。
