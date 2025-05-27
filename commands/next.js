const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const fs = require('fs');
const path = require('path');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('next')
        .setDescription('Passe au niveau de patate supérieur si disponible'),
    
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
        const patates = config.patates.niveaux;
        const patatesArray = Object.entries(patates).sort((a, b) => a[1].seuil_deblocage - b[1].seuil_deblocage);
        
        // Trouver la prochaine patate disponible
        let prochainePatate = null;
        for (const [type, info] of patatesArray) {
            if (userData.patates_epluchees >= info.seuil_deblocage && type !== userData.patate_actuelle) {
                prochainePatate = { type, info };
                break;
            }
        }

        // Si aucune patate n'est disponible
        if (!prochainePatate) {
            // Vérifier si toutes les patates sont débloquées
            const toutesDebloquees = patatesArray.every(([type, info]) => userData.patates_epluchees >= info.seuil_deblocage);
            
            if (toutesDebloquees) {
                const embed = new EmbedBuilder()
                    .setColor('#FFD700')
                    .setTitle('🎉 Toutes les patates sont débloquées !')
                    .setDescription('Vous avez débloqué toutes les patates disponibles !')
                    .addFields(
                        { name: '🥔 Patates épluchées', value: `${userData.patates_epluchees} patates au total` }
                    );

                return interaction.reply({ embeds: [embed] });
            }

            // Trouver la prochaine patate à débloquer
            let prochainePatateADebloquer = null;
            for (const [type, info] of patatesArray) {
                if (userData.patates_epluchees < info.seuil_deblocage) {
                    prochainePatateADebloquer = { type, info };
                    break;
                }
            }

            const patatesPourDebloquer = prochainePatateADebloquer.info.seuil_deblocage - userData.patates_epluchees;
            const embed = new EmbedBuilder()
                .setColor('#FF0000')
                .setTitle('❌ Patate non disponible')
                .setDescription(`Vous devez éplucher encore **${patatesPourDebloquer}** patates pour débloquer la **${prochainePatateADebloquer.info.nom}** !`)
                .addFields(
                    { name: '🥔 Patates épluchées', value: `${userData.patates_epluchees}/${prochainePatateADebloquer.info.seuil_deblocage}`, inline: true },
                    { name: '💰 Récompense', value: `${prochainePatateADebloquer.info.robux} Robux par patate`, inline: true }
                );

            return interaction.reply({ embeds: [embed] });
        }

        // Mettre à jour la patate actuelle
        userData.patate_actuelle = prochainePatate.type;
        fs.writeFileSync(configPath, JSON.stringify(config, null, 4));

        const embed = new EmbedBuilder()
            .setColor('#00FF00')
            .setTitle('🥔 Niveau de patate augmenté !')
            .setDescription(`Vous passez maintenant à la **${prochainePatate.info.nom}** !`)
            .addFields(
                { name: '💰 Récompense', value: `${prochainePatate.info.robux} Robux par patate`, inline: true },
                { name: '🥔 Patates épluchées', value: `${userData.patates_epluchees} patates au total`, inline: true }
            )
            .setFooter({ text: 'Continuez à éplucher pour gagner plus de Robux !' });

        await interaction.reply({ embeds: [embed] });
    },
}; 