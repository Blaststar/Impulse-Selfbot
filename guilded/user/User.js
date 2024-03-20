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
  
class User {
    constructor(config) {
        this.config = config;
    }

    getProfile(userId) {
        return new Promise((resolve, reject) => {
            request.get({
                url: `https://www.guilded.gg/api/users/${userId.trim()}/profilev3`,
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
                }
              }, function(err, res, body) {
                if (err) reject(err.message);
                if (!res) reject("Missing response");
                if (res.statusCode != 200) reject(body);
                return resolve(JSON.parse(body));
              });
        });
    }

    
    login() {
        return new Promise((resolve, reject) => {      
            request.get({
                url: "https://www.guilded.gg/api/me?isLogin=false&v2=true",
                headers: {
                  "accept": "application/json",
                  "accept-language": "en-US,en;q=0.9",
                  "cookie": `hmac_signed_session=${this.config.client.cookie};`,
                  "sec-ch-ua": "\"Chromium\";v=\"122\", \"Not(A:Brand\";v=\"24\", \"Google Chrome\";v=\"122\"",
                  "sec-ch-ua-mobile": "?0",
                  "sec-ch-ua-platform": "\"Windows\"",
                  "sec-fetch-dest": "document",
                  "sec-fetch-mode": "navigate",
                  "sec-fetch-site": "none",
                  "sec-fetch-user": "?1",
                  "upgrade-insecure-requests": "1",
                  "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36"
                }
            }, function(err, res, body) {
              if (err) reject(err.message);
              if (!res) reject("Missing response");
              if (res.statusCode != 200 || !JSON.stringify(body).includes("user")) reject(body);
              return resolve(JSON.parse(body));
            });
            
        });
    }
}

module.exports = User;
