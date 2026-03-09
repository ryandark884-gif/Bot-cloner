const {
Client,
GatewayIntentBits,
ActionRowBuilder,
ButtonBuilder,
ButtonStyle,
EmbedBuilder
} = require("discord.js");

const client = new Client({
intents: [GatewayIntentBits.Guilds]
});

let backup = null;

client.once("ready", () => {
console.log(`Bot online: ${client.user.tag}`);
});

client.on("interactionCreate", async (interaction) => {

if (interaction.isChatInputCommand()) {
if (interaction.commandName === "painel") {

const embed = new EmbedBuilder()
.setTitle("📦 Painel do Servidor")
.setDescription("Use os botões abaixo para gerenciar o servidor.")
.setColor(0x5865F2);

const row = new ActionRowBuilder().addComponents(
new ButtonBuilder()
.setCustomId("backup")
.setLabel("Criar Backup")
.setStyle(ButtonStyle.Primary),

new ButtonBuilder()
.setCustomId("restaurar")
.setLabel("Restaurar Backup")
.setStyle(ButtonStyle.Success)
);

await interaction.reply({
embeds: [embed],
components: [row]
});

}
}

if (interaction.isButton()) {

if (interaction.customId === "backup") {

const guild = interaction.guild;

backup = {
roles: guild.roles.cache.map(r => ({
name: r.name,
color: r.color,
permissions: r.permissions.bitfield
})),
channels: guild.channels.cache.map(c => ({
name: c.name,
type: c.type,
parent: c.parentId
}))
};

await interaction.reply({
content: "✅ Backup criado com sucesso.",
ephemeral: true
});

}

if (interaction.customId === "restaurar") {

if (!backup) {
return interaction.reply({
content: "❌ Nenhum backup encontrado.",
ephemeral: true
});
}

const guild = interaction.guild;

for (const role of backup.roles) {
if (role.name !== "@everyone") {
await guild.roles.create({
name: role.name,
color: role.color,
permissions: role.permissions
});
}
}

for (const channel of backup.channels) {
await guild.channels.create({
name: channel.name,
type: channel.type
});
}

await interaction.reply({
content: "🧬 Estrutura restaurada com sucesso.",
ephemeral: true
});

}

}

});

client.login(process.env.TOKEN);
