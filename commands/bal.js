const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const fs = require('fs');
const path = require('path');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('bal')
        .setDescription('Affiche votre solde de Robux'),
    
    async execute(interaction) {
        const configPath = path.join(__dirname, '..', 'config', 'config.json');
        const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
        const userId = interaction.user.id;

        // Initialiser l'utilisateur s'il n'existe pas
        if (!config.users[userId]) {
            config.users[userId] = {
                robux: 0,
                eplucheur: 'niveau1',
                patate_actuelle: 'patate',
                patates_epluchees: 0,
                stats_patates: {
                    patate: 0,
                    patate_blanche: 0,
                    patate_douce: 0,
                    patate_rouge: 0
                }
            };
            fs.writeFileSync(configPath, JSON.stringify(config, null, 4));
        }

        const userData = config.users[userId];
        const patateInfo = config.patates.niveaux[userData.patate_actuelle];
        const eplucheurInfo = config.patates.eplucheurs[userData.eplucheur];

        // Initialiser les stats si elles n'existent pas
        if (!userData.stats_patates) {
            userData.stats_patates = {
                patate: 0,
                patate_blanche: 0,
                patate_douce: 0,
                patate_rouge: 0
            };
            fs.writeFileSync(configPath, JSON.stringify(config, null, 4));
        }

        const embed = new EmbedBuilder()
            .setColor('#FFD700')
            .setTitle(`💰 Solde de ${interaction.user.username}`)
            .addFields(
                { name: '💰 Robux', value: `${userData.robux} Robux`, inline: true },
                { name: '🥔 Patate actuelle', value: patateInfo.nom, inline: true },
                { name: '🔧 Éplucheur', value: eplucheurInfo.nom, inline: true },
                { name: '📊 Statistiques des patates', value: 
                    `Total épluchées : **${userData.patates_epluchees}**\n` +
                    `• Patates : **${userData.stats_patates.patate}**\n` +
                    `• Patates Blanches : **${userData.stats_patates.patate_blanche}**\n` +
                    `• Patates Douces : **${userData.stats_patates.patate_douce}**\n` +
                    `• Patates Rouges : **${userData.stats_patates.patate_rouge}**`
                }
            )
            .setFooter({ text: 'Continuez à éplucher pour gagner plus de Robux !' });

        await interaction.reply({ embeds: [embed] });
    },
}; 