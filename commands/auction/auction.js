const { SlashCommandBuilder, PermissionsBitField, EmbedBuilder, MessageActionRow, ButtonBuilder, ButtonStyle, ActionRowBuilder } = require('discord.js');
const {pagination, ButtonTypes, ButtonStyles} = require('@devraelfreeze/discordjs-pagination');
const pointSchema = require('../../models/points');
const itemSchema = require('../../models/item');
const { auctionColor } = require('../../config.json');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('auction')
		.setDescription('Shows the current auction page'),
        async execute(interaction) {

        const items = await itemSchema.find({
            guildId: interaction.guild.id,
        });

        if (!items) {
            noItemsEmb = new EmbedBuilder()
                .setTitle('No items up for auction!')
                .setColor('#ff0000')
            interaction.reply({embeds: [noItemsEmb]});

        } else {
            const pages = [];
            for (let i = 0; i < items.length; i++) {
                const item = items[i];
                const seller = await interaction.guild.members.fetch(item.sellerId).catch(() => null);
                if (seller) {
                    var sellerAvatar = seller.user.displayAvatarURL({ dynamic: true });
                } else {
                    var sellerAvatar = 'https://cdn.discordapp.com/attachments/881268964838078976/881268995885717514/unknown.png';
                }
                const page = new EmbedBuilder()
                    .setTitle(`Item #${i + 1}` + ` - ` + `${item.itemName}`)
                    .setFields([
                        {
                            name: 'Item Name',
                            value: item.itemName,
                            inline: false,
                        },
                        {
                            name: 'Seller',
                            value: `<@${item.sellerId}>`,
                            inline: true,
                        },
                        {
                            name: 'Item Price',
                            value: item.itemPrice.toString() + '$',
                            inline: true,
                        },
                        {
                            name: 'Item Secret',
                            value: 'Purchase the item to reveal the secret!',
                            inline: false,
                        },
                    ])
                    .setColor(auctionColor)
                    .setTimestamp()
                    .setThumbnail(sellerAvatar)

                const buyButton = new ButtonBuilder()
                .setCustomId(`buy_${item.itemId}`) // Use a unique identifier for each item
                .setLabel('Buy')
                .setStyle(ButtonStyles.Success);

                // Create the action row containing the "Buy" button
                const actionRow = new ActionRowBuilder()
                .addComponents(buyButton);

                // Add the action row to the page
                page.addComponents(actionRow);

                pages.push(page);
            }

            await pagination({
                embeds: pages, /** Array of embeds objects */
                author: interaction.member.user,
                interaction: interaction,
                ephemeral: true,
                time: 60000, /** 40 seconds */
                fastSkip: false,
                pageTravel: false,
                buttons: [
                {
                    type: ButtonTypes.previous,
                    label: 'Previous Page',
                    style: ButtonStyles.Primary
                },
                {
                    type: ButtonTypes.next,
                    label: 'Next Page',
                    style: ButtonStyles.Success
                },
                //button to buy item that is a not a link
                {
                    type: ButtonTypes.
                ]
            });



              



        }
        
        
    }
};