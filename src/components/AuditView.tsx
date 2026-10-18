import React, { useState, useMemo } from 'react';
import { AuditLog } from '../types';
import { formatDateTime, downloadCsv } from '../services/api';
import {
  ShieldCheck,
  Search,
  Filter,
  Download,
  Clock,
  User,
  Activity,
} from 'lucide-react';

interface AuditViewProps {
  auditLogs: AuditLog[];
}

export const AuditView: React.FC<AuditViewProps> = ({ auditLogs }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('all');

  const filtered = useMemo(() => {
    return auditLogs.filter((l) => {
      const q = searchTerm.toLowerCase();
      const matchesSearch =
        !searchTerm ||
        l.action.toLowerCase().includes(q) ||
        l.auteur.toLowerCase().includes(q) ||
        l.details.toLowerCase().includes(q);

      const matchesType = typeFilter === 'all' || l.type === typeFilter;
      return matchesSearch && matchesType;
    });
  }, [auditLogs, searchTerm, typeFilter]);

  const handleExportCsv = () => {
    const headers = ['Horodatage', 'Action', 'Auteur', 'Détails de l’opération', 'Type'];
    const rows = filtered.map((l) => [
      formatDateTime(l.horodatage),
      l.action,
      l.auteur,
      l.details,
      l.type,
    ]);
    downloadCsv('journal_audit_rh.csv', [headers, ...rows]);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Banner */}
      <div className="bg-white p-5 rounded-xl border border-slate-200/90 shadow-xs flex items-center justify-between">
        <div>
          <h2 className="text-base font-bold text-slate-900">Journal d'Audit & Traçabilité Réglementaire (RGPD)</h2>
          <p className="text-xs text-slate-500">
            Registre immuable des modifications, approbations et accès administrateurs
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleExportCsv}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Exporter registre</span>
          </button>
        </div>
      </div>

      {/* Control bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200/90 shadow-xs flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex flex-1 items-center gap-3 w-full">
          <div className="relative flex-1 max-w-sm">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Rechercher par action, auteur, détail..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-slate-50 hover:bg-slate-100/80 focus:bg-white text-xs border border-slate-200 rounded-lg"
            />
          </div>

          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="py-2 pl-3 pr-8 bg-slate-50 hover:bg-slate-100/80 text-xs border border-slate-200 rounded-lg cursor-pointer"
          >
            <option value="all">Toutes opérations ({auditLogs.length})</option>
            <option value="validation">Approbations / Validations</option>
            <option value="creation">Créations</option>
            <option value="modification">Modifications</option>
            <option value="suppression">Suppressions</option>
            <option value="connexion">Connexions système</option>
          </select>
        </div>
      </div>

      {/* Timeline table */}
      <div className="bg-white rounded-xl border border-slate-200/90 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                <th className="py-3.5 px-6">Horodatage</th>
                <th className="py-3.5 px-6">Action Réalisée</th>
                <th className="py-3.5 px-6">Opérateur / Auteur</th>
                <th className="py-3.5 px-6">Détails de l'Événement</th>
                <th className="py-3.5 px-6 text-right">Catégorie</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((l) => (
                <tr key={l._id} className="hover:bg-slate-50/70 transition-colors">
                  <td className="py-3.5 px-6 text-slate-500 font-mono tabular-nums text-xs whitespace-nowrap">
                    {formatDateTime(l.horodatage)}
                  </td>
                  <td className="py-3.5 px-6 font-semibold text-slate-900 text-xs">
                    {l.action}
                  </td>
                  <td className="py-3.5 px-6 text-slate-700 text-xs font-medium">
                    {l.auteur}
                  </td>
                  <td className="py-3.5 px-6 text-slate-600 text-xs max-w-md">
                    {l.details}
                  </td>
                  <td className="py-3.5 px-6 text-right">
                    <span
                      className={`inline-block px-2 py-0.5 rounded text-[10px] font-mono uppercase font-semibold ${
                        l.type === 'validation'
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : l.type === 'suppression'
                          ? 'bg-rose-50 text-rose-700 border border-rose-200'
                          : l.type === 'creation'
                          ? 'bg-sky-50 text-sky-700 border border-sky-200'
                          : 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      {l.type}
                    </span>
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
