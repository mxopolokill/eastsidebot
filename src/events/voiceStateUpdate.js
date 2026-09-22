const { ChannelType, PermissionFlagsBits } = require('discord.js');

// Map pour associer chaque salon créé à son numéro et son préfixe (BDA, HRP...)
const tempChannels = new Map();

module.exports = {
  name: 'voiceStateUpdate',
  async execute(oldState, newState) {
    // Configuration des générateurs (BDA et HRP)
    const generators = [
      {
        joinId: process.env.BDA_JOIN_ID,
        categoryId: process.env.BDA_CATEGORY_ID,
        prefix: process.env.BDA_PREFIX || 'BDA',
      },
      {
        joinId: process.env.HRP_JOIN_ID,
        categoryId: process.env.HRP_CATEGORY_ID,
        prefix: process.env.HRP_PREFIX || 'HRP',
      },
    ];

    // Vérifie si l'utilisateur rejoint un des salons générateurs
    const generator = generators.find(g => g.joinId === newState.channelId);

    // 1. CRÉATION DU SALON (BDA 1, BDA 2, HRP 1, HRP 2...)
    if (generator) {
      try {
        // Récupère les numéros déjà utilisés pour ce préfixe spécifique
        const usedNumbers = Array.from(tempChannels.values())
          .filter(item => item.prefix === generator.prefix)
          .map(item => item.number);

        // Trouve le plus petit numéro disponible (1, 2, 3...)
        let channelNumber = 1;
        while (usedNumbers.includes(channelNumber)) {
          channelNumber++;
        }

        const channelName = `${generator.prefix} ${channelNumber}`;

        // Création du salon dans la catégorie dédiée
        const createdChannel = await newState.guild.channels.create({
          name: channelName,
          type: ChannelType.GuildVoice,
          parent: generator.categoryId || newState.channel.parentId,
          permissionOverwrites: [
            {
              id: newState.member.user.id,
              allow: [
                PermissionFlagsBits.ManageChannels,
                PermissionFlagsBits.MoveMembers,
              ],
            },
          ],
        });

        // Enregistre les informations du salon
        tempChannels.set(createdChannel.id, {
          number: channelNumber,
          prefix: generator.prefix,
        });

        // Déplace le joueur dans le salon créé
        await newState.setChannel(createdChannel);
      } catch (error) {
        console.error('Erreur lors de la création du salon vocal :', error);
      }
    }

    // 2. SUPPRESSION QUAND LE SALON EST VIDE
    if (oldState.channelId && tempChannels.has(oldState.channelId)) {
      const channel = oldState.guild.channels.cache.get(oldState.channelId);

      if (channel && channel.members.size === 0) {
        tempChannels.delete(channel.id); // Libère le numéro
        await channel.delete().catch(() => null);
      }
    }
  },
};