const Colors = {
    DEFAULT: 0x000000,
    WHITE: 0xffffff,
    AQUA: 0x1abc9c,
    GREEN: 0x57f287,
    BLUE: 0x3498db,
    YELLOW: 0xfee75c,
    PURPLE: 0x9b59b6,
    LUMINOUS_VIVID_PINK: 0xe91e63,
    FUCHSIA: 0xeb459e,
    GOLD: 0xf1c40f,
    ORANGE: 0xe67e22,
    RED: 0xed4245,
    GREY: 0x95a5a6,
    NAVY: 0x34495e,
    DARK_AQUA: 0x11806a,
    DARK_GREEN: 0x1f8b4c,
    DARK_BLUE: 0x206694,
    DARK_PURPLE: 0x71368a,
    DARK_VIVID_PINK: 0xad1457,
    DARK_GOLD: 0xc27c0e,
    DARK_ORANGE: 0xa84300,
    DARK_RED: 0x992d22,
    DARK_GREY: 0x979c9f,
    DARKER_GREY: 0x7f8c8d,
    LIGHT_GREY: 0xbcc0c0,
    DARK_NAVY: 0x2c3e50,
    BLURPLE: 0x5865f2,
    GREYPLE: 0x99aab5,
    DARK_BUT_NOT_BLACK: 0x2c2f33,
    NOT_QUITE_BLACK: 0x23272a,
};

function resolveColor(color) {
    if (typeof color === "string") {
      color = color.toUpperCase();
      if (color === "RANDOM") return Math.floor(Math.random() * (0xffffff + 1));
      if (color === "DEFAULT") return 0;
      color = Colors[color] ?? parseInt(color.replace("#", ""), 16);
    } else if (Array.isArray(color)) {
      color = (color[0] << 16) + (color[1] << 8) + color[2];
    }

    if (color < 0 || color > 0xffffff) throw new RangeError("COLOR_RANGE");
    else if (Number.isNaN(color)) throw new TypeError("COLOR_CONVERT");

    return color;
}

class MessageEmbed {
    constructor(data) {
        this.footer = null;
        this.image = null;
        this.thumbnail = null;
        this.author = null;
        this.fields = [];
        this.video = null;
        this.color = null;
        this.timestamp = null;
        this.timestampString = null;
        this.description = null;
        this.url = null;
        this.title = null;
        if (data)
            this._update(data);
    }
    _update(data) {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j;
        if ("color" in data)
            this.setColor(data.color);
        if ("timestamp" in data)
            this.setTimestamp(data.timestamp);
        if ("title" in data)
            this.setTitle(data.title);
        if ("description" in data)
            this.setDescription(data.description);
        if ("url" in data)
            this.setURL(data.url);
        if ("footer" in data)
            this.setFooter((_a = data.footer) === null || _a === void 0 ? void 0 : _a.text, (_c = (_b = data.footer) === null || _b === void 0 ? void 0 : _b.icon_url) !== null && _c !== void 0 ? _c : null);
        if ("image" in data)
            this.setImage((_d = data.image) === null || _d === void 0 ? void 0 : _d.url);
        if ("thumbnail" in data)
            this.setThumbnail((_e = data.thumbnail) === null || _e === void 0 ? void 0 : _e.url);
        if ("author" in data)
            this.setAuthor((_f = data.author) === null || _f === void 0 ? void 0 : _f.name, (_g = data.author) === null || _g === void 0 ? void 0 : _g.icon_url, (_h = data.author) === null || _h === void 0 ? void 0 : _h.url);
        if ("fields" in data)
            this.addFields((_j = data.fields) !== null && _j !== void 0 ? _j : []);
    }
    setTitle(title) {
        this.title = title !== null && title !== void 0 ? title : null;
        return this;
    }
    setDescription(description) {
        this.description = description !== null && description !== void 0 ? description : null;
        return this;
    }
    setURL(url) {
        this.url = url !== null && url !== void 0 ? url : null;
        return this;
    }
    setTimestamp(timestamp) {
        if (timestamp === null) {
            this.timestamp = null;
            this.timestampString = null;
            return this;
        }
        if (!timestamp) {
            return this.setTimestamp(new Date());
        }
        const parsedTimestamp = timestamp instanceof Date ? timestamp : Number.isInteger(timestamp) || typeof timestamp === "string" ? new Date(timestamp) : null;
        if (!parsedTimestamp || (parsedTimestamp instanceof Date && Number.isNaN(parsedTimestamp.getTime()))) {
            throw new TypeError("Invalid DateResolvable passed into setTimestamp.");
        }
        this.timestamp = parsedTimestamp.getTime();
        this.timestampString = parsedTimestamp.toISOString();
        return this;
    }
    setColor(color) {
        this.color = color ? resolveColor(color) : null;
        return this;
    }
    setFooter(text, iconURL) {
        this.footer = text ? { iconURL: iconURL !== null && iconURL !== void 0 ? iconURL : null, text } : null;
        return this;
    }
    setImage(url) {
        this.image = url ? { url } : null;
        return this;
    }
    setThumbnail(url) {
        this.thumbnail = url ? { url } : null;
        return this;
    }
    setAuthor(name, iconURL, url) {
        this.author = name
            ? {
                iconURL: iconURL !== null && iconURL !== void 0 ? iconURL : null,
                name: name !== null && name !== void 0 ? name : null,
                url: url !== null && url !== void 0 ? url : null,
            }
            : null;
        return this;
    }
    addFields(fields) {
        this.fields.push(...fields.map((field) => {
            var _a;
            return ({
                inline: (_a = field.inline) !== null && _a !== void 0 ? _a : false,
                name: field.name,
                value: field.value,
            });
        }));
        return this;
    }
    addField(name, value, inline) {
        this.addFields([{ inline, name, value }]);
        return this;
    }
    clearFields() {
        this.fields.length = 0;
        return this;
    }
    toJSON() {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o;
        return {
            author: ((_a = this.author) === null || _a === void 0 ? void 0 : _a.name)
                ? {
                    icon_url: (_b = this.author.iconURL) !== null && _b !== void 0 ? _b : undefined,
                    name: this.author.name,
                    url: (_c = this.author.url) !== null && _c !== void 0 ? _c : undefined,
                }
                : undefined,
            color: (_d = this.color) !== null && _d !== void 0 ? _d : undefined,
            description: (_e = this.description) !== null && _e !== void 0 ? _e : undefined,
            fields: (_f = this.fields.map((field) => {
                var _a;
                return ({
                    inline: (_a = field.inline) !== null && _a !== void 0 ? _a : false,
                    name: field.name,
                    value: field.value,
                });
            })) !== null && _f !== void 0 ? _f : undefined,
            footer: this.footer
                ? {
                    icon_url: (_g = this.footer.iconURL) !== null && _g !== void 0 ? _g : undefined,
                    text: (_h = this.footer.text) !== null && _h !== void 0 ? _h : undefined,
                }
                : undefined,
            image: this.image
                ? {
                    url: (_j = this.image.url) !== null && _j !== void 0 ? _j : undefined,
                }
                : undefined,
            thumbnail: this.thumbnail
                ? {
                    url: (_k = this.thumbnail.url) !== null && _k !== void 0 ? _k : undefined,
                }
                : undefined,
            timestamp: (_l = this.timestampString) !== null && _l !== void 0 ? _l : undefined,
            title: (_m = this.title) !== null && _m !== void 0 ? _m : undefined,
            url: (_o = this.url) !== null && _o !== void 0 ? _o : undefined,
        };
    }
}

module.exports = MessageEmbed;