import React, { useMemo } from 'react';
import { Employe, Conge, Absence } from '../types';
import { calculateWorkingDays } from '../services/api';
import {
  BarChart3,
  PieChart,
  TrendingDown,
  TrendingUp,
  Award,
  Users,
  CalendarCheck,
  Building,
} from 'lucide-react';

interface StatistiquesViewProps {
  employes: Employe[];
  conges: Conge[];
  absences: Absence[];
}

export const StatistiquesView: React.FC<StatistiquesViewProps> = ({
  employes,
  conges,
  absences,
}) => {
  // Department distribution
  const deptDistribution = useMemo(() => {
    const map = new Map<string, number>();
    employes.forEach((e) => {
      const d = e.departement || 'Non affecté';
      map.set(d, (map.get(d) || 0) + 1);
    });
    const total = employes.length || 1;
    return Array.from(map.entries())
      .map(([name, count]) => ({
        name,
        count,
        percent: Math.round((count / total) * 100),
      }))
      .sort((a, b) => b.count - a.count);
  }, [employes]);

  // Leave breakdown by type
  const congeTypes = useMemo(() => {
    const map = new Map<string, number>();
    conges.forEach((c) => {
      const days = calculateWorkingDays(c.dateDebut, c.dateFin);
      const label =
        c.typeConge === 'paye'
          ? 'Congés payés'
          : c.typeConge === 'maladie'
          ? 'Maladie'
          : c.typeConge === 'exceptionnel'
          ? 'Exceptionnels'
          : 'Sans solde';
      map.set(label, (map.get(label) || 0) + days);
    });
    return Array.from(map.entries());
  }, [conges]);

  // Absence motifs
  const absenceMotifs = useMemo(() => {
    const map = new Map<string, number>();
    absences.forEach((a) => {
      const m = a.motif || 'Autre motif';
      map.set(m, (map.get(m) || 0) + 1);
    });
    return Array.from(map.entries()).sort((a, b) => b[1] - a[1]);
  }, [absences]);

  const totalAbsences = absences.length;
  const justifieesPct = totalAbsences > 0
    ? Math.round((absences.filter((a) => a.justifiee).length / totalAbsences) * 100)
    : 100;

  const totalConges = conges.length;
  const approuvesPct = totalConges > 0
    ? Math.round((conges.filter((c) => c.statut === 'approuve').length / totalConges) * 100)
    : 0;

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* KPI Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-white p-5 rounded-xl border border-slate-200/90 shadow-xs">
          <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Effectif Global</div>
          <div className="text-3xl font-bold text-slate-900 mt-2 tabular-nums">{employes.length}</div>
          <p className="text-xs text-slate-400 mt-1">Dont {employes.filter((e) => e.statut === 'actif').length} actifs</p>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200/90 shadow-xs">
          <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Taux de Justification</div>
          <div className="text-3xl font-bold text-emerald-600 mt-2 tabular-nums">{justifieesPct}%</div>
          <p className="text-xs text-slate-400 mt-1">Sur l'ensemble des absences</p>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200/90 shadow-xs">
          <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Validation des Congés</div>
          <div className="text-3xl font-bold text-sky-600 mt-2 tabular-nums">{approuvesPct}%</div>
          <p className="text-xs text-slate-400 mt-1">Taux d'approbation global</p>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200/90 shadow-xs">
          <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Départements</div>
          <div className="text-3xl font-bold text-slate-900 mt-2 tabular-nums">{deptDistribution.length}</div>
          <p className="text-xs text-slate-400 mt-1">Pôles d'activité en service</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Department Workforce Distribution */}
        <div className="bg-white p-6 rounded-xl border border-slate-200/90 shadow-xs">
          <h3 className="text-base font-bold text-slate-900 mb-1">Répartition de l'Effectif par Pôle</h3>
          <p className="text-xs text-slate-500 mb-6">Distribution proportionnelle des collaborateurs</p>

          <div className="space-y-4">
            {deptDistribution.map((dept) => (
              <div key={dept.name} className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-800">{dept.name}</span>
                  <span className="text-slate-500 tabular-nums">
                    {dept.count} membre{dept.count > 1 ? 's' : ''} ({dept.percent}%)
                  </span>
                </div>
                <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-slate-900 rounded-full transition-all duration-300"
                    style={{ width: `${dept.percent}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Absence Motifs Breakdown */}
        <div className="bg-white p-6 rounded-xl border border-slate-200/90 shadow-xs">
          <h3 className="text-base font-bold text-slate-900 mb-1">Motifs Principaux d'Absences</h3>
          <p className="text-xs text-slate-500 mb-6">Fréquence des signalements enregistrés</p>

          <div className="space-y-3">
            {absenceMotifs.map(([motif, count]) => {
              const pct = totalAbsences > 0 ? Math.round((count / totalAbsences) * 100) : 0;
              return (
                <div key={motif} className="p-3 rounded-lg border border-slate-100 bg-slate-50/60 flex items-center justify-between text-xs">
                  <div className="font-medium text-slate-800">{motif}</div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-slate-500 tabular-nums">{count} fois</span>
                    <span className="px-2 py-0.5 rounded bg-slate-200 text-slate-700 font-semibold tabular-nums text-[11px]">
                      {pct}%
                    </span>
                  </div>
                </div>
              );
            })}
            {absenceMotifs.length === 0 && (
              <div className="py-8 text-center text-slate-400 text-xs">
                Aucune absence déclarée
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Leave Days Volume */}
      <div className="bg-white p-6 rounded-xl border border-slate-200/90 shadow-xs">
        <h3 className="text-base font-bold text-slate-900 mb-1">Volume de Jours Posés par Type de Congé</h3>
        <p className="text-xs text-slate-500 mb-6">Consommation des jours ouvrés sur la période</p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {congeTypes.map(([label, days]) => (
            <div key={label} className="p-4 rounded-xl border border-slate-100 bg-slate-50 flex flex-col justify-between">
              <span className="text-xs font-semibold text-slate-600">{label}</span>
              <div className="text-2xl font-bold text-slate-900 mt-2 tabular-nums">
                {days} <span className="text-xs font-normal text-slate-500">jours</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
