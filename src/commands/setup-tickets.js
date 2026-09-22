const { 
  SlashCommandBuilder, 
  EmbedBuilder, 
  ActionRowBuilder, 
  StringSelectMenuBuilder, 
  PermissionFlagsBits,
  MessageFlags
} = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('setup-tickets')
    .setDescription('Envoie le panneau de création de tickets East Side')
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

  async execute(interaction) {
    const embed = new EmbedBuilder()
      .setColor('#2b2d31')
      .setTitle('Créer un ticket – East Side | WL')
      .setDescription(
        'Choisis le département correspondant à ta demande pour qu’un membre de l’équipe puisse t’aider rapidement.\n\n' +
        '📜 **Whitelist**\n' +
        'Tu souhaites rejoindre East Side ? Après avoir lu le Règlement et le Lore, ouvre un ticket afin de déposer ta candidature.\n\n' +
        '💼 **Dossiers Légaux**\n' +
        'Vous souhaitez créer, reprendre ou développer un projet légal sur East Side.\n\n' +
        '⚖️ **Dossiers Illégaux**\n' +
        'Vous souhaitez créer, reprendre ou développer un projet illégal sur East Side.\n\n' +
        '🛠️ **Département Technique**\n' +
        'Pour toute demande liée aux bugs ou problèmes techniques.\n\n' +
        '❓ **Département Divers**\n' +
        'Toute autre demande générale.\n\n' +
        '👑 **Haute Direction**\n' +
        'Pour les situations sensibles nécessitant un contact direct avec la Haute Direction.'
      )
      .setFooter({ text: 'East Side • Système de tickets' });

    const selectMenu = new StringSelectMenuBuilder()
      .setCustomId('select_ticket_category')
      .setPlaceholder('Sélectionne le département adapté à ta demande...')
      .addOptions([
        { label: 'Whitelist', value: 'ticket_whitelist', emoji: '📜' },
        { label: 'Dossiers Légaux', value: 'ticket_legaux', emoji: '💼' },
        { label: 'Dossiers Illégaux', value: 'ticket_illegaux', emoji: '⚖️' },
        { label: 'Département Technique', value: 'ticket_technique', emoji: '🛠️' },
        { label: 'Département Divers', value: 'ticket_divers', emoji: '❓' },
        { label: 'Haute Direction', value: 'ticket_direction', emoji: '👑' },
      ]);

    const row = new ActionRowBuilder().addComponents(selectMenu);

    await interaction.channel.send({ embeds: [embed], components: [row] });
    await interaction.reply({ 
      content: '✅ Panneau de tickets envoyé avec succès !', 
      flags: MessageFlags.Ephemeral 
    });
  },
};