const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('tuto')
        .setDescription('Affiche le tutoriel du jeu de la patate'),
    
    async execute(interaction) {
        const embed = new EmbedBuilder()
            .setColor('#FFD700')
            .setTitle('🥔 Tutoriel du Jeu de la Patate')
            .setDescription('Bienvenue dans le jeu de la patate ! Voici comment jouer :')
            .addFields(
                { 
                    name: '🎮 Commandes de base',
                    value: '• </eplucher:1377004820946358505> : Commence à éplucher une patate\n' +
                          '• </bal:1377004820946358504> : Affiche votre solde et vos statistiques\n' +
                          '• </next:1377004820946358506> : Passe au niveau de patate supérieur\n' +
                          '• </back:1377004820946358503> : Revient au niveau de patate précédent\n' +
                          '• </upgrade:1377004820946358509> : Améliore votre éplucheur\n' +
                          '• </unban:1377018205889106012> : Demande un déban (1000 Robux requis)'
                },
                {
                    name: '📈 Système de paliers',
                    value: '• **Patate** : Niveau de départ\n' +
                          '• **Patate blanche** : Débloquée à 50 patates\n' +
                          '• **Patate douce** : Débloquée à 125 patates\n' +
                          '• **Patate rouge** : Débloquée à 235 patates\n\n' +
                          'Utilisez </next:1377004820946358506> pour passer au niveau supérieur quand il est débloqué !'
                },
                {
                    name: '💰 Système de récompenses',
                    value: '• Chaque patate épluchée vous rapporte des Robux\n' +
                          '• Les patates de niveau supérieur rapportent plus de Robux\n' +
                          '• 10% de chance d\'obtenir une patate d\'or (+20 Robux bonus)\n' +
                          '• Accumulez 1000 Robux pour demander un déban avec </unban:1377018205889106012>'
                },
                {
                    name: '🔧 Système d\'éplucheur',
                    value: '• Améliorez votre éplucheur avec </upgrade:1377004820946358509>\n' +
                          '• Les éplucheurs de niveau supérieur nécessitent moins de mots\n' +
                          '• Chaque éplucheur a un coût en Robux'
                },
                {
                    name: '💡 Conseils',
                    value: '• Épluchez régulièrement pour gagner des Robux\n' +
                          '• Passez au niveau supérieur dès que possible\n' +
                          '• Améliorez votre éplucheur pour éplucher plus vite\n' +
                          '• Gardez un œil sur vos statistiques avec </bal:1377004820946358504>'
                }
            )
            .setFooter({ text: 'Bonne chance dans votre quête d\'épluchage !' });

        await interaction.reply({ embeds: [embed] });
    },
}; 