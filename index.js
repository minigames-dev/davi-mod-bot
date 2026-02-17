const { Client, GatewayIntentBits, PermissionsBitField } = require('discord.js');

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMembers
    ]
});

const prefix = "!";
const palavroes = ["palavra1", "palavra2"]; // coloque palavrões aqui

client.on("ready", () => {
    console.log(`Bot ligado como ${client.user.tag}`);
});

client.on("messageCreate", async (message) => {
    if (message.author.bot) return;

    // AUTO MOD - palavrão
    if (palavroes.some(p => message.content.toLowerCase().includes(p))) {
        message.delete();
        message.channel.send(`${message.author}, não use palavrões!`);
    }

    // AUTO MOD - links
    if (message.content.includes("http")) {
        message.delete();
        message.channel.send(`${message.author}, links não são permitidos!`);
    }

    if (!message.content.startsWith(prefix)) return;

    const args = message.content.slice(prefix.length).split(" ");
    const comando = args.shift().toLowerCase();

    // BAN
    if (comando === "ban") {
        if (!message.member.permissions.has(PermissionsBitField.Flags.BanMembers)) return;
        const user = message.mentions.members.first();
        if (user) {
            user.ban();
            message.channel.send("Usuário banido!");
        }
    }

    // KICK
    if (comando === "kick") {
        if (!message.member.permissions.has(PermissionsBitField.Flags.KickMembers)) return;
        const user = message.mentions.members.first();
        if (user) {
            user.kick();
            message.channel.send("Usuário expulso!");
        }
    }

    // LIMPAR CHAT
    if (comando === "limpar") {
        if (!message.member.permissions.has(PermissionsBitField.Flags.ManageMessages)) return;
        const quantidade = parseInt(args[0]);
        if (!quantidade) return;
        message.channel.bulkDelete(quantidade);
    }
});

client.login(process.env.TOKEN);
