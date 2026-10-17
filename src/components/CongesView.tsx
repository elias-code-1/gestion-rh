import React, { useState, useMemo } from 'react';
import { Conge, Employe, TypeConge, StatutConge } from '../types';
import { formatDate, calculateWorkingDays, downloadCsv } from '../services/api';
import {
  CalendarCheck,
  Plus,
  Search,
  Filter,
  CheckCircle,
  XCircle,
  Clock,
  Download,
  AlertCircle,
  Calendar,
  Layers,
} from 'lucide-react';

interface CongesViewProps {
  conges: Conge[];
  employes: Employe[];
  onNewConge: () => void;
  onEditConge: (conge: Conge) => void;
  onDeleteConge: (id: string) => void;
  onApproveConge: (id: string) => Promise<void>;
  onRejectConge: (id: string) => Promise<void>;
}

const TYPE_LABELS: Record<TypeConge, string> = {
  paye: 'Congé Payé (CP)',
  maladie: 'Arrêt Maladie',
  exceptionnel: 'Événement Familial',
  sans_solde: 'Sans Solde',
};

export const CongesView: React.FC<CongesViewProps> = ({
  conges,
  employes,
  onNewConge,
  onEditConge,
  onDeleteConge,
  onApproveConge,
  onRejectConge,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statutFilter, setStatutFilter] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');

  // Filtered leaves
  const filteredConges = useMemo(() => {
    return conges.filter((c) => {
      const q = searchTerm.toLowerCase();
      const matchesSearch =
        !searchTerm ||
        (c.employeNom && c.employeNom.toLowerCase().includes(q)) ||
        (c.commentaire && c.commentaire.toLowerCase().includes(q));

      const matchesStatut = statutFilter === 'all' || c.statut === statutFilter;
      const matchesType = typeFilter === 'all' || c.typeConge === typeFilter;

      return matchesSearch && matchesStatut && matchesType;
    });
  }, [conges, searchTerm, statutFilter, typeFilter]);

  // Statistics on leaves
  const stats = useMemo(() => {
    let enAttente = 0;
    let approuve = 0;
    let totalJoursPris = 0;

    conges.forEach((c) => {
      if (c.statut === 'en_attente') enAttente++;
      if (c.statut === 'approuve') {
        approuve++;
        totalJoursPris += calculateWorkingDays(c.dateDebut, c.dateFin);
      }
    });

    return { enAttente, approuve, totalJoursPris };
  }, [conges]);

  const handleExportCsv = () => {
    const headers = ['Employé', 'Type', 'Date Début', 'Date Fin', 'Jours Ouvrés', 'Statut', 'Commentaire'];
    const rows = filteredConges.map((c) => [
      c.employeNom || c.employeId,
      TYPE_LABELS[c.typeConge] || c.typeConge,
      c.dateDebut,
      c.dateFin,
      String(calculateWorkingDays(c.dateDebut, c.dateFin)),
      c.statut,
      c.commentaire || '',
    ]);
    downloadCsv('demandes_conges_rh.csv', [headers, ...rows]);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div className="bg-white p-5 rounded-xl border border-slate-200/90 shadow-xs flex items-center justify-between">
          <div>
            <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Demandes en attente</div>
            <div className="text-2xl font-bold text-amber-600 mt-1 tabular-nums">{stats.enAttente}</div>
          </div>
          <div className="w-10 h-10 rounded-lg bg-amber-50 flex items-center justify-center text-amber-600">
            <Clock className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200/90 shadow-xs flex items-center justify-between">
          <div>
            <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Congés validés</div>
            <div className="text-2xl font-bold text-emerald-600 mt-1 tabular-nums">{stats.approuve}</div>
          </div>
          <div className="w-10 h-10 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-600">
            <CheckCircle className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200/90 shadow-xs flex items-center justify-between">
          <div>
            <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Jours ouvrés posés</div>
            <div className="text-2xl font-bold text-slate-900 mt-1 tabular-nums">{stats.totalJoursPris} jours</div>
          </div>
          <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center text-slate-600">
            <CalendarCheck className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Filter and Control Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200/90 shadow-xs flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex flex-1 items-center gap-3 w-full">
          <div className="relative flex-1 max-w-sm">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Rechercher par collaborateur..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-slate-50 hover:bg-slate-100/80 focus:bg-white text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500"
            />
          </div>

          <select
            value={statutFilter}
            onChange={(e) => setStatutFilter(e.target.value)}
            className="py-2 pl-3 pr-8 bg-slate-50 hover:bg-slate-100/80 text-xs border border-slate-200 rounded-lg cursor-pointer"
          >
            <option value="all">Tous les statuts ({conges.length})</option>
            <option value="en_attente">En attente ({stats.enAttente})</option>
            <option value="approuve">Approuvés ({stats.approuve})</option>
            <option value="refuse">Refusés</option>
          </select>

          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="py-2 pl-3 pr-8 bg-slate-50 hover:bg-slate-100/80 text-xs border border-slate-200 rounded-lg cursor-pointer hidden sm:block"
          >
            <option value="all">Tous types</option>
            <option value="paye">Congé payé</option>
            <option value="maladie">Arrêt maladie</option>
            <option value="exceptionnel">Exceptionnel</option>
            <option value="sans_solde">Sans solde</option>
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
            onClick={onNewConge}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg shadow-xs transition-colors whitespace-nowrap cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Nouvelle demande</span>
          </button>
        </div>
      </div>

      {/* Table of Leaves */}
      <div className="bg-white rounded-xl border border-slate-200/90 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                <th className="py-3.5 px-6">Employé</th>
                <th className="py-3.5 px-6">Type de congé</th>
                <th className="py-3.5 px-6">Période</th>
                <th className="py-3.5 px-6 text-center">Durée</th>
                <th className="py-3.5 px-6">Statut</th>
                <th className="py-3.5 px-6">Commentaire</th>
                <th className="py-3.5 px-6 text-right">Décision / Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredConges.map((c) => {
                const days = calculateWorkingDays(c.dateDebut, c.dateFin);
                return (
                  <tr key={c._id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3.5 px-6 font-semibold text-slate-900">
                      {c.employeNom || c.employeId}
                    </td>
                    <td className="py-3.5 px-6 text-xs text-slate-700">
                      <span className="font-medium">{TYPE_LABELS[c.typeConge] || c.typeConge}</span>
                    </td>
                    <td className="py-3.5 px-6 text-slate-600 tabular-nums text-xs">
                      {formatDate(c.dateDebut)} &rarr; {formatDate(c.dateFin)}
                    </td>
                    <td className="py-3.5 px-6 text-center text-xs font-mono font-semibold tabular-nums text-slate-700">
                      {days} jour{days > 1 ? 's' : ''}
                    </td>
                    <td className="py-3.5 px-6">
                      <span
                        className={`inline-block px-2.5 py-0.5 rounded text-xs font-medium tabular-nums ${
                          c.statut === 'approuve'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200/70'
                            : c.statut === 'refuse'
                            ? 'bg-rose-50 text-rose-700 border border-rose-200/70'
                            : 'bg-amber-50 text-amber-700 border border-amber-200/70'
                        }`}
                      >
                        {c.statut === 'approuve'
                          ? 'Approuvé'
                          : c.statut === 'refuse'
                          ? 'Refusé'
                          : 'En attente'}
                      </span>
                    </td>
                    <td className="py-3.5 px-6 text-xs text-slate-500 max-w-xs truncate">
                      {c.commentaire || '—'}
                    </td>
                    <td className="py-3.5 px-6 text-right">
                      <div className="inline-flex items-center gap-1.5">
                        {c.statut === 'en_attente' && (
                          <>
                            <button
                              onClick={() => onApproveConge(c._id)}
                              className="px-2.5 py-1 text-xs font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded transition-colors cursor-pointer"
                              title="Valider la demande"
                            >
                              Approuver
                            </button>
                            <button
                              onClick={() => onRejectConge(c._id)}
                              className="px-2.5 py-1 text-xs font-semibold text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded transition-colors cursor-pointer"
                              title="Refuser la demande"
                            >
                              Refuser
                            </button>
                          </>
                        )}
                        <button
                          onClick={() => onDeleteConge(c._id)}
                          className="p-1 text-slate-400 hover:text-rose-600 rounded transition-colors cursor-pointer ml-1"
                          title="Supprimer la demande"
                        >
                          ✕
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}

              {filteredConges.length === 0 && (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-400">
                    <CalendarCheck className="w-8 h-8 mx-auto mb-2 text-slate-300" />
                    <p className="text-sm font-medium text-slate-600">Aucune demande de congé correspondante</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
