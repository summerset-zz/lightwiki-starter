/**
 * 站点配置。字段含义见
 * https://github.com/summerset-zz/lightwiki/blob/main/docs/getting-started.md
 *
 * `basePath` 是站点所在的子路径：
 * - 本地预览、或者绑了自定义域名 → `/`
 * - 部署到 GitHub Pages 的项目站点 → `/<仓库名>/`
 *   （CI 会通过 LIGHTWIKI_BASE_PATH 注入，见 .github/workflows/pages.yml）
 *
 * 这里读 `globalThis.process.env` 而不是直接写 `process`，是为了不依赖
 * @types/node —— 内容仓库默认不装任何 npm 包。
 */
const env =
  (globalThis as { process?: { env?: Record<string, string | undefined> } }).process?.env ?? {};

export default {
  /** 站点名：出现在浏览器标题与侧栏顶部 */
  title: '我的知识库',
  /** 站点完整地址：用于拼绝对链接（canonical 等） */
  siteUrl: 'https://example.com',
  /** 站点所在的子路径；本地是 `/`，GitHub Pages 项目站点是 `/<仓库名>/` */
  basePath: env.LIGHTWIKI_BASE_PATH ?? '/',
  /** 默认语言的地址不带语言前缀 */
  defaultLanguage: 'zh',
  /** 语言 → 内容目录。加一门语言就在这里加一行 */
  content: {
    zh: 'content/zh',
  },
  /** 分组顺序，就是侧栏的顺序 */
  sections: ['guide'],
  /** 分组的显示名 */
  sectionLabels: {
    guide: '指南',
  },
};
