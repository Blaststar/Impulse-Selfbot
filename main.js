const fs = require("fs");
const moment = require("moment");
var config = require("./data/config.json");
const { v4: uuidv4 } = require("uuid");
const setTitle = require("node-bash-title");
const { Client } = require("./guilded");

if (!config.client.clientId || config.client.clientId === "") config.client.clientId = uuidv4();

const dark = new Map()
.set("red", "\x1b[31m")
.set("green", "\x1b[32m")
.set("yellow", "\x1b[33m")
.set("blue", "\x1b[34m")
.set("magenta", "\x1b[35m")
.set("cyan", "\x1b[36m")
.set("gray", "\x1b[37m");
  
const light = new Map()
.set("red", "\x1b[91m")
.set("green", "\x1b[92m")
.set("yellow", "\x1b[93m")
.set("blue", "\x1b[94m")
.set("magenta", "\x1b[95m")
.set("cyan", "\x1b[96m")
.set("gray", "\x1b[39m");

function getTime() {
  const date = new Date();
  var hours = moment(date).hours();
  var minutes = moment(date).minutes();
  var seconds = moment(date).seconds();
  return hours + ":" + minutes + ":" + seconds;
}

function log(header, message, color) {
    return console.log(`${dark.get("gray")}[${getTime()}] ${light.get("gray")}[${light.get(color)}${header}${light.get("gray")}]${light.get("yellow")} ${message}` + dark.get("gray"));
}

function displayUI() {
    const header = fs.readFileSync("./data/header.theme", "utf-8");
    console.log(`${light.get("blue") + header}\n` + dark.get("gray"));
}

setTitle(`Impulse v${config.version}`)
displayUI();

const cookie = config.client.cookie;
const id = config.client.userId;
const prefix = config.prefix;

function missingValues() {
    log("Missing Values", "Check config.json in data folder to make sure cookie, id, and prefix are provided!", "red");
}

if (cookie.trim() === "" || id.trim() === "" || prefix.trim() === "") return missingValues();

log("Using Prefix", prefix, "green");

const client = new Client(config);

const commands = new Map();
const snipedMessages = new Map();

function loadCommands(commandFiles) {
    for (const file of commandFiles){
        const command = require(`./commands/${file}`);
        commands.set(command.name, command);
        log("Loaded Command", `${command.name} - ${command.description}`, "cyan");
    }
}

function getCommands() {
    var commands = [];
    fs.readdirSync("./commands/").filter(file => file.endsWith(".js")).forEach(file => {commands.push(file)});
    const commandFolders = fs.readdirSync("./commands/", { withFileTypes: true }).filter(obj => obj.isDirectory()).map(obj => obj.name);
    commandFolders.forEach(folder => {
        var files = fs.readdirSync(`./commands/${folder}`).filter(file => file.endsWith(".js"));
        files.forEach(file => {
            commands.push(folder + "/" + file);
        });
    });
    setTimeout(() => {
        loadCommands(commands);
    }, 200);
}


client.on("disconnect", (code) => {
    log("Disconnected", code, "red");
});

client.on("ready", (data) => {
    if (data === null) {
        log("Error", "Unable to login, invalid cookie...", "red");
        process.exit(1);
    } else {
        setTitle("Impulse v1.0 | Connected")
        log("Connected", data.userId, "green");
        log("Session ID", data.sid, "green");
        getCommands();
    }
});

client.on("messageDeleted", (message) => {
    if (message.author === null || message.content === null) return;
    if (!snipedMessages.has(message.channel)) return snipedMessages.set(message.channel, {id: message.author, content: message.content});
    snipedMessages.delete(message.channel);
    snipedMessages.set(message.channel, {id: message.author, content: message.content});
});


client.on("messageDeleted", (message) => {
    if (message.author === null || message.content === null) return;
    if (message.author === id) return;
    log("Message Deleted", message.content, "red");
});

client.on("messageCreate", (message) => {
    if (message.author === null || message.content === null) return;
    if (message.author != id || message.content.trim() === "" || !message.content.startsWith(prefix)) return;
    const args = message.content.slice(prefix.length).trim().split(/ +/g);
    const command = args.shift().toLowerCase();

    if (commands.has(command)) {
        log("Command Used", command, "cyan");
        if (command === "snipe") {
            if (!snipedMessages.has(message.channel)) {
                commands.get(command).execute(message.channel, message, null);
            } else {
                commands.get(command).execute(message.channel, message, snipedMessages.get(message.channel)); 
            }

        } else {
            commands.get(command).execute(message.channel, message, args);
        }
    }
});

log("Connecting", "This should only take a few seconds...", "magenta");
client.connect();
