module.exports = { 
    name: "unban",
    description: "Unbans user by ID",
    execute(channelId, message, args) {
        var { Message, MessageEmbed, Moderation} = require("../../guilded");
        var config = require("../../data/config.json");

        const prefix = config.prefix;
        const msg = new Message(channelId, message.id, config);
        const id = args[0].trim();

        const example = new MessageEmbed()
        .setTitle("**Impulse | Unban**")
        .addFields([
            {name: "Usage", value: "`Unbans user by ID.`"},
            {name: "Example", value: "`" + prefix + "unban AQRYapg5`"},
        ])
        .setThumbnail("https://cdn.discordapp.com/attachments/1209353546542358578/1219450793124429864/nlt2tm5VCAVSAVSgQdFgf8PfGYo7EyTJo8AAAAASUVORK5CYII.png?ex=660b590d&is=65f8e40d&hm=0850260d634117b925d4a60d3236d3b356c4567c57ba9f31ff63d0de0a32705f&")
        .setColor("black")
        .setFooter("Impulse")
        .setTimestamp(); 

        if (!id || !isNaN(id)) return msg.send(null, example);
        const user = new Moderation(message.team, id, config);
        console.log(id);
        user.unban().then(() => {
            const embed = new MessageEmbed()
            .setTitle("**Impulse | Unbanned Member**")
            .setDescription(`Successfully unbanned ${id}!`)
            .setThumbnail("https://cdn.discordapp.com/attachments/1209353546542358578/1219450793124429864/nlt2tm5VCAVSAVSgQdFgf8PfGYo7EyTJo8AAAAASUVORK5CYII.png?ex=660b590d&is=65f8e40d&hm=0850260d634117b925d4a60d3236d3b356c4567c57ba9f31ff63d0de0a32705f&")
            .setColor("black")
            .setFooter("Impulse")
            .setTimestamp(); 

            msg.send(null, embed);
        }).catch((e) => {
            msg.send("Unable to unban member...");
        });
    }
}