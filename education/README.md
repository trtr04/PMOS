# PMOS 健康科普模块

这是可独立预览的科普模块，包含 6 篇中文文章、分类筛选、文章详情、来源链接和医疗免责声明。

## 本地查看

直接打开 `index.html`，或在仓库根目录启动静态服务器后访问 `/education/`。

## React 主工程交接

- 文章数据目前位于 `app.js` 的 `articles` 数组中。
- 迁移到 React 时，建议将文章数据转换为 `educationArticles.ts`。
- 列表路由建议使用 `/education`，详情路由建议使用 `/education/:articleId`。
- `AUTHOR` 当前仍为“待团队确认”，合并前请替换为最终署名。
