const WebSocket = require("ws");
const { v4: uuidv4 } = require('uuid');
const EventEmitter = require("events").EventEmitter;
const User = require("./user/User");


function formatJsonMessage(raw) {
  let data = Buffer.from(raw).toString();
  let split = data.split("");
  if (!isNaN(split[0])) data = data.replace(split[0], "");
  if (!isNaN(split[1])) data = data.replace(split[1], "");
  return data;
}

function isJsonString(str) {
  try {
      JSON.parse(str);
  } catch (e) {
      return false;
  }
  return true;
}

function searchMentions(parsed) {  
  let result = null;
  parsed.message.content.document.nodes[0].nodes.forEach(object => {
    if (object.type === "mention") return result = {id: object.data.mention.id, name: object.data.mention.name};
  });
  return result;
}

class Client extends EventEmitter {
    constructor(config) {
      super();
      this.config = config;
      this.cookie = config.client.cookie;
      this.ws = null;
      this.closed = false;
    }

    sendMessage(message) {
      if (this.closed) return;
      this.ws.send(message);
    }

    handleMessage(message) {
      let parsed = null;
      let str = null;
      if (isJsonString(message)) {
        parsed = JSON.parse(message);
        str = JSON.stringify(parsed);
      }
      if (str != null && str.includes("sid")) return parsed.sid;
      if (str != null && str.includes("[") && str.includes("type")) {
        switch (parsed[0]) {
          case "ChatMessageCreated":
            this.emit("messageCreate", {
              author: String(parsed[1].message.createdBy) || null,
              id: String(parsed[1].message.id) || null,
              team: String(parsed[1].teamId) || null,
              channel: String(parsed[1].channelId) || null,
              content: String(parsed[1].message.content.document.nodes[0].nodes[0].leaves[0].text) || null,
              mentions: searchMentions(parsed[1]) || null
          });
          break;
          case "ChatMessageDeleted":
            this.emit("messageDeleted", {
              author: String(parsed[1].message.createdBy) || null,
              id: String(parsed[1].message.id) || null,
              team: String(parsed[1].teamId) || null,
              channel: String(parsed[1].channelId) || null,
              content: String(parsed[1].message.content.document.nodes[0].nodes[0].leaves[0].text) || null,
              mentions: searchMentions(parsed[1]) || null
          });
          break;
          case "ChatMessageUpdated":
            this.emit("messageUpdated", parsed[1]);
          break;
        }
      }
    }

    heartBeat() {
      const interval = setInterval(() => {
        if (this.closed) return clearInterval(interval);
        this.ws.send(2);
      }, 25000);
    }
    
    connect() {
      const user = new User(this.config);
      let base = this;
      user.login().then((obj) => {
        this.ws = new WebSocket(`wss://www.guilded.gg/ws/?jwt=undefined&guildedClientId=${uuidv4()}&deviceType=web&EIO=3&transport=websocket`, {headers: {"Cookie": `hmac_signed_session=${this.cookie};`}});
        this.ws.setMaxListeners(0);
        
        this.ws.on("open", function open() {
          base.heartBeat();
        });

        this.ws.on("message", function message(data) {
          let message = formatJsonMessage(data);
          let sid = base.handleMessage(message);
          setTimeout(() => {
            if(sid) return base.emit("ready", {userId: obj.user.id, sid: sid});
          }, 200);
        });
  
        this.ws.on("close", function(e) {
          base.closed = true;
          base.emit("disconnect", e);
        });
      }).catch(() => {
        this.emit("ready", null);
      });
    }

    close() {
      this.ws.close(8675);
      this.closed = true;
    }
}

module.exports = Client;
