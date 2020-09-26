# discord-webhooks
A npm module for creating discord webhooks


## Installation
`npm i gideonbot/discord-webhooks` (requires git)

## Usage
```js
const Webhook = require('discord-webhooks');
let webhook = new Webhook('your webhook id', 'your webhook token');

webhook.send('this is a test');
webhook.send(null, {embeds: [{title: 'embed title'}]}).then(sent => console.log(sent.id));
webhook.get().then(data => console.log(data)); //gives you info about the webhook
```

## API

### .send(content, options)
desc here

### .get()
Obtains info about the webhook


## Feature list
- Follows rate limits

## Bug/Todo list
none (afaik)
