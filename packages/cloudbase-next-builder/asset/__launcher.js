require = require('esm')(module);
const path = require('path');
const Koa = require('koa');
const next = require('next');
const serverless = require('serverless-http');

async function main(...args) {
  let event = args[0];
  // 针对部署在子路径的情况需要手动带上路径前缀
  event.path = path.join('/*path*/', event.path);

  const dev = false;
  const app = next({ dev });
  const handle = app.getRequestHandler();
  const server = new Koa();
  await app.prepare();

  server.use((ctx) => {
    ctx.status = 200;
    ctx.respond = false;
    try {
      if(ctx.path === '/*path*//') {
        app.render(ctx.req, ctx.res, '/index', ctx.query);
      } else {
        handle(ctx.req, ctx.res);
      }
    } catch (e) {
      console.log(e);
    }
  });

  return serverless(server, {
    binary: [
      'application/javascript',
      'application/json',
      'application/octet-stream',
      'application/xml',
      'font/eot',
      'font/opentype',
      'font/otf',
      'image/jpeg',
      'image/png',
      'image/svg+xml',
      'text/comma-separated-values',
      'text/css',
      'text/javascript',
      'text/plain',
      'text/text',
      'text/xml',
    ],
  })(...args);

}

exports.main = main;
