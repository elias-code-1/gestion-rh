import React, { useState, useMemo } from 'react';
import { Entretien, Employe } from '../types';
import { formatDate, downloadCsv } from '../services/api';
import {
  Award,
  Plus,
  Search,
  Filter,
  Download,
  Star,
  CheckCircle,
  Clock,
  Calendar,
} from 'lucide-react';

interface EntretiensViewProps {
  entretiens: Entretien[];
  employes: Employe[];
  onNewEntretien: () => void;
  onUpdateStatus: (id: string, statut: 'a_planifier' | 'planifie' | 'realise') => Promise<void>;
  onDeleteEntretien: (id: string) => Promise<void>;
}

export const EntretiensView: React.FC<EntretiensViewProps> = ({
  entretiens,
  employes,
  onNewEntretien,
  onUpdateStatus,
  onDeleteEntretien,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const filtered = useMemo(() => {
    return entretiens.filter((e) => {
      const q = searchTerm.toLowerCase();
      const matchesSearch =
        !searchTerm ||
        (e.employeNom && e.employeNom.toLowerCase().includes(q)) ||
        (e.evaluator && e.evaluator.toLowerCase().includes(q)) ||
        (e.objectifs && e.objectifs.toLowerCase().includes(q));

      const matchesStatus = statusFilter === 'all' || e.statut === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [entretiens, searchTerm, statusFilter]);

  const handleExportCsv = () => {
    const headers = ['Collaborateur', 'Type', 'Date', 'Évaluateur', 'Score', 'Statut', 'Objectifs'];
    const rows = filtered.map((e) => [
      e.employeNom || e.employeId,
      e.type === 'annuel' ? 'Entretien Annuel' : 'Entretien Professionnel',
      e.date,
      e.evaluator,
      String(e.noteGlobale),
      e.statut,
      e.objectifs || '',
    ]);
    downloadCsv('campagne_entretiens_rh.csv', [headers, ...rows]);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Search and control bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200/90 shadow-xs flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex flex-1 items-center gap-3 w-full">
          <div className="relative flex-1 max-w-sm">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Rechercher par collaborateur, évaluateur..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-slate-50 hover:bg-slate-100/80 focus:bg-white text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="py-2 pl-3 pr-8 bg-slate-50 hover:bg-slate-100/80 text-xs border border-slate-200 rounded-lg cursor-pointer"
          >
            <option value="all">Tous les états ({entretiens.length})</option>
            <option value="realise">Réalisés</option>
            <option value="planifie">Planifiés</option>
            <option value="a_planifier">À planifier</option>
          </select>
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto justify-end">
          <button
            onClick={handleExportCsv}
            className="p-2 border border-slate-200 hover:bg-slate-50 text-slate-600 rounded-lg transition-colors cursor-pointer"
            title="Exporter en CSV"
          >
            <Download className="w-4 h-4" />
          </button>

          <button
            onClick={onNewEntretien}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg shadow-xs transition-colors whitespace-nowrap cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Programmer un entretien</span>
          </button>
        </div>
      </div>

      {/* Grid of Reviews */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((e) => (
          <div
            key={e._id}
            className="bg-white rounded-xl border border-slate-200/90 shadow-xs p-5 flex flex-col justify-between"
          >
            <div>
              <div className="flex items-start justify-between gap-3 mb-2">
                <div>
                  <h3 className="font-bold text-slate-900 text-sm">{e.employeNom || 'Salarié'}</h3>
                  <span className="text-[11px] text-slate-500 capitalize">
                    {e.type === 'annuel' ? 'Entretien Annuel (EIA)' : 'Entretien Professionnel'}
                  </span>
                </div>

                <div className="flex items-center gap-1 bg-amber-50 text-amber-900 border border-amber-200 px-2 py-0.5 rounded text-xs font-bold tabular-nums">
                  <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
                  <span>{e.noteGlobale} / 5</span>
                </div>
              </div>

              <div className="space-y-1.5 text-xs text-slate-600 mt-3 pt-3 border-t border-slate-100">
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Date d'entretien :</span>
                  <span className="font-medium text-slate-800 tabular-nums">{formatDate(e.date)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Évaluateur :</span>
                  <span className="font-medium text-slate-800">{e.evaluator}</span>
                </div>
              </div>

              {e.objectifs && (
                <div className="mt-3 p-2.5 rounded-lg bg-slate-50 border border-slate-100 text-xs">
                  <span className="text-[11px] font-semibold text-slate-500 block mb-1">
                    Objectifs & Axes d'évolution :
                  </span>
                  <p className="text-slate-700 italic">« {e.objectifs} »</p>
                </div>
              )}
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
              <span
                className={`px-2 py-0.5 rounded text-[11px] font-medium ${
                  e.statut === 'realise'
                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                    : e.statut === 'planifie'
                    ? 'bg-sky-50 text-sky-700 border border-sky-200'
                    : 'bg-amber-50 text-amber-700 border border-amber-200'
                }`}
              >
                {e.statut === 'realise' ? 'Réalisé' : e.statut === 'planifie' ? 'Planifié' : 'À planifier'}
              </span>

              <div className="flex items-center gap-1.5">
                {e.statut !== 'realise' && (
                  <button
                    onClick={() => onUpdateStatus(e._id, 'realise')}
                    className="px-2 py-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 rounded cursor-pointer"
                  >
                    Marquer réalisé
                  </button>
                )}
                <button
                  onClick={() => onDeleteEntretien(e._id)}
                  className="p-1 text-slate-400 hover:text-rose-600 rounded transition-colors cursor-pointer"
                  title="Supprimer"
                >
                  ✕
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
