const {
Client,
GatewayIntentBits,
SlashCommandBuilder,
REST,
Routes,
EmbedBuilder,
ActionRowBuilder,
ButtonBuilder,
ButtonStyle,
ChannelType
} = require("discord.js");

const client = new Client({
intents: [GatewayIntentBits.Guilds]
});

const TOKEN = process.env.TOKEN;
const CLIENT_ID = process.env.CLIENT_ID;

let backup = null;

const commands = [
new SlashCommandBuilder()
.setName("painel")
.setDescription("Abrir painel de gerenciamento")
].map(c => c.toJSON());

client.once("ready", async () => {

console.log(`✅ Bot online: ${client.user.tag}`);

const rest = new REST({ version: "10" }).setToken(TOKEN);

await rest.put(
Routes.applicationCommands(CLIENT_ID),
{ body: commands }
);

console.log("✅ /painel registrado");

});

client.on("interactionCreate", async interaction => {

if (interaction.isChatInputCommand()) {

if (interaction.commandName === "painel") {

const embed = new EmbedBuilder()
.setTitle("📊 Painel do Servidor")
.setDescription("Gerencie o servidor usando os botões abaixo.")
.setColor(0x5865F2);

const row = new ActionRowBuilder().addComponents(

new ButtonBuilder()
.setCustomId("backup")
.setLabel("Criar Backup")
.setStyle(ButtonStyle.Primary),

new ButtonBuilder()
.setCustomId("restore")
.setLabel("Restaurar Backup")
.setStyle(ButtonStyle.Success),

new ButtonBuilder()
.setCustomId("clone")
.setLabel("Clonar Estrutura")
.setStyle(ButtonStyle.Secondary)

);

await interaction.reply({
embeds: [embed],
components: [row]
});

}

}

if (interaction.isButton()) {

const guild = interaction.guild;

if (interaction.customId === "backup") {

backup = {
roles: guild.roles.cache.map(r => ({
name: r.name,
color: r.color,
permissions: r.permissions.bitfield
})),
channels: guild.channels.cache.map(c => ({
name: c.name,
type: c.type
}))
};

await interaction.reply({
content: "📦 Backup criado com sucesso.",
ephemeral: true
});

}

if (interaction.customId === "restore") {

if (!backup) {

return interaction.reply({
content: "❌ Nenhum backup encontrado.",
ephemeral: true
});

}

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
content: "🔁 Backup restaurado com sucesso.",
ephemeral: true
});

}

if (interaction.customId === "clone") {

await interaction.reply({
content: "🧬 Clonando estrutura...",
ephemeral: true
});

const roles = guild.roles.cache
.filter(r => r.name !== "@everyone")
.sort((a,b) => a.position - b.position);

for (const role of roles.values()) {

await guild.roles.create({
name: role.name,
color: role.color,
permissions: role.permissions
});

}

const channels = guild.channels.cache.filter(c =>
c.type === ChannelType.GuildText ||
c.type === ChannelType.GuildVoice ||
c.type === ChannelType.GuildCategory
);

for (const channel of channels.values()) {

await guild.channels.create({
name: channel.name,
type: channel.type
});

}

}

}

});

client.login(TOKEN);
