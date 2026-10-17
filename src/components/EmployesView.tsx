import React, { useState, useMemo } from 'react';
import { Employe } from '../types';
import { formatDate, downloadCsv } from '../services/api';
import {
  Search,
  Plus,
  Filter,
  Download,
  Mail,
  Phone,
  Briefcase,
  Building,
  UserCheck,
  UserX,
  Edit,
  Trash2,
  Eye,
} from 'lucide-react';

interface EmployesViewProps {
  employes: Employe[];
  onNewEmploye: () => void;
  onEditEmploye: (employe: Employe) => void;
  onDeleteEmploye: (id: string) => void;
  onSelectEmploye: (employe: Employe) => void;
}

export const EmployesView: React.FC<EmployesViewProps> = ({
  employes,
  onNewEmploye,
  onEditEmploye,
  onDeleteEmploye,
  onSelectEmploye,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDept, setSelectedDept] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'actif' | 'inactif'>('all');

  // List of unique departments
  const departements = useMemo(() => {
    const set = new Set<string>();
    employes.forEach((e) => {
      if (e.departement) set.add(e.departement);
    });
    return Array.from(set).sort();
  }, [employes]);

  // Filtered employees
  const filteredEmployes = useMemo(() => {
    return employes.filter((e) => {
      const q = searchTerm.toLowerCase();
      const matchesSearch =
        !searchTerm ||
        `${e.prenom} ${e.nom}`.toLowerCase().includes(q) ||
        (e.email && e.email.toLowerCase().includes(q)) ||
        (e.poste && e.poste.toLowerCase().includes(q)) ||
        (e.departement && e.departement.toLowerCase().includes(q));

      const matchesDept = selectedDept === 'all' || e.departement === selectedDept;
      const matchesStatus = statusFilter === 'all' || (e.statut || 'actif') === statusFilter;

      return matchesSearch && matchesDept && matchesStatus;
    });
  }, [employes, searchTerm, selectedDept, statusFilter]);

  const handleExportCsv = () => {
    const headers = ['Nom', 'Prénom', 'Email', 'Téléphone', 'Poste', 'Département', "Date d'embauche", 'Statut'];
    const rows = filteredEmployes.map((e) => [
      e.nom,
      e.prenom,
      e.email,
      e.telephone || '',
      e.poste || '',
      e.departement || '',
      e.dateEmbauche || '',
      e.statut || 'actif',
    ]);
    downloadCsv('collaborateurs_rh.csv', [headers, ...rows]);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Search and Filter Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200/90 shadow-xs flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex flex-1 items-center gap-3 w-full">
          {/* Live Search */}
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Rechercher par nom, email, poste..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-slate-50 hover:bg-slate-100/80 focus:bg-white text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 transition-all"
            />
          </div>

          {/* Department Filter */}
          <div className="relative">
            <select
              value={selectedDept}
              onChange={(e) => setSelectedDept(e.target.value)}
              className="py-2 pl-3 pr-8 bg-slate-50 hover:bg-slate-100/80 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 cursor-pointer"
            >
              <option value="all">Tous départements ({employes.length})</option>
              {departements.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Status segmented buttons & actions */}
        <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-end">
          <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg">
            <button
              onClick={() => setStatusFilter('all')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer ${
                statusFilter === 'all'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Tous
            </button>
            <button
              onClick={() => setStatusFilter('actif')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer ${
                statusFilter === 'actif'
                  ? 'bg-white text-emerald-800 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Actifs
            </button>
            <button
              onClick={() => setStatusFilter('inactif')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer ${
                statusFilter === 'inactif'
                  ? 'bg-white text-slate-800 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Inactifs
            </button>
          </div>

          <button
            onClick={handleExportCsv}
            className="p-2 border border-slate-200 hover:bg-slate-50 text-slate-600 rounded-lg transition-colors cursor-pointer"
            title="Exporter la liste filtrée en CSV"
          >
            <Download className="w-4 h-4" />
          </button>

          <button
            onClick={onNewEmploye}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg shadow-xs transition-colors whitespace-nowrap cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Nouveau</span>
          </button>
        </div>
      </div>

      {/* Employees Table */}
      <div className="bg-white rounded-xl border border-slate-200/90 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                <th className="py-3.5 px-6">Collaborateur</th>
                <th className="py-3.5 px-6">Poste</th>
                <th className="py-3.5 px-6">Département</th>
                <th className="py-3.5 px-6">Contact</th>
                <th className="py-3.5 px-6">Embauché le</th>
                <th className="py-3.5 px-6">Statut</th>
                <th className="py-3.5 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredEmployes.map((e) => (
                <tr key={e._id} className="hover:bg-slate-50/70 transition-colors">
                  <td className="py-3.5 px-6">
                    <button
                      onClick={() => onSelectEmploye(e)}
                      className="text-left group cursor-pointer"
                    >
                      <div className="font-semibold text-slate-900 group-hover:text-sky-600 transition-colors">
                        {e.prenom} {e.nom}
                      </div>
                      <div className="text-xs text-slate-400 group-hover:text-slate-500">{e.email}</div>
                    </button>
                  </td>
                  <td className="py-3.5 px-6 text-slate-700 text-xs font-medium">
                    {e.poste || '—'}
                  </td>
                  <td className="py-3.5 px-6">
                    <span className="text-xs text-slate-600 bg-slate-100 px-2.5 py-1 rounded-md font-medium">
                      {e.departement || 'Général'}
                    </span>
                  </td>
                  <td className="py-3.5 px-6 text-xs text-slate-500">
                    <div className="flex items-center gap-2">
                      {e.telephone ? (
                        <a
                          href={`tel:${e.telephone}`}
                          className="hover:text-sky-600 transition-colors flex items-center gap-1"
                          title={e.telephone}
                        >
                          <Phone className="w-3.5 h-3.5" />
                          <span>{e.telephone}</span>
                        </a>
                      ) : (
                        <span className="text-slate-400">—</span>
                      )}
                    </div>
                  </td>
                  <td className="py-3.5 px-6 text-slate-500 tabular-nums text-xs">
                    {formatDate(e.dateEmbauche)}
                  </td>
                  <td className="py-3.5 px-6">
                    <span
                      className={`inline-block px-2.5 py-0.5 rounded text-xs font-semibold capitalize ${
                        e.statut === 'actif'
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200/60'
                          : 'bg-slate-100 text-slate-600 border border-slate-200'
                      }`}
                    >
                      {e.statut || 'actif'}
                    </span>
                  </td>
                  <td className="py-3.5 px-6 text-right">
                    <div className="inline-flex items-center gap-1">
                      <button
                        onClick={() => onSelectEmploye(e)}
                        className="p-1.5 text-slate-400 hover:text-sky-600 hover:bg-sky-50 rounded transition-colors cursor-pointer"
                        title="Voir la fiche détaillée"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => onEditEmploye(e)}
                        className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded transition-colors cursor-pointer"
                        title="Modifier les informations"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => onDeleteEmploye(e._id)}
                        className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded transition-colors cursor-pointer"
                        title="Supprimer le collaborateur"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {filteredEmployes.length === 0 && (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-400">
                    <UserX className="w-8 h-8 mx-auto mb-2 text-slate-300" />
                    <p className="text-sm font-medium text-slate-600">Aucun collaborateur trouvé</p>
                    <p className="text-xs text-slate-400 mt-1">
                      Essayez d'ajuster vos critères de recherche ou de filtre.
                    </p>
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
