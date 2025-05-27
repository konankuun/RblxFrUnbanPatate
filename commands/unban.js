const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const fs = require('fs');
const path = require('path');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('unban')
        .setDescription('Demande un déban si vous avez assez de Robux'),
    
    async execute(interaction) {
        const configPath = path.join(__dirname, '..', 'config', 'config.json');
        const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
        const userId = interaction.user.id;

        // Vérifier si l'utilisateur existe
        if (!config.users[userId]) {
            return interaction.reply({
                content: '❌ Vous n\'avez pas encore commencé à jouer ! Utilisez `/eplucher` pour commencer.',
                ephemeral: true
            });
        }

        const userData = config.users[userId];

        // Vérifier si l'utilisateur a assez de Robux
        if (userData.robux < 1000) {
            const embed = new EmbedBuilder()
                .setColor('#FF0000')
                .setTitle('❌ Robux insuffisants')
                .setDescription(`Il vous faut au moins **1000 Robux** pour demander un déban.\nVous avez actuellement **${userData.robux} Robux**.`)
                .addFields(
                    { name: '🥔 Patates épluchées', value: `${userData.patates_epluchees} patates au total`, inline: true },
                    { name: '💰 Robux manquants', value: `${1000 - userData.robux} Robux`, inline: true }
                )
                .setFooter({ text: 'Continuez à éplucher des patates pour gagner plus de Robux !' });

            return interaction.reply({ embeds: [embed], ephemeral: true });
        }

        // Envoyer la notification de déban
        const embedUnban = new EmbedBuilder()
            .setColor('#00FF00')
            .setTitle('🎉 Demande de déban')
            .setDescription(`<@&1377017827311226910> Le joueur ${interaction.user} vient de réussir le jeu de la patate, un déban est demandé ici !`)
            .addFields(
                { name: '💰 Robux gagnés', value: `${userData.robux} Robux`, inline: true },
                { name: '🥔 Patates épluchées', value: `${userData.patates_epluchees} patates au total`, inline: true }
            )
            .setTimestamp();

        await interaction.reply({ embeds: [embedUnban] });
    },
}; 