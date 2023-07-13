const { SlashCommandBuilder } = require('discord.js');
const pointSchema = require('../../models/points');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('money')
		.setDescription('Shows the money you have or someone else has')
        .addUserOption(option => option.setName('user').setDescription('The user to see their money').setRequired(false)),
	async execute(interaction) {

        const member = interaction.options.getMember('user');
        if (!member) {
            pointSchema.findOne({
                guildId: interaction.guild.id,
                userId: interaction.user.id,
            }, async (err, result) => {
                if (err) throw err;
                if (!result) {
                    const newDoc = new pointSchema({
                        guildId: interaction.guild.id,
                        userId: interaction.user.id,
                        points: 10,
                    });
                    await newDoc.save();
                    await interaction.reply({ content: `You have *10*$!`, ephemeral: true })
                } else {
                    await interaction.reply({ content: `You have *${result.points}*$!`, ephemeral: true });
                }
            });
        } else {
            pointSchema.findOne({
                guildId: interaction.guild.id,
                userId: member.id,
            }, async (err, result) => {
                if (err) throw err;
                if (!result) {
                    const newDoc = new pointSchema({
                        guildId: interaction.guild.id,
                        userId: member.id,
                        points: 10,
                    });
                    await newDoc.save();
                    await interaction.reply({ content: `${member.user.username} has *10*$!`, ephemeral: true })
                } else {
                    await interaction.reply({ content: `${member.user.username} has *${result.points}*$!`, ephemeral: true });
                }
            });
        }
            
    }
};