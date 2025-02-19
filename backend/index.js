const Koa = require('koa');
const path = require('path');
const fs = require('fs');  // 导入 fs 模块用于文件系统操作
const serve = require('koa-static');
const cors = require('koa-cors');
const Router = require('koa-router');  // 导入 koa-router 用于定义路由
const app = new Koa();
const router = new Router();

// 跨域
app.use(cors());

// 设置静态文件路径
const staticPath = path.join(__dirname, 'articles');

// 提供 articles 文件夹中的文件作为静态文件
app.use(serve(staticPath));

// 接口：返回 articles 文件夹中的所有 .md 文件名
router.get('/articles', (ctx) => {
  const dirPath = path.join(__dirname, 'articles');
  const files = fs.readdirSync(dirPath);

  // 筛选出 .md 文件
  const mdFiles = files.filter(file => file.endsWith('.md'));
  ctx.body = mdFiles;  // 返回 .md 文件列表
});

// 启动服务器并监听
app.use(router.routes()).use(router.allowedMethods());
app.listen(3000, () => {
  console.log('Server running on http://localhost:3000');
});
