const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require('discord.js');
const fs = require('fs');
const path = require('path');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('add')
        .setDescription('Ajoute des Robux à un joueur')
        .addUserOption(option =>
            option.setName('joueur')
                .setDescription('Le joueur à qui ajouter des Robux')
                .setRequired(true))
        .addIntegerOption(option =>
            option.setName('montant')
                .setDescription('Le nombre de Robux à ajouter')
                .setRequired(true)
                .setMinValue(1))
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
        const montant = interaction.options.getInteger('montant');
        const configPath = path.join(__dirname, '..', 'config', 'config.json');
        const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));

        // Initialiser l'utilisateur s'il n'existe pas
        if (!config.users[targetUser.id]) {
            config.users[targetUser.id] = {
                robux: 0,
                eplucheur: 'niveau1',
                patate_actuelle: 'patate',
                patates_epluchees: 0
            };
        }

        // Sauvegarder l'ancien solde
        const ancienSolde = config.users[targetUser.id].robux;

        // Ajouter les Robux
        config.users[targetUser.id].robux += montant;

        // Sauvegarder les modifications
        fs.writeFileSync(configPath, JSON.stringify(config, null, 4));

        // Créer l'embed de confirmation
        const embed = new EmbedBuilder()
            .setColor('#00FF00')
            .setTitle('💰 Ajout de Robux')
            .setDescription(`${montant} Robux ont été ajoutés à ${targetUser.username}.`)
            .addFields(
                { name: '💰 Ancien solde', value: `${ancienSolde} Robux`, inline: true },
                { name: '💰 Nouveau solde', value: `${config.users[targetUser.id].robux} Robux`, inline: true },
                { name: '➕ Montant ajouté', value: `${montant} Robux`, inline: true }
            )
            .setFooter({ text: `Ajouté par ${interaction.user.username}` });

        await interaction.reply({ embeds: [embed] });
    },
}; 