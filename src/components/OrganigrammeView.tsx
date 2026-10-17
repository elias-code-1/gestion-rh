import React, { useMemo } from 'react';
import { Employe } from '../types';
import { formatDate } from '../services/api';
import {
  Network,
  Building,
  Users,
  Mail,
  Phone,
  Briefcase,
  UserCheck,
} from 'lucide-react';

interface OrganigrammeViewProps {
  employes: Employe[];
  onSelectEmploye: (employe: Employe) => void;
}

export const OrganigrammeView: React.FC<OrganigrammeViewProps> = ({
  employes,
  onSelectEmploye,
}) => {
  // Group employees by department
  const grouped = useMemo(() => {
    const map = new Map<string, Employe[]>();

    employes.forEach((e) => {
      const dept = e.departement || 'Direction & Administration';
      if (!map.has(dept)) map.set(dept, []);
      map.get(dept)!.push(e);
    });

    return Array.from(map.entries()).sort((a, b) => b[1].length - a[1].length);
  }, [employes]);

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="bg-white p-5 rounded-xl border border-slate-200/90 shadow-xs flex items-center justify-between">
        <div>
          <h2 className="text-base font-bold text-slate-900">Structure Organisationnelle de l'Entreprise</h2>
          <p className="text-xs text-slate-500">
            {grouped.length} départements recensés pour {employes.length} collaborateurs
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs font-semibold text-slate-600 bg-slate-100 px-3 py-1.5 rounded-lg">
          <Network className="w-4 h-4 text-slate-500" />
          <span>Annuaire d'équipes</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {grouped.map(([departement, members]) => {
          const actifsCount = members.filter((m) => (m.statut || 'actif') === 'actif').length;

          return (
            <div
              key={departement}
              className="bg-white rounded-xl border border-slate-200/90 shadow-xs overflow-hidden flex flex-col justify-between"
            >
              <div>
                {/* Department Header */}
                <div className="p-4 bg-slate-50/80 border-b border-slate-200 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-sky-100 text-sky-800 flex items-center justify-center font-bold text-xs">
                      <Building className="w-4 h-4" />
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900 text-sm">{departement}</h3>
                      <div className="text-[11px] text-slate-500">
                        {members.length} collaborateur{members.length > 1 ? 's' : ''} ({actifsCount} actif{actifsCount > 1 ? 's' : ''})
                      </div>
                    </div>
                  </div>
                </div>

                {/* Team Members List */}
                <div className="p-4 divide-y divide-slate-100">
                  {members.map((m) => (
                    <div
                      key={m._id}
                      onClick={() => onSelectEmploye(m)}
                      className="py-3 first:pt-0 last:pb-0 hover:bg-slate-50/70 -mx-2 px-2 rounded-lg transition-colors cursor-pointer group"
                    >
                      <div className="flex items-center justify-between">
                        <div className="font-semibold text-slate-900 text-xs group-hover:text-sky-600 transition-colors">
                          {m.prenom} {m.nom}
                        </div>
                        <span
                          className={`text-[10px] px-1.5 py-0.5 rounded font-medium ${
                            m.statut === 'actif'
                              ? 'bg-emerald-50 text-emerald-700'
                              : 'bg-slate-100 text-slate-500'
                          }`}
                        >
                          {m.statut || 'actif'}
                        </span>
                      </div>

                      <div className="text-[11px] text-slate-500 mt-0.5 flex items-center gap-1.5">
                        <Briefcase className="w-3 h-3 text-slate-400" />
                        <span>{m.poste || 'Poste non renseigné'}</span>
                      </div>

                      <div className="flex items-center gap-3 text-[11px] text-slate-400 mt-1.5">
                        {m.email && (
                          <span className="flex items-center gap-1 truncate" title={m.email}>
                            <Mail className="w-3 h-3 text-slate-400 shrink-0" />
                            <span className="truncate">{m.email}</span>
                          </span>
                        )}
                        {m.telephone && (
                          <span className="flex items-center gap-1 whitespace-nowrap">
                            <Phone className="w-3 h-3 text-slate-400 shrink-0" />
                            <span>{m.telephone}</span>
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-3 bg-slate-50/50 border-t border-slate-100 text-center">
                <span className="text-[11px] text-slate-400 font-medium">
                  Cliquez sur un profil pour ouvrir la fiche
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
