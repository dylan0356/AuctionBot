const { SlashCommandBuilder } = require('discord.js');
const pointSchema = require('../../models/points');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('dbtest')
		.setDescription('Tests the database connection'),
	async execute(interaction) {
		
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
                await interaction.reply(`You now have 10 !!!points!`);
            } else {
                await interaction.reply(`You now have ${result.points} points!`);
            }
        });
            
    }
};