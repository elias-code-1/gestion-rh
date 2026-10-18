import React from 'react';
import { Employe, Conge, Absence, ActiveTab } from '../types';
import { formatDate, calculateWorkingDays } from '../services/api';
import {
  Users,
  CalendarCheck,
  UserX,
  CheckCircle,
  XCircle,
  TrendingUp,
  ArrowRight,
  Clock,
  Sparkles,
  ShieldAlert,
} from 'lucide-react';

interface DashboardViewProps {
  employes: Employe[];
  conges: Conge[];
  absences: Absence[];
  onNavigate: (tab: ActiveTab) => void;
  onApproveConge: (id: string) => Promise<void>;
  onRejectConge: (id: string) => Promise<void>;
  onSelectEmploye: (employe: Employe) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  employes,
  conges,
  absences,
  onNavigate,
  onApproveConge,
  onRejectConge,
  onSelectEmploye,
}) => {
  const actifs = employes.filter((e) => (e.statut || 'actif') === 'actif');
  const enAttenteConges = conges.filter((c) => c.statut === 'en_attente');
  
  const now = new Date();
  const absencesCeMois = absences.filter((a) => {
    const d = new Date(a.date);
    return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
  });

  const absencesNonJustifiees = absences.filter((a) => !a.justifiee);

  // Today absences or approved conges
  const todayIso = now.toISOString().slice(0, 10);
  const congesAujourdhui = conges.filter((c) => {
    if (c.statut !== 'approuve') return false;
    const start = (c.dateDebut || '').slice(0, 10);
    const end = (c.dateFin || '').slice(0, 10);
    return todayIso >= start && todayIso <= end;
  });

  const absencesAujourdhui = absences.filter((a) => (a.date || '').slice(0, 10) === todayIso);
  const presentsAujourdhui = Math.max(0, actifs.length - (congesAujourdhui.length + absencesAujourdhui.length));
  const tauxPresence = actifs.length > 0 ? Math.round((presentsAujourdhui / actifs.length) * 100) : 100;

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-white p-5 rounded-xl border border-slate-200/90 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Effectif Actif</span>
            <Users className="w-4 h-4 text-slate-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold tracking-tight text-slate-900 tabular-nums">
              {actifs.length}
            </span>
            <span className="text-xs text-slate-500">/ {employes.length} total</span>
          </div>
          <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>Taux de disponibilité</span>
            <span className="font-semibold text-emerald-600 tabular-nums">{tauxPresence}%</span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200/90 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Demandes en attente</span>
            <Clock className="w-4 h-4 text-amber-500" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold tracking-tight text-amber-600 tabular-nums">
              {enAttenteConges.length}
            </span>
            <span className="text-xs text-slate-500">à traiter</span>
          </div>
          <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
            <button
              onClick={() => onNavigate('conges')}
              className="text-amber-700 hover:text-amber-800 font-semibold inline-flex items-center gap-1 cursor-pointer"
            >
              Voir les validations <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200/90 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Absences ce mois</span>
            <UserX className="w-4 h-4 text-slate-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold tracking-tight text-slate-900 tabular-nums">
              {absencesCeMois.length}
            </span>
            <span className="text-xs text-slate-500">journées</span>
          </div>
          <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>Non justifiées</span>
            <span className={`font-semibold tabular-nums ${absencesNonJustifiees.length > 0 ? 'text-rose-600' : 'text-slate-600'}`}>
              {absencesNonJustifiees.length}
            </span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200/90 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Présents Aujourd'hui</span>
            <TrendingUp className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold tracking-tight text-emerald-700 tabular-nums">
              {presentsAujourdhui}
            </span>
            <span className="text-xs text-slate-500">collaborateurs</span>
          </div>
          <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>En congé aujourd'hui</span>
            <span className="font-semibold text-slate-700 tabular-nums">{congesAujourdhui.length}</span>
          </div>
        </div>
      </div>

      {/* Feature Section: Action Prioritaire - Demandes de congés à valider */}
      {enAttenteConges.length > 0 && (
        <div className="bg-amber-50/70 border border-amber-200/80 rounded-xl p-5 shadow-xs">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-amber-700" />
              <h2 className="text-sm font-bold text-amber-950">
                Action requise : {enAttenteConges.length} demande(s) de congé en attente de décision
              </h2>
            </div>
            <button
              onClick={() => onNavigate('conges')}
              className="text-xs font-semibold text-amber-900 hover:underline cursor-pointer"
            >
              Gérer dans l'onglet congés &rarr;
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {enAttenteConges.slice(0, 3).map((conge) => {
              const days = calculateWorkingDays(conge.dateDebut, conge.dateFin);
              return (
                <div key={conge._id} className="bg-white p-4 rounded-lg border border-amber-200/70 shadow-xs flex flex-col justify-between gap-3">
                  <div>
                    <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
                      <span className="font-semibold text-slate-900">{conge.employeNom || 'Collaborateur'}</span>
                      <span className="font-mono tabular-nums bg-amber-100 text-amber-800 px-2 py-0.5 rounded text-[11px]">
                        {days} jour{days > 1 ? 's' : ''}
                      </span>
                    </div>
                    <div className="text-xs text-slate-600">
                      Du {formatDate(conge.dateDebut)} au {formatDate(conge.dateFin)}
                    </div>
                    {conge.commentaire && (
                      <p className="text-xs text-slate-500 italic mt-1 line-clamp-1">
                        « {conge.commentaire} »
                      </p>
                    )}
                  </div>

                  <div className="flex items-center gap-2 pt-2 border-t border-slate-100">
                    <button
                      onClick={() => onApproveConge(conge._id)}
                      className="flex-1 flex items-center justify-center gap-1.5 py-1.5 px-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded text-xs font-semibold transition-colors cursor-pointer"
                    >
                      <CheckCircle className="w-3.5 h-3.5" />
                      <span>Approuver</span>
                    </button>
                    <button
                      onClick={() => onRejectConge(conge._id)}
                      className="flex-1 flex items-center justify-center gap-1.5 py-1.5 px-3 bg-slate-100 hover:bg-rose-50 hover:text-rose-700 hover:border-rose-200 border border-slate-200 text-slate-700 rounded text-xs font-semibold transition-colors cursor-pointer"
                    >
                      <XCircle className="w-3.5 h-3.5" />
                      <span>Refuser</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Main Grid: Dernières demandes & Activités récentes */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Table: Dernières demandes de congé */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200/90 shadow-xs p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-base font-bold text-slate-900">Dernières demandes de congé</h2>
              <p className="text-xs text-slate-500">Historique récent des demandes soumises</p>
            </div>
            <button
              onClick={() => onNavigate('conges')}
              className="text-xs font-semibold text-sky-600 hover:text-sky-700 flex items-center gap-1 cursor-pointer"
            >
              Voir tout <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-slate-200 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  <th className="pb-3">Employé</th>
                  <th className="pb-3">Type</th>
                  <th className="pb-3">Période</th>
                  <th className="pb-3 text-right">Statut</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {conges.slice(0, 5).map((c) => (
                  <tr key={c._id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3 font-medium text-slate-900">{c.employeNom || c.employeId}</td>
                    <td className="py-3 text-slate-600 capitalize text-xs">
                      {c.typeConge === 'paye'
                        ? 'Congé payé'
                        : c.typeConge === 'maladie'
                        ? 'Maladie'
                        : c.typeConge === 'exceptionnel'
                        ? 'Exceptionnel'
                        : 'Sans solde'}
                    </td>
                    <td className="py-3 text-slate-500 tabular-nums text-xs">
                      {formatDate(c.dateDebut)} &rarr; {formatDate(c.dateFin)}
                    </td>
                    <td className="py-3 text-right">
                      <span
                        className={`inline-block px-2 py-0.5 rounded text-xs font-medium tabular-nums ${
                          c.statut === 'approuve'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200/70'
                            : c.statut === 'refuse'
                            ? 'bg-rose-50 text-rose-700 border border-rose-200/70'
                            : 'bg-amber-50 text-amber-700 border border-amber-200/70'
                        }`}
                      >
                        {c.statut === 'approuve' ? 'Approuvé' : c.statut === 'refuse' ? 'Refusé' : 'En attente'}
                      </span>
                    </td>
                  </tr>
                ))}
                {conges.length === 0 && (
                  <tr>
                    <td colSpan={4} className="py-8 text-center text-slate-400 text-xs">
                      Aucune demande de congé enregistrée
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Sidebar Widget: Absences Récentes & Alertes RH */}
        <div className="bg-white rounded-xl border border-slate-200/90 shadow-xs p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-base font-bold text-slate-900">Registre des Absences</h2>
                <p className="text-xs text-slate-500">Derniers signalements d'absence</p>
              </div>
              <button
                onClick={() => onNavigate('absences')}
                className="text-xs font-semibold text-sky-600 hover:text-sky-700 cursor-pointer"
              >
                Voir
              </button>
            </div>

            <div className="space-y-3">
              {absences.slice(0, 4).map((a) => (
                <div key={a._id} className="p-3 rounded-lg border border-slate-100 bg-slate-50/60 flex items-start justify-between gap-3 text-xs">
                  <div>
                    <div className="font-semibold text-slate-900">{a.employeNom || 'Collaborateur'}</div>
                    <div className="text-slate-500 mt-0.5">{a.motif || 'Absence'}</div>
                    <div className="text-slate-400 tabular-nums mt-0.5">{formatDate(a.date)}</div>
                  </div>
                  <div>
                    {a.justifiee ? (
                      <span className="text-[11px] font-medium text-emerald-700 bg-emerald-50 border border-emerald-200 px-1.5 py-0.5 rounded">
                        Justifiée
                      </span>
                    ) : (
                      <span className="text-[11px] font-medium text-rose-700 bg-rose-50 border border-rose-200 px-1.5 py-0.5 rounded">
                        Non justifiée
                      </span>
                    )}
                  </div>
                </div>
              ))}
              {absences.length === 0 && (
                <div className="py-8 text-center text-slate-400 text-xs">
                  Aucune absence déclarée
                </div>
              )}
            </div>
          </div>

          {/* Quick Roster Links */}
          <div className="mt-6 pt-4 border-t border-slate-100">
            <div className="text-xs font-semibold text-slate-900 mb-2">Accès rapide</div>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <button
                onClick={() => onNavigate('calendrier')}
                className="p-2.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-700 font-medium text-left transition-colors cursor-pointer"
              >
                📅 Planning du mois
              </button>
              <button
                onClick={() => onNavigate('organigramme')}
                className="p-2.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-700 font-medium text-left transition-colors cursor-pointer"
              >
                🏢 Organigramme
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
