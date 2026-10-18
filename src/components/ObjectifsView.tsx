import React, { useState } from 'react';
import { Employe } from '../types';
import {
  Target,
  Plus,
  TrendingUp,
  CheckCircle2,
  Clock,
  Award,
} from 'lucide-react';

interface ObjectifItem {
  id: string;
  employeId: string;
  titre: string;
  trimestre: string;
  progression: number;
  echeance: string;
}

interface ObjectifsViewProps {
  employes: Employe[];
}

export const ObjectifsView: React.FC<ObjectifsViewProps> = ({ employes }) => {
  const [objectifs, setObjectifs] = useState<ObjectifItem[]>([
    {
      id: 'obj-1',
      employeId: 'emp-2',
      titre: 'Migration de l’infrastructure vers Kubernetes & microservices',
      trimestre: 'Q4 2026',
      progression: 75,
      echeance: '2026-12-15',
    },
    {
      id: 'obj-2',
      employeId: 'emp-4',
      titre: 'Refonte complète de la charte graphique et du Design System UI',
      trimestre: 'Q4 2026',
      progression: 90,
      echeance: '2026-11-30',
    },
    {
      id: 'obj-3',
      employeId: 'emp-3',
      titre: 'Augmentation de 25% du trafic qualifié B2B via SEO et campagnes',
      trimestre: 'Q4 2026',
      progression: 60,
      echeance: '2026-12-31',
    },
    {
      id: 'obj-4',
      employeId: 'emp-1',
      titre: 'Digitalisation des dossiers RH et bilan social automatisé',
      trimestre: 'Q4 2026',
      progression: 100,
      echeance: '2026-10-31',
    },
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [targetEmpId, setTargetEmpId] = useState(employes[0]?._id || '');
  const [titre, setTitre] = useState('');
  const [trimestre, setTrimestre] = useState('Q4 2026');
  const [echeance, setEcheance] = useState('2026-12-31');

  const updateProgression = (id: string, newProg: number) => {
    setObjectifs((prev) =>
      prev.map((o) => (o.id === id ? { ...o, progression: Math.min(100, Math.max(0, newProg)) } : o))
    );
  };

  const handleAddObjectif = (e: React.FormEvent) => {
    e.preventDefault();
    if (!titre.trim()) return;
    const newObj: ObjectifItem = {
      id: `obj-${Date.now()}`,
      employeId: targetEmpId,
      titre: titre.trim(),
      trimestre,
      progression: 0,
      echeance,
    };
    setObjectifs((prev) => [newObj, ...prev]);
    setTitre('');
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Top Banner */}
      <div className="bg-white p-5 rounded-xl border border-slate-200/90 shadow-xs flex items-center justify-between">
        <div>
          <h2 className="text-base font-bold text-slate-900">Objectifs Trimestriels & Alignement Stratégique (OKR)</h2>
          <p className="text-xs text-slate-500">
            Suivi des résultats clés par collaborateur pour le trimestre en cours
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg shadow-xs transition-colors cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Définir un objectif</span>
        </button>
      </div>

      {/* Grid of Objectives */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {objectifs.map((obj) => {
          const emp = employes.find((e) => e._id === obj.employeId);
          const isFinished = obj.progression === 100;

          return (
            <div
              key={obj.id}
              className="bg-white rounded-xl border border-slate-200/90 shadow-xs p-5 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div>
                    <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400 bg-slate-100 px-2 py-0.5 rounded">
                      {obj.trimestre}
                    </span>
                    <h3 className="font-bold text-slate-900 text-sm mt-1">{obj.titre}</h3>
                  </div>
                  {isFinished ? (
                    <span className="flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Atteint
                    </span>
                  ) : (
                    <span className="text-xs font-bold font-mono tabular-nums text-slate-700">
                      {obj.progression}%
                    </span>
                  )}
                </div>

                <div className="text-xs text-slate-500 mt-1">
                  Assigné à : <strong className="text-slate-800">{emp ? `${emp.prenom} ${emp.nom}` : 'Collaborateur'}</strong>
                  {emp?.poste && <span> ({emp.poste})</span>}
                </div>

                {/* Progress bar */}
                <div className="mt-4 space-y-1.5">
                  <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full transition-all duration-300 ${
                        isFinished ? 'bg-emerald-500' : 'bg-slate-900'
                      }`}
                      style={{ width: `${obj.progression}%` }}
                    ></div>
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-slate-400">
                    <span>Échéance : {obj.echeance}</span>
                    <span>Ajuster la progression :</span>
                  </div>
                </div>
              </div>

              {/* Action slider */}
              <div className="mt-3 pt-3 border-t border-slate-100 flex items-center gap-3">
                <input
                  type="range"
                  min="0"
                  max="100"
                  step="5"
                  value={obj.progression}
                  onChange={(e) => updateProgression(obj.id, Number(e.target.value))}
                  className="w-full accent-slate-900 cursor-pointer"
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-md w-full p-5 space-y-4">
            <h3 className="text-base font-bold text-slate-900">Nouvel Objectif Stratégique</h3>

            <form onSubmit={handleAddObjectif} className="space-y-3 text-xs">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Collaborateur assigné</label>
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
                <label className="font-semibold text-slate-700 block mb-1">Intitulé de l'objectif</label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Réduire le temps de chargement de 40%..."
                  value={titre}
                  onChange={(e) => setTitre(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Période / Trimestre</label>
                  <input
                    type="text"
                    value={trimestre}
                    onChange={(e) => setTrimestre(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Date d'échéance</label>
                  <input
                    type="date"
                    value={echeance}
                    onChange={(e) => setEcheance(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg"
                  />
                </div>
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
                  Créer l'objectif
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
