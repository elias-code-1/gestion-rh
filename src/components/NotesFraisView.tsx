import React, { useState, useMemo } from 'react';
import { NoteFrais, Employe } from '../types';
import { formatDate, formatCurrency, downloadCsv } from '../services/api';
import {
  Receipt,
  Plus,
  Search,
  Filter,
  Download,
  CheckCircle,
  Clock,
  XCircle,
  FileText,
} from 'lucide-react';

interface NotesFraisViewProps {
  notesFrais: NoteFrais[];
  employes: Employe[];
  onNewNoteFrais: () => void;
  onUpdateStatus: (id: string, statut: 'en_attente' | 'validee' | 'remboursee' | 'refusee') => Promise<void>;
  onDeleteNoteFrais: (id: string) => Promise<void>;
}

export const NotesFraisView: React.FC<NotesFraisViewProps> = ({
  notesFrais,
  employes,
  onNewNoteFrais,
  onUpdateStatus,
  onDeleteNoteFrais,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statutFilter, setStatutFilter] = useState<string>('all');

  const filtered = useMemo(() => {
    return notesFrais.filter((n) => {
      const q = searchTerm.toLowerCase();
      const matchesSearch =
        !searchTerm ||
        (n.titre && n.titre.toLowerCase().includes(q)) ||
        (n.employeNom && n.employeNom.toLowerCase().includes(q));
      const matchesStatus = statutFilter === 'all' || n.statut === statutFilter;
      return matchesSearch && matchesStatus;
    });
  }, [notesFrais, searchTerm, statutFilter]);

  const totalEnAttente = notesFrais
    .filter((n) => n.statut === 'en_attente')
    .reduce((acc, n) => acc + n.montant, 0);

  const totalRembourse = notesFrais
    .filter((n) => n.statut === 'remboursee')
    .reduce((acc, n) => acc + n.montant, 0);

  const handleExportCsv = () => {
    const headers = ['Collaborateur', 'Libellé', 'Catégorie', 'Date', 'Montant (€)', 'Statut'];
    const rows = filtered.map((n) => [
      n.employeNom || n.employeId,
      n.titre,
      n.categorie,
      n.dateDepense,
      String(n.montant),
      n.statut,
    ]);
    downloadCsv('notes_frais_rh.csv', [headers, ...rows]);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div className="bg-white p-5 rounded-xl border border-slate-200/90 shadow-xs flex items-center justify-between">
          <div>
            <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">En attente de validation</div>
            <div className="text-2xl font-bold text-amber-600 mt-1 tabular-nums">{formatCurrency(totalEnAttente)}</div>
          </div>
          <div className="w-10 h-10 rounded-lg bg-amber-50 flex items-center justify-center text-amber-600">
            <Clock className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200/90 shadow-xs flex items-center justify-between">
          <div>
            <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Remboursé</div>
            <div className="text-2xl font-bold text-emerald-600 mt-1 tabular-nums">{formatCurrency(totalRembourse)}</div>
          </div>
          <div className="w-10 h-10 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-600">
            <CheckCircle className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200/90 shadow-xs flex items-center justify-between">
          <div>
            <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Nombre de Notes Déposées</div>
            <div className="text-2xl font-bold text-slate-900 mt-1 tabular-nums">{notesFrais.length}</div>
          </div>
          <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center text-slate-600">
            <Receipt className="w-5 h-5" />
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
              placeholder="Rechercher par collaborateur, libellé..."
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
            <option value="all">Tous statuts ({notesFrais.length})</option>
            <option value="en_attente">En attente de validation</option>
            <option value="validee">Validées (à payer)</option>
            <option value="remboursee">Remboursées</option>
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
            onClick={onNewNoteFrais}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg shadow-xs transition-colors whitespace-nowrap cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Déposer une note</span>
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
                <th className="py-3.5 px-6">Libellé de la Dépense</th>
                <th className="py-3.5 px-6">Catégorie</th>
                <th className="py-3.5 px-6">Date</th>
                <th className="py-3.5 px-6 text-right">Montant</th>
                <th className="py-3.5 px-6">Statut</th>
                <th className="py-3.5 px-6 text-right">Décision</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((n) => (
                <tr key={n._id} className="hover:bg-slate-50/70 transition-colors">
                  <td className="py-3.5 px-6 font-semibold text-slate-900 text-xs">
                    {n.employeNom || n.employeId}
                  </td>
                  <td className="py-3.5 px-6 text-slate-800 text-xs font-medium">
                    {n.titre}
                    {n.justificatif && (
                      <span className="block text-[11px] text-slate-400 font-normal">
                        📎 {n.justificatif}
                      </span>
                    )}
                  </td>
                  <td className="py-3.5 px-6 text-slate-500 capitalize text-xs">
                    {n.categorie}
                  </td>
                  <td className="py-3.5 px-6 text-slate-600 tabular-nums text-xs">
                    {formatDate(n.dateDepense)}
                  </td>
                  <td className="py-3.5 px-6 text-right font-mono font-bold text-slate-900 tabular-nums text-xs">
                    {formatCurrency(n.montant)}
                  </td>
                  <td className="py-3.5 px-6">
                    <span
                      className={`px-2 py-0.5 rounded text-xs font-medium ${
                        n.statut === 'remboursee'
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : n.statut === 'validee'
                          ? 'bg-sky-50 text-sky-700 border border-sky-200'
                          : n.statut === 'en_attente'
                          ? 'bg-amber-50 text-amber-700 border border-amber-200'
                          : 'bg-rose-50 text-rose-700 border border-rose-200'
                      }`}
                    >
                      {n.statut === 'remboursee'
                        ? 'Remboursée'
                        : n.statut === 'validee'
                        ? 'Validée'
                        : n.statut === 'en_attente'
                        ? 'En attente'
                        : 'Refusée'}
                    </span>
                  </td>
                  <td className="py-3.5 px-6 text-right">
                    <div className="inline-flex items-center gap-1.5">
                      {n.statut === 'en_attente' && (
                        <>
                          <button
                            onClick={() => onUpdateStatus(n._id, 'validee')}
                            className="px-2 py-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 rounded cursor-pointer"
                          >
                            Valider
                          </button>
                          <button
                            onClick={() => onUpdateStatus(n._id, 'refusee')}
                            className="px-2 py-1 text-[11px] font-semibold text-rose-700 bg-rose-50 hover:bg-rose-100 rounded cursor-pointer"
                          >
                            Refuser
                          </button>
                        </>
                      )}
                      {n.statut === 'validee' && (
                        <button
                          onClick={() => onUpdateStatus(n._id, 'remboursee')}
                          className="px-2 py-1 text-[11px] font-semibold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 rounded cursor-pointer"
                        >
                          Payer / Rembourser
                        </button>
                      )}
                      <button
                        onClick={() => onDeleteNoteFrais(n._id)}
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
