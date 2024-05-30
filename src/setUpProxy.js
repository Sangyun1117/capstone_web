import { useSelector } from 'react-redux';
const { createProxyMiddleware } = require('http-proxy-middleware');
const serverPath = useSelector((state) => state.serverPath);

module.exports = function (app) {
  app.use(
    '/boardScreen', //proxy가 필요한 path prameter
    createProxyMiddleware({
      target: serverPath, //타겟이 되는 api url
      changeOrigin: true, //대상 서버 구성에 따라 호스트 헤더가 변경되도록 설정
    })
  );
};
