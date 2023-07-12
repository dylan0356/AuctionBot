const { SlashCommandBuilder, PermissionsBitField } = require('discord.js');
const pointSchema = require('../../models/points');
const itemSchema = require('../../models/item');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('listlots')
		.setDescription('Shows the items you have up for auction'),
        async execute(interaction) {

        itemSchema.findOne({
            guildId: interaction.guild.id,
            sellerId: interaction.user.id,

        }, async (err, result) => {
            if (err) throw err;
            if (!result) {
                interaction.reply('You do not have any items up for auction!');
            } else {
                await interaction.reply(`You have **${result.itemName}** up for auction for **${result.itemPrice}**$!`);
            }
        }
        );    
    }
};