const { SlashCommandBuilder, PermissionsBitField } = require('discord.js');
const bansSchema = require('../../models/bans');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('auctionunban')
		.setDescription('Unbans a user from posting auctions')
        .addUserOption(option => option.setName('user').setDescription('The user to ban').setRequired(true)),
    userPermissions: new PermissionsBitField(['BanMembers']),
        async execute(interaction) {
        const member = interaction.options.getMember('user');
		
        bansSchema.findOneAndDelete({
            guildId: interaction.guild.id,
            userId: member.id,
        }, async (err, result) => {
            if (err) throw err;
            if (!result) {
                await interaction.reply(`${member} has not been banned from posting auctions!`);
            } else {
                await interaction.reply(`${member} has been unbanned from posting auctions!`);
            }
        }
        );
            
    }
};