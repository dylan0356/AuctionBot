const { Events } = require('discord.js');
const chalk = require('chalk');
const mongoose = require('mongoose');
const mongoDBUrl = process.env.MONGODB_URL;


module.exports = {
	name: Events.ClientReady,
	once: true,
	async execute(client) {
		if (!mongoDBUrl) {
			console.log(chalk.redBright(`[!]`), `MongoDB URL not found!`);
			process.exit(1);
		}
		console.log(chalk.greenBright(`[!]`), `Connecting to MongoDB...`);
		console.log(chalk.greenBright(`[!]`), `MongoDB URL: ${mongoDBUrl}`);
		await mongoose.connect(mongoDBUrl, {
			useNewUrlParser: true,
			useUnifiedTopology: true,
		});

		if (mongoose.connection.readyState !== 1) {
			console.log(chalk.redBright(`[!]`), `MongoDB connection failed!`);
			process.exit(1);
		} else if (mongoose.connection.readyState === 1) {
			console.log(chalk.greenBright(`[!]`), `MongoDB connection successful!` + '\n');
		}



		client.startTime = Date.now();
		console.log(chalk.greenBright(`[!]`), `Logged in as ${client.user.tag}`);
		console.log(chalk.greenBright(`[!]`), `Loaded ${client.commands.size} commands`);
		console.log(chalk.greenBright(`[!]`), `Started at ${client.startTime}`);
		console.log(chalk.greenBright(`[!]`), `Loaded ${client.guilds.cache.size} guilds`);
		console.log(chalk.greenBright(`[!]`), `Ready!`);
	},
};