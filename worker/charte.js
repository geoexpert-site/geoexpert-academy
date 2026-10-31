// Charte de l'apprenant (texte validé par l'administrateur le 31/10/2026, d'après ressources/charte-apprenant.md,
// corrigé pour suivre les CGV : durées à compter de la première connexion, données personnelles, sanction).
// Même texte publié sur le site : charte-apprenant.html (à mettre à jour en même temps).
// Nouvelle version (texte modifié) : changer « version » → chaque apprenant devra l'accepter à sa prochaine connexion.
export const CHARTE = {
  version: '1.0',
  date: 'octobre 2026',
  titre: 'Charte de l\'apprenant – Formations vidéo GeoExpert Academy',
  intro: 'Bienvenue dans votre espace apprenant. Cette charte résume les règles de votre formation vidéo. Elle reprend les conditions générales de vente (CGV) que vous avez acceptées lors de votre inscription. En cas de différence, les CGV s\'appliquent.',
  sections: [
    { t: '1. Votre code d\'accès', items: [
      'Votre code d\'accès est personnel et réservé à une seule personne.',
      'Vous vous engagez à ne pas le partager, le prêter ou le revendre.',
      'Si vous pensez que votre code a été utilisé par quelqu\'un d\'autre, prévenez-nous rapidement sur WhatsApp : nous le remplacerons.',
    ] },
    { t: '2. Vos vidéos et vos documents', items: [
      'Les vidéos, cours en PDF, guides, exercices et données de la formation sont réservés à votre usage personnel.',
      'Il est interdit de les enregistrer, filmer, copier, partager, publier ou revendre, en tout ou en partie, sans notre accord écrit.',
      'Certains documents portent votre nom : ils vous sont strictement réservés.',
    ] },
    { t: '3. La période d\'essai accompagnée et le remboursement', items: [
      'Pendant les 7 premiers jours suivant votre première connexion à l\'espace apprenant, vous accédez à l\'introduction et aux 2 premières leçons de votre formation, et le formateur vous accompagne sur WhatsApp.',
      'Si la formation ne vous convient pas, vous pouvez demander le remboursement par WhatsApp pendant ces 7 jours : il est intégral, et votre accès est alors désactivé.',
      'À partir du 8e jour, toutes les leçons et toutes les ressources de votre formation sont débloquées.',
    ] },
    { t: '4. La durée de votre accès', items: [
      '12 mois pour une formation seule, 24 mois pour un pack, à compter de votre première connexion à l\'espace apprenant.',
      'Pendant cette période, vous pouvez revoir les vidéos autant que vous le souhaitez.',
    ] },
    { t: '5. L\'assistance du formateur', items: [
      'Vous bénéficiez de 3 mois d\'assistance sur WhatsApp, à compter de votre première connexion à l\'espace apprenant.',
      'Délai indicatif de réponse : 48 heures ouvrables.',
      'L\'assistance porte sur les cours et les exercices de la formation achetée. La réalisation d\'un projet personnel ou professionnel complet fait l\'objet d\'un devis séparé.',
    ] },
    { t: '6. Votre attestation de fin de formation', items: [
      'Elle vous est délivrée lorsque vous avez terminé toutes les leçons de la formation et que le formateur a validé votre exercice final, envoyé par WhatsApp.',
      'Elle comporte un code unique, vérifiable sur notre site.',
    ] },
    { t: '7. Votre engagement', items: [
      'Vous vous engagez à suivre vos leçons régulièrement, à refaire les manipulations sur votre ordinateur et à réaliser les exercices.',
      'Vous vous engagez à rester courtois et respectueux dans vos échanges avec le formateur.',
    ] },
    { t: '8. Le non-respect de la charte', items: [
      'En cas de partage du code, de diffusion des contenus ou de comportement irrespectueux, GeoExpert Academy peut suspendre ou désactiver votre accès, après vous en avoir informé, sans remboursement.',
    ] },
    { t: '9. Vos données personnelles', items: [
      'Nous utilisons votre nom, votre numéro WhatsApp et votre progression uniquement pour gérer votre accès, vous accompagner et délivrer votre attestation. Nous enregistrons aussi la date de votre acceptation de cette charte.',
      'Elles ne sont jamais vendues. Elles sont transmises uniquement aux prestataires nécessaires au service (paiement, mesure d\'audience et publicité), comme décrit dans notre politique de confidentialité.',
      'Vous pouvez demander à consulter, corriger ou supprimer vos données en nous écrivant à contact@geoexpertacademy.ci ou sur WhatsApp.',
    ] },
    { t: '10. Nous contacter', items: [
      'WhatsApp : +225 07 87 01 50 30',
      'E-mail : contact@geoexpertacademy.ci',
      'Site : www.geoexpertacademy.ci',
    ] },
  ],
  case: 'J\'ai lu la charte de l\'apprenant et je l\'accepte.',
};
