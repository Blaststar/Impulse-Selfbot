module.exports = { 
    name: "userinfo",
    description: "Gives information on user's profile",
    execute(channelId, message, args) {
        var { User, Message, MessageEmbed } = require("../../guilded");
        var config = require("../../data/config.json");
        var moment = require("moment");

        const prefix = config.prefix;
        const msg = new Message(channelId, message.id, config);
        var userId = args[0];

        if (!userId) userId = message.author;

        function getDate(date) {
            let year = moment(date).format("YY");
            let month = moment(date).format("MM");
            let day = moment(date).format("DD");

            return `${day}/${month}/${year}`;
        }

        const user = new User(config);
        user.getProfile(userId).then((data) => {
            let id = data.id;
            let name = data.name;
            let pfp = data.profilePicture;
            let status = data.userStatus.content;
            let badges = data.badges.length;
            let about = data.aboutInfo;
            let created = getDate(data.joinDate);
            if (status === null) {
                status = "None";
            } else {
                status = data.userStatus.content.document.nodes[0].nodes[0].leaves[0].text
            }
            if (about === null) {
                about = "None";
            } else {
                about = data.aboutInfo.bio;
            }
            if (pfp === null) {
                pfp = "https://cdn.discordapp.com/attachments/898733028606611477/1219813720385917018/profile_4.png?ex=660cab0d&is=65fa360d&hm=851a125a511a205bf29e697f7275fff124c0d6d26afbb9b71891cba779f7a237&";
            } else {
                let end = pfp.split("UserAvatar/")[1];
                pfp = "https://cdn.gilcdn.com/UserAvatar/" + end;
            }

            const embed = new MessageEmbed()
            .setTitle("**Impulse | Userinfo**")
            .addFields([
                {name: "Name", value: "`" + name + "`", inline: true},
                {name: "User ID", value: "`" + id + "`", inline: true},
                {name: "Created", value: "`" + created + "`", inline: true},
                {name: "Badges", value: "`" + badges + "`", inline: true},
                {name: "Status", value: "```" + status + "```", inline: false},
                {name: "About", value: "```" + about + "```", inline: false}
            ])
            .setThumbnail(pfp)
            .setColor("black")
            .setFooter("Impulse")
            .setTimestamp(); 

            msg.send(null, embed);
        }).catch((e) => {
            const fail = new MessageEmbed()
            .setTitle("**Impulse | Userinfo**")
            .addFields([
                {name: "Message", value: "`Failed to get user's information...`"},
                {name: "Error", value: "`" + e + "`"}
            ])
            .setThumbnail("https://cdn.discordapp.com/attachments/1209353546542358578/1219450793124429864/nlt2tm5VCAVSAVSgQdFgf8PfGYo7EyTJo8AAAAASUVORK5CYII.png?ex=660b590d&is=65f8e40d&hm=0850260d634117b925d4a60d3236d3b356c4567c57ba9f31ff63d0de0a32705f&")
            .setColor("black")
            .setFooter("Impulse")
            .setTimestamp(); 
    
            msg.send(null, fail);
        });
    }
}