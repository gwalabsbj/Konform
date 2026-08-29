# Konform

**Générateur gratuit et open source de mentions légales et de politiques de confidentialité, conformes au droit ivoirien et béninois.**

Konform est un projet communautaire à but non lucratif, pensé pour les développeurs, freelances et entrepreneurs de **Côte d'Ivoire** et du **Bénin**. Il génère des documents juridiques adaptés aux lois locales — et non à des modèles européens ou américains transplantés.

Aucun compte, aucun paiement, aucune donnée collectée : tout se passe dans le navigateur.

---

## ✨ Fonctionnalités

- **Deux documents** générés en parallèle : mentions légales et politique de confidentialité.
- **Deux cadres juridiques** :
  - 🇨🇮 Côte d'Ivoire — loi n°2013-450 du 19 juin 2013, autorité de contrôle **ARTCI**.
  - 🇧🇯 Bénin — loi n°2017-20 portant Code du numérique (Livre 5), autorité de contrôle **APDP**.
- **Politique de confidentialité complète** (jusqu'à 18 sections) : principes du traitement, finalités et base légale, sous-traitants, module paiement, transferts hors du pays, violation de données, données des mineurs, droits des personnes, cookies détaillés, réclamations.
- **Module agrégateurs de paiement** : CinetPay, FedaPay, Kkiapay, PayDunya, Stripe, PayPal, Wave, Mobile Money, et champ libre — avec clause PCI-DSS.
- **Export** en `.html` (prêt pour WordPress ou tout CMS) et `.doc` (Word).
- **Sauvegarde locale** : les informations saisies sont conservées dans le navigateur (localStorage) et partagées entre les deux générateurs.
- **Zéro dépendance** : HTML, CSS et JavaScript purs. Aucun framework, aucun build.

---

## ⚠️ Avertissement important

Konform **facilite la rédaction** de documents juridiques mais **ne remplace pas un conseil juridique professionnel**. Les documents générés sont des modèles à titre indicatif. Faites-les toujours valider par un avocat spécialisé en droit numérique avant toute publication, en particulier si votre activité traite des données sensibles (santé, données bancaires, mineurs).

Ce projet **ne couvre volontairement pas** les cadres étrangers (RGPD européen, CCPA californien) : les inclure sur un site sans utilisateurs concernés créerait des obligations plutôt qu'une protection. Konform se concentre sur une conformité locale solide.

---

## 🚀 Utilisation

### En ligne

Le site est statique : il suffit d'ouvrir `src/index.html` dans un navigateur.

### En local

```bash
git clone https://github.com/[ton-utilisateur]/konform.git
cd konform/src
# Ouvrez index.html dans votre navigateur, ou lancez un petit serveur :
python3 -m http.server 8000
# puis rendez-vous sur http://localhost:8000
```

### Déploiement

N'importe quel hébergement statique convient (GitHub Pages, Netlify, Vercel, Cloudflare Pages). Il suffit de servir le contenu du dossier `src/`.

Ce dépôt inclut un workflow GitHub Actions (`.github/workflows/deploy.yml`) qui déploie automatiquement le dossier `src/` sur **GitHub Pages** à chaque push sur `main`. Pour l'activer : dans **Settings → Pages**, choisissez la source **GitHub Actions**.

---

## 📁 Structure du projet

```
konform/
├── .github/
│   └── workflows/
│       └── deploy.yml                  # Déploiement automatique sur GitHub Pages
├── src/
│   ├── index.html                      # Page d'accueil
│   ├── mentions-legales.html           # Générateur de mentions légales
│   ├── politique-confidentialite.html  # Générateur de politique de confidentialité
│   ├── konform.css                     # Styles partagés
│   └── konform.js                      # Moteur de génération partagé
├── LICENSE
├── README.md
├── CONTRIBUTING.md
└── .gitignore
```

---

## 🤝 Contribuer

Les contributions sont les bienvenues, en particulier :

- **Ajout de nouveaux pays** (nouveau cadre juridique, nouvelle autorité de contrôle).
- Corrections ou améliorations des clauses existantes, idéalement avec une **référence à un texte de loi ou à une source officielle**.
- Améliorations d'interface, d'accessibilité ou de traduction.

Voir [CONTRIBUTING.md](CONTRIBUTING.md) pour les détails. Pour proposer l'ajout d'un pays ou signaler un problème, ouvrez une *issue* ou écrivez sur WhatsApp (lien dans le site).

---

## 📜 Licence

Distribué sous licence **MIT**. Voir [LICENSE](LICENSE).

Le texte des documents générés vous appartient : vous êtes libre de l'utiliser, le modifier et le publier pour vos projets et ceux de vos clients.

---

*Konform — fait pour la communauté tech ivoirienne et béninoise.*
