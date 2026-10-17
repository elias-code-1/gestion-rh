import React, { useState } from 'react';
import { OnboardingItem, Employe } from '../types';
import { formatDate } from '../services/api';
import {
  UserPlus,
  UserMinus,
  CheckCircle2,
  Circle,
  Plus,
  ArrowRight,
  ShieldCheck,
  Calendar,
} from 'lucide-react';

interface OnboardingViewProps {
  onboardings: OnboardingItem[];
  employes: Employe[];
  onToggleEtape: (onboardingId: string, etapeId: string) => Promise<void>;
  onNewProtocol: () => void;
}

export const OnboardingView: React.FC<OnboardingViewProps> = ({
  onboardings,
  employes,
  onToggleEtape,
  onNewProtocol,
}) => {
  const [filterPhase, setFilterPhase] = useState<'all' | 'onboarding' | 'offboarding'>('all');

  const filtered = onboardings.filter(
    (item) => filterPhase === 'all' || item.phase === filterPhase
  );

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200/90 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg">
          <button
            onClick={() => setFilterPhase('all')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer ${
              filterPhase === 'all' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Tous les parcours ({onboardings.length})
          </button>
          <button
            onClick={() => setFilterPhase('onboarding')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer ${
              filterPhase === 'onboarding'
                ? 'bg-white text-emerald-800 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Onboarding ({onboardings.filter((o) => o.phase === 'onboarding').length})
          </button>
          <button
            onClick={() => setFilterPhase('offboarding')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer ${
              filterPhase === 'offboarding'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Départs / Offboarding ({onboardings.filter((o) => o.phase === 'offboarding').length})
          </button>
        </div>

        <button
          onClick={onNewProtocol}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg shadow-xs transition-colors cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Nouveau protocole</span>
        </button>
      </div>

      {/* Grid of Checklists */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((item) => {
          const totalEtapes = item.etapes.length;
          const completedEtapes = item.etapes.filter((e) => e.terminee).length;
          const percent = totalEtapes > 0 ? Math.round((completedEtapes / totalEtapes) * 100) : 0;
          const isOffboarding = item.phase === 'offboarding';

          return (
            <div
              key={item._id}
              className="bg-white rounded-xl border border-slate-200/90 shadow-xs overflow-hidden flex flex-col justify-between"
            >
              <div>
                {/* Header card */}
                <div className="p-4 bg-slate-50/70 border-b border-slate-200 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div
                      className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs ${
                        isOffboarding ? 'bg-rose-100 text-rose-700' : 'bg-emerald-100 text-emerald-700'
                      }`}
                    >
                      {isOffboarding ? <UserMinus className="w-4 h-4" /> : <UserPlus className="w-4 h-4" />}
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900 text-sm">{item.employeNom || 'Salarié'}</h3>
                      <span className="text-[11px] text-slate-500 capitalize">
                        {isOffboarding ? 'Protocole de départ' : 'Parcours d’intégration'}
                      </span>
                    </div>
                  </div>

                  <span
                    className={`text-[11px] font-mono tabular-nums font-bold px-2 py-0.5 rounded ${
                      percent === 100
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-slate-200/80 text-slate-700'
                    }`}
                  >
                    {percent}%
                  </span>
                </div>

                {/* Progress bar */}
                <div className="w-full h-1 bg-slate-100">
                  <div
                    className={`h-full transition-all duration-300 ${
                      percent === 100 ? 'bg-emerald-500' : isOffboarding ? 'bg-rose-500' : 'bg-sky-500'
                    }`}
                    style={{ width: `${percent}%` }}
                  ></div>
                </div>

                {/* Metadata */}
                <div className="p-4 border-b border-slate-100 text-[11px] text-slate-500 flex items-center justify-between">
                  <span>Démarrage : {formatDate(item.dateDebut)}</span>
                  {item.tuteur && <span>Tuteur : <strong className="text-slate-700">{item.tuteur}</strong></span>}
                </div>

                {/* Checklist steps */}
                <div className="p-4 space-y-2.5 text-xs">
                  {item.etapes.map((etape) => (
                    <button
                      key={etape.id}
                      onClick={() => onToggleEtape(item._id, etape.id)}
                      className="w-full flex items-start gap-2.5 text-left p-1.5 -mx-1.5 rounded hover:bg-slate-50 transition-colors cursor-pointer group"
                    >
                      {etape.terminee ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      ) : (
                        <Circle className="w-4 h-4 text-slate-300 group-hover:text-slate-400 shrink-0 mt-0.5" />
                      )}
                      <span
                        className={`${
                          etape.terminee
                            ? 'line-through text-slate-400'
                            : 'text-slate-700 font-medium group-hover:text-slate-900'
                        }`}
                      >
                        {etape.label}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="p-3 bg-slate-50/50 border-t border-slate-100 text-center text-[11px] text-slate-400">
                {completedEtapes} sur {totalEtapes} étapes validées
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
