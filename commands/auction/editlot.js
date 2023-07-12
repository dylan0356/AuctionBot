const { SlashCommandBuilder, PermissionsBitField } = require('discord.js');
const pointSchema = require('../../models/points');
const itemSchema = require('../../models/item');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('editlot')
		.setDescription('Edits the lot you have up for auction')
        .addIntegerOption(option => option.setName('price').setDescription('The price of the item').setRequired(true))
        .addStringOption(option => option.setName('secret').setDescription('The secret of the item').setRequired(true)),
        async execute(interaction) {

        itemSchema.findOne({
            guildId: interaction.guild.id,
            sellerId: interaction.user.id,

        }, async (err, result) => {
            if (err) throw err;
            if (!result) {
                interaction.reply('You do not have any items up for auction!');
            } else {
                itemSchema.findOneAndUpdate({
                    guildId: interaction.guild.id,
                    sellerId: interaction.user.id,
                }, {
                    itemPrice: interaction.options.getInteger('price'),
                    itemSecret: interaction.options.getString('secret'),
                }, async (err, result) => {
                    if (err) throw err;
                    await interaction.reply(`You have edited your lot for **${result.itemName}** to **${result.itemPrice}**$!`);
                });
            }
        }
        );    
    }
};