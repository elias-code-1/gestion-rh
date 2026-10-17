import React, { useState, useMemo } from 'react';
import { MaterielItem, Employe } from '../types';
import { formatDate, downloadCsv } from '../services/api';
import {
  Laptop,
  Smartphone,
  Car,
  KeyRound,
  Plus,
  Search,
  Filter,
  Download,
  Trash2,
  CheckCircle,
} from 'lucide-react';

interface MaterielsViewProps {
  materiels: MaterielItem[];
  employes: Employe[];
  onNewMateriel: () => void;
  onDeleteMateriel: (id: string) => Promise<void>;
}

export const MaterielsView: React.FC<MaterielsViewProps> = ({
  materiels,
  employes,
  onNewMateriel,
  onDeleteMateriel,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('all');

  const filtered = useMemo(() => {
    return materiels.filter((m) => {
      const q = searchTerm.toLowerCase();
      const matchesSearch =
        !searchTerm ||
        m.nom.toLowerCase().includes(q) ||
        (m.employeNom && m.employeNom.toLowerCase().includes(q)) ||
        m.numeroSerie.toLowerCase().includes(q);

      const matchesType = typeFilter === 'all' || m.type === typeFilter;
      return matchesSearch && matchesType;
    });
  }, [materiels, searchTerm, typeFilter]);

  const handleExportCsv = () => {
    const headers = ['Équipement', 'Type', 'Numéro de Série', 'Bénéficiaire', 'Date d’attribution', 'État'];
    const rows = filtered.map((m) => [
      m.nom,
      m.type,
      m.numeroSerie,
      m.employeNom || m.employeId,
      m.dateAttribution,
      m.etat,
    ]);
    downloadCsv('parc_materiel_rh.csv', [headers, ...rows]);
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'ordinateur':
        return <Laptop className="w-4 h-4 text-sky-600" />;
      case 'smartphone':
        return <Smartphone className="w-4 h-4 text-emerald-600" />;
      case 'vehicule':
        return <Car className="w-4 h-4 text-purple-600" />;
      default:
        return <KeyRound className="w-4 h-4 text-slate-600" />;
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Control bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200/90 shadow-xs flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex flex-1 items-center gap-3 w-full">
          <div className="relative flex-1 max-w-sm">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Rechercher par équipement, numéro de série..."
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
            <option value="all">Tous types d'équipements ({materiels.length})</option>
            <option value="ordinateur">Ordinateurs portables</option>
            <option value="smartphone">Smartphones & Flotte</option>
            <option value="autre">Badges & Clés sécurisées</option>
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
            onClick={onNewMateriel}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg shadow-xs transition-colors whitespace-nowrap cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Attribuer un matériel</span>
          </button>
        </div>
      </div>

      {/* Grid of Equipment Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((m) => (
          <div
            key={m._id}
            className="bg-white rounded-xl border border-slate-200/90 shadow-xs p-5 flex flex-col justify-between"
          >
            <div>
              <div className="flex items-start justify-between gap-3 mb-2">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center">
                    {getIcon(m.type)}
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 text-sm">{m.nom}</h3>
                    <span className="text-[11px] font-mono text-slate-400 block mt-0.5">
                      S/N: {m.numeroSerie}
                    </span>
                  </div>
                </div>
              </div>

              <div className="mt-3 pt-3 border-t border-slate-100 space-y-1.5 text-xs text-slate-600">
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Attribué à :</span>
                  <strong className="text-slate-800">{m.employeNom || m.employeId}</strong>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Date d'affectation :</span>
                  <span className="tabular-nums">{formatDate(m.dateAttribution)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">État matériel :</span>
                  <span className="capitalize font-medium text-slate-700">
                    {m.etat === 'comme_neuf'
                      ? 'Comme neuf'
                      : m.etat === 'tres_bon'
                      ? 'Très bon état'
                      : m.etat === 'bon'
                      ? 'Bon état'
                      : 'Usagé'}
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
              <span className="text-emerald-700 font-medium text-[11px] flex items-center gap-1">
                <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                Matériel actif
              </span>

              <button
                onClick={() => onDeleteMateriel(m._id)}
                className="p-1 text-slate-400 hover:text-rose-600 rounded transition-colors cursor-pointer"
                title="Restituer / Supprimer"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
