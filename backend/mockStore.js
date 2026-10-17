// In-memory store with rich sample data for enterprise HR operations
let nextEmpId = 6;
let nextAbsId = 4;
let nextCngId = 5;
let nextFormationId = 4;
let nextEntretienId = 4;
let nextFraisId = 5;
let nextOnboardingId = 4;
let nextMaterielId = 6;
let nextLogId = 10;

let employes = [
  {
    _id: 'emp-1',
    nom: 'Dupont',
    prenom: 'Alice',
    email: 'alice.dupont@rh-solution.fr',
    telephone: '01 45 67 89 10',
    poste: 'Directrice RH',
    departement: 'Ressources Humaines',
    dateEmbauche: '2022-03-01',
    statut: 'actif',
    salaireBrut: 4800,
    visiteMedicale: '2025-04-12',
    competences: [
      { nom: 'Droit du Travail', niveau: 'Expert' },
      { nom: 'Gestion des Conflits', niveau: 'Avancé' },
      { nom: 'Recrutement Cadres', niveau: 'Expert' },
    ],
    teletravailJours: 2,
  },
  {
    _id: 'emp-2',
    nom: 'Martin',
    prenom: 'Thomas',
    email: 'thomas.martin@rh-solution.fr',
    telephone: '06 12 34 56 78',
    poste: 'Développeur Full-Stack',
    departement: 'Informatique',
    dateEmbauche: '2023-06-15',
    statut: 'actif',
    salaireBrut: 3900,
    visiteMedicale: '2025-09-20',
    competences: [
      { nom: 'React & TypeScript', niveau: 'Expert' },
      { nom: 'Node.js & Express', niveau: 'Avancé' },
      { nom: 'Architecture Cloud', niveau: 'Intermédiaire' },
    ],
    teletravailJours: 3,
  },
  {
    _id: 'emp-3',
    nom: 'Bernard',
    prenom: 'Camille',
    email: 'camille.bernard@rh-solution.fr',
    telephone: '06 98 76 54 32',
    poste: 'Chef de Projet',
    departement: 'Marketing',
    dateEmbauche: '2021-11-01',
    statut: 'actif',
    salaireBrut: 4200,
    visiteMedicale: '2025-01-15',
    competences: [
      { nom: 'Stratégie Digitale', niveau: 'Expert' },
      { nom: 'SEO & Content', niveau: 'Avancé' },
      { nom: 'Gestion de Budget', niveau: 'Avancé' },
    ],
    teletravailJours: 2,
  },
  {
    _id: 'emp-4',
    nom: 'Petit',
    prenom: 'Lucas',
    email: 'lucas.petit@rh-solution.fr',
    telephone: '07 23 45 67 89',
    poste: 'Designer UX/UI',
    departement: 'Produit',
    dateEmbauche: '2024-02-10',
    statut: 'actif',
    salaireBrut: 3400,
    visiteMedicale: '2024-02-15',
    competences: [
      { nom: 'Figma & Design System', niveau: 'Expert' },
      { nom: 'Recherche Utilisateur', niveau: 'Avancé' },
      { nom: 'Prototypage Interactif', niveau: 'Avancé' },
    ],
    teletravailJours: 2,
  },
  {
    _id: 'emp-5',
    nom: 'Robert',
    prenom: 'Sophie',
    email: 'sophie.robert@rh-solution.fr',
    telephone: '01 23 98 76 54',
    poste: 'Comptable',
    departement: 'Finance',
    dateEmbauche: '2020-09-01',
    statut: 'inactif',
    salaireBrut: 3100,
    visiteMedicale: '2023-10-10',
    competences: [
      { nom: 'Clôture Mensuelle', niveau: 'Expert' },
      { nom: 'Paie & Déclarations', niveau: 'Avancé' },
    ],
    teletravailJours: 1,
  },
];

let absences = [
  {
    _id: 'abs-1',
    employeId: 'emp-2',
    employeNom: 'Thomas Martin',
    date: new Date().toISOString().slice(0, 10),
    motif: 'Rendez-vous médical',
    justifiee: true,
    commentaire: 'Attestation médicale fournie',
  },
  {
    _id: 'abs-2',
    employeId: 'emp-4',
    employeNom: 'Lucas Petit',
    date: new Date(Date.now() - 2 * 86400000).toISOString().slice(0, 10),
    motif: 'Panne de transport',
    justifiee: false,
    commentaire: 'Retard de train le matin',
  },
  {
    _id: 'abs-3',
    employeId: 'emp-3',
    employeNom: 'Camille Bernard',
    date: '2026-09-15',
    motif: 'Urgence personnelle',
    justifiee: true,
    commentaire: 'Validé avec le manager',
  },
];

let conges = [
  {
    _id: 'cng-1',
    employeId: 'emp-1',
    employeNom: 'Alice Dupont',
    typeConge: 'paye',
    dateDebut: '2026-10-24',
    dateFin: '2026-10-31',
    statut: 'en_attente',
    commentaire: "Congés d'automne",
  },
  {
    _id: 'cng-2',
    employeId: 'emp-2',
    employeNom: 'Thomas Martin',
    typeConge: 'paye',
    dateDebut: '2026-11-02',
    dateFin: '2026-11-06',
    statut: 'approuve',
    commentaire: 'Vacances prévues',
  },
  {
    _id: 'cng-3',
    employeId: 'emp-3',
    employeNom: 'Camille Bernard',
    typeConge: 'maladie',
    dateDebut: '2026-10-05',
    dateFin: '2026-10-07',
    statut: 'approuve',
    commentaire: 'Arrêt de travail transmis',
  },
  {
    _id: 'cng-4',
    employeId: 'emp-4',
    employeNom: 'Lucas Petit',
    typeConge: 'exceptionnel',
    dateDebut: '2026-11-15',
    dateFin: '2026-11-16',
    statut: 'en_attente',
    commentaire: 'Événement familial',
  },
];

let formations = [
  {
    _id: 'form-1',
    employeId: 'emp-2',
    employeNom: 'Thomas Martin',
    titre: 'Certification Kubernetes & DevOps Cloud',
    organisme: 'Linux Foundation',
    cout: 1850,
    dureeJours: 5,
    datePrevue: '2026-11-20',
    statut: 'validee',
  },
  {
    _id: 'form-2',
    employeId: 'emp-4',
    employeNom: 'Lucas Petit',
    titre: 'Design Accessible & Normes RGAA',
    organisme: 'Institut Design Numérique',
    cout: 950,
    dureeJours: 3,
    datePrevue: '2026-12-05',
    statut: 'en_attente',
  },
  {
    _id: 'form-3',
    employeId: 'emp-3',
    employeNom: 'Camille Bernard',
    titre: 'Management Transversal et Leadership Positif',
    organisme: 'HEC Executive',
    cout: 2400,
    dureeJours: 4,
    datePrevue: '2026-10-10',
    statut: 'terminee',
  },
];

let entretiens = [
  {
    _id: 'ent-1',
    employeId: 'emp-2',
    employeNom: 'Thomas Martin',
    type: 'annuel',
    date: '2026-11-10',
    evaluator: 'Alice Dupont',
    noteGlobale: 4.5,
    statut: 'planifie',
    objectifs: 'Optimiser la performance de la base de données et monter en compétence DevOps',
  },
  {
    _id: 'ent-2',
    employeId: 'emp-4',
    employeNom: 'Lucas Petit',
    type: 'professionnel',
    date: '2026-09-20',
    evaluator: 'Camille Bernard',
    noteGlobale: 4.8,
    statut: 'realise',
    objectifs: 'Livraison du nouveau design system et animation des ateliers utilisateurs',
  },
  {
    _id: 'ent-3',
    employeId: 'emp-3',
    employeNom: 'Camille Bernard',
    type: 'annuel',
    date: '2026-12-01',
    evaluator: 'Direction Générale',
    noteGlobale: 4.2,
    statut: 'a_planifier',
    objectifs: 'Développement de la stratégie d’acquisition B2B',
  },
];

let notesFrais = [
  {
    _id: 'ndf-1',
    employeId: 'emp-2',
    employeNom: 'Thomas Martin',
    titre: 'Billet de train Salon Tech Paris',
    montant: 142.5,
    dateDepense: '2026-10-08',
    categorie: 'transport',
    statut: 'en_attente',
    justificatif: 'SNCF_e-ticket_oct2026.pdf',
  },
  {
    _id: 'ndf-2',
    employeId: 'emp-3',
    employeNom: 'Camille Bernard',
    titre: 'Déjeuner client grand compte',
    montant: 98.0,
    dateDepense: '2026-10-12',
    categorie: 'repas',
    statut: 'validee',
    justificatif: 'Facture_Brasserie_Saint_Germain.pdf',
  },
  {
    _id: 'ndf-3',
    employeId: 'emp-4',
    employeNom: 'Lucas Petit',
    titre: 'Abonnement mensuel Plugin Figma Design',
    montant: 45.0,
    dateDepense: '2026-10-01',
    categorie: 'logiciel',
    statut: 'remboursee',
    justificatif: 'Invoice_Figma_plugin.pdf',
  },
  {
    _id: 'ndf-4',
    employeId: 'emp-1',
    employeNom: 'Alice Dupont',
    titre: 'Hôtel Congrès RH Lyon',
    montant: 215.0,
    dateDepense: '2026-09-28',
    categorie: 'hebergement',
    statut: 'remboursee',
    justificatif: 'Facture_Novotel_Lyon.pdf',
  },
];

let onboardings = [
  {
    _id: 'onb-1',
    employeId: 'emp-4',
    employeNom: 'Lucas Petit',
    phase: 'onboarding',
    dateDebut: '2024-02-10',
    tuteur: 'Camille Bernard',
    etapes: [
      { id: '1', label: 'Signature du contrat et remise du livret d’accueil', terminee: true },
      { id: '2', label: 'Création des comptes email, Slack et outils', terminee: true },
      { id: '3', label: 'Attribution du MacBook Pro et des accès sécurisés', terminee: true },
      { id: '4', label: 'Visite médicale d’information et de prévention', terminee: true },
      { id: '5', label: 'Bilan de fin de période d’essai', terminee: false },
    ],
  },
  {
    _id: 'onb-2',
    employeId: 'emp-2',
    employeNom: 'Thomas Martin',
    phase: 'onboarding',
    dateDebut: '2023-06-15',
    tuteur: 'Alice Dupont',
    etapes: [
      { id: '1', label: 'Signature contrat & mutuelle', terminee: true },
      { id: '2', label: 'Poste de travail configuré', terminee: true },
      { id: '3', label: 'Rencontre avec l’équipe projet', terminee: true },
      { id: '4', label: 'Période d’essai validée avec succès', terminee: true },
    ],
  },
  {
    _id: 'onb-3',
    employeId: 'emp-5',
    employeNom: 'Sophie Robert',
    phase: 'offboarding',
    dateDebut: '2026-09-01',
    tuteur: 'Alice Dupont',
    etapes: [
      { id: '1', label: 'Entretien de départ RH réalisé', terminee: true },
      { id: '2', label: 'Restitution du matériel informatique et du badge', terminee: true },
      { id: '3', label: 'Calcul et signature du solde de tout compte', terminee: true },
      { id: '4', label: 'Révocation des accès systèmes et redirection mail', terminee: true },
    ],
  },
];

let materiels = [
  {
    _id: 'mat-1',
    employeId: 'emp-2',
    employeNom: 'Thomas Martin',
    type: 'ordinateur',
    nom: 'MacBook Pro 16" M3 Pro 36Go',
    numeroSerie: 'C02G9012MD6T',
    dateAttribution: '2023-06-15',
    etat: 'tres_bon',
  },
  {
    _id: 'mat-2',
    employeId: 'emp-4',
    employeNom: 'Lucas Petit',
    type: 'ordinateur',
    nom: 'MacBook Pro 14" M3 18Go',
    numeroSerie: 'C02K1098MD4P',
    dateAttribution: '2024-02-10',
    etat: 'comme_neuf',
  },
  {
    _id: 'mat-3',
    employeId: 'emp-1',
    employeNom: 'Alice Dupont',
    type: 'smartphone',
    nom: 'iPhone 15 Pro 128Go',
    numeroSerie: 'DX4H7821PQ9L',
    dateAttribution: '2023-10-01',
    etat: 'bon',
  },
  {
    _id: 'mat-4',
    employeId: 'emp-3',
    employeNom: 'Camille Bernard',
    type: 'ordinateur',
    nom: 'Dell XPS 15 32Go i7',
    numeroSerie: 'DL98230198XA',
    dateAttribution: '2022-01-10',
    etat: 'bon',
  },
  {
    _id: 'mat-5',
    employeId: 'emp-1',
    employeNom: 'Alice Dupont',
    type: 'autre',
    nom: 'Badge d’accès sécurisé Direction',
    numeroSerie: 'BDG-001-DIR',
    dateAttribution: '2022-03-01',
    etat: 'comme_neuf',
  },
];

let timeLogs = [
  {
    _id: 'tl-1',
    employeId: 'emp-2',
    employeNom: 'Thomas Martin',
    semaine: '2026-W42',
    heuresDeclarees: 37.5,
    heuresSupp: 2.5,
    joursPresentiel: 2,
    joursTeletravail: 3,
    statut: 'valide',
  },
  {
    _id: 'tl-2',
    employeId: 'emp-3',
    employeNom: 'Camille Bernard',
    semaine: '2026-W42',
    heuresDeclarees: 35.0,
    heuresSupp: 0,
    joursPresentiel: 3,
    joursTeletravail: 2,
    statut: 'valide',
  },
  {
    _id: 'tl-3',
    employeId: 'emp-4',
    employeNom: 'Lucas Petit',
    semaine: '2026-W42',
    heuresDeclarees: 38.0,
    heuresSupp: 3.0,
    joursPresentiel: 3,
    joursTeletravail: 2,
    statut: 'en_attente',
  },
];

let auditLogs = [
  {
    _id: 'log-1',
    horodatage: '2026-10-17T09:12:00Z',
    action: 'Connexion administrateur RH',
    auteur: 'Système Sécurisé',
    details: 'Initialisation de la session RH',
    type: 'connexion',
  },
  {
    _id: 'log-2',
    horodatage: '2026-10-17T09:15:30Z',
    action: 'Validation de congé approuvé',
    auteur: 'Alice Dupont',
    details: 'Congé payé validé pour Thomas Martin (2 jours)',
    type: 'validation',
  },
  {
    _id: 'log-3',
    horodatage: '2026-10-16T14:40:00Z',
    action: 'Déclaration absence',
    auteur: 'Lucas Petit',
    details: 'Absence pour motif : Panne de transport',
    type: 'creation',
  },
  {
    _id: 'log-4',
    horodatage: '2026-10-15T11:20:00Z',
    action: 'Note de frais soumise',
    auteur: 'Thomas Martin',
    details: 'Déplacement professionnel SNCF (142.50 €)',
    type: 'frais',
  },
  {
    _id: 'log-5',
    horodatage: '2026-10-14T16:00:00Z',
    action: 'Matrice de compétences mise à jour',
    auteur: 'Direction Technique',
    details: 'Évaluation niveau React & TypeScript : Expert pour Thomas Martin',
    type: 'competence',
  },
];

module.exports = {
  // Employés
  getEmployes: () => [...employes],
  getEmployeById: (id) => employes.find((e) => e._id === id),
  createEmploye: (data) => {
    const newEmp = { ...data, _id: `emp-${nextEmpId++}` };
    employes.push(newEmp);
    auditLogs.unshift({
      _id: `log-${nextLogId++}`,
      horodatage: new Date().toISOString(),
      action: 'Création collaborateur',
      auteur: 'Gestionnaire RH',
      details: `Ajout de ${newEmp.prenom} ${newEmp.nom} (${newEmp.poste || 'Salarié'})`,
      type: 'creation',
    });
    return newEmp;
  },
  updateEmploye: (id, data) => {
    const idx = employes.findIndex((e) => e._id === id);
    if (idx !== -1) {
      employes[idx] = { ...employes[idx], ...data, _id: id };
      auditLogs.unshift({
        _id: `log-${nextLogId++}`,
        horodatage: new Date().toISOString(),
        action: 'Mise à jour collaborateur',
        auteur: 'Gestionnaire RH',
        details: `Modification du dossier de ${employes[idx].prenom} ${employes[idx].nom}`,
        type: 'modification',
      });
      return employes[idx];
    }
    return null;
  },
  deleteEmploye: (id) => {
    const emp = employes.find((e) => e._id === id);
    const initial = employes.length;
    employes = employes.filter((e) => e._id !== id);
    if (emp) {
      auditLogs.unshift({
        _id: `log-${nextLogId++}`,
        horodatage: new Date().toISOString(),
        action: 'Suppression collaborateur',
        auteur: 'Gestionnaire RH',
        details: `Départ / suppression de ${emp.prenom} ${emp.nom}`,
        type: 'suppression',
      });
    }
    return employes.length < initial;
  },

  // Absences
  getAbsences: () => [...absences],
  createAbsence: (data) => {
    let employeNom = data.employeNom;
    if (!employeNom && data.employeId) {
      const emp = employes.find((e) => e._id === data.employeId);
      if (emp) employeNom = `${emp.prenom} ${emp.nom}`;
    }
    const newAbs = { ...data, employeNom, _id: `abs-${nextAbsId++}` };
    absences.push(newAbs);
    auditLogs.unshift({
      _id: `log-${nextLogId++}`,
      horodatage: new Date().toISOString(),
      action: 'Signalement absence',
      auteur: 'Système RH',
      details: `Absence déclarée pour ${newAbs.employeNom} le ${newAbs.date}`,
      type: 'creation',
    });
    return newAbs;
  },
  updateAbsence: (id, data) => {
    const idx = absences.findIndex((a) => a._id === id);
    if (idx !== -1) {
      absences[idx] = { ...absences[idx], ...data, _id: id };
      return absences[idx];
    }
    return null;
  },
  deleteAbsence: (id) => {
    const initial = absences.length;
    absences = absences.filter((a) => a._id !== id);
    return absences.length < initial;
  },

  // Conges
  getConges: () => [...conges],
  createConge: (data) => {
    let employeNom = data.employeNom;
    if (!employeNom && data.employeId) {
      const emp = employes.find((e) => e._id === data.employeId);
      if (emp) employeNom = `${emp.prenom} ${emp.nom}`;
    }
    const newCng = { ...data, employeNom, _id: `cng-${nextCngId++}` };
    conges.push(newCng);
    auditLogs.unshift({
      _id: `log-${nextLogId++}`,
      horodatage: new Date().toISOString(),
      action: 'Demande de congé',
      auteur: newCng.employeNom || 'Salarié',
      details: `Demande de ${newCng.typeConge} du ${newCng.dateDebut} au ${newCng.dateFin}`,
      type: 'creation',
    });
    return newCng;
  },
  updateConge: (id, data) => {
    const idx = conges.findIndex((c) => c._id === id);
    if (idx !== -1) {
      conges[idx] = { ...conges[idx], ...data, _id: id };
      if (data.statut) {
        auditLogs.unshift({
          _id: `log-${nextLogId++}`,
          horodatage: new Date().toISOString(),
          action: `Congé ${data.statut === 'approuve' ? 'approuvé' : data.statut === 'refuse' ? 'refusé' : 'modifié'}`,
          auteur: 'Validateur RH',
          details: `Décision sur la demande de ${conges[idx].employeNom} : statut ${data.statut}`,
          type: 'validation',
        });
      }
      return conges[idx];
    }
    return null;
  },
  deleteConge: (id) => {
    const initial = conges.length;
    conges = conges.filter((c) => c._id !== id);
    return conges.length < initial;
  },

  // Formations
  getFormations: () => [...formations],
  createFormation: (data) => {
    const newF = { ...data, _id: `form-${nextFormationId++}` };
    formations.push(newF);
    return newF;
  },
  updateFormation: (id, data) => {
    const idx = formations.findIndex((f) => f._id === id);
    if (idx !== -1) {
      formations[idx] = { ...formations[idx], ...data, _id: id };
      return formations[idx];
    }
    return null;
  },
  deleteFormation: (id) => {
    formations = formations.filter((f) => f._id !== id);
    return true;
  },

  // Entretiens
  getEntretiens: () => [...entretiens],
  createEntretien: (data) => {
    const newE = { ...data, _id: `ent-${nextEntretienId++}` };
    entretiens.push(newE);
    return newE;
  },
  updateEntretien: (id, data) => {
    const idx = entretiens.findIndex((e) => e._id === id);
    if (idx !== -1) {
      entretiens[idx] = { ...entretiens[idx], ...data, _id: id };
      return entretiens[idx];
    }
    return null;
  },
  deleteEntretien: (id) => {
    entretiens = entretiens.filter((e) => e._id !== id);
    return true;
  },

  // Notes de frais
  getNotesFrais: () => [...notesFrais],
  createNoteFrais: (data) => {
    const newF = { ...data, _id: `ndf-${nextFraisId++}` };
    notesFrais.push(newF);
    return newF;
  },
  updateNoteFrais: (id, data) => {
    const idx = notesFrais.findIndex((f) => f._id === id);
    if (idx !== -1) {
      notesFrais[idx] = { ...notesFrais[idx], ...data, _id: id };
      return notesFrais[idx];
    }
    return null;
  },
  deleteNoteFrais: (id) => {
    notesFrais = notesFrais.filter((f) => f._id !== id);
    return true;
  },

  // Onboardings
  getOnboardings: () => [...onboardings],
  updateOnboarding: (id, data) => {
    const idx = onboardings.findIndex((o) => o._id === id);
    if (idx !== -1) {
      onboardings[idx] = { ...onboardings[idx], ...data, _id: id };
      return onboardings[idx];
    }
    return null;
  },
  createOnboarding: (data) => {
    const newO = { ...data, _id: `onb-${nextOnboardingId++}` };
    onboardings.push(newO);
    return newO;
  },

  // Matériels
  getMateriels: () => [...materiels],
  createMateriel: (data) => {
    const newM = { ...data, _id: `mat-${nextMaterielId++}` };
    materiels.push(newM);
    return newM;
  },
  updateMateriel: (id, data) => {
    const idx = materiels.findIndex((m) => m._id === id);
    if (idx !== -1) {
      materiels[idx] = { ...materiels[idx], ...data, _id: id };
      return materiels[idx];
    }
    return null;
  },
  deleteMateriel: (id) => {
    materiels = materiels.filter((m) => m._id !== id);
    return true;
  },

  // Feuilles de temps
  getTimeLogs: () => [...timeLogs],
  createTimeLog: (data) => {
    const newT = { ...data, _id: `tl-${Date.now()}` };
    timeLogs.push(newT);
    return newT;
  },
  updateTimeLog: (id, data) => {
    const idx = timeLogs.findIndex((t) => t._id === id);
    if (idx !== -1) {
      timeLogs[idx] = { ...timeLogs[idx], ...data, _id: id };
      return timeLogs[idx];
    }
    return null;
  },

  // Audit Logs
  getAuditLogs: () => [...auditLogs],
};
