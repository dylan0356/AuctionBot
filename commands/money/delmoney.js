const { SlashCommandBuilder, PermissionsBitField } = require('discord.js');
const pointSchema = require('../../models/points');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('delmoney')
		.setDescription('Removes money from a user')
        .addUserOption(option => option.setName('user').setDescription('The user to remove money from').setRequired(true))
        .addIntegerOption(option => option.setName('amount').setDescription('The amount of money to remove').setRequired(true)),
    userPermissions: new PermissionsBitField(['ManageGuild']),
        
	async execute(interaction) {
        const member = interaction.options.getMember('user');
		
        pointSchema.findOneAndUpdate({
            guildId: interaction.guild.id,
            userId: member.id,
        }, {
            $inc: {
                points: -interaction.options.getInteger('amount'),
            },
        }, async (err, result) => {
            if (err) throw err;
            if (!result) {
                interaction.reply('That user is not in the database!')
            } else {
                await interaction.reply(`${member} now has *${result.points - interaction.options.getInteger('amount')}*$!`);
            }
        });
            
    }
};