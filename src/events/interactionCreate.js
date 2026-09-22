const { 
  ChannelType, 
  PermissionFlagsBits, 
  EmbedBuilder, 
  ActionRowBuilder, 
  ButtonBuilder, 
  ButtonStyle,
  MessageFlags
} = require('discord.js');

module.exports = {
  name: 'interactionCreate',
  async execute(interaction) {
    // ---------------------------------------------------------
    // A. GESTION DES COMMANDES SLASH (ex: /setup-tickets)
    // ---------------------------------------------------------
    if (interaction.isChatInputCommand()) {
      const command = interaction.client.commands.get(interaction.commandName);
      if (!command) return;

      try {
        await command.execute(interaction);
      } catch (error) {
        console.error(`Erreur sur /${interaction.commandName} :`, error);
        const errorOptions = { 
          content: '❌ Une erreur est survenue lors de l’exécution de cette commande !', 
          flags: MessageFlags.Ephemeral 
        };
        if (interaction.replied || interaction.deferred) {
          await interaction.followUp(errorOptions);
        } else {
          await interaction.reply(errorOptions);
        }
      }
      return;
    }

    // ---------------------------------------------------------
    // B. GESTION DU MENU DÉROULANT DE CRÉATION DE TICKET
    // ---------------------------------------------------------
    if (interaction.isStringSelectMenu() && interaction.customId === 'select_ticket_category') {
      const selectedCategory = interaction.values[0];
      const guild = interaction.guild;
      const user = interaction.user;

      await interaction.deferReply({ flags: MessageFlags.Ephemeral });

      const ticketConfigs = {
        ticket_whitelist: {
          prefix: 'whitelist',
          title: '📜 Ticket Whitelist – East Side',
          desc: 'Merci d’indiquer votre nom RP, votre âge ainsi que vos disponibilités pour l’entretien vocal.',
          roleId: process.env.STAFF_ROLE_ID
        },
        ticket_legaux: {
          prefix: 'légal',
          title: '💼 Dossier Légal – East Side',
          desc: 'Merci de présenter votre projet de manière claire et détaillée (Création/Reprise d’entreprise, événements, etc.).',
          roleId: process.env.STAFF_ROLE_ID
        },
        ticket_illegaux: {
          prefix: 'illégal',
          title: '⚖️ Dossier Illégal – East Side',
          desc: 'Merci de présenter votre projet de manière claire et détaillée (Organisation, Gang, Trafics, Braquages, etc.).',
          roleId: process.env.STAFF_ROLE_ID
        },
        ticket_technique: {
          prefix: 'tech',
          title: '🛠️ Support Technique – East Side',
          desc: 'Merci de décrire votre problème technique ou bug rencontré, accompagnés de captures d’écran ou d’extraits vidéo si possible.',
          roleId: process.env.STAFF_ROLE_ID
        },
        ticket_divers: {
          prefix: 'divers',
          title: '❓ Ticket Divers – East Side',
          desc: 'Posez votre question ou détaillez votre demande ci-dessous.',
          roleId: process.env.STAFF_ROLE_ID
        },
        ticket_direction: {
          prefix: 'direction',
          title: '👑 Haute Direction – East Side',
          desc: 'Ce ticket est strictly confidentiel. Merci de décrire les faits de manière claire en joignant toutes les preuves nécessaires.',
          roleId: process.env.HAUTE_DIRECTION_ROLE_ID
        }
      };

      const config = ticketConfigs[selectedCategory];

      const existingChannel = guild.channels.cache.find(
        c => c.name === `${config.prefix}-${user.username.toLowerCase()}`
      );

      if (existingChannel) {
        return interaction.editReply({ 
          content: `❌ Vous avez déjà un ticket ouvert dans cette catégorie : ${existingChannel}` 
        });
      }

      const permissionOverwrites = [
        {
          id: guild.roles.everyone.id,
          deny: [PermissionFlagsBits.ViewChannel],
        },
        {
          id: user.id,
          allow: [
            PermissionFlagsBits.ViewChannel,
            PermissionFlagsBits.SendMessages,
            PermissionFlagsBits.AttachFiles,
            PermissionFlagsBits.ReadMessageHistory
          ],
        },
      ];

      if (config.roleId) {
        permissionOverwrites.push({
          id: config.roleId,
          allow: [
            PermissionFlagsBits.ViewChannel,
            PermissionFlagsBits.SendMessages,
            PermissionFlagsBits.AttachFiles,
            PermissionFlagsBits.ReadMessageHistory
          ],
        });
      }

      try {
        const ticketChannel = await guild.channels.create({
          name: `${config.prefix}-${user.username}`,
          type: ChannelType.GuildText,
          parent: process.env.TICKETS_CATEGORY_ID || null,
          permissionOverwrites: permissionOverwrites,
        });

        const ticketEmbed = new EmbedBuilder()
          .setColor('#00ff88')
          .setTitle(config.title)
          .setDescription(`Bonjour ${user},\n\n${config.desc}\n\nUn membre de l'équipe prendra en charge votre demande sous peu.`)
          .setFooter({ text: 'East Side • Système de tickets' })
          .setTimestamp();

        const closeButton = new ActionRowBuilder().addComponents(
          new ButtonBuilder()
            .setCustomId('close_ticket')
            .setLabel('Fermer le ticket')
            .setStyle(ButtonStyle.Danger)
            .setEmoji('🔒')
        );

        await ticketChannel.send({ 
          content: `${user} | <@&${config.roleId || guild.roles.everyone.id}>`, 
          embeds: [ticketEmbed], 
          components: [closeButton] 
        });

        await interaction.editReply({ 
          content: `✅ Votre ticket a été créé avec succès dans ${ticketChannel}` 
        });

      } catch (error) {
        console.error('Erreur lors de la création du ticket :', error);
        await interaction.editReply({ content: '❌ Impossible de créer le ticket.' });
      }
    }

    // ---------------------------------------------------------
    // C. GESTION DU BOUTON DE FERMETURE
    // ---------------------------------------------------------
    if (interaction.isButton() && interaction.customId === 'close_ticket') {
      await interaction.reply({ content: '🔒 Fermeture et suppression du ticket dans 5 secondes...' });
      setTimeout(async () => {
        await interaction.channel.delete().catch(() => null);
      }, 5000);
    }
  },
};