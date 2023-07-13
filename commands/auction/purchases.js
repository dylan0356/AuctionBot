const { SlashCommandBuilder, PermissionsBitField, EmbedBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder } = require('discord.js');
const pointSchema = require('../../models/points');
const itemSchema = require('../../models/item');
const purchaseSchema = require('../../models/purchases');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('purchases')
		.setDescription('Shows the items you have purchased'),
        async execute(interaction) {

        const purchases = await purchaseSchema.find({
            guildId: interaction.guild.id,
            userId: interaction.user.id,

        });
            if (!purchases) {
                interaction.reply('You have not purchased any items!');
            } else {
                //do a page system for each item
                const pages = [];
                for (let i = 0; i < purchases.length; i++) {
                    const item = purchases[i];
                    const page = new EmbedBuilder()
                        .setTitle(`Purchases for ${interaction.user.username}`)
                        .addFields(
                            { name: 'Item Name', value: item.itemName },
                            { name: 'Item Price', value: item.itemPrice.toString()},
                            { name: 'Secret', value: item.itemSecret },
                        )
                        .setFooter({ text: `Page ${i + 1}/${purchases.length}` });
                    pages.push(page);

                }

                const row = new ActionRowBuilder()
                    .addComponents(
                        new ButtonBuilder()
                            .setCustomId('previous')
                            .setLabel('Previous')
                            .setStyle(ButtonStyle.Secondary),
                        new ButtonBuilder()
                            .setCustomId('next')
                            .setLabel('Next')
                            .setStyle(ButtonStyle.Primary),
                    );

                const msg = await interaction.reply({ embeds: [pages[0]], components: [row], ephemeral: true });

                const filter = i => i.user.id === interaction.user.id;
                const collector = msg.createMessageComponentCollector({ filter, time: 60000 });

                let currentIndex = 0;
                collector.on('collect', async i => {
                    if (i.customId === 'previous') {
                        if (currentIndex === 0) {
                            currentIndex = pages.length - 1;
                        } else {
                            currentIndex--;
                        }
                        await i.update({ embeds: [pages[currentIndex]], components: [row], ephemeral: true});
                    } else if (i.customId === 'next') {
                        if (currentIndex === pages.length - 1) {
                            currentIndex = 0;
                        } else {
                            currentIndex++;
                        }
                        await i.update({ embeds: [pages[currentIndex]], components: [row], ephemeral: true });
                    }
                }

                );
            }
        }
        
    
};