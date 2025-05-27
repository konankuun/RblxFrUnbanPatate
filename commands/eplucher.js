const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const fs = require('fs');
const path = require('path');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('eplucher')
        .setDescription('Commence à éplucher une patate'),
    
    async execute(interaction) {
        const configPath = path.join(__dirname, '..', 'config', 'config.json');
        const wordsPath = path.join(__dirname, '..', 'config', 'words.json');
        const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
        const words = JSON.parse(fs.readFileSync(wordsPath, 'utf8'));
        const userId = interaction.user.id;

        // Initialiser l'utilisateur s'il n'existe pas
        if (!config.users[userId]) {
            config.users[userId] = {
                robux: 0,
                eplucheur: 'niveau1',
                patate_actuelle: 'patate',
                patates_epluchees: 0
            };
            fs.writeFileSync(configPath, JSON.stringify(config, null, 4));
        }

        const userData = config.users[userId];
        const patateInfo = config.patates.niveaux[userData.patate_actuelle];
        const eplucheurInfo = config.patates.eplucheurs[userData.eplucheur];
        
        // Créer une copie de la liste des mots pour éviter les répétitions
        let motsDisponibles = [...words[userData.patate_actuelle].mots];
        let motsUtilises = [];

        // Vérifier si c'est une patate d'or (10% de chance)
        const isGolden = Math.random() < 0.1;
        const bonusOr = isGolden ? 20 : 0;
        const gainTotal = patateInfo.robux + bonusOr;

        // Fonction pour obtenir un mot aléatoire non utilisé
        function obtenirMotAleatoire() {
            if (motsDisponibles.length === 0) {
                // Si tous les mots ont été utilisés, réinitialiser la liste
                motsDisponibles = [...words[userData.patate_actuelle].mots];
                motsUtilises = [];
            }
            
            const indexAleatoire = Math.floor(Math.random() * motsDisponibles.length);
            const mot = motsDisponibles[indexAleatoire];
            
            // Retirer le mot de la liste des mots disponibles
            motsDisponibles.splice(indexAleatoire, 1);
            motsUtilises.push(mot);
            
            return mot;
        }

        // Fonction pour rendre le mot difficile à copier
        function rendreMotNonCopiable(mot) {
            return mot.split('').join('\u200B'); // Utilise un caractère de largeur nulle (zero-width space)
        }

        // Sélectionner le premier mot
        let motActuel = obtenirMotAleatoire();
        let motsValides = 0;
        let messageEmbed = null;

        const embed = new EmbedBuilder()
            .setColor(isGolden ? '#FFD700' : '#8B4513')
            .setTitle(`🥔 Épluchage de ${patateInfo.nom}${isGolden ? ' 🏆' : ''}`)
            .setDescription(`Tapez le mot suivant :\n**${rendreMotNonCopiable(motActuel)}**`)
            .addFields(
                { name: '📝 Progression', value: `${motsValides}/${eplucheurInfo.mots_requis} mots` },
                { name: '⏱️ Temps', value: '7 secondes par mot' },
                { name: '💰 Récompense', value: `${gainTotal} Robux${isGolden ? ' (Patate d\'or ! +20 Robux)' : ''}` }
            )
            .setFooter({ text: `Éplucheur actuel : ${eplucheurInfo.nom}` });

        // Utiliser la nouvelle méthode recommandée
        const reply = await interaction.reply({ embeds: [embed] });
        messageEmbed = reply;

        // Créer un filtre pour les messages de l'utilisateur
        const filter = m => m.author.id === userId;
        const collector = interaction.channel.createMessageCollector({ 
            filter, 
            time: 300000, // 5 minutes au total
            max: eplucheurInfo.mots_requis 
        });

        let tempsRestant = 7000; // 7 secondes en millisecondes
        let timer = null;

        collector.on('collect', async message => {
            // Supprimer le message de l'utilisateur
            await message.delete().catch(console.error);

            const motTape = message.content.trim();
            
            if (motTape.toLowerCase() === motActuel.toLowerCase()) {
                motsValides++;
                clearTimeout(timer);

                // Vérifier si on a atteint le nombre de mots requis
                if (motsValides >= eplucheurInfo.mots_requis) {
                    // Mettre à jour les Robux de l'utilisateur
                    userData.robux += gainTotal;

                    // Mettre à jour les statistiques
                    userData.stats_patates[userData.patate_actuelle]++;
                    userData.patates_epluchees++;

                    // Vérifier le déblocage de nouvelles patates
                    let nouvellePatate = null;
                    const patatesArray = Object.entries(config.patates.niveaux).sort((a, b) => a[1].seuil_deblocage - b[1].seuil_deblocage);
                    
                    // Vérifier si le joueur a atteint exactement un seuil de déblocage
                    for (const [type, info] of patatesArray) {
                        if (userData.patates_epluchees === info.seuil_deblocage) {
                            nouvellePatate = type;
                            break;
                        }
                    }

                    // Si une nouvelle patate est débloquée, envoyer une notification
                    if (nouvellePatate) {
                        const embedPalier = new EmbedBuilder()
                            .setColor('#FFD700')
                            .setTitle('🎉 Nouveau palier débloqué !')
                            .setDescription(`Félicitations ! Vous avez débloqué la **${config.patates.niveaux[nouvellePatate].nom}** !\nUtilisez la commande \`/next\` pour passer à ce niveau.`)
                            .addFields(
                                { name: '🥔 Patates épluchées', value: `${userData.patates_epluchees} patates au total`, inline: true },
                                { name: '💰 Récompense', value: `${config.patates.niveaux[nouvellePatate].robux} Robux par patate`, inline: true }
                            )
                            .setFooter({ text: 'Continuez à éplucher pour débloquer plus de patates !' });

                        await interaction.followUp({ embeds: [embedPalier] });
                    }

                    fs.writeFileSync(configPath, JSON.stringify(config, null, 4));

                    const embedSucces = new EmbedBuilder()
                        .setColor(isGolden ? '#FFD700' : '#00FF00')
                        .setTitle('🎉 Patate épluchée avec succès !')
                        .setDescription(`Vous avez gagné **${gainTotal}** Robux !${isGolden ? '\n\n✨ **PATATE D\'OR !** +20 Robux bonus' : ''}`)
                        .addFields(
                            { name: '💰 Nouveau solde', value: `${userData.robux} Robux` },
                            { name: '📊 Détail des gains', value: `• Gain de base : ${patateInfo.robux} Robux\n${isGolden ? '• Bonus patate d\'or : +20 Robux' : ''}` },
                            { name: '🥔 Patates épluchées', value: `${userData.patates_epluchees} patates au total` }
                        )
                        .setFooter({ text: 'Continuez à éplucher pour gagner plus de Robux !' });

                    await interaction.followUp({ embeds: [embedSucces] });
                    collector.stop('succes');
                    return;
                }

                // Sélectionner un nouveau mot non utilisé
                motActuel = obtenirMotAleatoire();
                
                // Mettre à jour l'embed
                const embedUpdate = new EmbedBuilder()
                    .setColor(isGolden ? '#FFD700' : '#8B4513')
                    .setTitle(`🥔 Épluchage de ${patateInfo.nom}${isGolden ? ' 🏆' : ''}`)
                    .setDescription(`Tapez le mot suivant :\n**${rendreMotNonCopiable(motActuel)}**`)
                    .addFields(
                        { name: '📝 Progression', value: `${motsValides}/${eplucheurInfo.mots_requis} mots` },
                        { name: '⏱️ Temps', value: '7 secondes par mot' },
                        { name: '💰 Récompense', value: `${gainTotal} Robux${isGolden ? ' (Patate d\'or ! +20 Robux)' : ''}` }
                    )
                    .setFooter({ text: `Éplucheur actuel : ${eplucheurInfo.nom}` });

                await messageEmbed.edit({ embeds: [embedUpdate] });

                // Réinitialiser le timer
                tempsRestant = 7000;
                timer = setTimeout(() => {
                    const embedTimeout = new EmbedBuilder()
                        .setColor('#FF0000')
                        .setTitle('❌ Temps écoulé !')
                        .setDescription(`Le mot était : **${rendreMotNonCopiable(motActuel)}**`);
                    messageEmbed.edit({ embeds: [embedTimeout] });
                    collector.stop('timeout');
                }, tempsRestant);

            } else {
                const embedError = new EmbedBuilder()
                    .setColor('#FF0000')
                    .setTitle('❌ Mot incorrect !')
                    .setDescription(`Le mot était : **${rendreMotNonCopiable(motActuel)}**`);
                await messageEmbed.edit({ embeds: [embedError] });
                collector.stop('error');
            }
        });

        collector.on('end', async (collected, reason) => {
            clearTimeout(timer);

            if (reason === 'timeout' || reason === 'error') {
                const embedEchec = new EmbedBuilder()
                    .setColor('#FF0000')
                    .setTitle('❌ Épluchage échoué')
                    .setDescription('Vous n\'avez pas réussi à éplucher la patate !');

                await interaction.followUp({ embeds: [embedEchec] });
            }
        });

        // Démarrer le premier timer
        timer = setTimeout(() => {
            const embedTimeout = new EmbedBuilder()
                .setColor('#FF0000')
                .setTitle('❌ Temps écoulé !')
                .setDescription(`Le mot était : **${rendreMotNonCopiable(motActuel)}**`);
            messageEmbed.edit({ embeds: [embedTimeout] });
            collector.stop('timeout');
        }, tempsRestant);
    },
};

// Fonction pour compter les syllabes (version simplifiée)
function compterSyllabes(mot) {
    const voyelles = 'aeiouyéèêëïîôöûüù';
    let syllabes = 0;
    let estVoyelle = false;

    for (let i = 0; i < mot.length; i++) {
        const estVoyelleActuelle = voyelles.includes(mot[i].toLowerCase());
        if (estVoyelleActuelle && !estVoyelle) {
            syllabes++;
        }
        estVoyelle = estVoyelleActuelle;
    }

    return syllabes;
}
