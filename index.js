require('dotenv').config();
const fs = require('fs');
const path = require('path');
const { Client, GatewayIntentBits, Collection } = require('discord.js');

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildVoiceStates,
  ],
});

// Collection des commandes
client.commands = new Collection();

// 1. Chargement dynamique des commandes
const commandsPath = path.join(__dirname, 'src', 'commands');
if (fs.existsSync(commandsPath)) {
  const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
  for (const file of commandFiles) {
    const command = require(path.join(commandsPath, file));
    if (command.data && command.execute) {
      client.commands.set(command.data.name, command);
    }
  }
}

// 2. Événement de démarrage
client.once('clientReady', (c) => {
  console.log(`\n🤖 Bot East Side connecté sous : ${c.user.tag}`);
  console.log('📌 Prêt à gérer les salons vocaux et le système de tickets !\n');
});

// 3. Délégation des événements vers leurs fichiers respectifs
const voiceEvent = require('./src/events/voiceStateUpdate');
const interactionEvent = require('./src/events/interactionCreate');

client.on(voiceEvent.name, (...args) => voiceEvent.execute(...args));
client.on(interactionEvent.name, (...args) => interactionEvent.execute(...args));

client.login(process.env.DISCORD_TOKEN);