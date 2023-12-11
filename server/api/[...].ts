import type {RequestHandler} from 'http-proxy-middleware';
import {createProxyMiddleware} from 'http-proxy-middleware';
import {defineEventHandler} from 'h3';

let proxyServer: RequestHandler;

export default defineEventHandler(async ({node: {req, res}}) => {
    if (!proxyServer) {
        proxyServer = createProxyMiddleware('/api/ok', {
            target: 'http://localhost:3000/ok',
            changeOrigin: true,
            pathRewrite: {
                '^/api/ok': '/',
            },
        });
    }

    try {
        //@ts-expect-error
        await new Promise<void>((resolve, reject) => proxyServer(req, res, (err) => {
            if (err) {
                reject(err);
            } else {
                resolve();
            }
        }));
    } catch (err) {
        console.error(err);
    }
});
