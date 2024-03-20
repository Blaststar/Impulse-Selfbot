const request = require("request");
const { v4: uuidv4 } = require('uuid');

function stag() {
    var result = [];
    var characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz123456789";
    var charactersLength = characters.length;
    for ( var i = 0; i < 32; i++ ) {
      result.push(characters.charAt(Math.floor(Math.random()*charactersLength)));
    }
    return result.join("");
}

function createMessage (content, embed) {
  var message = {"messageId":uuidv4(),"content":{"object":"value","document":{"object":"document","data":{},"nodes":[{"object":"block","type":"paragraph","data":{},"nodes":[{"object":"text","leaves":[{"object":"leaf","text":content,"marks":[]}]}]}]}},"repliesToIds":[],"confirmed":false,"isSilent":false,"isPrivate":false}
  if (embed) message = {"messageId":uuidv4(),"content":{"object":"value","document":{"object":"document","data":{},"nodes":[{"object":"block","type":"webhookMessage","data":{"embeds":[embed]},"nodes":[{"object":"text","leaves":[{"object":"leaf","text":"","marks":[]}]}]}]}},"repliesToIds":[],"confirmed":false,"isSilent":false,"isPrivate":false}
  return message;
}
  
class Message {
    constructor(channelId, messageId, config) {
        this.config = config;
        this.channelId = channelId;
        this.messageId = messageId;
    }

    send(message, embed) {
        return new Promise((resolve, reject) => {
            request.post({
                url: `https://www.guilded.gg/api/channels/${this.channelId}/messages`,
                headers: {
                "accept": "application/json",
                "accept-language": "en-US,en;q=0.9",
                "content-type": "application/json",
                "cookie": `hmac_signed_session=${this.config.client.cookie};`,
                "guilded-client-id": this.config.client.clientId, 
                "guilded-stag": stag(),
                "guilded-viewer-platform": "desktop",
                "origin": "https://www.guilded.gg",
                "referer": "https://www.guilded.gg/",
                "sec-ch-ua": "\"Chromium\";v=\"122\", \"Not(A:Brand\";v=\"24\", \"Google Chrome\";v=\"122\"",
                "sec-ch-ua-mobile": "?0",
                "sec-ch-ua-platform": "\"Windows\"",
                "sec-fetch-dest": "empty",
                "sec-fetch-mode": "cors",
                "sec-fetch-site": "same-origin",
                "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36",
                "x-requested-with": "XMLHttpRequest"
                },
                body: JSON.stringify(createMessage(message, embed))
              }, function(err, res, body) {
                if (err) reject(err.message);
                if (!res) reject("Missing response");
                if (res.statusCode != 200) reject(body);
                return resolve(JSON.parse(body).message);
              });
        });
    }

    edit(message) {
        return new Promise((resolve, reject) => {
            request.put({
                url: `https://www.guilded.gg/api/channels/${this.channelId}/messages/${this.messageId}`,
                headers: {
                "accept": "application/json",
                "accept-language": "en-US,en;q=0.9",
                "content-type": "application/json",
                "cookie": `hmac_signed_session=${this.config.client.cookie};`,
                "guilded-client-id": this.config.client.clientId, 
                "guilded-viewer-platform": "desktop",
                "origin": "https://www.guilded.gg",
                "referer": "https://www.guilded.gg/",
                "sec-ch-ua": "\"Chromium\";v=\"122\", \"Not(A:Brand\";v=\"24\", \"Google Chrome\";v=\"122\"",
                "sec-ch-ua-mobile": "?0",
                "sec-ch-ua-platform": "\"Windows\"",
                "sec-fetch-dest": "empty",
                "sec-fetch-mode": "cors",
                "sec-fetch-site": "same-origin",
                "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36",
                "x-requested-with": "XMLHttpRequest"
                },
                body: JSON.stringify({"content":{"object":"value","document":{"object":"document","data":{},"nodes":[{"object":"block","type":"paragraph","data":{},"nodes":[{"object":"text","leaves":[{"object":"leaf","text":message,"marks":[]}]}]}]}}})
              }, function(err, res, body) {
                if (err) reject(err.message);
                if (!res) reject("Missing response");
                if (res.statusCode != 200) reject(body);
                return resolve(body);
              });
        });
    }

    delete(delay) {
        return new Promise((resolve, reject) => {
          if (!delay || isNaN(delay)) delay = 0;
          setTimeout(() => {
            request.delete({
                url: `https://www.guilded.gg/api/channels/${this.channelId}/messages/${this.messageId}`,
                headers: {
                "accept": "application/json",
                "accept-language": "en-US,en;q=0.9",
                "cookie": `hmac_signed_session=${this.config.client.cookie};`,
                "guilded-client-id": this.config.client.clientId, 
                "guilded-viewer-platform": "desktop",
                "origin": "https://www.guilded.gg",
                "referer": "https://www.guilded.gg/",
                "sec-ch-ua": "\"Chromium\";v=\"122\", \"Not(A:Brand\";v=\"24\", \"Google Chrome\";v=\"122\"",
                "sec-ch-ua-mobile": "?0",
                "sec-ch-ua-platform": "\"Windows\"",
                "sec-fetch-dest": "empty",
                "sec-fetch-mode": "cors",
                "sec-fetch-site": "same-origin",
                "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36",
                "x-requested-with": "XMLHttpRequest"
                }
              }, function(err, res, body) {
                if (err) reject(err.message);
                if (!res) reject("Missing response");
                if (res.statusCode != 200) reject(body);
                return resolve(200);
              });
            }, delay);
        });
    }

    getMessages(amount) {
      return new Promise((resolve, reject) => {
          request.get({
              url: `https://www.guilded.gg/api/channels/${this.channelId}/messages?limit=${amount}&maxReactionUsers=8`,
              headers: {
              "accept": "application/json",
              "accept-language": "en-US,en;q=0.9",
              "content-type": "application/json",
              "cookie": `hmac_signed_session=${this.config.client.cookie};`,
              "guilded-client-id": this.config.client.clientId, 
              "guilded-stag": stag(),
              "guilded-viewer-platform": "desktop",
              "origin": "https://www.guilded.gg",
              "referer": "https://www.guilded.gg/",
              "sec-ch-ua": "\"Chromium\";v=\"122\", \"Not(A:Brand\";v=\"24\", \"Google Chrome\";v=\"122\"",
              "sec-ch-ua-mobile": "?0",
              "sec-ch-ua-platform": "\"Windows\"",
              "sec-fetch-dest": "empty",
              "sec-fetch-mode": "cors",
              "sec-fetch-site": "same-origin",
              "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36",
              "x-requested-with": "XMLHttpRequest"
              }
            }, function(err, res, body) {
              if (err) reject(err.message);
              if (!res) reject("Missing response");
              if (res.statusCode != 200) reject(body);
              return resolve(JSON.parse(body).messages);
            });
      });
  }

}

module.exports = Message;