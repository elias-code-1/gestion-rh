import React, { useMemo } from 'react';
import { Employe, Conge, Absence, NoteFrais, ActiveTab } from '../types';
import { formatDate } from '../services/api';
import {
  AlertTriangle,
  Clock,
  UserX,
  Stethoscope,
  CalendarCheck,
  Receipt,
  ArrowRight,
  ShieldAlert,
  CheckCircle,
} from 'lucide-react';

interface AlertesViewProps {
  employes: Employe[];
  conges: Conge[];
  absences: Absence[];
  notesFrais: NoteFrais[];
  onNavigate: (tab: ActiveTab) => void;
  onApproveConge: (id: string) => Promise<void>;
  onToggleAbsenceJustifiee: (absence: Absence) => Promise<void>;
}

export const AlertesView: React.FC<AlertesViewProps> = ({
  employes,
  conges,
  absences,
  notesFrais,
  onNavigate,
  onApproveConge,
  onToggleAbsenceJustifiee,
}) => {
  const now = new Date();

  // 1. Visites médicales dépassées ou proches (< 60 jours)
  const alertesVisites = useMemo(() => {
    return employes
      .filter((e) => {
        if (!e.visiteMedicale) return true;
        const d = new Date(e.visiteMedicale);
        const diffDays = Math.round((d.getTime() - now.getTime()) / 86400000);
        return diffDays < 60;
      })
      .map((e) => ({
        id: `vm-${e._id}`,
        employe: e,
        date: e.visiteMedicale,
        isOverdue: !e.visiteMedicale || new Date(e.visiteMedicale) < now,
      }));
  }, [employes, now]);

  // 2. Congés en attente
  const alertesConges = useMemo(() => {
    return conges.filter((c) => c.statut === 'en_attente');
  }, [conges]);

  // 3. Absences non justifiées
  const alertesAbsences = useMemo(() => {
    return absences.filter((a) => !a.justifiee);
  }, [absences]);

  // 4. Notes de frais en attente de remboursement
  const alertesNotesFrais = useMemo(() => {
    return notesFrais.filter((n) => n.statut === 'en_attente');
  }, [notesFrais]);

  const totalAlertes =
    alertesVisites.length + alertesConges.length + alertesAbsences.length + alertesNotesFrais.length;

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Alert Center Header Banner */}
      <div className="bg-white p-5 rounded-xl border border-slate-200/90 shadow-xs flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center font-bold">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-900">Centre d'Alertes et Vigilance RH</h2>
            <p className="text-xs text-slate-500">
              {totalAlertes} point{totalAlertes > 1 ? 's' : ''} d'attention nécessitant une action administrative
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Module 1: Visites médicales */}
        <div className="bg-white rounded-xl border border-slate-200/90 shadow-xs p-5">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
            <div className="flex items-center gap-2">
              <Stethoscope className="w-4 h-4 text-sky-600" />
              <h3 className="text-sm font-bold text-slate-900">
                Santé au Travail & Visites Médicales ({alertesVisites.length})
              </h3>
            </div>
            <button
              onClick={() => onNavigate('employes')}
              className="text-xs text-sky-600 hover:underline cursor-pointer"
            >
              Collaborateurs &rarr;
            </button>
          </div>

          <div className="space-y-3">
            {alertesVisites.map((item) => (
              <div
                key={item.id}
                className="p-3 rounded-lg border border-slate-100 bg-slate-50/60 flex items-center justify-between text-xs"
              >
                <div>
                  <div className="font-semibold text-slate-900">
                    {item.employe.prenom} {item.employe.nom}
                  </div>
                  <div className="text-slate-500 text-[11px] mt-0.5">
                    {item.employe.poste || 'Collaborateur'} · {item.employe.departement || 'Général'}
                  </div>
                </div>
                <div>
                  {item.isOverdue ? (
                    <span className="text-[11px] font-semibold text-rose-700 bg-rose-50 border border-rose-200 px-2 py-0.5 rounded">
                      À renouveler d'urgence
                    </span>
                  ) : (
                    <span className="text-[11px] font-medium text-amber-700 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded">
                      Échéance : {formatDate(item.date)}
                    </span>
                  )}
                </div>
              </div>
            ))}
            {alertesVisites.length === 0 && (
              <div className="py-6 text-center text-slate-400 text-xs">
                Toutes les visites médicales sont à jour.
              </div>
            )}
          </div>
        </div>

        {/* Module 2: Demandes de congés à valider */}
        <div className="bg-white rounded-xl border border-slate-200/90 shadow-xs p-5">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-amber-600" />
              <h3 className="text-sm font-bold text-slate-900">
                Congés en Attente d'Approbation ({alertesConges.length})
              </h3>
            </div>
            <button
              onClick={() => onNavigate('conges')}
              className="text-xs text-sky-600 hover:underline cursor-pointer"
            >
              Gestion congés &rarr;
            </button>
          </div>

          <div className="space-y-3">
            {alertesConges.map((c) => (
              <div
                key={c._id}
                className="p-3 rounded-lg border border-amber-100 bg-amber-50/40 flex items-center justify-between text-xs"
              >
                <div>
                  <div className="font-semibold text-slate-900">{c.employeNom || 'Salarié'}</div>
                  <div className="text-slate-600 text-[11px] mt-0.5">
                    Du {formatDate(c.dateDebut)} au {formatDate(c.dateFin)} ({c.typeConge})
                  </div>
                </div>
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => onApproveConge(c._id)}
                    className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded text-[11px] font-semibold cursor-pointer"
                  >
                    Valider
                  </button>
                </div>
              </div>
            ))}
            {alertesConges.length === 0 && (
              <div className="py-6 text-center text-slate-400 text-xs">
                Aucune demande en souffrance.
              </div>
            )}
          </div>
        </div>

        {/* Module 3: Absences non justifiées */}
        <div className="bg-white rounded-xl border border-slate-200/90 shadow-xs p-5">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
            <div className="flex items-center gap-2">
              <UserX className="w-4 h-4 text-rose-600" />
              <h3 className="text-sm font-bold text-slate-900">
                Absences sans Justificatif Reçu ({alertesAbsences.length})
              </h3>
            </div>
            <button
              onClick={() => onNavigate('absences')}
              className="text-xs text-sky-600 hover:underline cursor-pointer"
            >
              Registre absences &rarr;
            </button>
          </div>

          <div className="space-y-3">
            {alertesAbsences.map((a) => (
              <div
                key={a._id}
                className="p-3 rounded-lg border border-slate-100 bg-slate-50/60 flex items-center justify-between text-xs"
              >
                <div>
                  <div className="font-semibold text-slate-900">{a.employeNom || 'Salarié'}</div>
                  <div className="text-slate-500 text-[11px] mt-0.5">
                    Le {formatDate(a.date)} · Motif : {a.motif || 'Non précisé'}
                  </div>
                </div>
                <button
                  onClick={() => onToggleAbsenceJustifiee(a)}
                  className="px-2.5 py-1 text-slate-700 hover:bg-emerald-50 hover:text-emerald-700 hover:border-emerald-200 border border-slate-200 rounded text-[11px] font-medium cursor-pointer"
                >
                  Régulariser
                </button>
              </div>
            ))}
            {alertesAbsences.length === 0 && (
              <div className="py-6 text-center text-slate-400 text-xs">
                Toutes les absences sont justifiées.
              </div>
            )}
          </div>
        </div>

        {/* Module 4: Notes de frais en attente */}
        <div className="bg-white rounded-xl border border-slate-200/90 shadow-xs p-5">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
            <div className="flex items-center gap-2">
              <Receipt className="w-4 h-4 text-indigo-600" />
              <h3 className="text-sm font-bold text-slate-900">
                Notes de Frais à Valider ({alertesNotesFrais.length})
              </h3>
            </div>
            <button
              onClick={() => onNavigate('notes_frais')}
              className="text-xs text-sky-600 hover:underline cursor-pointer"
            >
              Notes de frais &rarr;
            </button>
          </div>

          <div className="space-y-3">
            {alertesNotesFrais.map((n) => (
              <div
                key={n._id}
                className="p-3 rounded-lg border border-slate-100 bg-slate-50/60 flex items-center justify-between text-xs"
              >
                <div>
                  <div className="font-semibold text-slate-900">{n.employeNom || 'Salarié'}</div>
                  <div className="text-slate-500 text-[11px] mt-0.5">
                    {n.titre} · {formatDate(n.dateDepense)}
                  </div>
                </div>
                <div className="font-bold text-slate-900 tabular-nums">
                  {n.montant.toFixed(2)} €
                </div>
              </div>
            ))}
            {alertesNotesFrais.length === 0 && (
              <div className="py-6 text-center text-slate-400 text-xs">
                Aucune note de frais en attente de validation.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
