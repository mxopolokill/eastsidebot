const {
  SlashCommandBuilder,
  EmbedBuilder
} = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('wl')
    .setDescription('Affiche les informations pour passer la Whitelist'),

  async execute(interaction) {
    const embed = new EmbedBuilder()
      .setColor('#8B0000')
      .setTitle('🌆・COMMENT PASSER TA WHITELIST')
      .setDescription(
        `Bienvenue sur **East Side RP** !

Pour rejoindre le serveur et commencer ton aventure RP, tu devras passer la **Whitelist (WL)**.

La WL permet de vérifier que chaque joueur connaît les bases du RolePlay, le règlement et l'univers du serveur.

━━━━━━━━━━━━━━━━━━━━

**📖・1. Lire le règlement**

Avant toute chose, prends le temps de lire attentivement le **règlement HRP & RP**.

> ⚠️ La lecture et l'acceptation du règlement sont obligatoires pour passer la WL.

━━━━━━━━━━━━━━━━━━━━

**🌎・2. Lire le Lore**

Le **Lore d'East Side RP** te permettra de découvrir l'histoire du serveur et le contexte dans lequel ton personnage évoluera.

> 📚 La lecture du Lore est indispensable avant de passer ta WL.

━━━━━━━━━━━━━━━━━━━━

**🎫・3. Ouvrir un ticket**

Une fois le règlement et le Lore lus, rends-toi dans le salon **Tickets** et ouvre un ticket en sélectionnant **Whitelist**.

Il te sera demandé :

> 👤 Nom & Prénom RP
> 📖 Histoire de ton personnage
> 🎮 Expérience RP
> 🎯 Objectifs de ton personnage
> 📚 Connaissance du règlement et du Lore

> ⚠️ Merci de répondre sérieusement et de fournir des réponses personnelles et cohérentes.

━━━━━━━━━━━━━━━━━━━━

**🎙️・4. Entretien Whitelist**

Après l'étude de ton dossier, un membre du staff pourra te contacter pour un **entretien vocal**.

L'entretien permettra de vérifier ta compréhension du **RP, du règlement et du Lore**.

━━━━━━━━━━━━━━━━━━━━

**✅・5. Validation**

**WL VALIDÉE :** 🎉
Tu seras ajouté à la Whitelist et tu pourras rejoindre East Side RP.

**WL À REVOIR :** 🔄
Le staff t'indiquera les points à corriger ou à améliorer avant une nouvelle tentative.

━━━━━━━━━━━━━━━━━━━━

**🌆・EAST SIDE RP**

Prépare ton personnage, écris ton histoire et construis ton propre avenir.

**Ici, ton histoire commence.** 🤝`
      )
      .setFooter({
        text: 'East Side RP • Système Whitelist'
      })
      .setTimestamp();

    await interaction.reply({
      embeds: [embed]
    });
  }
};