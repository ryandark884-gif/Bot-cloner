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
StringSelectMenuBuilder,
ChannelType
} = require("discord.js");

const client = new Client({
intents: [GatewayIntentBits.Guilds]
});

const TOKEN = process.env.TOKEN;
const CLIENT_ID = process.env.CLIENT_ID;

const commands = [
new SlashCommandBuilder()
.setName("painel")
.setDescription("Abrir painel do bot")
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
.setTitle("📊 Painel do Bot")
.setDescription("Clique no botão para clonar um servidor.")
.setColor(0x5865F2);

const row = new ActionRowBuilder().addComponents(

new ButtonBuilder()
.setCustomId("clone_server")
.setLabel("🧬 Clonar Servidor")
.setStyle(ButtonStyle.Primary)

);

await interaction.reply({
embeds: [embed],
components: [row]
});

}

}

if (interaction.isButton()) {

if (interaction.customId === "clone_server") {

const guilds = client.guilds.cache
.filter(g => g.id !== interaction.guild.id);

const menu = new StringSelectMenuBuilder()
.setCustomId("select_server")
.setPlaceholder("Escolha o servidor para copiar");

guilds.forEach(g => {
menu.addOptions({
label: g.name,
value: g.id
});
});

const row = new ActionRowBuilder().addComponents(menu);

await interaction.reply({
content: "Escolha o servidor que deseja copiar:",
components: [row],
ephemeral: true
});

}

}

if (interaction.isStringSelectMenu()) {

if (interaction.customId === "select_server") {

const sourceGuild = client.guilds.cache.get(interaction.values[0]);
const targetGuild = interaction.guild;

await interaction.update({
content: "🧬 Clonando estrutura do servidor...",
components: []
});

const roles = sourceGuild.roles.cache
.filter(r => r.name !== "@everyone")
.sort((a,b) => a.position - b.position);

for (const role of roles.values()) {

await targetGuild.roles.create({
name: role.name,
color: role.color,
permissions: role.permissions
});

}

const categories = sourceGuild.channels.cache
.filter(c => c.type === ChannelType.GuildCategory);

for (const category of categories.values()) {

await targetGuild.channels.create({
name: category.name,
type: ChannelType.GuildCategory
});

}

const channels = sourceGuild.channels.cache
.filter(c =>
c.type === ChannelType.GuildText ||
c.type === ChannelType.GuildVoice
);

for (const channel of channels.values()) {

await targetGuild.channels.create({
name: channel.name,
type: channel.type
});

}

interaction.followUp({
content: "✅ Estrutura clonada com sucesso!"
});

}

}

});

client.login(TOKEN);
