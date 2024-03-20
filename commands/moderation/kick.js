module.exports = { 
    name: "kick",
    description: "Kicks mentioned user",
    execute(channelId, message, args) {
        var { Message, MessageEmbed, Moderation} = require("../../guilded");
        var config = require("../../data/config.json");

        const prefix = config.prefix;
        const msg = new Message(channelId, message.id, config);

        const example = new MessageEmbed()
        .setTitle("**Impulse | Kick**")
        .addFields([
            {name: "Usage", value: "`Kicks mentioned member.`"},
            {name: "Example", value: "`" + prefix + "kick @RandomMember`"},
        ])
        .setThumbnail("https://cdn.discordapp.com/attachments/1209353546542358578/1219450793124429864/nlt2tm5VCAVSAVSgQdFgf8PfGYo7EyTJo8AAAAASUVORK5CYII.png?ex=660b590d&is=65f8e40d&hm=0850260d634117b925d4a60d3236d3b356c4567c57ba9f31ff63d0de0a32705f&")
        .setColor("black")
        .setFooter("Impulse")
        .setTimestamp(); 

        if (message.mentions === null) return msg.send(null, example);

        const user = new Moderation(message.team, message.mentions.id, config);
        user.kick().then(() => {
            const embed = new MessageEmbed()
            .setTitle("**Impulse | Kicked Member**")
            .setDescription(`Successfully kicked @${message.mentions.name}!`)
            .setThumbnail("https://cdn.discordapp.com/attachments/1209353546542358578/1219450793124429864/nlt2tm5VCAVSAVSgQdFgf8PfGYo7EyTJo8AAAAASUVORK5CYII.png?ex=660b590d&is=65f8e40d&hm=0850260d634117b925d4a60d3236d3b356c4567c57ba9f31ff63d0de0a32705f&")
            .setColor("black")
            .setFooter("Impulse")
            .setTimestamp(); 

            msg.send(null, embed);
        }).catch((e) => {
            console.log(e);
            msg.send("Unable to kick member...");
        });
    }
}