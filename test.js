const Webhook = require('./index');

let webhook = new Webhook('no', 'no too');

(async () => {
    await webhook.send('text 1', {embeds: [{title: 'this is title'}]});
    await webhook.send('text 2', {embeds: [{title: 'this is title'}]});
    await webhook.send('text 3', {embeds: [{title: 'this is title'}]});
    await webhook.send('text 4', {embeds: [{title: 'this is title'}]});
    await webhook.send('text 5', {embeds: [{title: 'this is title'}]});
    await webhook.send('text 6', {embeds: [{title: 'this is title'}]});
})();