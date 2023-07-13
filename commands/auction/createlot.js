const { SlashCommandBuilder, PermissionsBitField } = require('discord.js');
const pointSchema = require('../../models/points');
const itemSchema = require('../../models/item');
const bans = require('../../models/bans');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('createlot')
		.setDescription('Creates a lot for an item')
        .addStringOption(option => option.setName('item').setDescription('The item to create a lot for').setRequired(true))
        .addIntegerOption(option => option.setName('price').setDescription('The price of the item').setRequired(true))
        .addStringOption(option => option.setName('secret').setDescription('The secret of the item').setRequired(true)),
        async execute(interaction) {

        const item = interaction.options.getString('item');
        const price = interaction.options.getInteger('price');
        const secret = interaction.options.getString('secret');

        bans.findOne({
            guildId: interaction.guild.id,
            userId: interaction.user.id,
        }, async (err, result) => {
            if (err) throw err;
            if (result) {
                interaction.reply('You are banned from posting auctions!');
                
            } else {
        
        itemSchema.findOne({
            guildId: interaction.guild.id,
            sellerId: interaction.user.id,

        }, async (err, result) => {
            if (err) throw err;
            if (result) {
                interaction.reply('You already have an item up for auction!');
            } else {
                const newItem = new itemSchema({
                    guildId: interaction.guild.id,
                    sellerId: interaction.user.id,
                    itemName: item,
                    itemPrice: price,
                    itemSecret: secret,
                });
                await newItem.save();
                await interaction.reply(`You have created a lot for **${item}** for **${price}**$!`);
            }
        });

            }
        });

    }
};
