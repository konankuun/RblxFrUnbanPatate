const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const fs = require('fs');
const path = require('path');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('upgrade')
        .setDescription('Améliore votre éplucheur')
        .addStringOption(option =>
            option.setName('niveau')
                .setDescription('Le niveau d\'éplucheur que vous souhaitez acheter')
                .setRequired(true)
                .addChoices(
                    { name: 'Niveau 2 - 45 Robux', value: 'niveau2' },
                    { name: 'Niveau 3 - 60 Robux', value: 'niveau3' },
                    { name: 'Niveau 4 - 75 Robux', value: 'niveau4' }
                )),
    
    async execute(interaction) {
        const configPath = path.join(__dirname, '..', 'config', 'config.json');
        const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
        const userId = interaction.user.id;
        const niveauSouhaite = interaction.options.getString('niveau');

        // Vérifier si l'utilisateur existe
        if (!config.users[userId]) {
            return interaction.reply({ 
                content: 'Vous devez d\'abord commencer à jouer ! Utilisez `/eplucher` pour commencer.',
                ephemeral: true 
            });
        }

        const userData = config.users[userId];
        const eplucheurActuel = parseInt(userData.eplucheur.replace('niveau', ''));
        const eplucheurSouhaite = parseInt(niveauSouhaite.replace('niveau', ''));

        // Vérifier si l'amélioration est valide
        if (eplucheurSouhaite <= eplucheurActuel) {
            return interaction.reply({
                content: 'Vous ne pouvez pas acheter un éplucheur de niveau inférieur ou égal à celui que vous possédez !',
                ephemeral: true
            });
        }

        const prix = config.patates.eplucheurs[niveauSouhaite].prix;

        // Vérifier si l'utilisateur a assez de Robux
        if (userData.robux < prix) {
            return interaction.reply({
                content: `Vous n'avez pas assez de Robux ! Il vous faut ${prix} Robux pour cet éplucheur.`,
                ephemeral: true
            });
        }

        // Effectuer l'achat
        userData.robux -= prix;
        userData.eplucheur = niveauSouhaite;
        fs.writeFileSync(configPath, JSON.stringify(config, null, 4));

        const embed = new EmbedBuilder()
            .setColor('#00FF00')
            .setTitle('🔧 Éplucheur amélioré !')
            .setDescription(`Vous avez acheté l'éplucheur ${config.patates.eplucheurs[niveauSouhaite].nom} !`)
            .addFields(
                { name: '💰 Robux restants', value: `${userData.robux} Robux` },
                { name: '📝 Nouveau nombre de mots requis', value: `${config.patates.eplucheurs[niveauSouhaite].mots_requis} mots` }
            );

        await interaction.reply({ embeds: [embed] });
    },
}; 