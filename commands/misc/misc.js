module.exports = { 
    name: "misc",
    description: "Lists misc commands",
    execute(channelId, message, args) {
        var { Message, MessageEmbed } = require("../../guilded");
        var config = require("../../data/config.json");

        const prefix = config.prefix;
        const msg = new Message(channelId, message.id, config);

        const embed = new MessageEmbed()
        .setTitle("**Impulse | Misc**")
        .addFields([
            {name: `${prefix}snipe`, value: "`Displays latest deleted message in channel.`"},
        ])
        .setThumbnail("https://cdn.discordapp.com/attachments/1209353546542358578/1219450793124429864/nlt2tm5VCAVSAVSgQdFgf8PfGYo7EyTJo8AAAAASUVORK5CYII.png?ex=660b590d&is=65f8e40d&hm=0850260d634117b925d4a60d3236d3b356c4567c57ba9f31ff63d0de0a32705f&")
        .setColor("black")
        .setFooter("Impulse")
        .setTimestamp(); 

        msg.send(null, embed);
    }
}