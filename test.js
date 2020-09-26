const Webhook = require('./index');
let webhook = new Webhook('no', 'no too');

(async () => {
    webhook.send({embeds: [{title: 'ass'}]});
    webhook.send(null, {embeds: [{title: 'ass'}]});
})();