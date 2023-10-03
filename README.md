# webhook-relay

Have you ever felt the need to relay a single webhook event to multiple endpoints, transforming the payload according to each endpoint's supported formats? Worry no more! Webhook-Relay is there to help!

## What can it do?

Webhook-Relay is a Webhook Proxy/Manager (i might need to find a better term for it...) which can transform payloads received from the webhook origin using an extensible conversion mechanism. 
Since Webhooks are often used to send messages to various Messenger apps (like MS Teams, Slack etc.) and not all webhook providers support all these apps, this simple server also allows you to write message templates using your favorite templating engine. It supports mustache templates by default, but any templating engine should be fine as long as you provide a render-function in order to generate a text using the specified templating engine.

## How to run the server?

Simply start the process by running `node index.js`. By default, it will run on port 3000. You can change the port by either configuring the `port` config value in the `config.json`, or by setting an environment variable called `PORT`. Env variables override config values.
You can take a look at `config.sample.json` to find out how to configure the various relay endpoints and conversion mechanisms.

By default, this relay supports conversion of Harbor webhook events to MS Teams incoming webhook payloads (more to come!). It uses mustache templating by default. Currently, it will simply send the JSON payload received from Harbor as a teams message.

## Extending

There are three important mechanisms for converting and relaying messages:

### Converters

Converters convert the JSON payload received from the webhook event origin to a JSON format the destination can understand. It simply maps the keys from the original request to a new JSON object. In order to add another converter, simply export the conversion function in a module under the `converters` folder, or install a converter through `npm`.

### Resolvers

Resolvers generate a path based on the payload received from the origin. The path points to a template to use for generating the text rendered by the the rendering engine. In order to add another resolver, export the resolver function in a module under the `resolvers` folder, or install a resolver through `npm`.

### Renderers

Renderers generate a text based on the payload received from the origin and a template file resolved by a `resolver`. In most cases, it simply calls a templating engine's `render()` function with the template's content and the webhook origin payload
*Important Note:* Because sometimes, you will want to send the original payload as a text, renderers receive the original payload, as well as a `JSON.stringify()`ed version of the payload contained in the `plain` key of the payload the renderer receives. In order to add another renderer, export the render function in a module under the `renderers` folder, or install a renderer through `npm`.

## Final words

Simply create an issue or discussion if you feel there is room for improvement! I recently started this issue because i needed an easy way to convert a harbor webhook event to MS Teams Incoming Webhooks, but i feel this tool can be used in various scenarios! :)
