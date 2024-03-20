module.exports = { 
    name: "help",
    description: "Returns help message",
    execute(channelId, message, args) {
        var { Message, MessageEmbed } = require("../guilded");
        var config = require("../data/config.json");

        const prefix = config.prefix;
        const msg = new Message(channelId, message.id, config);

        const embed = new MessageEmbed()
        .setTitle("**Impulse | Help**")
        .addFields([
            {name: `${prefix}user`, value: "`User related commands.`"},
            {name: `${prefix}mod`, value: "`Moderation related commands.`"},
            {name: `${prefix}misc`, value: "`Misc commands.`"},
            {name: "Developer", value: "`Tech Support`"},
            {name: "Version", value: "`" + config.version + "`"},
            {name: "Prefix", value: "`" + prefix + "`"}
        ])
        .setThumbnail("https://cdn.discordapp.com/attachments/1209353546542358578/1219450793124429864/nlt2tm5VCAVSAVSgQdFgf8PfGYo7EyTJo8AAAAASUVORK5CYII.png?ex=660b590d&is=65f8e40d&hm=0850260d634117b925d4a60d3236d3b356c4567c57ba9f31ff63d0de0a32705f&")
        .setColor("black")
        .setFooter("Impulse")
        .setTimestamp(); 

        msg.send(null, embed);
    }
}