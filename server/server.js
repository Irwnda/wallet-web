/* eslint-disable no-console */
const jsonServer = require('json-server');

const server = jsonServer.create();

const router = jsonServer.router('wallet.json');

const middlewares = jsonServer.defaults();

server.use(middlewares);

server.use(router);

router.render = (req, res) => {
  const { method } = req;
  if (Array.isArray(res.locals.data)) {
    const { _parsedUrl: parsedUrl } = req;
    const url = parsedUrl.pathname.slice(1);
    res.jsonp({
      [url]: res.locals.data
    });
  } else {
    res.jsonp(res.locals.data);
  }
  if (method === 'POST') {
    res.status(200).send(req.body);
  }
};

server.listen(3000, () => {
  console.log('JSON Server is running');
});
