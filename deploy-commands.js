const { REST, Routes, SlashCommandBuilder } = require("discord.js");

const commands = [
new SlashCommandBuilder()
.setName("painel")
.setDescription("Abrre painel de gerenciamento")
].map(c => c.toJSON());

const rest = new REST({ version: "10" }).setToken("SEU_TOKEN");

(async () => {
try {

await rest.put(
Routes.applicationCommands("SEU_CLIENT_ID"),
{ body: commands }
);

console.log("Comando registrado.");

} catch (err) {
console.error(err);
}
})();
