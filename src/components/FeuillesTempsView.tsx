import React, { useState } from 'react';
import { TimeLog, Employe } from '../types';
import {
  Clock,
  Plus,
  CheckCircle,
  Home,
  Building,
  TrendingUp,
  Download,
} from 'lucide-react';
import { downloadCsv } from '../services/api';

interface FeuillesTempsViewProps {
  timeLogs: TimeLog[];
  employes: Employe[];
  onNewLog: () => void;
  onValidateLog: (id: string) => Promise<void>;
}

export const FeuillesTempsView: React.FC<FeuillesTempsViewProps> = ({
  timeLogs,
  employes,
  onNewLog,
  onValidateLog,
}) => {
  const totalHeures = timeLogs.reduce((acc, t) => acc + (t.heuresDeclarees || 0), 0);
  const totalSupp = timeLogs.reduce((acc, t) => acc + (t.heuresSupp || 0), 0);
  const totalTeletravailJours = timeLogs.reduce((acc, t) => acc + (t.joursTeletravail || 0), 0);

  const handleExportCsv = () => {
    const headers = ['Collaborateur', 'Semaine', 'Heures Déclarées', 'Heures Supp', 'Présentiel', 'Télétravail', 'Statut'];
    const rows = timeLogs.map((t) => [
      t.employeNom || t.employeId,
      t.semaine,
      String(t.heuresDeclarees),
      String(t.heuresSupp),
      `${t.joursPresentiel} jours`,
      `${t.joursTeletravail} jours`,
      t.statut,
    ]);
    downloadCsv('feuilles_temps_rh.csv', [headers, ...rows]);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* KPI strip */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div className="bg-white p-5 rounded-xl border border-slate-200/90 shadow-xs flex items-center justify-between">
          <div>
            <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Heures Travaillées</div>
            <div className="text-2xl font-bold text-slate-900 mt-1 tabular-nums">{totalHeures}h</div>
          </div>
          <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center text-slate-600">
            <Clock className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200/90 shadow-xs flex items-center justify-between">
          <div>
            <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Heures Supplémentaires</div>
            <div className="text-2xl font-bold text-indigo-600 mt-1 tabular-nums">{totalSupp}h</div>
          </div>
          <div className="w-10 h-10 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600">
            <TrendingUp className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200/90 shadow-xs flex items-center justify-between">
          <div>
            <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Jours de Télétravail Réalisés</div>
            <div className="text-2xl font-bold text-emerald-600 mt-1 tabular-nums">{totalTeletravailJours} jours</div>
          </div>
          <div className="w-10 h-10 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-600">
            <Home className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Control bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200/90 shadow-xs flex items-center justify-between gap-4">
        <div className="text-xs text-slate-600">
          Suivi des déclarations hebdomadaires conformément à l'accord 35 heures & forfait jours
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleExportCsv}
            className="p-2 border border-slate-200 hover:bg-slate-50 text-slate-600 rounded-lg transition-colors cursor-pointer"
            title="Exporter en CSV"
          >
            <Download className="w-4 h-4" />
          </button>

          <button
            onClick={onNewLog}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg shadow-xs transition-colors whitespace-nowrap cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Déclarer des heures</span>
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-slate-200/90 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                <th className="py-3.5 px-6">Collaborateur</th>
                <th className="py-3.5 px-6">Semaine</th>
                <th className="py-3.5 px-6 text-center">Volume Horaire</th>
                <th className="py-3.5 px-6 text-center">Heures Supp</th>
                <th className="py-3.5 px-6">Répartition Site / Home Office</th>
                <th className="py-3.5 px-6">Statut</th>
                <th className="py-3.5 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {timeLogs.map((t) => (
                <tr key={t._id} className="hover:bg-slate-50/70 transition-colors">
                  <td className="py-3.5 px-6 font-semibold text-slate-900">
                    {t.employeNom || t.employeId}
                  </td>
                  <td className="py-3.5 px-6 text-slate-600 tabular-nums text-xs">
                    {t.semaine}
                  </td>
                  <td className="py-3.5 px-6 text-center font-bold text-slate-800 tabular-nums text-xs">
                    {t.heuresDeclarees}h
                  </td>
                  <td className="py-3.5 px-6 text-center font-medium text-indigo-700 tabular-nums text-xs">
                    {t.heuresSupp > 0 ? `+${t.heuresSupp}h` : '—'}
                  </td>
                  <td className="py-3.5 px-6 text-xs text-slate-600">
                    <div className="flex items-center gap-3">
                      <span className="flex items-center gap-1 text-slate-700">
                        <Building className="w-3.5 h-3.5 text-slate-400" />
                        {t.joursPresentiel}j présentiel
                      </span>
                      <span className="flex items-center gap-1 text-emerald-700">
                        <Home className="w-3.5 h-3.5 text-emerald-500" />
                        {t.joursTeletravail}j télétravail
                      </span>
                    </div>
                  </td>
                  <td className="py-3.5 px-6">
                    <span
                      className={`px-2 py-0.5 rounded text-xs font-medium ${
                        t.statut === 'valide'
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : 'bg-amber-50 text-amber-700 border border-amber-200'
                      }`}
                    >
                      {t.statut === 'valide' ? 'Validé' : 'En attente'}
                    </span>
                  </td>
                  <td className="py-3.5 px-6 text-right">
                    {t.statut !== 'valide' && (
                      <button
                        onClick={() => onValidateLog(t._id)}
                        className="px-2.5 py-1 text-xs font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 rounded transition-colors cursor-pointer"
                      >
                        Valider la semaine
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
