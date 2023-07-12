const { Client, Collection, GatewayIntentBits } = require('discord.js');
const dotenv = require('dotenv');
const fs = require('node:fs');
const path = require('node:path');
const chalk = require('chalk');

dotenv.config();

const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.GuildMembers] });

client.commands = new Collection();

const foldersPath = path.join(__dirname, 'commands');
const commandFolders = fs.readdirSync(foldersPath);

for (const folder of commandFolders) {
  const commandsPath = path.join(foldersPath, folder);
  
  // Check if the item is a directory
  const isDirectory = fs.statSync(commandsPath).isDirectory();
  if (!isDirectory) continue;
  
  const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
	for (const file of commandFiles) {
		const filePath = path.join(commandsPath, file);
		const command = require(filePath);
		if ('data' in command && 'execute' in command) {
			client.commands.set(command.data.name, command);
            //console log the command name and file path trimmed to the commands folder
            console.log(chalk.greenBright(`[+]`), `Loaded command ${command.data.name} from ${filePath.replace(foldersPath, '')}`);
		}
        else {
			console.log(chalk.redBright(`[WARNING]`), `The command at ${filePath} is missing a required "data" or "execute" property.`);
		}
	}
}
console.log('\n');

const eventsPath = path.join(__dirname, 'events');
const eventFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith('.js'));

for (const file of eventFiles) {
	const filePath = path.join(eventsPath, file);
	const event = require(filePath);
	if (event.once) {
		client.once(event.name, (...args) => event.execute(...args));
        console.log(chalk.greenBright(`[+]`), `Loaded once event ${event.name} from ${filePath.replace(eventsPath, '')}`);
	}
    else {
		client.on(event.name, (...args) => event.execute(...args));
        console.log(chalk.greenBright(`[+]`), `Loaded event ${event.name} from ${filePath.replace(eventsPath, '')}`);
	}
}
console.log('\n');

client.login(process.env.TOKEN);