const {
Client,
GatewayIntentBits,
ActionRowBuilder,
ButtonBuilder,
ButtonStyle,
EmbedBuilder,
SlashCommandBuilder,
REST,
Routes
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
].map(command => command.toJSON());

client.once("ready", async () => {

console.log(`✅ Bot online: ${client.user.tag}`);

const rest = new REST({ version: "10" }).setToken(TOKEN);

try {

await rest.put(
Routes.applicationCommands(CLIENT_ID),
{ body: commands }
);

console.log("✅ Comando /painel registrado");

} catch (error) {
console.error(error);
}

});

client.on("interactionCreate", async interaction => {

if (interaction.isChatInputCommand()) {

if (interaction.commandName === "painel") {

const embed = new EmbedBuilder()
.setTitle("📊 Painel do Bot")
.setDescription("Use os botões abaixo.")
.setColor(0x5865F2);

const row = new ActionRowBuilder().addComponents(

new ButtonBuilder()
.setCustomId("ping")
.setLabel("Ping")
.setStyle(ButtonStyle.Primary),

new ButtonBuilder()
.setCustomId("info")
.setLabel("Informações")
.setStyle(ButtonStyle.Success)

);

await interaction.reply({
embeds: [embed],
components: [row]
});

}

}

if (interaction.isButton()) {

if (interaction.customId === "ping") {

await interaction.reply({
content: "🏓 Pong! Bot funcionando.",
ephemeral: true
});

}

if (interaction.customId === "info") {

await interaction.reply({
content: "🤖 Painel funcionando corretamente.",
ephemeral: true
});

}

}

});

client.login(TOKEN);
