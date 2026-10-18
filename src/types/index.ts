export type StatutEmploye = 'actif' | 'inactif';

export interface CompetenceItem {
  nom: string;
  niveau: 'Débutant' | 'Intermédiaire' | 'Avancé' | 'Expert';
}

export interface ContactUrgence {
  nom?: string;
  telephone?: string;
  lien?: string;
}

export interface Employe {
  _id: string;
  nom: string;
  prenom: string;
  email: string;
  telephone?: string;
  poste?: string;
  departement?: string;
  dateEmbauche?: string;
  statut: StatutEmploye;
  salaireBrut?: number;
  typeContrat?: string;
  visiteMedicale?: string;
  competences?: CompetenceItem[];
  teletravailJours?: number;
  matricule?: string;
  nationalite?: string;
  iban?: string;
  secuSociale?: string;
  contactUrgence?: ContactUrgence;
}

export type TypeConge = 'paye' | 'maladie' | 'exceptionnel' | 'sans_solde';
export type StatutConge = 'en_attente' | 'approuve' | 'refuse';

export interface Conge {
  _id: string;
  employeId: string;
  employeNom?: string;
  typeConge: TypeConge;
  dateDebut: string;
  dateFin: string;
  statut: StatutConge;
  commentaire?: string;
}

export interface Absence {
  _id: string;
  employeId: string;
  employeNom?: string;
  date: string;
  motif?: string;
  justifiee: boolean;
  commentaire?: string;
}

export interface Formation {
  _id: string;
  employeId: string;
  employeNom?: string;
  titre: string;
  organisme: string;
  cout: number;
  dureeJours: number;
  datePrevue: string;
  statut: 'en_attente' | 'validee' | 'terminee' | 'refusee';
  competenceVisee?: string;
  commentaire?: string;
}

export interface Entretien {
  _id: string;
  employeId: string;
  employeNom?: string;
  type: 'annuel' | 'professionnel' | 'fin_periode_essai' | 'reprise_activite';
  date: string;
  evaluator: string;
  noteGlobale: number;
  statut: 'a_planifier' | 'planifie' | 'realise';
  objectifs?: string;
  souhaitsEvolution?: string;
  remarques?: string;
}

export interface NoteFrais {
  _id: string;
  employeId: string;
  employeNom?: string;
  titre: string;
  montant: number;
  dateDepense: string;
  categorie: 'transport' | 'repas' | 'hebergement' | 'logiciel' | 'autre';
  statut: 'en_attente' | 'validee' | 'remboursee' | 'refusee';
  justificatif?: string;
  remarque?: string;
}

export interface EtapeChecklist {
  id: string;
  label: string;
  terminee: boolean;
  dateValidation?: string;
}

export interface OnboardingItem {
  _id: string;
  employeId: string;
  employeNom?: string;
  phase: 'onboarding' | 'offboarding';
  dateDebut: string;
  tuteur?: string;
  statut?: 'en_cours' | 'termine';
  etapes: EtapeChecklist[];
}

export interface MaterielItem {
  _id: string;
  employeId: string;
  employeNom?: string;
  type: 'ordinateur' | 'smartphone' | 'vehicule' | 'ecran' | 'accessoire' | 'autre';
  nom: string;
  numeroSerie: string;
  dateAttribution: string;
  dateRestitution?: string;
  etat: 'comme_neuf' | 'tres_bon' | 'bon' | 'usage';
  statut?: 'attribue' | 'restitue' | 'en_reparation';
}

export interface TimeLog {
  _id: string;
  employeId: string;
  employeNom?: string;
  semaine: string;
  heuresDeclarees: number;
  heuresSupp: number;
  joursPresentiel: number;
  joursTeletravail: number;
  statut: 'en_attente' | 'valide' | 'rejete';
  commentaire?: string;
}

export interface PrimeItem {
  _id: string;
  employeId: string;
  employeNom?: string;
  titre: string;
  montant: number;
  dateVersement: string;
  motif?: string;
  statut?: 'en_attente' | 'validee' | 'payee';
}

export interface ObjectifItem {
  _id: string;
  employeId: string;
  employeNom?: string;
  titre: string;
  description?: string;
  trimestre: string;
  progression: number;
  echeance?: string;
  statut?: 'non_demarre' | 'en_cours' | 'atteint' | 'depasse' | 'abandonne';
  poids?: number;
}

export interface DocumentRH {
  _id: string;
  titre: string;
  categorie: 'contrat' | 'attestation' | 'avenant' | 'politique' | 'certificat';
  description?: string;
  contenuTemplate: string;
  statut: 'actif' | 'archive';
  dernierUsage?: string;
}

export interface DocumentGenere {
  titre: string;
  employeNom: string;
  dateGeneration: string;
  texteGenere: string;
}

export interface ParametresRH {
  _id?: string;
  nomEntreprise: string;
  siret: string;
  codeNAF: string;
  conventionCollective: string;
  heuresHebdoLegales: number;
  joursCongesAnnuels: number;
  valeurFacialeTicketRestau: number;
  partPatronaleTicketRestau: number;
  seuilAlerteVisiteMedicaleJours: number;
  emailNotificationsRH: string;
  responsableLegal: string;
  adresseEntreprise: string;
}

export interface RUPItem {
  ordre: number;
  matricule: string;
  nom: string;
  prenom: string;
  nationalite: string;
  poste: string;
  departement: string;
  typeContrat: string;
  dateEmbauche?: string;
  statut: string;
  visiteMedicale?: string;
}

export interface AlerteRH {
  id: string;
  categorie: 'conges' | 'absences' | 'conformite' | 'remuneration';
  niveau: 'urgent' | 'moyen' | 'info';
  titre: string;
  description: string;
  lienTab: ActiveTab;
  date?: string;
}

export interface StatsRH {
  totalEmployes: number;
  employesActifs: number;
  employesInactifs: number;
  masseSalarialeBrute: number;
  masseSalarialeAnnuelle: number;
  coutPatronalEstime: number;
  parDepartement: Record<string, number>;
  congesEnAttente: number;
  congesApprouves: number;
  absencesCeMois: number;
  absencesInjustifiees: number;
  budgetFormationEngage: number;
  fraisEnAttenteTotal: number;
  fraisRemboursesTotal: number;
  materielsAttribues: number;
  totalMateriels: number;
  entretiensPlanifies: number;
  tauxAbsenteisme: number;
  teletravailMoyenJours: number;
}

export interface AuditLog {
  _id: string;
  horodatage: string;
  action: string;
  auteur: string;
  details: string;
  type: 'creation' | 'modification' | 'suppression' | 'validation' | 'connexion' | 'frais' | 'competence';
}

export type HRCategory =
  | 'direction'
  | 'personnel'
  | 'temps'
  | 'talents'
  | 'remuneration'
  | 'conformite';

export type ActiveTab =
  // Catégorie 1: Pilotage & Direction
  | 'dashboard'
  | 'statistiques'
  | 'alertes'
  | 'parametres'
  // Catégorie 2: Gestion du Personnel
  | 'employes'
  | 'organigramme'
  | 'onboarding'
  | 'rup'
  // Catégorie 3: Temps, Congés & Présences
  | 'conges'
  | 'absences'
  | 'calendrier'
  | 'feuilles_temps'
  // Catégorie 4: Talents, Compétences & Formations
  | 'competences'
  | 'formations'
  | 'entretiens'
  | 'objectifs'
  // Catégorie 5: Rémunération & Avantages Sociaux
  | 'salaires'
  | 'notes_frais'
  | 'titres_restaurant'
  | 'primes'
  // Catégorie 6: Conformité, Documents & Outils RH
  | 'documents'
  | 'materiels'
  | 'audit';

export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'info';
  message: string;
}
