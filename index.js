const express = require('express');
const app = express();
const axios = require('axios');
const parser = require('body-parser');
const payloadBuilder = require('./payloadConverter');
const config = require('./config');

app.use(parser.json());

app.post('/', async (req, res) => {
  console.log("received webhook event", req.body);
  
  const promises = [];
  config.urls.forEach(url => {
    const payload = payloadBuilder.convertPayload(url, req.body);
    console.log("POST", payload);
    promises.push(axios.post(url.url, payload));
  })

  await Promise.all(promises).then(_ => {
    res.status(200).send();
  }).catch(e => {
    console.warn('got error response for webhook', e.request.res.responseUrl, e.response)
    res.status(e?.response?.status ?? 500).send(e?.response?.data);
  });
});

const server = app.listen(config.port, () => {
  console.log(`started webhook listener on port ${config.port}`);
});

function shutdown() {
  server.close(() => {
    console.log('HTTP server shut down.');
  });
};

process.on('SIGBREAK', shutdown);
process.on('SIGTERM', shutdown);