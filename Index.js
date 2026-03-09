const {
  Client,
  GatewayIntentBits,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  ModalBuilder,
  TextInputBuilder,
  TextInputStyle
} = require("discord.js");

const client = new Client({
  intents: [GatewayIntentBits.Guilds]
});

client.once("ready", () => {
  console.log(`Bot ligado como ${client.user.tag}`);
});

client.on("interactionCreate", async (interaction) => {

  // comando /painel
  if (interaction.isChatInputCommand()) {
    if (interaction.commandName === "painel") {

      const row = new ActionRowBuilder().addComponents(
        new ButtonBuilder()
          .setCustomId("clonar")
          .setLabel("Clonar")
          .setStyle(ButtonStyle.Primary)
      );

      await interaction.reply({
        content: "📊 **Painel de opções**",
        components: [row]
      });
    }
  }

  // botão
  if (interaction.isButton()) {
    if (interaction.customId === "clonar") {

      const modal = new ModalBuilder()
        .setCustomId("clonar_modal")
        .setTitle("Inserir link");

      const input = new TextInputBuilder()
        .setCustomId("link_servidor")
        .setLabel("Link do servidor")
        .setStyle(TextInputStyle.Short)
        .setPlaceholder("https://discord.gg/...");

      const row = new ActionRowBuilder().addComponents(input);

      modal.addComponents(row);

      await interaction.showModal(modal);
    }
  }

  // resposta do modal
  if (interaction.isModalSubmit()) {
    if (interaction.customId === "clonar_modal") {

      const link = interaction.fields.getTextInputValue("link_servidor");

      await interaction.reply({
        content: `✅ Link recebido: ${link}\nProcesso confirmado.`,
        ephemeral: true
      });
    }
  }

});

client.login(process.env.TOKEN);
