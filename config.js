const fs = require('fs');
const payloadConverter = require('./payloadConverter');

const path = process.env.CONFIG_PATH ?? './config.json';

let data = {
  urls: [],
  port: 3000
};

if(path && fs.existsSync(path)){
  const content = JSON.parse(fs.readFileSync(path));
  data = {...data, ...content};
}

if(process.env.WEBHOOK_URLS) {
  data.urls = [...data.urls, process.env.WEBHOOK_URLS
    .split(',')
    .map((url, i) => ({
      url,
      resolver: process.env[`URL_${i}_RESOLVER`],
      converter: process.env[`URL_${i}_CONVERTER`],
      resolver: process.env[`URL_${i}_RENDERER`]
    })
  )];
}

data.urls.forEach(url => {
  try {
    payloadConverter.getConverter(url.converter);
    payloadConverter.getResolver(url.resolver);
    payloadConverter.getRenderer(url.renderer);
  } catch(e) {
    throw new Error(e);
  }
})

if(process.env.PORT) {
  data.port = process.env.PORT;
}

module.exports = data;