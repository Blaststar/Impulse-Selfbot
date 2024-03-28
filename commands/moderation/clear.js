module.exports = { 
    name: "clear",
    description: "Clears given amount of messages you sent",
    execute(channelId, message, args) {
        var { Message, MessageEmbed } = require("../../guilded");
        var config = require("../../data/config.json");

        const prefix = config.prefix;
        const msg = new Message(channelId, message.id, config);
        const amount = args[0];

        const embed = new MessageEmbed()
        .setTitle("**Impulse | Clear**")
        .setDescription(`Attemping to clear ${amount} messages...`)
        .setThumbnail("https://cdn.discordapp.com/attachments/1209353546542358578/1219450793124429864/nlt2tm5VCAVSAVSgQdFgf8PfGYo7EyTJo8AAAAASUVORK5CYII.png?ex=660b590d&is=65f8e40d&hm=0850260d634117b925d4a60d3236d3b356c4567c57ba9f31ff63d0de0a32705f&")
        .setColor("black")
        .setFooter("Impulse")
        .setTimestamp(); 

        const example = new MessageEmbed()
        .setTitle("**Impulse | Clear**")
        .addFields([
            {name: `Usage`, value: "`Clears given amount of messages.`"},
            {name: `Example`, value: "`" + prefix + "clear 5`"},
        ])
        .setThumbnail("https://cdn.discordapp.com/attachments/1209353546542358578/1219450793124429864/nlt2tm5VCAVSAVSgQdFgf8PfGYo7EyTJo8AAAAASUVORK5CYII.png?ex=660b590d&is=65f8e40d&hm=0850260d634117b925d4a60d3236d3b356c4567c57ba9f31ff63d0de0a32705f&")
        .setColor("black")
        .setFooter("Impulse")
        .setTimestamp(); 

        if(isNaN(amount) || Number(amount) > 100 || Number(amount) < 1) return msg.send(null, example);

        msg.delete(500).then(() => {
            msg.getMessages(amount).then((messages) => {
                msg.send(null, embed).then((data) => {
                    var count = 0;
                    var i = 0;
                    var interval = setInterval(() => {
                        let m = messages[i];
                        if (!m) {
                            clearInterval(interval);
                            const complete = new MessageEmbed()
                            .setTitle("**Impulse | Clear**")
                            .setDescription(`Successfully cleared ${amount} messages!`)
                            .setThumbnail("https://cdn.discordapp.com/attachments/1209353546542358578/1219450793124429864/nlt2tm5VCAVSAVSgQdFgf8PfGYo7EyTJo8AAAAASUVORK5CYII.png?ex=660b590d&is=65f8e40d&hm=0850260d634117b925d4a60d3236d3b356c4567c57ba9f31ff63d0de0a32705f&")
                            .setColor("black")
                            .setFooter("Impulse")
                            .setTimestamp(); 
    
                            m = new Message(channelId, data.id, config);
                            m.delete().then(() => {
                                msg.send(null, complete).then((res) => {
                                    m = new Message(channelId, res.id, config);
                                    m.delete(5000);
                                });
                            });
                        } else {
                            if (m.createdBy != config.client.userId) return i++;
                            m = new Message(channelId, m.id, config);
                            m.delete().then(() => {
                                count++
                            }).catch((e) => {
                                console.log(e);
                                return;
                            });
                            i++;
                        }
                    }, 200);
                });
            });
        });
    }
}
