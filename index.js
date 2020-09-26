const fetch = require('make-fetch-happen');
const form_data = require('form-data');
const url = require('url');

const api_url = 'https://discord.com/api/v6';

class Webhook {
    /**
     * @param {string} id 
     * @param {string} token 
     */
    constructor(id, token) {
        if (!id || !token || typeof(id) != 'string' || typeof(token) != 'string' || isNaN(id)) {
            throw new Error('Invalid channel_id or token');
        }

        this.id = id;
        this.token = token;

        this.ratelimit_reset = new Date();
        this.ratelimit_remaining = 5;
        this.ratelimit_limit = 5;
    }

    /**
     * 
     * @param {string | form_data[]} content 
     * @param {{content: string, username?: string, avatar?: string, embeds?: [], mentions: {}}} options 
     */
    async send(content, options = {}) {
        if (content == undefined && options == undefined) throw new Error('Invalid args');

        if (Util.IsObject(content)) {
            options = content;
            content = null;
        }

        if (content && typeof(content) != 'string' && !(content instanceof form_data)) throw new Error('Invalid content');

        if (!options) options = {};

        if (!Util.IsObject(options)) throw new Error('Invalid options');

        if (options.avatar && (typeof(options.avatar) != 'string' || !Util.IsValidURL(options.avatar))) {
            throw new Error('Invalid avatar url');
        }

        if (options.embeds && !Array.isArray(options.embeds)) {
            throw new Error('options.embeds needs to be an array');
        }

        let body = !(content instanceof form_data) ? JSON.stringify({
            content,
            username: options.username ? String(options.username) : undefined,
            avatar_url: options.avatar,
            tts: 'tts' in options ? Boolean(options.tts) : undefined,
            embeds: options.embeds,
            allowed_mentions: options.mentions
        }) : content;

        let content_type = !(content instanceof form_data) ? 'application/json' : 'multipart/form-data';

        let headers = {
            'Content-Type': content_type,
            'X-RateLimit-Precision': 'millisecond'
        };

        if (this.ratelimit_remaining == 0) {
            if (this.ratelimit_reset < new Date()) this.ratelimit_remaining = this.ratelimit_limit;
            else await Util.Sleep(this.ratelimit_reset - new Date());
        }

        return new Promise((resolve, reject) => {
            Util.request(`${api_url}/webhooks/${this.id}/${this.token}?wait=true`, 'POST', body, headers).then(response => {
                if (!response.Valid) return reject(response.Status);

                this.ratelimit_reset = new Date(Number(response.headers['x-ratelimit-reset']) * 1000);
                this.ratelimit_remaining = Number(response.headers['x-ratelimit-remaining']);
                this.ratelimit_limit = Number(response.headers['x-ratelimit-limit']);

                resolve(response.json);
            });
        });
    }

    get() {
        return Util.request(`${api_url}/webhooks/${this.id}/${this.token}`).then(x => x.json);
    }
}

class Util {
    /**
     * @param {string} url 
     * @param {string} method 
     * @param {string?} body
     * @param {Record<string, string>?} headers 
     * @returns {Promise<Response>}
     */
    static request(url, method, body, headers) {
        return new Promise((resolve, reject) => {
            if (!url || typeof(url) != 'string') return reject('Bad URL');

            if (!method) method = 'GET';

            if (typeof(method) != 'string') return reject('Invalid Method');
            
            method = method.toUpperCase();

            if (!url.startsWith('http://') && !url.startsWith('https://')) return reject('Invalid URL');
            if (!(method == 'POST' || method == 'GET' || method == 'PUT' || method == 'PATCH' || method == 'DELETE')) return reject('Invalid method');

            let data = {};
            data.headers = {'User-Agent': 'discord-webhooks (https://github.com/gideonbot/request-controller, 1.0.0)'};
            data.method = method;
            
            if (body) data.body = body;
            if (headers) data.headers = headers;

            //We set the content type if it's not present already
            if (method != 'GET' && body && !('Content-Type' in data.headers)) {
                if (typeof(body) == 'string' && this.IsValidJSON(body)) {
                    data.headers['Content-Type'] = 'application/json';
                }

                else return reject('Invalid body type');
            }

            let timer = setTimeout(() => reject('Timed Out'), 60e3);

            fetch(url, data).then(async response => {
                clearTimeout(timer);
                try {
                    let body = await response.text();
                    return resolve(new Response(response, body));
                }
                catch (ex) { return reject(ex); }
            }, failed => reject(failed));
        });
    }

    static Sleep(ms) {
        if (ms == undefined || ms == null || typeof(ms) != 'number') ms = 0;
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    static IsValidJSON(str) {
        if (!str) return false;

        try { JSON.parse(str); }
        catch (_) { return false; }

        return true;
    }

    static IsObject(o) {
        if (Array.isArray(o)) return false;
        return o === Object(o);
    }

    static IsValidURL(str) {
        if (!str) return false;

        try {return !!url.parse(str);}
        catch (ex) { return false; }
    }
}

class Response {
    /**
     * @param {*} response 
     * @param {string} body 
     */
    constructor(response, body) {
        if (!response) throw new Error('Missing Response');

        this.response = response;
        this.body = body;
        this.headers = {};

        if (response.headers) {
            for (let entry of response.headers.entries()) {
                this.headers[entry[0]] = entry[1];
            }
        }
    }

    get Valid() {
        return !this.error && (this.response.status < 400);
    }

    get StatusCode() {
        return this.response.status;
    }

    get StatusText() {
        return this.response.statusText;
    }

    get Status() {
        return this.StatusText + ' (' + this.StatusCode + ')';
    }

    get json() {
        if (!this.body) return null;

        try { return JSON.parse(this.body); }
        catch (ex) { return null; }
    }
}

module.exports = Webhook;