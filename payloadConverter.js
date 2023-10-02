const fs = require('fs');

const resolverCache = {};
const converterCache = {};
const rendererCache = {};
const resolverGroup = 'resolvers';
const rendererGroup = 'renderers';
const converterGroup = 'converters';
const defaultConverter = (payload) => ({...payload}); //this simply maps the object to itself, effectively relaying the payload to the receiver without changing it.

module.exports = {

  loadComponent(group, name) {
    return require(`./${group}/${name}`) ?? require(name);
  },
  
  getComponent(group, name, cache) {
    if(!name) {
      return null;
    }

    let component;
    if(component = cache[name]) {
      console.log(`component ${group}/${name} found in cache`);
      return component;
    }

    component = this.loadComponent(group, name);
    if(!component) {
      console.error(`no component named ${group}/${name} found`);
      throw new Error(`cannot resolve component ${group}/${name}`);
    }

    cache[name] = component;
    console.log(`cached component ${group}/${name}`, component);

    return component;
  },
  
  getResolver(name) {
    return this.getComponent(resolverGroup, name, resolverCache); 
  },
  
  getConverter(name) {
    return this.getComponent(converterGroup, name, converterCache); 
  },
  
  getRenderer(name) {
    return this.getComponent(rendererGroup, name, rendererCache); 
  },

  convertPayload(url, originalPayload) {
    const payload = {...originalPayload, plain: JSON.stringify(originalPayload, undefined, 2)};
    
    let rendered, template;
    if(template = this.getMessageTemplate(url, originalPayload)) {
      rendered = this.render(template, payload, url);
    }

    return this.convert(url, originalPayload, rendered);
  },

  convert(url, payload, rendered) {
    let convertFunction = this.getConverter(url.converter);
    if(!convertFunction)
      convertFunction = defaultConverter;
    return convertFunction(payload, rendered);
  },

  render(template, payload, url) {
    const renderFunction = this.getRenderer(url.renderer);
    if(renderFunction == null) {
      return null;
    }
    return renderFunction(template, payload);
  },

  getMessageTemplate(url, payload) {
    if(!url.resolver)
      return null;

    const resolver = this.getResolver(url.resolver);
    if(resolver == null)
      return null;

    const path = resolver(payload);
    return this.readTemplateContent(`./templates/${path}`);
  },

  readTemplateContent(path) {
    if(!fs.existsSync(path)) {
      return null;
    }
    return fs.readFileSync(path, 'utf-8');
  }
};