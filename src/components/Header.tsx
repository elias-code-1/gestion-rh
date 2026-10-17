import React from 'react';
import { ActiveTab } from '../types';
import { Download, Calendar, Users, Clock, Plus } from 'lucide-react';

interface HeaderProps {
  activeTab: ActiveTab;
  totalEmployes: number;
  pendingConges: number;
  onExportAll: () => void;
  onPrimaryAction?: () => void;
  primaryActionLabel?: string;
}

const TAB_CONFIG: Record<ActiveTab, { category: string; title: string; subtitle: string; actionLabel?: string }> = {
  // Pilotage & Direction
  dashboard: { category: 'Pilotage & Direction', title: 'Tableau de bord', subtitle: "Indicateurs clés et vision synthétique des effectifs", actionLabel: '+ Nouveau collaborateur' },
  statistiques: { category: 'Pilotage & Direction', title: 'Analyses & Bilan Social', subtitle: 'Indicateurs de performance, répartition et décomptes annuels' },
  alertes: { category: 'Pilotage & Direction', title: 'Centre d’Alertes Proactives', subtitle: 'Échéances, visites médicales et régularisations urgentes' },
  parametres: { category: 'Pilotage & Direction', title: 'Paramètres & Société', subtitle: 'Configuration légale, convention collective et temps de travail' },

  // Personnel & Organisation
  employes: { category: 'Personnel & Organisation', title: 'Collaborateurs & Contrats', subtitle: 'Fichiers du personnel, historique et coordonnées professionnelles', actionLabel: '+ Nouvel employé' },
  organigramme: { category: 'Personnel & Organisation', title: 'Organigramme d’Entreprise', subtitle: 'Cartographie hiérarchique et annuaire des départements' },
  onboarding: { category: 'Personnel & Organisation', title: 'Onboarding & Départs', subtitle: 'Parcours d’accueil et protocoles de fin de contrat', actionLabel: '+ Nouveau parcours' },
  rup: { category: 'Personnel & Organisation', title: 'Registre Unique du Personnel (RUP)', subtitle: 'Registre légal obligatoire conforme au Code du travail' },

  // Temps & Présences
  conges: { category: 'Temps & Présences', title: 'Congés & Permissions', subtitle: 'Demandes de congés payés, RTT et arbitrage d’équipe', actionLabel: '+ Poser un congé' },
  absences: { category: 'Temps & Présences', title: 'Registre des Absences', subtitle: 'Signalements d’absence et suivi des justificatifs médicaux', actionLabel: '+ Signaler absence' },
  calendrier: { category: 'Temps & Présences', title: 'Planning des Présences', subtitle: 'Calendrier mensuel des disponibilités et présences sur site' },
  feuilles_temps: { category: 'Temps & Présences', title: 'Feuilles de Temps & 35h', subtitle: 'Suivi hebdomadaire des heures travaillées et heures supplémentaires', actionLabel: '+ Déclarer des heures' },

  // Talents & Formations
  competences: { category: 'Talents & Formations', title: 'Matrice des Compétences', subtitle: 'Cartographie des savoir-faire techniques et managériaux', actionLabel: '+ Ajouter compétence' },
  formations: { category: 'Talents & Formations', title: 'Plan de Formations', subtitle: 'Demandes, budgets alloués et suivi des certifications', actionLabel: '+ Nouvelle formation' },
  entretiens: { category: 'Talents & Formations', title: 'Entretiens Annuels & Évaluations', subtitle: 'Campagnes d’évaluation, entretiens professionnels et objectifs', actionLabel: '+ Programmer un entretien' },
  objectifs: { category: 'Talents & Formations', title: 'Objectifs & OKR', subtitle: 'Alignement stratégique et indicateurs clés de résultats', actionLabel: '+ Définir un objectif' },

  // Rémunération & Avantages
  salaires: { category: 'Rémunération & Avantages', title: 'Masse Salariale & Rémunérations', subtitle: 'Salaires bruts, charges patronales et simulateur d’augmentation' },
  primes: { category: 'Rémunération & Avantages', title: 'Primes & Gratifications', subtitle: 'Bonus sur objectifs, gratifications et primes de fin d’année', actionLabel: '+ Attribuer prime' },
  notes_frais: { category: 'Rémunération & Avantages', title: 'Notes de Frais & Dépenses', subtitle: 'Remboursements professionnels, transports et hébergement', actionLabel: '+ Soumettre note de frais' },
  titres_restaurant: { category: 'Rémunération & Avantages', title: 'Titres-Restaurant', subtitle: 'Calcul mensuel des dotations de déjeuners selon jours prestés' },

  // Conformité & Outils
  documents: { category: 'Conformité & Outils', title: 'Générateur d’Attestations & Modèles', subtitle: 'Édition immédiate d’attestations d’emploi et avenants de travail', actionLabel: '+ Nouveau modèle' },
  materiels: { category: 'Conformité & Outils', title: 'Parc & Matériel Prêté', subtitle: 'Inventaire des équipements informatiques et téléphones', actionLabel: '+ Attribuer matériel' },
  audit: { category: 'Conformité & Outils', title: 'Journal d’Audit & Sécurité', subtitle: 'Traçabilité des actions administratives et registre RGPD' },
};

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  totalEmployes,
  pendingConges,
  onExportAll,
  onPrimaryAction,
  primaryActionLabel,
}) => {
  const config = TAB_CONFIG[activeTab] || {
    category: 'Gestion RH',
    title: activeTab,
    subtitle: '',
  };

  const actionText = primaryActionLabel || config.actionLabel;

  const todayFormatted = new Date().toLocaleDateString('fr-FR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  return (
    <header className="h-18 bg-white border-b border-slate-200/80 px-8 flex items-center justify-between gap-6 shrink-0">
      <div>
        <div className="flex items-center gap-2 text-xs font-medium text-slate-500 mb-0.5">
          <span>Dossier RH</span>
          <span className="text-slate-300">/</span>
          <span>{config.category}</span>
          <span className="text-slate-300">/</span>
          <span className="text-slate-900 font-semibold">{config.title}</span>
        </div>
        <h1 className="text-lg font-bold tracking-tight text-slate-900">{config.title}</h1>
      </div>

      <div className="flex items-center gap-3">
        {/* Date and info */}
        <div className="hidden lg:flex items-center gap-4 text-xs font-medium text-slate-600 border-r border-slate-200 pr-4">
          <div className="flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-slate-400" />
            <span className="capitalize">{todayFormatted}</span>
          </div>
          <div className="flex items-center gap-1.5 tabular-nums">
            <Users className="w-3.5 h-3.5 text-slate-400" />
            <span>{totalEmployes} collaborateurs</span>
          </div>
        </div>

        {/* Global Export Button */}
        <button
          onClick={onExportAll}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors whitespace-nowrap cursor-pointer"
          title="Exporter les données au format CSV"
        >
          <Download className="w-3.5 h-3.5 text-slate-500" />
          <span>Exporter CSV</span>
        </button>

        {/* Dynamic Contextual Action */}
        {actionText && onPrimaryAction && (
          <button
            onClick={onPrimaryAction}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg shadow-xs transition-colors whitespace-nowrap cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>{actionText}</span>
          </button>
        )}
      </div>
    </header>
  );
};
