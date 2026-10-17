import React, { useState, useMemo } from 'react';
import { Formation, Employe } from '../types';
import { formatDate, formatCurrency, downloadCsv } from '../services/api';
import {
  GraduationCap,
  Plus,
  Search,
  Filter,
  Download,
  Calendar,
  CheckCircle,
  Clock,
  Euro,
} from 'lucide-react';

interface FormationsViewProps {
  formations: Formation[];
  employes: Employe[];
  onNewFormation: () => void;
  onUpdateStatus: (id: string, statut: 'en_attente' | 'validee' | 'terminee' | 'refusee') => Promise<void>;
  onDeleteFormation: (id: string) => Promise<void>;
}

export const FormationsView: React.FC<FormationsViewProps> = ({
  formations,
  employes,
  onNewFormation,
  onUpdateStatus,
  onDeleteFormation,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statutFilter, setStatutFilter] = useState<string>('all');

  const filtered = useMemo(() => {
    return formations.filter((f) => {
      const q = searchTerm.toLowerCase();
      const matchesSearch =
        !searchTerm ||
        (f.titre && f.titre.toLowerCase().includes(q)) ||
        (f.employeNom && f.employeNom.toLowerCase().includes(q)) ||
        (f.organisme && f.organisme.toLowerCase().includes(q));

      const matchesStatus = statutFilter === 'all' || f.statut === statutFilter;
      return matchesSearch && matchesStatus;
    });
  }, [formations, searchTerm, statutFilter]);

  const totalBudget = formations.reduce((acc, f) => acc + (f.cout || 0), 0);
  const totalJours = formations.reduce((acc, f) => acc + (f.dureeJours || 0), 0);

  const handleExportCsv = () => {
    const headers = ['Collaborateur', 'Titre Formation', 'Organisme', 'Coût (€)', 'Durée (Jours)', 'Date Prévue', 'Statut'];
    const rows = filtered.map((f) => [
      f.employeNom || f.employeId,
      f.titre,
      f.organisme,
      String(f.cout),
      String(f.dureeJours),
      f.datePrevue,
      f.statut,
    ]);
    downloadCsv('plan_formations_rh.csv', [headers, ...rows]);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* KPI banner */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div className="bg-white p-5 rounded-xl border border-slate-200/90 shadow-xs flex items-center justify-between">
          <div>
            <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Budget Formation Engagé</div>
            <div className="text-2xl font-bold text-slate-900 mt-1 tabular-nums">{formatCurrency(totalBudget)}</div>
          </div>
          <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center text-slate-600">
            <Euro className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200/90 shadow-xs flex items-center justify-between">
          <div>
            <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Jours de Formation</div>
            <div className="text-2xl font-bold text-sky-700 mt-1 tabular-nums">{totalJours} jours</div>
          </div>
          <div className="w-10 h-10 rounded-lg bg-sky-50 flex items-center justify-center text-sky-600">
            <Calendar className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200/90 shadow-xs flex items-center justify-between">
          <div>
            <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Formations Validées / Terminées</div>
            <div className="text-2xl font-bold text-emerald-600 mt-1 tabular-nums">
              {formations.filter((f) => f.statut === 'validee' || f.statut === 'terminee').length}
            </div>
          </div>
          <div className="w-10 h-10 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-600">
            <CheckCircle className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Control bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200/90 shadow-xs flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex flex-1 items-center gap-3 w-full">
          <div className="relative flex-1 max-w-sm">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Rechercher par titre, collaborateur..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-slate-50 hover:bg-slate-100/80 focus:bg-white text-xs border border-slate-200 rounded-lg"
            />
          </div>

          <select
            value={statutFilter}
            onChange={(e) => setStatutFilter(e.target.value)}
            className="py-2 pl-3 pr-8 bg-slate-50 hover:bg-slate-100/80 text-xs border border-slate-200 rounded-lg cursor-pointer"
          >
            <option value="all">Tous statuts ({formations.length})</option>
            <option value="validee">Validées</option>
            <option value="en_attente">En attente</option>
            <option value="terminee">Terminées</option>
            <option value="refusee">Refusées</option>
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
            onClick={onNewFormation}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg shadow-xs transition-colors whitespace-nowrap cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Nouvelle formation</span>
          </button>
        </div>
      </div>

      {/* Formations Table */}
      <div className="bg-white rounded-xl border border-slate-200/90 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                <th className="py-3.5 px-6">Titre de la Formation</th>
                <th className="py-3.5 px-6">Bénéficiaire</th>
                <th className="py-3.5 px-6">Organisme</th>
                <th className="py-3.5 px-6 text-center">Durée</th>
                <th className="py-3.5 px-6 text-right">Coût</th>
                <th className="py-3.5 px-6">Statut</th>
                <th className="py-3.5 px-6 text-right">Décision</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((f) => (
                <tr key={f._id} className="hover:bg-slate-50/70 transition-colors">
                  <td className="py-3.5 px-6 font-semibold text-slate-900 text-xs">
                    {f.titre}
                  </td>
                  <td className="py-3.5 px-6 text-slate-700 text-xs font-medium">
                    {f.employeNom || f.employeId}
                  </td>
                  <td className="py-3.5 px-6 text-slate-500 text-xs">
                    {f.organisme}
                  </td>
                  <td className="py-3.5 px-6 text-center text-xs font-mono tabular-nums text-slate-600">
                    {f.dureeJours} jour{f.dureeJours > 1 ? 's' : ''}
                  </td>
                  <td className="py-3.5 px-6 text-right text-xs font-mono font-bold text-slate-900 tabular-nums">
                    {formatCurrency(f.cout)}
                  </td>
                  <td className="py-3.5 px-6">
                    <span
                      className={`px-2 py-0.5 rounded text-xs font-medium ${
                        f.statut === 'terminee'
                          ? 'bg-slate-100 text-slate-700 border border-slate-200'
                          : f.statut === 'validee'
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : f.statut === 'en_attente'
                          ? 'bg-amber-50 text-amber-700 border border-amber-200'
                          : 'bg-rose-50 text-rose-700 border border-rose-200'
                      }`}
                    >
                      {f.statut === 'terminee'
                        ? 'Terminée'
                        : f.statut === 'validee'
                        ? 'Validée'
                        : f.statut === 'en_attente'
                        ? 'En attente'
                        : 'Refusée'}
                    </span>
                  </td>
                  <td className="py-3.5 px-6 text-right">
                    <div className="inline-flex items-center gap-1.5">
                      {f.statut === 'en_attente' && (
                        <button
                          onClick={() => onUpdateStatus(f._id, 'validee')}
                          className="px-2 py-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 rounded cursor-pointer"
                        >
                          Valider
                        </button>
                      )}
                      {f.statut === 'validee' && (
                        <button
                          onClick={() => onUpdateStatus(f._id, 'terminee')}
                          className="px-2 py-1 text-[11px] font-semibold text-sky-700 bg-sky-50 hover:bg-sky-100 rounded cursor-pointer"
                        >
                          Clôturer
                        </button>
                      )}
                      <button
                        onClick={() => onDeleteFormation(f._id)}
                        className="p-1 text-slate-400 hover:text-rose-600 rounded transition-colors cursor-pointer"
                        title="Supprimer"
                      >
                        ✕
                      </button>
                    </div>
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
