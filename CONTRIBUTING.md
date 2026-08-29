# Contribuer à Konform

Merci de vouloir améliorer Konform ! Ce projet grandit avec la communauté.

## Principes du projet

1. **Ancrage juridique local avant tout.** Chaque clause doit refléter le droit réel du pays visé. On ne transplante pas des cadres étrangers (RGPD, CCPA) sur des pays où ils ne s'appliquent pas : cela crée des obligations non tenues plutôt qu'une protection.
2. **Toute clause juridique doit être justifiable.** Idéalement, appuyez vos ajouts sur un texte de loi, un article précis, ou une communication officielle de l'autorité de contrôle.
3. **Pas de copier-coller de documents propriétaires.** Ne reprenez pas le texte d'une politique de confidentialité existante (celle d'une entreprise, d'un cabinet, d'un autre générateur). Rédigez des clauses originales.
4. **Simplicité technique.** Le projet reste en HTML/CSS/JS pur, sans framework ni étape de build, pour rester accessible et facile à héberger.

## Signaler un problème ou proposer une idée

Ouvrez une *issue* en décrivant clairement :
- le pays concerné (le cas échéant),
- le problème ou la proposition,
- une source officielle si possible.

## Ajouter un nouveau pays

Le cœur de la logique se trouve dans `src/konform.js`, dans les fonctions `genMentionsLegales(c)` et `genPolitique(c)`, où `c` est le code du pays (`'ci'`, `'bj'`...).

Étapes générales :

1. **Rassembler les références légales** : loi applicable, autorité de contrôle, droits reconnus, obligations de déclaration, formalisme d'exercice des droits.
2. **Ajouter le code pays** dans les branches conditionnelles des deux fonctions de génération (label de loi, autorité, site de l'autorité, liste des droits, etc.).
3. **Ajouter le bouton de sélection du pays** dans les trois pages HTML (`index.html`, `mentions-legales.html`, `politique-confidentialite.html`).
4. **Tester** que la numérotation des sections reste correcte et que les deux documents se génèrent sans erreur.

## Style de code

- Indentation à 2 espaces.
- Pas de dépendances externes.
- Commentaires en français, cohérents avec le reste du projet.

## Licence des contributions

En contribuant, vous acceptez que votre contribution soit distribuée sous la licence MIT du projet.
