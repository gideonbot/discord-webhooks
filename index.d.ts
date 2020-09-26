import FormData from 'form-data';

export class Webhook {
    constructor(id: string, token: string);
    get(): Promise<WebhookInfo>;
    send(content: string | FormData, options?: SendOptions): Promise<Message>;
}

interface SendOptions {
    content: string;
    username?: string;
    avatar?: string;
    embeds?: Embed[];
    mentions: {};
}

interface Embed {
    title?: string;
    description?: string;
    url?: string;
    timestamp?: string;
    color?: number;
    footer?: {text: string; icon_url?: string; proxy_icon_url?: string;};
    image?: {url?: string; proxy_url?: string; height?: number; width?: number;};
    thumbnail?: {url?: string; proxy_url?: string; height?: number; width?: number;};
    provider?: {name?: string; url?: string};
    author?: {name?: string; url?: string; icon_url?: string; proxy_icon_url?: string;};
    fields?: EmbedField[];
}

interface EmbedField {
    name: string;
    value: string;
    inline?: boolean;
}

interface WebhookInfo {
    type: number;
    id: string;
    name?: string;
    avatar?: string;
    guild_id?: string;
    channel_id: string;
    guild_id: string;
    application_id: null;
    token?: string;
}

interface Message {
    id: string;
    channel_id: string;
    guild_id?: string;
    author: User;
    member?: GuildMember;
    content: string;
    timestamp: string;
    edited_timestamp?: string;
    tts: boolean;
    mention_everyone: boolean;
    mentions: User[];
    mention_roles: [];
    mention_channels: [];
    attachments: [];
    embeds: Embed[];
    pinned: boolean;
    webhook_id?: string;
    type: number;
    flags?: number;
}

interface GuildMember {
    user?: User;
    nick?: string;
    rolees: [];
    joined_at: string;
    premium_since?: string;
    deaf: boolean;
    mute: boolean;
}

interface User {
    id: string;
    username: string;
    discriminator: string;
    avatar?: string;
    bot?: boolean;
}