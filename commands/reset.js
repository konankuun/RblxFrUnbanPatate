const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require('discord.js');
const fs = require('fs');
const path = require('path');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('reset')
        .setDescription('Réinitialise les données d\'un joueur')
        .addUserOption(option =>
            option.setName('joueur')
                .setDescription('Le joueur à réinitialiser')
                .setRequired(true))
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

    async execute(interaction) {
        // Vérifier si l'utilisateur a les permissions d'administrateur
        if (!interaction.member.permissions.has(PermissionFlagsBits.Administrator)) {
            return interaction.reply({
                content: '❌ Vous n\'avez pas la permission d\'utiliser cette commande.',
                ephemeral: true
            });
        }

        const targetUser = interaction.options.getUser('joueur');
        const configPath = path.join(__dirname, '..', 'config', 'config.json');
        const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));

        // Vérifier si le joueur existe dans la configuration
        if (!config.users[targetUser.id]) {
            return interaction.reply({
                content: `❌ Le joueur ${targetUser.username} n'a pas encore de données à réinitialiser.`,
                ephemeral: true
            });
        }

        // Sauvegarder les anciennes données pour l'affichage
        const anciennesDonnees = { ...config.users[targetUser.id] };

        // Réinitialiser complètement les données du joueur
        config.users[targetUser.id] = {
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

        // Sauvegarder les modifications
        fs.writeFileSync(configPath, JSON.stringify(config, null, 4));

        // Créer l'embed de confirmation
        const embed = new EmbedBuilder()
            .setColor('#FF0000')
            .setTitle('🔄 Réinitialisation des données')
            .setDescription(`Les données de ${targetUser.username} ont été réinitialisées.`)
            .addFields(
                { name: '💰 Ancien solde', value: `${anciennesDonnees.robux} Robux`, inline: true },
                { name: '💰 Nouveau solde', value: '0 Robux', inline: true },
                { name: '🥔 Ancien type de patate', value: config.patates.niveaux[anciennesDonnees.patate_actuelle].nom, inline: true },
                { name: '🥔 Nouveau type de patate', value: 'Patate', inline: true },
                { name: '🔧 Ancien éplucheur', value: config.patates.eplucheurs[anciennesDonnees.eplucheur].nom, inline: true },
                { name: '🔧 Nouvel éplucheur', value: 'Éplucheur Basique', inline: true },
                { name: '📊 Statistiques', value: 
                    `• Patates épluchées : ${anciennesDonnees.patates_epluchees} → 0\n` +
                    `• Toutes les statistiques ont été réinitialisées`
                }
            )
            .setFooter({ text: `Réinitialisé par ${interaction.user.username}` });

        await interaction.reply({ embeds: [embed] });
    },
}; 