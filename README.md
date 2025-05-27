# 🥔 RblxFrUnbanPatate

Un bot Discord qui permet aux joueurs bannis de Roblox de gagner leur déban en épluchant des patates virtuelles !

## 📋 Fonctionnalités

- **Système d'épluchage de patates** : Tapez des mots pour éplucher des patates et gagner des Robux
- **Système de paliers** : Débloquez des patates plus rentables en progressant
- **Patates d'or** : 10% de chance d'obtenir une patate d'or avec un bonus de 20 Robux
- **Système d'éplucheur** : Améliorez votre éplucheur pour éplucher plus vite
- **Système de déban** : Demandez un déban une fois 1000 Robux accumulés

## 🎮 Commandes

- `/eplucher` : Commence à éplucher une patate
- `/bal` : Affiche votre solde et vos statistiques
- `/next` : Passe au niveau de patate supérieur
- `/back` : Revient au niveau de patate précédent
- `/upgrade` : Améliore votre éplucheur
- `/unban` : Demande un déban (1000 Robux requis)
- `/tuto` : Affiche le tutoriel du jeu
- `/reset` : (Admin) Réinitialise les données d'un joueur
- `/add` : (Admin) Ajoute des Robux à un joueur

## 📈 Système de paliers

| Niveau | Patate | Seuil de déblocage | Robux par patate |
|--------|---------|-------------------|------------------|
| 1 | Patate | 0 | 20 |
| 2 | Patate blanche | 50 | 40 |
| 3 | Patate douce | 125 | 60 |
| 4 | Patate rouge | 235 | 80 |

## 🔧 Système d'éplucheur

| Niveau | Nom | Mots requis | Coût |
|--------|-----|-------------|------|
| 1 | Éplucheur Basique | 6 | 0 |
| 2 | Éplucheur Amélioré | 5 | 500 |
| 3 | Éplucheur Pro | 4 | 1000 |
| 4 | Éplucheur Master | 3 | 2000 |

## ⚙️ Installation

1. Clonez le repository :
```bash
git clone https://github.com/konankuun/RblxFrUnbanPatate.git
cd RblxFrUnbanPatate
```

2. Installez les dépendances :
```bash
npm install
```

3. Créez un fichier `.env` à la racine du projet :
```env
BOT_TOKEN=votre_token_discord
```

4. Démarrez le bot :
```bash
node index.js
```

## 📁 Structure des fichiers

```
RblxFrUnbanPatate/
├── commands/           # Commandes du bot
├── config/            # Fichiers de configuration
│   ├── config.json    # Configuration générale
│   └── words.json     # Liste des mots pour l'épluchage
├── index.js           # Point d'entrée du bot
├── package.json       # Dépendances
└── README.md          # Documentation
```

## 🔒 Configuration

Le bot utilise deux fichiers de configuration principaux :

- `config.json` : Contient les paramètres du jeu (paliers, récompenses, etc.)
- `words.json` : Contient les listes de mots pour chaque niveau de patate

## 🤝 Contribution

Les contributions sont les bienvenues ! N'hésitez pas à :
1. Fork le projet
2. Créer une branche pour votre fonctionnalité
3. Commiter vos changements
4. Push vers la branche
5. Ouvrir une PR (Pull Req)

## 📝 Licence

Ce projet est sous licence MIT. Voir le fichier `LICENSE` pour plus de détails.

## 👥 Auteurs

- KonKonan - Développement initial

## 🙏 Remerciements

- Discord.js pour leur excellente bibliothèque
- La communauté Roblox pour leur soutien 
