import React, { useState, useMemo } from 'react';
import { Absence, Employe } from '../types';
import { formatDate, downloadCsv } from '../services/api';
import {
  UserX,
  Plus,
  Search,
  Filter,
  CheckCircle2,
  AlertTriangle,
  Download,
  FileCheck,
  Calendar,
} from 'lucide-react';

interface AbsencesViewProps {
  absences: Absence[];
  employes: Employe[];
  onNewAbsence: () => void;
  onEditAbsence: (absence: Absence) => void;
  onDeleteAbsence: (id: string) => void;
  onToggleJustifiee: (absence: Absence) => Promise<void>;
}

export const AbsencesView: React.FC<AbsencesViewProps> = ({
  absences,
  employes,
  onNewAbsence,
  onEditAbsence,
  onDeleteAbsence,
  onToggleJustifiee,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [justifieeFilter, setJustifieeFilter] = useState<'all' | 'justifiee' | 'non_justifiee'>('all');

  const filteredAbsences = useMemo(() => {
    return absences.filter((a) => {
      const q = searchTerm.toLowerCase();
      const matchesSearch =
        !searchTerm ||
        (a.employeNom && a.employeNom.toLowerCase().includes(q)) ||
        (a.motif && a.motif.toLowerCase().includes(q));

      const matchesJustifiee =
        justifieeFilter === 'all' ||
        (justifieeFilter === 'justifiee' && a.justifiee) ||
        (justifieeFilter === 'non_justifiee' && !a.justifiee);

      return matchesSearch && matchesJustifiee;
    });
  }, [absences, searchTerm, justifieeFilter]);

  const stats = useMemo(() => {
    const total = absences.length;
    const justifiees = absences.filter((a) => a.justifiee).length;
    const nonJustifiees = total - justifiees;
    return { total, justifiees, nonJustifiees };
  }, [absences]);

  const handleExportCsv = () => {
    const headers = ['Employé', 'Date', 'Motif', 'Justifiée', 'Commentaire'];
    const rows = filteredAbsences.map((a) => [
      a.employeNom || a.employeId,
      a.date,
      a.motif || '',
      a.justifiee ? 'Oui' : 'Non',
      a.commentaire || '',
    ]);
    downloadCsv('registre_absences_rh.csv', [headers, ...rows]);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div className="bg-white p-5 rounded-xl border border-slate-200/90 shadow-xs flex items-center justify-between">
          <div>
            <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Absences</div>
            <div className="text-2xl font-bold text-slate-900 mt-1 tabular-nums">{stats.total}</div>
          </div>
          <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center text-slate-600">
            <UserX className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200/90 shadow-xs flex items-center justify-between">
          <div>
            <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Absences justifiées</div>
            <div className="text-2xl font-bold text-emerald-600 mt-1 tabular-nums">{stats.justifiees}</div>
          </div>
          <div className="w-10 h-10 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-600">
            <CheckCircle2 className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200/90 shadow-xs flex items-center justify-between">
          <div>
            <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">En attente de justificatif</div>
            <div className="text-2xl font-bold text-rose-600 mt-1 tabular-nums">{stats.nonJustifiees}</div>
          </div>
          <div className="w-10 h-10 rounded-lg bg-rose-50 flex items-center justify-center text-rose-600">
            <AlertTriangle className="w-5 h-5" />
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
              placeholder="Rechercher par collaborateur, motif..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-slate-50 hover:bg-slate-100/80 focus:bg-white text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500"
            />
          </div>

          <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg">
            <button
              onClick={() => setJustifieeFilter('all')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer ${
                justifieeFilter === 'all'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Toutes ({stats.total})
            </button>
            <button
              onClick={() => setJustifieeFilter('justifiee')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer ${
                justifieeFilter === 'justifiee'
                  ? 'bg-white text-emerald-800 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Justifiées ({stats.justifiees})
            </button>
            <button
              onClick={() => setJustifieeFilter('non_justifiee')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer ${
                justifieeFilter === 'non_justifiee'
                  ? 'bg-white text-rose-800 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              À régulariser ({stats.nonJustifiees})
            </button>
          </div>
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
            onClick={onNewAbsence}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg shadow-xs transition-colors whitespace-nowrap cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Signaler absence</span>
          </button>
        </div>
      </div>

      {/* Absences Table */}
      <div className="bg-white rounded-xl border border-slate-200/90 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                <th className="py-3.5 px-6">Employé</th>
                <th className="py-3.5 px-6">Date de l'absence</th>
                <th className="py-3.5 px-6">Motif déclaré</th>
                <th className="py-3.5 px-6">Justificatif</th>
                <th className="py-3.5 px-6">Commentaire</th>
                <th className="py-3.5 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredAbsences.map((a) => (
                <tr key={a._id} className="hover:bg-slate-50/70 transition-colors">
                  <td className="py-3.5 px-6 font-semibold text-slate-900">
                    {a.employeNom || a.employeId}
                  </td>
                  <td className="py-3.5 px-6 text-slate-600 tabular-nums text-xs">
                    {formatDate(a.date)}
                  </td>
                  <td className="py-3.5 px-6 text-slate-800 text-xs font-medium">
                    {a.motif || 'Non précisé'}
                  </td>
                  <td className="py-3.5 px-6">
                    <button
                      onClick={() => onToggleJustifiee(a)}
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-medium transition-colors cursor-pointer ${
                        a.justifiee
                          ? 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200/70'
                          : 'bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200/70'
                      }`}
                      title="Cliquer pour changer l'état du justificatif"
                    >
                      {a.justifiee ? (
                        <>
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                          <span>Justifiée</span>
                        </>
                      ) : (
                        <>
                          <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
                          <span>Non justifiée (Régulariser)</span>
                        </>
                      )}
                    </button>
                  </td>
                  <td className="py-3.5 px-6 text-xs text-slate-500 max-w-xs truncate">
                    {a.commentaire || '—'}
                  </td>
                  <td className="py-3.5 px-6 text-right">
                    <div className="inline-flex items-center gap-2">
                      <button
                        onClick={() => onEditAbsence(a)}
                        className="text-xs text-slate-500 hover:text-slate-800 font-medium cursor-pointer"
                      >
                        Modifier
                      </button>
                      <button
                        onClick={() => onDeleteAbsence(a._id)}
                        className="p-1 text-slate-400 hover:text-rose-600 rounded transition-colors cursor-pointer"
                        title="Supprimer"
                      >
                        ✕
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {filteredAbsences.length === 0 && (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-400">
                    <UserX className="w-8 h-8 mx-auto mb-2 text-slate-300" />
                    <p className="text-sm font-medium text-slate-600">Aucune absence enregistrée</p>
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
