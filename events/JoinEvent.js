const { Events, EmbedBuilder } = require('discord.js');
const pointSchema = require('../models/points');


module.exports = {
	name: Events.GuildMemberAdd,
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
            }
        });

    }
};