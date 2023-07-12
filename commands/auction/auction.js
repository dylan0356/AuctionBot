const { SlashCommandBuilder, PermissionsBitField, EmbedBuilder, MessageActionRow, ButtonBuilder, ButtonStyle, ActionRowBuilder } = require('discord.js');
const pointSchema = require('../../models/points');
const itemSchema = require('../../models/item');
const { auctionColor, auctionLog } = require('../../config.json');

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
                pages.push(page);
            }

            
            //now make a page system that has a different page for each element in the pages array
            const row = new ActionRowBuilder()
                .addComponents(
                    new ButtonBuilder()
                        .setCustomId('previous')
                        .setLabel('Previous')
                        .setStyle('PRIMARY'),
                    new ButtonBuilder()
                        .setCustomId('buy')
                        .setLabel('Buy')
                        .setStyle('PRIMARY'),
                    new ButtonBuilder()
                        .setCustomId('next')
                        .setLabel('Next')
                        .setStyle('PRIMARY'),
                );
            const msg = await interaction.reply({ embeds: [pages[0]], components: [row] });
            const collector = msg.createMessageComponentCollector({ componentType: 'BUTTON', time: 60000 });

            let currentPage = 0;
            collector.on('collect', async i => {
                //if button is previous, go to previous page
                if (i.customId === 'previous') {
                    if (currentPage !== 0) {
                        currentPage -= 1;
                        i.update({ embeds: [pages[currentPage]], components: [row] });
                    } else {
                        i.update({ embeds: [pages[currentPage]], components: [row] });
                    }
                }
                //if button is next, go to next page
                if (i.customId === 'next') {
                    if (currentPage < pages.length - 1) {
                        currentPage += 1;
                        i.update({ embeds: [pages[currentPage]], components: [row] });
                    } else {
                        i.update({ embeds: [pages[currentPage]], components: [row] });
                    }
                }
                //if button is buy, buy the item
                if (i.customId === 'buy') {
                    //if the user is the seller, don't let them buy the item
                    if (i.user.id === items[currentPage].sellerId) {
                        //reply with an error message
                        const errorEmb = new EmbedBuilder()
                            .setTitle('Error')
                            .setDescription('You cannot buy your own item!')
                            .setColor('#ff0000')
                        i.update({ embeds: [errorEmb], components: [row] });
                    } else {
                        //check if the user has enough money to buy the item
                        const buyer = await pointSchema.findOne({
                            userId: i.user.id,
                            guildId: interaction.guild.id,
                        });
                        if (buyer.points < items[currentPage].itemPrice) {
                            const errorEmb = new EmbedBuilder()
                                .setTitle('Error')
                                .setDescription('You do not have enough money to buy this item!')
                                .setColor('#ff0000')
                            i.update({ embeds: [errorEmb], components: [row] });
                        } else {
                            //if they do, subtract the money from the buyer and add it to the seller
                            const seller = await pointSchema.findOne({
                                userId: items[currentPage].sellerId,
                                guildId: interaction.guild.id,
                            });
                            buyer.points -= items[currentPage].itemPrice;
                            seller.points += items[currentPage].itemPrice;
                            await buyer.save();
                            await seller.save();
                            //reply with a success message
                            const successEmb = new EmbedBuilder()
                                .setTitle('Success!')
                                .setDescription(`You have bought ${items[currentPage].itemName} for ${items[currentPage].itemPrice}$!`)
                                .setColor('#00ff00')
                            i.update({ embeds: [successEmb], components: [row] });

                            //send the item info with the secret revealed to the buyer
                            const buyerEmb = new EmbedBuilder()
                                .setTitle(`Item #${currentPage + 1}` + ` - ` + `${items[currentPage].itemName}`)
                                .setFields([
                                    {
                                        name: 'Item Name',
                                        value: items[currentPage].itemName,
                                        inline: false,
                                    },
                                    {
                                        name: 'Seller',
                                        value: `<@${items[currentPage].sellerId}>`,
                                        inline: true,
                                    },
                                    {
                                        name: 'Item Price',
                                        value: items[currentPage].itemPrice.toString() + '$',
                                        inline: true,
                                    },
                                    {
                                        name: 'Item Secret',
                                        value: items[currentPage].itemSecret,
                                        inline: false,
                                    },
                                ])
                                .setColor(auctionColor)
                                .setTimestamp()
                                .setThumbnail(sellerAvatar)
                            const buyerChannel = await i.user.createDM();
                            buyerChannel.send({ embeds: [buyerEmb] });
                            //delete the item from the database
                            await itemSchema.deleteOne({
                                guildId: interaction.guild.id,
                                itemName: items[currentPage].itemName,
                            });
                            //log the purchase
                            const logEmb = new EmbedBuilder()
                                .setTitle('Item Purchased')
                                .setDescription(`Item: ${items[currentPage].itemName}\nBuyer: <@${i.user.id}>\nSeller: <@${items[currentPage].sellerId}>`)
                                .setColor(auctionLog)
                                .setTimestamp()
                            //find log channel by logChannel as id
                            const logChannel = await interaction.guild.channels.fetch(interaction.guild.settings.get('logChannel'));
                            logChannel.send({ embeds: [logEmb] });
                        }
                    }
                }   
            })
        }
    }
}
