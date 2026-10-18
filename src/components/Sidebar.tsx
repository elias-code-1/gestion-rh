import React from 'react';
import { ActiveTab } from '../types';
import {
  LayoutDashboard,
  BarChart3,
  BellRing,
  Users,
  UserPlus,
  Award,
  CalendarCheck,
  UserX,
  CalendarDays,
  Clock,
  Sparkles,
  GraduationCap,
  Target,
  DollarSign,
  Receipt,
  UtensilsCrossed,
  Network,
  FileText,
  Laptop,
  ShieldCheck,
  BriefcaseBusiness,
  Sliders,
  BookOpen,
  Coins,
} from 'lucide-react';

interface SidebarProps {
  activeTab: ActiveTab;
  onTabChange: (tab: ActiveTab) => void;
  pendingCongesCount: number;
  totalEmployesCount: number;
  unjustifiedAbsencesCount: number;
  pendingFraisCount: number;
  alertesCount: number;
}

interface NavCategory {
  title: string;
  items: {
    id: ActiveTab;
    label: string;
    icon: React.ElementType;
    badge?: string;
    alertBadge?: string;
    warningBadge?: string;
  }[];
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  onTabChange,
  pendingCongesCount,
  totalEmployesCount,
  unjustifiedAbsencesCount,
  pendingFraisCount,
  alertesCount,
}) => {
  const categories: NavCategory[] = [
    {
      title: 'Direction & Pilotage',
      items: [
        { id: 'dashboard', label: 'Tableau de bord', icon: LayoutDashboard },
        { id: 'statistiques', label: 'Analyses & KPIs', icon: BarChart3 },
        {
          id: 'alertes',
          label: 'Centre d’Alertes RH',
          icon: BellRing,
          warningBadge: alertesCount > 0 ? String(alertesCount) : undefined,
        },
        { id: 'parametres', label: 'Paramètres & Société', icon: Sliders },
      ],
    },
    {
      title: 'Personnel & Organisation',
      items: [
        {
          id: 'employes',
          label: 'Collaborateurs',
          icon: Users,
          badge: totalEmployesCount > 0 ? String(totalEmployesCount) : undefined,
        },
        { id: 'organigramme', label: 'Organigramme Pôles', icon: Network },
        { id: 'onboarding', label: 'Onboarding & Départs', icon: UserPlus },
        { id: 'rup', label: 'Registre Personnel (RUP)', icon: BookOpen },
      ],
    },
    {
      title: 'Temps & Présences',
      items: [
        {
          id: 'conges',
          label: 'Congés & RTT',
          icon: CalendarCheck,
          alertBadge: pendingCongesCount > 0 ? String(pendingCongesCount) : undefined,
        },
        {
          id: 'absences',
          label: 'Absences & Maladie',
          icon: UserX,
          warningBadge: unjustifiedAbsencesCount > 0 ? String(unjustifiedAbsencesCount) : undefined,
        },
        { id: 'calendrier', label: 'Planning des Présences', icon: CalendarDays },
        { id: 'feuilles_temps', label: 'Feuilles de Temps 35h', icon: Clock },
      ],
    },
    {
      title: 'Talents & Carrières',
      items: [
        { id: 'competences', label: 'Matrice Compétences', icon: Sparkles },
        { id: 'formations', label: 'Plan de Formations', icon: GraduationCap },
        { id: 'entretiens', label: 'Entretiens Annuels', icon: Award },
        { id: 'objectifs', label: 'Objectifs & OKR', icon: Target },
      ],
    },
    {
      title: 'Rémunération & Avantages',
      items: [
        { id: 'salaires', label: 'Masse Salariale', icon: DollarSign },
        { id: 'primes', label: 'Primes & Bonus', icon: Coins },
        {
          id: 'notes_frais',
          label: 'Notes de Frais',
          icon: Receipt,
          alertBadge: pendingFraisCount > 0 ? String(pendingFraisCount) : undefined,
        },
        { id: 'titres_restaurant', label: 'Titres-Restaurant', icon: UtensilsCrossed },
      ],
    },
    {
      title: 'Conformité & Outils',
      items: [
        { id: 'documents', label: 'Attestations & Modèles', icon: FileText },
        { id: 'materiels', label: 'Parc & Équipements', icon: Laptop },
        { id: 'audit', label: 'Journal d’Audit & RGPD', icon: ShieldCheck },
      ],
    },
  ];

  return (
    <aside className="w-68 bg-slate-900 text-slate-300 flex flex-col justify-between shrink-0 select-none border-r border-slate-800">
      <div className="flex flex-col h-full overflow-hidden">
        {/* Brand header */}
        <div className="h-16 flex items-center gap-3 px-5 border-b border-slate-800 shrink-0">
          <div className="w-9 h-9 rounded-lg bg-gradient-to-tr from-indigo-600 to-sky-500 flex items-center justify-center text-white shadow-xs">
            <BriefcaseBusiness className="w-5 h-5" />
          </div>
          <div>
            <div className="text-white font-bold text-sm tracking-tight leading-tight">Dossier RH Suite</div>
            <div className="text-slate-400 text-[11px]">Système de Gestion Intégré</div>
          </div>
        </div>

        {/* Categories scrollable menu */}
        <div className="flex-1 overflow-y-auto px-3 py-3 space-y-4">
          {categories.map((cat, idx) => (
            <div key={idx} className="space-y-1">
              <div className="px-3 pt-1.5 pb-1 text-[10px] font-bold tracking-wider text-slate-500 uppercase">
                {cat.title}
              </div>
              <div className="space-y-0.5">
                {cat.items.map((item) => {
                  const Icon = item.icon;
                  const isActive = activeTab === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => onTabChange(item.id)}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-colors cursor-pointer text-left ${
                        isActive
                          ? 'bg-slate-800 text-white font-semibold shadow-xs'
                          : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                      }`}
                    >
                      <div className="flex items-center gap-2.5 truncate">
                        <Icon className={`w-3.5 h-3.5 shrink-0 ${isActive ? 'text-sky-400' : 'text-slate-400'}`} />
                        <span className="truncate">{item.label}</span>
                      </div>

                      {item.badge && (
                        <span className="text-[10px] font-mono tabular-nums text-slate-400 px-1.5 py-0.2 rounded bg-slate-800 shrink-0 ml-1">
                          {item.badge}
                        </span>
                      )}
                      {item.alertBadge && (
                        <span className="text-[10px] font-mono tabular-nums font-bold text-amber-300 px-1.5 py-0.2 rounded bg-amber-950/80 border border-amber-800/60 shrink-0 ml-1">
                          {item.alertBadge}
                        </span>
                      )}
                      {item.warningBadge && (
                        <span className="text-[10px] font-mono tabular-nums text-rose-300 px-1.5 py-0.2 rounded bg-rose-950/80 border border-rose-800/60 shrink-0 ml-1">
                          {item.warningBadge}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Footer info */}
        <div className="p-3 border-t border-slate-800 text-[11px] text-slate-400 flex items-center justify-between shrink-0 bg-slate-900/90">
          <span className="truncate">Données MongoDB</span>
          <span className="font-mono text-[10px] text-emerald-400 shrink-0 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse inline-block"></span>
            En direct
          </span>
        </div>
      </div>
    </aside>
  );
};
