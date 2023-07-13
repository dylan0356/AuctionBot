const { SlashCommandBuilder, PermissionsBitField } = require('discord.js');
const bansSchema = require('../../models/bans');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('auctionban')
		.setDescription('Bans a user from posting auctions')
        .addUserOption(option => option.setName('user').setDescription('The user to ban').setRequired(true))
        .addStringOption(option => option.setName('reason').setDescription('The reason for the ban').setRequired(false)),
    userPermissions: new PermissionsBitField(['BanMembers']),
        async execute(interaction) {
        const member = interaction.options.getMember('user');
		
        bansSchema.findOneAndUpdate({
            guildId: interaction.guild.id,
            userId: member.id,
        }, {
            reason: interaction.options.getString('reason'),
        }, async (err, result) => {
            if (err) throw err;
            if (!result) {
                const newBan = new bansSchema({
                    guildId: interaction.guild.id,
                    userId: member.id,
                    reason: interaction.options.getString('reason'),
                });
                await newBan.save();
                await interaction.reply(`${member} has been banned from posting auctions!`);
            } else {
                await interaction.reply(`${member} has already been banned from posting auctions!`);
            }
        }
        );
            
    }
};