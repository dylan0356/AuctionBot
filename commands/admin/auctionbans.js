const { SlashCommandBuilder, PermissionsBitField, EmbedBuilder } = require('discord.js');
const bansSchema = require('../../models/bans');
const { auctionColor } = require('../../config.json');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('auctionbans')
		.setDescription('Shows a list of users banned from posting auctions'),
    userPermissions: new PermissionsBitField(['BanMembers']),
        async execute(interaction) {
        const member = interaction.options.getMember('user');
		
        bansSchema.find({
            guildId: interaction.guild.id,
        }, async (err, result) => {
            if (err) throw err;
            if (!result) {
                await interaction.reply(`There are no users banned from posting auctions!`);
            } else {
                embed = new EmbedBuilder()
                .setTitle('Auction Bans')
                .setDescription('A list of users banned from posting auctions')
                .setColor(auctionColor)
                .setTimestamp();
                for (let i = 0; i < result.length; i++) {
                    currUser = await interaction.guild.members.fetch(result[i].userId);
                    embed.addFields( { name: `${i + 1}. ${currUser.user.tag} - ${currUser} `, value: `Reason: ${result[i].reason}` } );
                }

                await interaction.reply({ embeds: [embed] });

            }
        });
    }
};