import React, { useState, useMemo } from 'react';
import { Employe } from '../types';
import {
  Sparkles,
  Search,
  Filter,
  Plus,
  Award,
  Layers,
  CheckCircle,
} from 'lucide-react';

interface CompetencesViewProps {
  employes: Employe[];
  onAddCompetence: (employeId: string, nom: string, niveau: 'Débutant' | 'Intermédiaire' | 'Avancé' | 'Expert') => Promise<void>;
}

export const CompetencesView: React.FC<CompetencesViewProps> = ({
  employes,
  onAddCompetence,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLevel, setSelectedLevel] = useState<string>('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [targetEmpId, setTargetEmpId] = useState(employes[0]?._id || '');
  const [newSkillName, setNewSkillName] = useState('');
  const [newSkillLevel, setNewSkillLevel] = useState<'Débutant' | 'Intermédiaire' | 'Avancé' | 'Expert'>('Avancé');

  const allSkills = useMemo(() => {
    const list: { employe: Employe; skillName: string; level: 'Débutant' | 'Intermédiaire' | 'Avancé' | 'Expert' }[] = [];
    employes.forEach((e) => {
      (e.competences || []).forEach((c) => {
        list.push({
          employe: e,
          skillName: c.nom,
          level: c.niveau,
        });
      });
    });
    return list;
  }, [employes]);

  const filtered = useMemo(() => {
    return allSkills.filter((item) => {
      const q = searchTerm.toLowerCase();
      const matchesSearch =
        !searchTerm ||
        item.skillName.toLowerCase().includes(q) ||
        `${item.employe.prenom} ${item.employe.nom}`.toLowerCase().includes(q);
      const matchesLevel = selectedLevel === 'all' || item.level === selectedLevel;
      return matchesSearch && matchesLevel;
    });
  }, [allSkills, searchTerm, selectedLevel]);

  const handleCreateSkill = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!targetEmpId || !newSkillName.trim()) return;
    await onAddCompetence(targetEmpId, newSkillName.trim(), newSkillLevel);
    setNewSkillName('');
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Top filter bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200/90 shadow-xs flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex flex-1 items-center gap-3 w-full">
          <div className="relative flex-1 max-w-sm">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Rechercher par compétence, collaborateur..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-slate-50 hover:bg-slate-100/80 focus:bg-white text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500"
            />
          </div>

          <select
            value={selectedLevel}
            onChange={(e) => setSelectedLevel(e.target.value)}
            className="py-2 pl-3 pr-8 bg-slate-50 hover:bg-slate-100/80 text-xs border border-slate-200 rounded-lg cursor-pointer"
          >
            <option value="all">Tous niveaux ({allSkills.length})</option>
            <option value="Expert">Niveau Expert</option>
            <option value="Avancé">Niveau Avancé</option>
            <option value="Intermédiaire">Niveau Intermédiaire</option>
            <option value="Débutant">Niveau Débutant</option>
          </select>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg shadow-xs transition-colors whitespace-nowrap cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Ajouter une compétence</span>
        </button>
      </div>

      {/* Grid of skill badges grouped by employees */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {employes.map((e) => {
          const comps = e.competences || [];
          return (
            <div
              key={e._id}
              className="bg-white rounded-xl border border-slate-200/90 shadow-xs p-5 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-3">
                  <div>
                    <h3 className="font-bold text-slate-900 text-sm">
                      {e.prenom} {e.nom}
                    </h3>
                    <span className="text-[11px] text-slate-500">{e.poste || 'Salarié'}</span>
                  </div>
                  <span className="text-[10px] font-mono text-slate-400 bg-slate-100 px-2 py-0.5 rounded">
                    {comps.length} compétence{comps.length > 1 ? 's' : ''}
                  </span>
                </div>

                <div className="space-y-2">
                  {comps.map((c, idx) => (
                    <div
                      key={idx}
                      className="p-2 rounded-lg bg-slate-50/80 border border-slate-100 flex items-center justify-between text-xs"
                    >
                      <span className="font-semibold text-slate-800">{c.nom}</span>
                      <span
                        className={`text-[10px] font-semibold px-2 py-0.5 rounded ${
                          c.niveau === 'Expert'
                            ? 'bg-purple-50 text-purple-700 border border-purple-200'
                            : c.niveau === 'Avancé'
                            ? 'bg-sky-50 text-sky-700 border border-sky-200'
                            : c.niveau === 'Intermédiaire'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : 'bg-slate-200/60 text-slate-600'
                        }`}
                      >
                        {c.niveau}
                      </span>
                    </div>
                  ))}
                  {comps.length === 0 && (
                    <div className="py-4 text-center text-slate-400 text-xs">
                      Aucune compétence déclarée
                    </div>
                  )}
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 text-right">
                <button
                  onClick={() => {
                    setTargetEmpId(e._id);
                    setIsModalOpen(true);
                  }}
                  className="text-xs text-sky-600 hover:text-sky-700 font-semibold cursor-pointer"
                >
                  + Ajouter
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal add skill */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-md w-full p-5 space-y-4">
            <h3 className="text-base font-bold text-slate-900">Ajouter une compétence certifiée</h3>

            <form onSubmit={handleCreateSkill} className="space-y-3 text-xs">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Collaborateur concerné</label>
                <select
                  value={targetEmpId}
                  onChange={(e) => setTargetEmpId(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg"
                >
                  {employes.map((e) => (
                    <option key={e._id} value={e._id}>
                      {e.prenom} {e.nom}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Nom de la compétence</label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Docker, Gestion de crise, Négociation..."
                  value={newSkillName}
                  onChange={(e) => setNewSkillName(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Niveau de maîtrise</label>
                <select
                  value={newSkillLevel}
                  onChange={(e) => setNewSkillLevel(e.target.value as any)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg"
                >
                  <option value="Débutant">Débutant (Notions de base)</option>
                  <option value="Intermédiaire">Intermédiaire (Autonome)</option>
                  <option value="Avancé">Avancé (Très expérimenté)</option>
                  <option value="Expert">Expert (Référent technique / Formateur)</option>
                </select>
              </div>

              <div className="pt-3 border-t border-slate-100 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border border-slate-200 rounded-lg text-slate-700 font-semibold cursor-pointer"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-slate-900 text-white rounded-lg font-semibold hover:bg-slate-800 cursor-pointer"
                >
                  Enregistrer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
