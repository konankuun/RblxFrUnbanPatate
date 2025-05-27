const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const fs = require('fs');
const path = require('path');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('back')
        .setDescription('Reviens à une patate plus facile'),
    
    async execute(interaction) {
        const configPath = path.join(__dirname, '..', 'config', 'config.json');
        const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
        const userId = interaction.user.id;

        // Vérifier si l'utilisateur existe
        if (!config.users[userId]) {
            return interaction.reply({ 
                content: 'Vous devez d\'abord commencer à jouer ! Utilisez `/eplucher` pour commencer.',
                ephemeral: true 
            });
        }

        const userData = config.users[userId];
        const niveauxPatates = Object.keys(config.patates.niveaux);
        const indexActuel = niveauxPatates.indexOf(userData.patate_actuelle);

        // Vérifier si on peut revenir au niveau précédent
        if (indexActuel <= 0) {
            return interaction.reply({
                content: 'Vous êtes déjà au niveau de patate le plus facile !',
                ephemeral: true
            });
        }

        // Revenir au niveau précédent
        userData.patate_actuelle = niveauxPatates[indexActuel - 1];
        fs.writeFileSync(configPath, JSON.stringify(config, null, 4));

        const embed = new EmbedBuilder()
            .setColor('#FF6B6B')
            .setTitle('🥔 Niveau de patate diminué !')
            .setDescription(`Vous revenez maintenant à la ${config.patates.niveaux[userData.patate_actuelle].nom} !`)
            .addFields(
                { name: '📝 Syllabes requises', value: `${config.patates.niveaux[userData.patate_actuelle].syllabes[0]}-${config.patates.niveaux[userData.patate_actuelle].syllabes[1]} syllabes` },
                { name: '💰 Récompense', value: `${config.patates.niveaux[userData.patate_actuelle].robux} Robux` }
            );

        await interaction.reply({ embeds: [embed] });
    },
}; 