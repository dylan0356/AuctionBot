const { SlashCommandBuilder, PermissionsBitField } = require('discord.js');
const pointSchema = require('../../models/points');
const itemSchema = require('../../models/item');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('deletelot')
		.setDescription('Deletes the lot you have up for auction or the lot of another user (Admin only)') 
        .addUserOption(option => option.setName('user').setDescription('The user to delete the lot of').setRequired(false)),
        async execute(interaction) {

        const member = interaction.options.getMember('user');

        if (member) {
            if (interaction.member.permissions.has('ADMINISTRATOR')) {
                itemSchema.findOneAndDelete({
                    guildId: interaction.guild.id,
                    sellerId: member.id,
                }, async (err, result) => {
                    if (err) throw err;
                    if (!result) {
                        interaction.reply('That user does not have any items up for auction!');
                    } else {
                        await interaction.reply(`You have deleted the lot for **${result.itemName}**!`);
                    }
                });
            } else {
                interaction.reply('You do not have permission to delete the lot of another user!');
            }
        } else {
            itemSchema.findOneAndDelete({
                guildId: interaction.guild.id,
                sellerId: interaction.user.id,
            }, async (err, result) => {
                if (err) throw err;
                if (!result) {
                    interaction.reply('You do not have any items up for auction!');
                } else {
                    await interaction.reply(`You have deleted the lot for **${result.itemName}**!`);
                }
            });
        }
    }
};