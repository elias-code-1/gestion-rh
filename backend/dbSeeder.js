const Employe = require('./models/Employe');
const Formation = require('./models/Formation');
const Entretien = require('./models/Entretien');
const NoteFrais = require('./models/NoteFrais');
const Materiel = require('./models/Materiel');
const TimeLog = require('./models/TimeLog');
const Onboarding = require('./models/Onboarding');
const Prime = require('./models/Prime');
const Objectif = require('./models/Objectif');
const AuditLog = require('./models/AuditLog');
const Document = require('./models/DocumentModel');
const ParametreRH = require('./models/ParametreRH');
const Conge = require('./models/conge');
const Absence = require('./models/Absence');
const ModuleRecord = require('./models/ModuleRecord');

async function seedDatabaseIfEmpty() {
  try {
    // 1. Paramètres RH d'entreprise
    const countParam = await ParametreRH.countDocuments();
    if (countParam === 0) {
      await ParametreRH.create({
        nomEntreprise: 'Dossier RH Solutions SAS',
        siret: '849 203 912 00018',
        codeNAF: '6201Z',
        conventionCollective: 'SYNTEC - Bureaux d’études techniques et conseils',
        heuresHebdoLegales: 35,
        joursCongesAnnuels: 25,
        valeurFacialeTicketRestau: 10.5,
        partPatronaleTicketRestau: 60,
        seuilAlerteVisiteMedicaleJours: 30,
        emailNotificationsRH: 'rh@dossier-rh.fr',
        responsableLegal: 'Sophie Legrand, Directrice des Ressources Humaines',
        adresseEntreprise: '14 rue de la Paix, 75002 Paris',
      });
      console.log('✅ [Seed DB] Paramètres RH initialisés dans MongoDB');
    }

    // 2. Vérification et enrichissement des Employés
    let employes = await Employe.find();
    if (employes.length === 0) {
      const initialEmployes = [
        {
          nom: 'APEDO',
          prenom: 'Elias',
          email: 'jojoapedo228@gmail.com',
          telephone: '06 12 34 56 78',
          poste: 'Développeur Full-stack & Mobile',
          departement: 'Informatique',
          dateEmbauche: new Date('2024-03-01'),
          statut: 'actif',
          salaireBrut: 4200,
          typeContrat: 'CDI',
          visiteMedicale: new Date('2026-12-15'),
          teletravailJours: 2,
          matricule: 'EMP-001',
          nationalite: 'Française',
          iban: 'FR76 3000 4000 5000 6000 7000 123',
          secuSociale: '1 95 04 75 123 456 78',
          contactUrgence: { nom: 'Komi Apedo', telephone: '06 99 88 77 66', lien: 'Frère' },
          competences: [
            { nom: 'React / TypeScript', niveau: 'Expert' },
            { nom: 'Node.js & Express', niveau: 'Avancé' },
            { nom: 'MongoDB & Cloud', niveau: 'Avancé' },
          ],
        },
        {
          nom: 'AVIAH',
          prenom: 'Moussa',
          email: 'contact@logonova.site',
          telephone: '06 98 76 54 32',
          poste: 'Architecte Backend & DevOps',
          departement: 'Serveur & Cloud',
          dateEmbauche: new Date('2023-09-15'),
          statut: 'actif',
          salaireBrut: 4500,
          typeContrat: 'CDI',
          visiteMedicale: new Date('2026-11-20'),
          teletravailJours: 3,
          matricule: 'EMP-002',
          nationalite: 'Française',
          iban: 'FR76 3000 2000 1000 9000 8000 456',
          secuSociale: '1 92 08 69 987 654 32',
          contactUrgence: { nom: 'Aicha Aviah', telephone: '06 11 22 33 44', lien: 'Conjointe' },
          competences: [
            { nom: 'Docker & Kubernetes', niveau: 'Expert' },
            { nom: 'Microservices & API REST', niveau: 'Expert' },
            { nom: 'PostgreSQL & MongoDB', niveau: 'Avancé' },
          ],
        },
        {
          nom: 'DUPONT',
          prenom: 'Claire',
          email: 'claire.dupont@dossier-rh.fr',
          telephone: '06 55 44 33 22',
          poste: 'Responsable Ressources Humaines',
          departement: 'Ressources Humaines',
          dateEmbauche: new Date('2022-01-10'),
          statut: 'actif',
          salaireBrut: 4800,
          typeContrat: 'CDI',
          visiteMedicale: new Date('2026-08-10'),
          teletravailJours: 2,
          matricule: 'EMP-003',
          nationalite: 'Française',
          iban: 'FR76 1005 2005 3005 4005 5005 789',
          secuSociale: '2 88 11 75 456 789 01',
          contactUrgence: { nom: 'Julien Dupont', telephone: '06 77 88 99 00', lien: 'Époux' },
          competences: [
            { nom: 'Droit du travail & RUP', niveau: 'Expert' },
            { nom: 'Gestion de la Paie', niveau: 'Avancé' },
            { nom: 'Recrutement & Talents', niveau: 'Expert' },
          ],
        },
        {
          nom: 'MOREAU',
          prenom: 'Sébastien',
          email: 'sebastien.moreau@dossier-rh.fr',
          telephone: '06 44 33 22 11',
          poste: 'Product Designer UX/UI',
          departement: 'Design & Produit',
          dateEmbauche: new Date('2024-06-01'),
          statut: 'actif',
          salaireBrut: 3800,
          typeContrat: 'CDI',
          visiteMedicale: new Date('2027-02-14'),
          teletravailJours: 2,
          matricule: 'EMP-004',
          nationalite: 'Française',
          iban: 'FR76 2002 3003 4004 5005 6006 321',
          secuSociale: '1 96 02 92 112 233 44',
          contactUrgence: { nom: 'Camille Moreau', telephone: '06 33 22 11 00', lien: 'Sœur' },
          competences: [
            { nom: 'Figma & Design System', niveau: 'Expert' },
            { nom: 'Accessibilité RGAA', niveau: 'Avancé' },
            { nom: 'Prototypage Interactif', niveau: 'Avancé' },
          ],
        },
      ];
      employes = await Employe.insertMany(initialEmployes);
      console.log('✅ [Seed DB] Employés initiaux insérés dans MongoDB');
    } else {
      // Enrichir les employés existants s'ils n'ont pas encore de compétences ou de matricule
      for (const emp of employes) {
        let updated = false;
        if (!emp.matricule) {
          emp.matricule = `EMP-${String(emp._id).slice(-4).toUpperCase()}`;
          updated = true;
        }
        if (!emp.competences || emp.competences.length === 0) {
          emp.competences = [
            { nom: 'Gestion de Projet & Méthode Agile', niveau: 'Avancé' },
            { nom: 'Communication Professionnelle', niveau: 'Avancé' },
            { nom: 'Outils Numériques & Collaboration', niveau: 'Expert' },
          ];
          updated = true;
        }
        if (!emp.salaireBrut) {
          emp.salaireBrut = 3700;
          updated = true;
        }
        if (updated) {
          await emp.save();
        }
      }
    }

    const emp1 = employes[0];
    const emp2 = employes[1] || employes[0];
    const emp3 = employes[2] || employes[0];
    const emp4 = employes[3] || employes[0];

    // 3. Formations professionnelles
    const countForm = await Formation.countDocuments();
    if (countForm === 0) {
      await Formation.insertMany([
        {
          employeId: emp1._id,
          employeNom: `${emp1.prenom} ${emp1.nom}`,
          titre: 'Certification Architecture Cloud & Microservices',
          organisme: 'AWS Training & Certification',
          cout: 1850,
          dureeJours: 5,
          datePrevue: '2026-11-18',
          statut: 'validee',
          competenceVisee: 'Cloud Architecture',
          commentaire: 'Financement OPCO validé à 100%',
        },
        {
          employeId: emp2._id,
          employeNom: `${emp2.prenom} ${emp2.nom}`,
          titre: 'Kubernetes Avancé & Sécurité des Conteneurs',
          organisme: 'Linux Foundation Institute',
          cout: 2200,
          dureeJours: 4,
          datePrevue: '2026-12-02',
          statut: 'en_attente',
          competenceVisee: 'DevOps & Sécurité',
          commentaire: 'En attente de validation budgétaire RH',
        },
        {
          employeId: emp3._id,
          employeNom: `${emp3.prenom} ${emp3.nom}`,
          titre: 'Droit du Travail & Gestion des IRP 2026',
          organisme: 'Dalloz Formation Juridique',
          cout: 1450,
          dureeJours: 3,
          datePrevue: '2026-10-25',
          statut: 'terminee',
          competenceVisee: 'Conformité & Droit Social',
          commentaire: 'Formation achevée, attestation reçue',
        },
        {
          employeId: emp4._id,
          employeNom: `${emp4.prenom} ${emp4.nom}`,
          titre: 'Design Accessible & Normes RGAA 4.1',
          organisme: 'Institut National du Design Web',
          cout: 980,
          dureeJours: 2,
          datePrevue: '2026-11-28',
          statut: 'validee',
          competenceVisee: 'Accessibilité Web',
          commentaire: 'Session intra-entreprise planifiée',
        },
      ]);
      console.log('✅ [Seed DB] Formations insérées dans MongoDB');
    }

    // 4. Entretiens Annuels & Professionnels
    const countEnt = await Entretien.countDocuments();
    if (countEnt === 0) {
      await Entretien.insertMany([
        {
          employeId: emp1._id,
          employeNom: `${emp1.prenom} ${emp1.nom}`,
          type: 'annuel',
          date: '2026-10-12',
          evaluator: 'Direction Technique',
          noteGlobale: 5,
          statut: 'realise',
          objectifs: 'Lead technique sur les refontes API et tutorat des juniors',
          souhaitsEvolution: 'Évolution vers un rôle de Tech Lead / Lead Dev',
          remarques: 'Excellents résultats sur le dernier trimestre',
        },
        {
          employeId: emp2._id,
          employeNom: `${emp2.prenom} ${emp2.nom}`,
          type: 'professionnel',
          date: '2026-11-15',
          evaluator: 'Directeur des Systèmes d’Information',
          noteGlobale: 4,
          statut: 'planifie',
          objectifs: 'Optimisation de la haute disponibilité et de la sécurité des données',
          souhaitsEvolution: 'Certification Cloud Architect',
        },
        {
          employeId: emp3._id,
          employeNom: `${emp3.prenom} ${emp3.nom}`,
          type: 'annuel',
          date: '2026-11-20',
          evaluator: 'Direction Générale',
          noteGlobale: 5,
          statut: 'planifie',
          objectifs: 'Déploiement de la politique RSE et suivi de la parité',
          souhaitsEvolution: 'Pilotage stratégique des talents',
        },
      ]);
      console.log('✅ [Seed DB] Entretiens insérés dans MongoDB');
    }

    // 5. Notes de frais
    const countNdf = await NoteFrais.countDocuments();
    if (countNdf === 0) {
      await NoteFrais.insertMany([
        {
          employeId: emp1._id,
          employeNom: `${emp1.prenom} ${emp1.nom}`,
          titre: 'Billet de train Salon Tech Dev Lyon',
          montant: 145.8,
          dateDepense: '2026-10-05',
          categorie: 'transport',
          statut: 'validee',
          justificatif: 'SNCF_e-billet_lyon.pdf',
          remarque: 'Déplacement congrès tech',
        },
        {
          employeId: emp2._id,
          employeNom: `${emp2.prenom} ${emp2.nom}`,
          titre: 'Abonnement serveur test cloud mensuel',
          montant: 65.0,
          dateDepense: '2026-10-01',
          categorie: 'logiciel',
          statut: 'remboursee',
          justificatif: 'Facture_Cloud_Octobre.pdf',
          remarque: 'Environnement de pré-production',
        },
        {
          employeId: emp3._id,
          employeNom: `${emp3.prenom} ${emp3.nom}`,
          titre: 'Déjeuner de travail avec cabinet conseil RH',
          montant: 84.5,
          dateDepense: '2026-10-09',
          categorie: 'repas',
          statut: 'en_attente',
          justificatif: 'Note_Restaurant_Paris.pdf',
          remarque: 'Point de cadrage sur les accords d’entreprise',
        },
        {
          employeId: emp4._id,
          employeNom: `${emp4.prenom} ${emp4.nom}`,
          titre: 'Licence annuelle typographie professionnelle',
          montant: 120.0,
          dateDepense: '2026-09-28',
          categorie: 'logiciel',
          statut: 'remboursee',
          justificatif: 'Invoice_Font_Licence.pdf',
        },
      ]);
      console.log('✅ [Seed DB] Notes de frais insérées dans MongoDB');
    }

    // 6. Matériels et équipements
    const countMat = await Materiel.countDocuments();
    if (countMat === 0) {
      await Materiel.insertMany([
        {
          employeId: emp1._id,
          employeNom: `${emp1.prenom} ${emp1.nom}`,
          type: 'ordinateur',
          nom: 'MacBook Pro 16" M3 Max 36GB',
          numeroSerie: 'C02G90XYZ123',
          dateAttribution: '2024-03-02',
          etat: 'comme_neuf',
          statut: 'attribue',
        },
        {
          employeId: emp1._id,
          employeNom: `${emp1.prenom} ${emp1.nom}`,
          type: 'smartphone',
          nom: 'iPhone 15 Pro 128GB Flotte',
          numeroSerie: 'F2LPQ8994K01',
          dateAttribution: '2024-03-05',
          etat: 'tres_bon',
          statut: 'attribue',
        },
        {
          employeId: emp2._id,
          employeNom: `${emp2.prenom} ${emp2.nom}`,
          type: 'ordinateur',
          nom: 'Dell XPS 15 32GB i9 Developer Edition',
          numeroSerie: 'DELL-9844-SN18',
          dateAttribution: '2023-09-16',
          etat: 'tres_bon',
          statut: 'attribue',
        },
        {
          employeId: emp3._id,
          employeNom: `${emp3.prenom} ${emp3.nom}`,
          type: 'ordinateur',
          nom: 'Lenovo ThinkPad X1 Carbon 16GB',
          numeroSerie: 'LNV-TP-48902',
          dateAttribution: '2022-01-12',
          etat: 'bon',
          statut: 'attribue',
        },
        {
          employeId: emp4._id,
          employeNom: `${emp4.prenom} ${emp4.nom}`,
          type: 'ecran',
          nom: 'Écran 32" 4K LG UltraFine Ergo',
          numeroSerie: 'LG32-4K-99018',
          dateAttribution: '2024-06-03',
          etat: 'comme_neuf',
          statut: 'attribue',
        },
      ]);
      console.log('✅ [Seed DB] Matériels insérés dans MongoDB');
    }

    // 7. Feuilles de temps (Time tracking)
    const countTime = await TimeLog.countDocuments();
    if (countTime === 0) {
      await TimeLog.insertMany([
        {
          employeId: emp1._id,
          employeNom: `${emp1.prenom} ${emp1.nom}`,
          semaine: '2026-W41',
          heuresDeclarees: 38.5,
          heuresSupp: 3.5,
          joursPresentiel: 3,
          joursTeletravail: 2,
          statut: 'valide',
          commentaire: 'Sprint final livraison release',
        },
        {
          employeId: emp2._id,
          employeNom: `${emp2.prenom} ${emp2.nom}`,
          semaine: '2026-W41',
          heuresDeclarees: 35,
          heuresSupp: 0,
          joursPresentiel: 2,
          joursTeletravail: 3,
          statut: 'valide',
        },
        {
          employeId: emp3._id,
          employeNom: `${emp3.prenom} ${emp3.nom}`,
          semaine: '2026-W42',
          heuresDeclarees: 37,
          heuresSupp: 2,
          joursPresentiel: 4,
          joursTeletravail: 1,
          statut: 'en_attente',
          commentaire: 'Audit légal et préparation des déclarations',
        },
      ]);
      console.log('✅ [Seed DB] Feuilles de temps insérées dans MongoDB');
    }

    // 8. Parcours Onboarding
    const countOnb = await Onboarding.countDocuments();
    if (countOnb === 0) {
      await Onboarding.insertMany([
        {
          employeId: emp1._id,
          employeNom: `${emp1.prenom} ${emp1.nom}`,
          phase: 'onboarding',
          dateDebut: '2024-03-01',
          tuteur: 'Moussa Aviah',
          statut: 'termine',
          etapes: [
            { id: '1', label: 'Signature du contrat et fiche de renseignements', terminee: true, dateValidation: '2024-03-01' },
            { id: '2', label: 'Remise du matériel informatique et badge sécurisé', terminee: true, dateValidation: '2024-03-01' },
            { id: '3', label: 'Création des accès emails, GitHub, Slack et VPN', terminee: true, dateValidation: '2024-03-02' },
            { id: '4', label: 'Visite médicale d’embauche avec la médecine du travail', terminee: true, dateValidation: '2024-03-10' },
            { id: '5', label: 'Entretien de bilan de fin de période d’essai', terminee: true, dateValidation: '2024-06-01' },
          ],
        },
        {
          employeId: emp4._id,
          employeNom: `${emp4.prenom} ${emp4.nom}`,
          phase: 'onboarding',
          dateDebut: '2024-06-01',
          tuteur: 'Claire Dupont',
          statut: 'en_cours',
          etapes: [
            { id: '1', label: 'Signature du contrat et documents légaux', terminee: true, dateValidation: '2024-06-01' },
            { id: '2', label: 'Affectation de l’ordinateur portable et licence Figma', terminee: true, dateValidation: '2024-06-01' },
            { id: '3', label: 'Présentation de l’équipe et du livret d’accueil', terminee: true, dateValidation: '2024-06-02' },
            { id: '4', label: 'Visite médicale d’information et de prévention', terminee: false },
            { id: '5', label: 'Bilan d’intégration à 3 mois', terminee: false },
          ],
        },
      ]);
      console.log('✅ [Seed DB] Parcours Onboarding insérés dans MongoDB');
    }

    // 9. Primes et gratifications
    const countPrime = await Prime.countDocuments();
    if (countPrime === 0) {
      await Prime.insertMany([
        {
          employeId: emp1._id,
          employeNom: `${emp1.prenom} ${emp1.nom}`,
          titre: 'Prime de performance projet Q3',
          montant: 1200,
          dateVersement: '2026-09-30',
          motif: 'Livraison anticipée de l’application mobile',
          statut: 'payee',
        },
        {
          employeId: emp2._id,
          employeNom: `${emp2.prenom} ${emp2.nom}`,
          titre: 'Prime d’astreinte et haute disponibilité',
          montant: 850,
          dateVersement: '2026-10-15',
          motif: 'Supervision de la migration d’infrastructure sans interruption',
          statut: 'validee',
        },
        {
          employeId: emp3._id,
          employeNom: `${emp3.prenom} ${emp3.nom}`,
          titre: 'Prime exceptionnelle de bilan social',
          montant: 1000,
          dateVersement: '2026-10-31',
          motif: 'Réussite de l’audit de conformité sociale',
          statut: 'en_attente',
        },
      ]);
      console.log('✅ [Seed DB] Primes insérées dans MongoDB');
    }

    // 10. Objectifs & OKR
    const countObj = await Objectif.countDocuments();
    if (countObj === 0) {
      await Objectif.insertMany([
        {
          employeId: emp1._id,
          employeNom: `${emp1.prenom} ${emp1.nom}`,
          titre: 'Temps de réponse moyen des API < 80ms',
          description: 'Optimisation des index MongoDB et mise en cache des requêtes fréquentes',
          trimestre: 'Q4 2026',
          progression: 85,
          echeance: '2026-12-15',
          statut: 'en_cours',
          poids: 30,
        },
        {
          employeId: emp1._id,
          employeNom: `${emp1.prenom} ${emp1.nom}`,
          titre: 'Couverture de tests unitaires et d’intégration > 85%',
          description: 'Mise en place de tests automatisés dans le pipeline CI/CD',
          trimestre: 'Q4 2026',
          progression: 70,
          echeance: '2026-12-31',
          statut: 'en_cours',
          poids: 35,
        },
        {
          employeId: emp2._id,
          employeNom: `${emp2.prenom} ${emp2.nom}`,
          titre: 'Mise en place de la redondance multi-zone cloud',
          description: 'Automatisation Terraform des déploiements Kubernetes',
          trimestre: 'Q4 2026',
          progression: 90,
          echeance: '2026-11-30',
          statut: 'en_cours',
          poids: 40,
        },
        {
          employeId: emp3._id,
          employeNom: `${emp3.prenom} ${emp3.nom}`,
          titre: 'Réduction du taux de turn-over sous les 4%',
          description: 'Enquêtes d’engagement trimestrielles et plans d’action managériaux',
          trimestre: 'Q4 2026',
          progression: 100,
          echeance: '2026-10-31',
          statut: 'atteint',
          poids: 50,
        },
      ]);
      console.log('✅ [Seed DB] Objectifs insérés dans MongoDB');
    }

    // 11. Modèles de documents RH & Attestations
    const countDocs = await Document.countDocuments();
    if (countDocs === 0) {
      await Document.insertMany([
        {
          titre: 'Attestation d’Emploi en CDI',
          categorie: 'attestation',
          description: 'Modèle officiel délivré au collaborateur pour justifier de son emploi',
          contenuTemplate: `Je soussignée, Sophie Legrand, agissant en qualité de Directrice des Ressources Humaines de la société Dossier RH Solutions SAS, certifie par la présente que :

Madame / Monsieur {{NOM_PRENOM}}
Demeurant à l'adresse enregistrée au dossier
Est employé(e) au sein de notre entreprise depuis le {{DATE_EMBAUCHE}}
En qualité de {{POSTE}}, sous contrat de travail à durée indéterminée (CDI).

La présente attestation est délivrée à la demande de l'intéressé(e) pour faire valoir ce que de droit.

Fait à Paris, le {{DATE_DU_JOUR}}.
Pour la société,
Sophie Legrand - DRH`,
          statut: 'actif',
        },
        {
          titre: 'Avenant de Télétravail Conventionnel',
          categorie: 'avenant',
          description: 'Convention individuelle fixant les jours hebdomadaires de télétravail',
          contenuTemplate: `AVENANT AU CONTRAT DE TRAVAIL - TÉLÉTRAVAIL

ENTRE LES SOUSSIGNÉS :
La société Dossier RH Solutions SAS
Et Monsieur / Madame {{NOM_PRENOM}}, occupant le poste de {{POSTE}}.

ARTICLE 1 : MODALITÉS DU TÉLÉTRAVAIL
Le salarié bénéficie d'un rythme hebdomadaire de {{JOURS_TELETRAVAIL}} jour(s) de télétravail par semaine.

ARTICLE 2 : CONFORMITÉ ET SÉCURITÉ
Le salarié s'engage à disposer d'un espace de travail conforme et ergonomique respectant les règles de cybersécurité de l'entreprise.

Fait à Paris, le {{DATE_DU_JOUR}}.`,
          statut: 'actif',
        },
        {
          titre: 'Certificat de Travail Réglementaire',
          categorie: 'certificat',
          description: 'Document légal remis au salarié lors de la rupture ou du terme du contrat',
          contenuTemplate: `CERTIFICAT DE TRAVAIL
(Article L. 1234-19 du Code du travail)

La société Dossier RH Solutions SAS atteste que :
Monsieur / Madame {{NOM_PRENOM}}
A été employé(e) dans notre société du {{DATE_EMBAUCHE}} au {{DATE_SORTIE}}
En qualité de {{POSTE}}.

Monsieur / Madame {{NOM_PRENOM}} nous quitte ce jour libre de tout engagement.

Fait à Paris, le {{DATE_DU_JOUR}}.`,
          statut: 'actif',
        },
        {
          titre: 'Reçu pour Solde de Tout Compte',
          categorie: 'certificat',
          description: 'Inventaire des sommes versées au salarié lors de son départ',
          contenuTemplate: `REÇU POUR SOLDE DE TOUT COMPTE
(Article L. 1234-20 du Code du travail)

Je soussigné(e) {{NOM_PRENOM}}, reconnais avoir reçu de la société Dossier RH Solutions SAS la somme totale de {{MONTANT_TOTAL}} € représentant le règlement de toutes sommes dues à la date de fin de contrat (salaire, indemnité de congés payés, primes).

Fait à Paris, le {{DATE_DU_JOUR}}.`,
          statut: 'actif',
        },
      ]);
      console.log('✅ [Seed DB] Modèles de documents RH insérés dans MongoDB');
    }

    // 12. Journal d'Audit initial
    const countAudit = await AuditLog.countDocuments();
    if (countAudit === 0) {
      await AuditLog.insertMany([
        {
          horodatage: new Date(),
          action: 'Initialisation du registre de sécurité',
          auteur: 'Système RH',
          details: 'Démarrage du journal d’audit et de traçabilité RGPD dans MongoDB',
          type: 'connexion',
        },
        {
          horodatage: new Date(Date.now() - 3600000 * 24),
          action: 'Synchronisation de la base du personnel',
          auteur: 'Directrice RH',
          details: 'Vérification de la conformité du Registre Unique du Personnel',
          type: 'validation',
        },
      ]);
      console.log('✅ [Seed DB] Journal d’audit initialisé dans MongoDB');
    }

    // 13. Initialisation des enregistrements des 28 modules RH spécialisés
    const countModules = await ModuleRecord.countDocuments();
    if (countModules === 0) {
      const recordsToSeed = [
        // bdese
        {
          moduleKey: 'bdese',
          titre: 'Rapport Annuel Situation Économique & Financière 2024',
          sousTitre: 'Exercice clos au 31/12/2024',
          categorie: 'Données financières',
          statut: 'publie',
          responsable: 'Direction Financière & DRH',
          description: 'Présentation du chiffre d’affaires, marge brute, capitaux propres et politique d’investissement.',
          tags: ['Obligatoire', 'CSE', 'Finance'],
          metadata: { annee: 2024, validateur: 'Commissaire aux comptes' },
        },
        {
          moduleKey: 'bdese',
          titre: 'Bilan Social et Évolution des Emplois par Métier',
          sousTitre: 'Répartition par contrat et ancienneté',
          categorie: 'Emploi & Effectifs',
          statut: 'publie',
          responsable: 'Sophie Legrand, DRH',
          description: 'Analyse des flux d’entrées, départs, pyramide des âges et égalité professionnelle.',
          tags: ['Social', 'GPEC'],
          metadata: { effectifMoyen: 42 },
        },
        {
          moduleKey: 'bdese',
          titre: 'Bilan Environnemental & Émissions GES Scope 1-2-3',
          sousTitre: 'Démarche transition écologique',
          categorie: 'Environnement',
          statut: 'en_cours',
          responsable: 'Comité RSE',
          description: 'Bilan carbone des serveurs cloud, consommation électrique des locaux et déplacements pro.',
          tags: ['RSE', 'Bilan Carbone'],
        },

        // index_egalite
        {
          moduleKey: 'index_egalite',
          titre: 'Index Egapro 2024 - Score Global 91/100',
          sousTitre: 'Déclaration transmise à l’Inspection du Travail',
          categorie: 'Déclaration officielle',
          statut: 'conforme',
          montant: 91,
          taux: 91,
          responsable: 'Sophie Legrand, DRH',
          description: 'Indicateur 1 Rémunérations: 38/40 | Indicateur 2 Augmentations: 20/20 | Indicateur 3 Promotions: 15/15 | Indicateur 4 Congés Maternité: 15/15 | Indicateur 5 Top 10 rémunérations: 3/10.',
          tags: ['Egapro', 'Conforme', 'Légal'],
          metadata: { noteGlobale: 91, datePublication: '2025-02-28' },
        },
        {
          moduleKey: 'index_egalite',
          titre: 'Plan d’action Parité sur les Postes de Direction',
          sousTitre: 'Progression des femmes dans le top management',
          categorie: 'Plan d’actions',
          statut: 'en_cours',
          responsable: 'Comité de Direction',
          description: 'Programme de mentorat et objectifs de parité dans les recrutements de directeurs de pôle.',
          tags: ['Parité', 'Objectif 2026'],
        },

        // bilan_social
        {
          moduleKey: 'bilan_social',
          titre: 'BSI Collaborateurs Cadres & Tech 2024',
          sousTitre: 'Bilan Social Individuel personnalisé',
          categorie: 'BSI Annuel',
          statut: 'diffuse',
          montant: 48500,
          responsable: 'Pôle Paie & DRH',
          description: 'Synthèse individualisée de la rémunération brute, prévoyance, mutuelle, intéressement, formations suivies et tickets restaurant.',
          tags: ['Rétention', 'Fidélisation'],
        },
        {
          moduleKey: 'bilan_social',
          titre: 'Indicateurs Sociaux d’Entreprise (Rapport CSE)',
          sousTitre: 'Données certifiées pour consultation CSE',
          categorie: 'Légal CSE',
          statut: 'valide',
          responsable: 'Sophie Legrand, DRH',
          description: 'Rapport complet sur la masse salariale, absentéisme, turnover (6.2%) et formation continue.',
          tags: ['Obligatoire'],
        },

        // climat_social
        {
          moduleKey: 'climat_social',
          titre: 'Baromètre QVT & Bien-être au travail Q1 2026',
          sousTitre: 'Taux de participation : 86%',
          categorie: 'Enquête interne',
          statut: 'termine',
          taux: 88,
          montant: 88,
          responsable: 'Comité QVT',
          description: '88% des salariés expriment une grande satisfaction sur l’autonomie et l’ambiance de travail. Axe d’amélioration : équilibrage de la charge sur les fins de sprint.',
          tags: ['QVT', 'Satisfaction'],
        },
        {
          moduleKey: 'climat_social',
          titre: 'Sondage Équipement Télétravail & Ergonomie',
          sousTitre: 'Enquête posture et matériel',
          categorie: 'Ergonomie',
          statut: 'en_cours',
          taux: 92,
          montant: 92,
          responsable: 'Médecine du travail & RH',
          description: 'Évaluation des besoins en double écran, sièges ergonomiques et casques anti-bruit pour le télétravail.',
          tags: ['Santé', 'Télétravail'],
        },

        // offboarding
        {
          moduleKey: 'offboarding',
          titre: 'Départ volontaire & Procédure de clôture',
          sousTitre: 'Passation et restitution des accès',
          employeNom: 'Thomas Bernard',
          statut: 'en_cours',
          dateFin: '2026-04-30',
          responsable: 'Sophie Legrand',
          description: 'Checklist : clôture des accès GitHub, restitution MacBook Pro, calcul du solde de tout compte et entretien de départ RH.',
          tags: ['Départ', 'Solde de tout compte'],
          metadata: { etapes: ['Entretien RH fait', 'Matériel inventorié', 'STC en calcul'] },
        },
        {
          moduleKey: 'offboarding',
          titre: 'Fin de contrat CDD & Certificat de travail',
          sousTitre: 'Clôture administrative',
          employeNom: 'Alexandre Petit',
          statut: 'termine',
          dateFin: '2026-02-28',
          responsable: 'Service Paie',
          description: 'Attestation France Travail transmise par flux dématérialisé DSN, certificat de travail et reçu pour solde de tout compte remis en main propre.',
          tags: ['France Travail', 'Archivé'],
        },

        // visites_medicales
        {
          moduleKey: 'visites_medicales',
          titre: 'Visite médicale périodique - Suivi individuel',
          sousTitre: 'Centre CIST Paris Centre',
          employeNom: 'Elias APEDO',
          statut: 'valide',
          dateDebut: '2024-03-15',
          dateFin: '2026-12-15',
          responsable: 'Dr. Martin (Médecin du travail)',
          description: 'Avis d’aptitude médicale sans réserve au poste de Développeur Full-Stack & Mobile. Prochaine visite prévue à échéance de 5 ans.',
          tags: ['Aptitude', 'Conforme'],
          metadata: { aptitude: 'Apte sans réserve', periodicite: '5 ans' },
        },
        {
          moduleKey: 'visites_medicales',
          titre: 'Visite de reprise après congé maternité',
          sousTitre: 'Obligation Code du Travail Art. R.4624-31',
          employeNom: 'Sarah Benali',
          statut: 'planifie',
          dateDebut: '2026-05-10',
          responsable: 'Service RH',
          description: 'Visite obligatoire dans les 8 jours suivant la reprise du travail après un congé maternité.',
          tags: ['Reprise', 'Obligatoire'],
        },
        {
          moduleKey: 'visites_medicales',
          titre: 'Visite d’information et de prévention (VIP) d’embauche',
          sousTitre: 'Contrôle médical initial',
          employeNom: 'Marc Lefebvre',
          statut: 'valide',
          dateDebut: '2024-01-20',
          responsable: 'CIST Médecine du Travail',
          description: 'Visite VIP initiale réalisée dans les 3 mois suivant la prise de fonction. Avis conforme.',
          tags: ['Embauche', 'Conforme'],
        },

        // contrats_avenants
        {
          moduleKey: 'contrats_avenants',
          titre: 'Contrat à Durée Indéterminée (CDI) Cadre',
          sousTitre: 'Convention SYNTEC Position 3.1',
          employeNom: 'Elias APEDO',
          categorie: 'CDI',
          statut: 'signe',
          dateDebut: '2024-03-01',
          montant: 4200,
          responsable: 'Direction Générale',
          description: 'Contrat CDI temps plein avec période d’essai de 4 mois confirmée. Forfait 35h avec 2 jours de télétravail hebdomadaires.',
          tags: ['CDI', 'Cadre'],
        },
        {
          moduleKey: 'contrats_avenants',
          titre: 'Avenant de Promotion & Responsabilité Technique',
          sousTitre: 'Passage Lead Tech et revalorisation',
          employeNom: 'Marc Lefebvre',
          categorie: 'Avenant',
          statut: 'signe',
          dateDebut: '2025-01-01',
          montant: 5100,
          responsable: 'Sophie Legrand, DRH',
          description: 'Avenant au contrat initial entérinant les nouvelles responsabilités de management d’équipe et réévaluation salariale.',
          tags: ['Promotion', 'Signé'],
        },
        {
          moduleKey: 'contrats_avenants',
          titre: 'Contrat d’Apprentissage Master Informatique',
          sousTitre: 'Formation ingénieur logiciel en alternance',
          employeNom: 'Lucas Dubois',
          categorie: 'Alternance',
          statut: 'en_cours',
          dateDebut: '2024-09-01',
          dateFin: '2026-08-31',
          montant: 1850,
          responsable: 'Tuteur : Elias APEDO',
          description: 'Contrat d’apprentissage 24 mois visé par l’OPCO Atlas. Rythme 3 semaines entreprise / 1 semaine école.',
          tags: ['OPCO Atlas', 'Alternance'],
        },

        // titres_sejour
        {
          moduleKey: 'titres_sejour',
          titre: 'Titre de Séjour Passeport Talent - Salarié Qualifié',
          sousTitre: 'Délivré par la Préfecture de Police de Paris',
          employeNom: 'Camille Rousseau',
          statut: 'valide',
          dateFin: '2027-09-30',
          responsable: 'Pôle Juridique RH',
          description: 'Autorisation de travail vérifiée auprès de la préfecture (Code du Travail L.5221-8). Titre pluriannuel de 4 ans.',
          tags: ['Passeport Talent', 'Conforme'],
          metadata: { numeroTitre: '9920184920', prefecture: 'Paris' },
        },
        {
          moduleKey: 'titres_sejour',
          titre: 'Récépissé de Renouvellement de Carte de Séjour',
          sousTitre: 'Demande déposée sur l’ANEF',
          employeNom: 'Elias APEDO',
          statut: 'en_cours',
          dateFin: '2026-11-20',
          responsable: 'Service RH',
          description: 'Dossier de renouvellement complet déposé avec maintien des droits au travail. Attestation de prolongation d’instruction valide.',
          tags: ['ANEF', 'En attente titre'],
        },

        // habilitations
        {
          moduleKey: 'habilitations',
          titre: 'Habilitation Électrique B0 - H0V (Personnel non électricien)',
          sousTitre: 'Norme NF C 18-510',
          employeNom: 'Lucas Dubois',
          statut: 'valide',
          dateFin: '2027-06-15',
          responsable: 'Organisme SOCOTEC',
          description: 'Autorisation d’accès sans surveillance dans les locaux réservés aux électriciens (salles serveurs, baies de brassage).',
          tags: ['Sécurité', 'NF C 18-510'],
        },
        {
          moduleKey: 'habilitations',
          titre: 'Certificat Sauveteur Secouriste du Travail (SST)',
          sousTitre: 'Formation continue INRS',
          employeNom: 'Sarah Benali',
          statut: 'valide',
          dateFin: '2026-10-12',
          responsable: 'Croix-Rouge Française',
          description: 'Formation initiale 14h aux premiers secours en entreprise. Recyclage MAC prévu tous les 24 mois.',
          tags: ['SST', 'Premiers Secours'],
        },

        // heures_supp
        {
          moduleKey: 'heures_supp',
          titre: 'Heures supplémentaires Déploiement Cloud Week-end',
          sousTitre: '6 heures majorées à 125%',
          employeNom: 'Elias APEDO',
          statut: 'valide',
          montant: 215,
          taux: 6,
          dateDebut: '2026-03-22',
          responsable: 'Marc Lefebvre (Manager)',
          description: 'Intervention technique de nuit pour migration de l’infrastructure de base de données sans coupure de service.',
          tags: ['Majoré 125%', 'Payé'],
        },
        {
          moduleKey: 'heures_supp',
          titre: 'Permanence Maintenance Système de Nuit',
          sousTitre: '4 heures majorées à 150%',
          employeNom: 'Marc Lefebvre',
          statut: 'en_attente',
          montant: 180,
          taux: 4,
          dateDebut: '2026-04-05',
          responsable: 'Direction Technique',
          description: 'Résolution d’un incident sur l’API passerelle de production. Validation en attente côté RH.',
          tags: ['Nuit', 'En attente'],
        },

        // teletravail
        {
          moduleKey: 'teletravail',
          titre: 'Charte Télétravail - Rythme 2 Jours / Semaine',
          sousTitre: 'Mardi et Jeudi en distanciel',
          employeNom: 'Elias APEDO',
          statut: 'actif',
          taux: 2,
          responsable: 'Sophie Legrand, DRH',
          description: 'Convention individuelle signée conforme à l’accord d’entreprise. Indemnité mensuelle forfaitaire de 25 € versée.',
          tags: ['2 jours/semaine', 'Actif'],
        },
        {
          moduleKey: 'teletravail',
          titre: 'Convention Télétravail Flexible - 3 Jours',
          sousTitre: 'Lundi, Mercredi et Vendredi',
          employeNom: 'Sarah Benali',
          statut: 'actif',
          taux: 3,
          responsable: 'Manager Pôle Design',
          description: 'Aménagement pour conciliation vie personnelle / professionnelle accordé. Connexion VPN sécurisée active.',
          tags: ['3 jours/semaine', 'Actif'],
        },

        // astreintes
        {
          moduleKey: 'astreintes',
          titre: 'Astreinte Opérationnelle Système Semaine 16',
          sousTitre: 'Disponibilité 24/7 sur incident critique P1',
          employeNom: 'Marc Lefebvre',
          statut: 'confirme',
          montant: 350,
          dateDebut: '2026-04-13',
          dateFin: '2026-04-19',
          responsable: 'Directeur Technique',
          description: 'Forfait astreinte hebdomadaire de 350 € bruts avec engagement d’intervention sous 30 minutes en cas d’alerte.',
          tags: ['Astreinte 24/7', 'Prime'],
        },
        {
          moduleKey: 'astreintes',
          titre: 'Astreinte Support Week-end Pâques',
          sousTitre: 'Samedi et Dimanche de garde',
          employeNom: 'Elias APEDO',
          statut: 'en_attente',
          montant: 250,
          dateDebut: '2026-04-04',
          dateFin: '2026-04-06',
          responsable: 'Pôle Support',
          description: 'Permanence téléphonique et supervision des alertes Datadog.',
          tags: ['Week-end'],
        },

        // conges_speciaux
        {
          moduleKey: 'conges_speciaux',
          titre: 'Congé Naissance & Paternité (28 jours calendaires)',
          sousTitre: 'Code du Travail Art. L.1225-35',
          employeNom: 'Marc Lefebvre',
          statut: 'valide',
          dateDebut: '2026-06-01',
          dateFin: '2026-06-28',
          responsable: 'Service Paie',
          description: '3 jours de naissance employeur + 25 jours indemnisés par la CPAM avec maintien de salaire net par l’entreprise.',
          tags: ['Paternité', 'Légal'],
        },
        {
          moduleKey: 'conges_speciaux',
          titre: 'Congé Exceptionnel pour Mariage (4 jours ouvrés)',
          sousTitre: 'Convention SYNTEC Art. 5.1',
          employeNom: 'Camille Rousseau',
          statut: 'approuve',
          dateDebut: '2026-07-10',
          dateFin: '2026-07-15',
          responsable: 'Sophie Legrand, DRH',
          description: 'Absence rémunérée accordée sur présentation du certificat de mariage civil.',
          tags: ['Mariage', 'Syntec'],
        },

        // recrutement
        {
          moduleKey: 'recrutement',
          titre: 'Lead DevOps / Cloud Platform Engineer (CDI)',
          sousTitre: 'Kubernetes, Terraform, AWS/GCP',
          categorie: 'Tech & Architecture',
          statut: 'ouvert',
          montant: 58000,
          responsable: 'Marc Lefebvre',
          description: 'Poste stratégique pour accompagner la montée en charge. 14 candidatures reçues, 3 short-listés pour les entretiens techniques.',
          tags: ['CDI', 'Prioritaire', 'Paris/Télétravail'],
          metadata: { candidatsCount: 14, enEntretien: 3 },
        },
        {
          moduleKey: 'recrutement',
          titre: 'Senior Product Designer (UI/UX)',
          sousTitre: 'Figma, Design System, Ergonomie SaaS',
          categorie: 'Design & Produit',
          statut: 'entretiens',
          montant: 49000,
          responsable: 'Sarah Benali',
          description: 'Recrutement pour refondre le portail client. Phase 2 : test de cas pratique en cours auprès de 2 finalistes.',
          tags: ['CDI', 'En cours'],
          metadata: { candidatsCount: 22, enEntretien: 2 },
        },
        {
          moduleKey: 'recrutement',
          titre: 'Gestionnaire Paie & Administration du Personnel',
          sousTitre: 'Logiciel Silae, DSN, Déclarations sociales',
          categorie: 'Ressources Humaines',
          statut: 'ouvert',
          montant: 42000,
          responsable: 'Sophie Legrand, DRH',
          description: 'Renfort du pôle RH pour la gestion des bulletins de paie et la veille conventionnelle.',
          tags: ['CDI', 'RH'],
        },

        // cooptation
        {
          moduleKey: 'cooptation',
          titre: 'Cooptation Développeur Backend par Elias APEDO',
          sousTitre: 'Prime versée suite à validation de période d’essai',
          employeNom: 'Elias APEDO',
          statut: 'valide',
          montant: 1500,
          responsable: 'Service RH',
          description: 'Candidat recommandé recruté en CDI. Période d’essai de 4 mois franchie avec succès. Versement de la prime de 1500 € sur la paie.',
          tags: ['Prime versée', 'Succès'],
        },
        {
          moduleKey: 'cooptation',
          titre: 'Parrainage Ingénieur QA / Automatisation',
          sousTitre: 'Candidature en cours de processus',
          employeNom: 'Sarah Benali',
          statut: 'en_attente',
          montant: 1500,
          responsable: 'Recrutement RH',
          description: 'Candidat au stade de l’entretien final avec la direction technique. Prime conditionnée à l’embauche.',
          tags: ['En cours'],
        },

        // mobilite_interne
        {
          moduleKey: 'mobilite_interne',
          titre: 'Souhait d’évolution vers le rôle de Lead Architecte',
          sousTitre: 'Parcours de transition interne',
          employeNom: 'Elias APEDO',
          statut: 'en_revue',
          responsable: 'Direction Technique & DRH',
          description: 'Entretien de carrière mené positivement. Définition conjointe d’un plan de certifications cloud et prise de lead progressive.',
          tags: ['Promotion interne', 'Tech Lead'],
        },
        {
          moduleKey: 'mobilite_interne',
          titre: 'Passerelle transversale Support vers Product Owner',
          sousTitre: 'Montée en compétences fonctionnelles',
          employeNom: 'Lucas Dubois',
          statut: 'valide',
          responsable: 'Pôle Produit',
          description: 'Transition validée après un stage immersif de 2 semaines aux côtés des Product Managers.',
          tags: ['Mobilité acceptée'],
        },

        // referentiel_metiers
        {
          moduleKey: 'referentiel_metiers',
          titre: 'Fiche de Poste : Ingénieur Développeur Full-Stack',
          sousTitre: 'Coefficient Syntec : 170 à 210 | Position 3.1',
          categorie: 'Ingénierie Logicielle',
          statut: 'actif',
          responsable: 'Direction Technique',
          description: 'Missions clés : Conception architecturale, développement React/Node, tests automatisés, participation aux cérémonies Agiles.',
          tags: ['Syntec 3.1', 'Core Business'],
        },
        {
          moduleKey: 'referentiel_metiers',
          titre: 'Fiche de Poste : Responsable Ressources Humaines',
          sousTitre: 'Coefficient Syntec : 210 à 270 | Position 3.2',
          categorie: 'Ressources Humaines',
          statut: 'actif',
          responsable: 'Direction Générale',
          description: 'Missions clés : Pilotage de la masse salariale, dialogue social avec le CSE, conformité Code du Travail, plan de formation.',
          tags: ['Cadre Supérieur'],
        },
        {
          moduleKey: 'referentiel_metiers',
          titre: 'Fiche de Poste : Product Manager SaaS',
          sousTitre: 'Coefficient Syntec : 150 à 180 | Position 2.3',
          categorie: 'Produit & UX',
          statut: 'actif',
          responsable: 'Chief Product Officer',
          description: 'Missions clés : Analyse du marché, roadmap produit, rédaction des user stories et mesure des indicateurs d’usage.',
          tags: ['Produit'],
        },

        // avantages_nature
        {
          moduleKey: 'avantages_nature',
          titre: 'Véhicule Hybride Rechargeable de Fonction (Peugeot 308 PHEV)',
          sousTitre: 'Immatriculation : GK-412-TR',
          employeNom: 'Marc Lefebvre',
          statut: 'attribue',
          montant: 380,
          responsable: 'Gestion Flotte & Paie',
          description: 'Avantage en nature assujetti aux cotisations sociales (380 €/mois sur bulletin de paie). Carte carburant et badge autoroute inclus.',
          tags: ['Véhicule', 'Avantage Paie'],
        },
        {
          moduleKey: 'avantages_nature',
          titre: 'Smartphone Professionnel iPhone 15 Pro & Forfait 5G',
          sousTitre: 'Dotation mobile illimitée',
          employeNom: 'Elias APEDO',
          statut: 'attribue',
          montant: 45,
          responsable: 'Pôle Informatique',
          description: 'Téléphone de service avec forfait international illimité et charte d’usage professionnel/personnel signée.',
          tags: ['Mobile 5G', 'Dotation'],
        },

        // mutuelle_prevoyance
        {
          moduleKey: 'mutuelle_prevoyance',
          titre: 'Mutuelle Santé d’Entreprise Alan Blue (Option Famille)',
          sousTitre: 'Couverture frais de santé responsable',
          employeNom: 'Elias APEDO',
          statut: 'affilie',
          montant: 85,
          taux: 65,
          responsable: 'Alan Assurances / RH',
          description: 'Prise en charge employeur à 65% (55.25 €) et part salarié à 35% (29.75 €). Carte de tiers-payant dématérialisée et téléconsultation 24/7.',
          tags: ['Mutuelle Alan', 'Part employeur 65%'],
        },
        {
          moduleKey: 'mutuelle_prevoyance',
          titre: 'Contrat Prévoyance Incapacité / Invalidité / Décès Cadres',
          sousTitre: 'Régime obligatoire 1.50% CCN Syntec',
          employeNom: 'Sarah Benali',
          statut: 'affilie',
          montant: 48,
          taux: 100,
          responsable: 'Malakoff Humanis',
          description: 'Garantie maintien de salaire à 100% en cas d’arrêt maladie de longue durée après franchise de 90 jours.',
          tags: ['Prévoyance Cadre', 'Syntec'],
        },

        // interessement_epargne
        {
          moduleKey: 'interessement_epargne',
          titre: 'Accord Triennal d’Intéressement aux Résultats (2024-2026)',
          sousTitre: 'Déposé sur TéléAccords - Récépissé DRIEETS',
          categorie: 'Accord collectif',
          statut: 'actif',
          montant: 42000,
          responsable: 'Direction Générale & CSE',
          description: 'Critères basés sur la croissance du chiffre d’affaires et la satisfaction client (NPS > 50). Versement annuel en mai.',
          tags: ['Accord Légal', 'Exonération'],
        },
        {
          moduleKey: 'interessement_epargne',
          titre: 'Campagne d’Arbitrage PEE / PERCOL avec Abondement',
          sousTitre: 'Abondement employeur de 100% jusqu’à 1000 €',
          employeNom: 'Elias APEDO',
          statut: 'valide',
          montant: 1000,
          responsable: 'Natixis Interépargne / RH',
          description: 'Arbitrage effectué sur fonds labellisés ISR (Investissement Socialement Responsable). Exonération fiscale d’impôt sur le revenu.',
          tags: ['PEE', 'Abondement versé'],
        },

        // acompte_salaire
        {
          moduleKey: 'acompte_salaire',
          titre: 'Demande d’Acompte sur Salaire Quinzaine (Code Travail L.3242-1)',
          sousTitre: 'Versement de la fraction de travail accomplie',
          employeNom: 'Lucas Dubois',
          statut: 'valide',
          montant: 600,
          dateDebut: '2026-04-15',
          responsable: 'Service Paie',
          description: 'Virement de 600 € exécuté le 15 du mois correspondant à la moitié de la rémunération mensuelle acquise. Régularisation sur fiche de paie.',
          tags: ['Droit légal', 'Virement émis'],
        },
        {
          moduleKey: 'acompte_salaire',
          titre: 'Demande d’acompte imprévu pour frais médicaux',
          sousTitre: 'Instruction comptable rapide',
          employeNom: 'Camille Rousseau',
          statut: 'en_cours',
          montant: 500,
          dateDebut: '2026-04-18',
          responsable: 'Trésorerie / RH',
          description: 'Demande formulée pour avance sur frais exceptionnels. Approbation RH transmise à la comptabilité.',
          tags: ['En cours de virement'],
        },

        // augmentations
        {
          moduleKey: 'augmentations',
          titre: 'Revalorisation Annuelle au Mérite (+7.5%)',
          sousTitre: 'Revue salariale suite aux résultats 2025',
          employeNom: 'Elias APEDO',
          statut: 'approuve',
          montant: 4515,
          taux: 7.5,
          responsable: 'Marc Lefebvre (N+1) & DRH',
          description: 'Passage du salaire de 4200 € à 4515 € bruts/mois pour saluer les réussites majeures sur l’architecture et le mentorat.',
          tags: ['Mérite', 'Approuvé'],
        },
        {
          moduleKey: 'augmentations',
          titre: 'Rattrapage conventionnel grille Syntec (+3.2%)',
          sousTitre: 'Application accord de branche NAO',
          employeNom: 'Lucas Dubois',
          statut: 'en_cours',
          montant: 1910,
          taux: 3.2,
          responsable: 'Pôle Paie',
          description: 'Mise en conformité avec la revalorisation des minima conventionnels des alternants.',
          tags: ['Syntec NAO'],
        },

        // duerp
        {
          moduleKey: 'duerp',
          titre: 'Risque Troubles Musculo-Squelettiques (TMS) Travail sur Écran',
          sousTitre: 'Unité de travail : Tous postes sédentaires & Télétravail',
          categorie: 'Ergonomie',
          statut: 'critique_moderee',
          priorite: 'Moyenne',
          responsable: 'Référent Santé Sécurité au Travail',
          description: 'Postures assises prolongées. Plan d’action : Dotation de bureaux réglables en hauteur, sièges ergonomiques et séances d’étirements.',
          tags: ['TMS', 'Obligatoire'],
          metadata: { probabilite: 'Forte', gravite: 'Faible', planAction: 'Audit ergonomique 2026' },
        },
        {
          moduleKey: 'duerp',
          titre: 'Risques Psychosociaux (RPS) et Pics de Charge',
          sousTitre: 'Unité de travail : Développeurs & Gestion de projet',
          categorie: 'RPS & Charge mentale',
          statut: 'surveillance',
          priorite: 'Haute',
          responsable: 'Médecin du travail & DRH',
          description: 'Sensibilisation au droit à la déconnexion, révision des échéances de livraison et désignation d’un référent harcèlement moral/sexuel.',
          tags: ['RPS', 'Droit à la déconnexion'],
        },
        {
          moduleKey: 'duerp',
          titre: 'Risque Incendie & Évacuation des Locaux',
          sousTitre: 'Unité de travail : Bureaux 14 rue de la Paix',
          categorie: 'Sécurité Incendie',
          statut: 'maitrise',
          priorite: 'Basse',
          responsable: 'Guide & Serre-file désignés',
          description: 'Vérification annuelle des extincteurs effectuée en janvier 2026. Exercice d’évacuation semestriel programmé.',
          tags: ['Incendie', 'Conforme'],
        },

        // accidents_travail
        {
          moduleKey: 'accidents_travail',
          titre: 'Accident de Trajet Domicile-Bureaux (Chute Mobilité Douce)',
          sousTitre: 'Déclaration CPAM n° AT-2026-003',
          employeNom: 'Lucas Dubois',
          statut: 'clos',
          dateDebut: '2026-01-18',
          dateFin: '2026-02-02',
          responsable: 'Service RH & CPAM',
          description: 'Entorse cheville droite lors du trajet en vélo. Déclaration transmise dans les 48 heures légales. Reprise de poste sans séquelle.',
          tags: ['CPAM 48h', 'Dossier clos'],
        },
        {
          moduleKey: 'accidents_travail',
          titre: 'Registre des Accidents Bénins sans Arrêt (Article L.441-4)',
          sousTitre: 'Coupure superficielle lors d’ouverture d’emballage',
          employeNom: 'Thomas Bernard',
          statut: 'enregistre',
          dateDebut: '2026-03-02',
          responsable: 'Secouriste du Travail (Sarah Benali)',
          description: 'Désinfection et pansement appliqués à l’infirmerie de l’entreprise. Mention inscrite au registre des accidents bénins visé par la CARSAT.',
          tags: ['Registre Bénin', 'Sans arrêt'],
        },

        // cse
        {
          moduleKey: 'cse',
          titre: 'Procès-Verbal de la Réunion Plénière Ordinaire du CSE - Mars 2026',
          sousTitre: 'Adoption à l’unanimité des résolutions',
          categorie: 'Procès-Verbal',
          statut: 'adopte',
          dateDebut: '2026-03-20',
          responsable: 'Secrétaire du CSE & Direction',
          description: 'Ordre du jour : Bilan de la politique de télétravail, approbation des comptes annuels ASC et consultation sur le plan de formation.',
          tags: ['PV Officiel', 'Diffusion Intranet'],
        },
        {
          moduleKey: 'cse',
          titre: 'Budget des Activités Sociales et Culturelles (ASC) 2026',
          sousTitre: 'Subvention légale de 0.8% de la masse salariale brute',
          categorie: 'Finances CSE',
          statut: 'valide',
          montant: 12400,
          responsable: 'Trésorier du CSE',
          description: 'Attribution de chèques vacances (250 €/salarié), subvention billetterie cinéma et événements d’équipe été.',
          tags: ['Budget ASC', 'Avantage Salariés'],
        },
        {
          moduleKey: 'cse',
          titre: 'Registre des Mandats Électoraux des Représentants du Personnel',
          sousTitre: 'Mandats 2024-2028 (Durée 4 ans)',
          categorie: 'Mandats',
          statut: 'actif',
          responsable: 'Inspection du Travail',
          description: 'Liste des 3 membres titulaires et 3 suppléants bénéficiant de la protection légale liée au mandat représentatif.',
          tags: ['Salariés Protégés'],
        },

        // lanceur_alerte
        {
          moduleKey: 'lanceur_alerte',
          titre: 'Dispositif Interne de Recueil des Signalements Éthiques',
          sousTitre: 'Conformité Loi Waserman n° 2022-401 & Décret 2022-1284',
          categorie: 'Protocole Légal',
          statut: 'actif',
          responsable: 'Référent Déontologue Indépendant',
          description: 'Canal chiffré de bout en bout garantissant l’anonymat strict et l’immunité contre toute mesure de représailles ou licenciement.',
          tags: ['Loi Waserman', 'Protection Totale'],
        },
        {
          moduleKey: 'lanceur_alerte',
          titre: 'Dossier de Signalement Clôturé #ALT-2026-01',
          sousTitre: 'Traitement sous délai légal de 3 mois',
          categorie: 'Instruction',
          statut: 'traite',
          responsable: 'Commission d’enquête interne',
          description: 'Signalement instruit dans le respect du contradictoire. Accusé de réception sous 7 jours, clôture avec recommandations préventives.',
          tags: ['Instruit & Clos'],
        },

        // rse_environnement
        {
          moduleKey: 'rse_environnement',
          titre: 'Plan de Mobilité Durable & Forfait Mobilités Douces',
          sousTitre: 'Prise en charge jusqu’à 600 €/an par collaborateur',
          categorie: 'Mobilité Durable',
          statut: 'actif',
          montant: 600,
          responsable: 'Comité RSE & DRH',
          description: 'Indemnité kilométrique vélo et subvention covoiturage pour favoriser les transports décarbonés sur le trajet domicile-travail.',
          tags: ['Éco-responsable', '600 €/an'],
        },
        {
          moduleKey: 'rse_environnement',
          titre: 'Bilan d’Émissions Gaz à Effet de Serre (BEGES) & Numérique Responsable',
          sousTitre: 'Émissions certifiées : 58.4 tonnes CO2 eq.',
          categorie: 'Climat & Numérique',
          statut: 'valide',
          montant: 58.4,
          responsable: 'Comité RSE',
          description: 'Sensibilisation aux bonnes pratiques de sobriété numérique : hébergement éco-conçu, extinction nocturne des serveurs de test.',
          tags: ['Green IT', 'Scope 1-2-3'],
        },

        // sanctions_disciplinaires
        {
          moduleKey: 'sanctions_disciplinaires',
          titre: 'Registre Légal des Sanctions Disciplinaires (Art. L.1332-5)',
          sousTitre: 'Règle d’amnistie légale : effacement automatique après 3 ans',
          categorie: 'Registre Officiel',
          statut: 'conforme',
          responsable: 'Direction des Ressources Humaines',
          description: 'Traçabilité des mesures disciplinaires prises dans le strict respect de la procédure contradictoire et des délais de prescription de 2 mois.',
          tags: ['Code du Travail', 'Registre Confidentiel'],
        },
        {
          moduleKey: 'sanctions_disciplinaires',
          titre: 'Notification d’Avertissement Formel pour Absences Répétées',
          sousTitre: 'Courrier recommandé avec AR',
          employeNom: 'Alexandre Petit',
          categorie: 'Avertissement',
          statut: 'clos',
          dateDebut: '2026-01-12',
          responsable: 'Direction Générale',
          description: 'Entretien préalable tenu en présence du salarié. Notification écrite rappelant l’obligation de transmission des arrêts de travail sous 48h.',
          tags: ['Avertissement', 'Archivé'],
        },
      ];

      await ModuleRecord.insertMany(recordsToSeed);
      console.log(`✅ [Seed DB] ${recordsToSeed.length} enregistrements insérés dans ModuleRecord pour les 28 modules RH !`);
    }

    console.log('🎉 [MongoDB] Base de données 100% synchronisée et persistée !');
  } catch (error) {
    console.error('❌ Erreur lors du seeding MongoDB :', error.message);
  }
}

module.exports = { seedDatabaseIfEmpty };
