import React, { useMemo } from 'react';
import { Employe, Conge, Absence } from '../types';
import { formatDate, calculateWorkingDays } from '../services/api';
import {
  X,
  Mail,
  Phone,
  Briefcase,
  Building,
  Calendar,
  CalendarCheck,
  UserX,
  Clock,
  Edit,
} from 'lucide-react';

interface EmployeDetailModalProps {
  employe: Employe | null;
  conges: Conge[];
  absences: Absence[];
  onClose: () => void;
  onEdit: (employe: Employe) => void;
}

const TOTAL_ANNUAL_CP = 25; // 25 jours légaux annuels

export const EmployeDetailModal: React.FC<EmployeDetailModalProps> = ({
  employe,
  conges,
  absences,
  onClose,
  onEdit,
}) => {
  if (!employe) return null;

  // Filter leaves and absences for this specific employee
  const employeConges = useMemo(() => {
    return conges.filter(
      (c) => c.employeId === employe._id || (c.employeNom && c.employeNom.includes(employe.nom))
    );
  }, [conges, employe]);

  const employeAbsences = useMemo(() => {
    return absences.filter(
      (a) => a.employeId === employe._id || (a.employeNom && a.employeNom.includes(employe.nom))
    );
  }, [absences, employe]);

  // Calculate annual CP days taken
  const cpPris = useMemo(() => {
    return employeConges
      .filter((c) => c.statut === 'approuve' && c.typeConge === 'paye')
      .reduce((sum, c) => sum + calculateWorkingDays(c.dateDebut, c.dateFin), 0);
  }, [employeConges]);

  const soldeRestant = Math.max(0, TOTAL_ANNUAL_CP - cpPris);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-6 bg-slate-900 text-white flex items-start justify-between">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-sky-500 to-indigo-600 flex items-center justify-center text-xl font-bold text-white shadow-md">
              {employe.prenom[0]}
              {employe.nom[0]}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold tracking-tight">
                  {employe.prenom} {employe.nom}
                </h2>
                <span
                  className={`text-[11px] px-2 py-0.5 rounded-full font-semibold uppercase ${
                    employe.statut === 'actif'
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-400/30'
                      : 'bg-slate-700 text-slate-300'
                  }`}
                >
                  {employe.statut || 'actif'}
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-1 flex items-center gap-2">
                <span>{employe.poste || 'Poste non spécifié'}</span>
                <span>·</span>
                <span>{employe.departement || 'Département général'}</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                onClose();
                onEdit(employe);
              }}
              className="p-2 text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
              title="Modifier les informations"
            >
              <Edit className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="p-2 text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
              aria-label="Fermer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6 text-sm">
          {/* Info Cards Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3 rounded-xl border border-slate-100 bg-slate-50">
              <span className="text-[11px] font-semibold text-slate-400 block uppercase">Solde CP Restant</span>
              <span className="text-xl font-bold text-slate-900 tabular-nums">
                {soldeRestant} <span className="text-xs font-normal text-slate-500">/ 25j</span>
              </span>
            </div>
            <div className="p-3 rounded-xl border border-slate-100 bg-slate-50">
              <span className="text-[11px] font-semibold text-slate-400 block uppercase">CP Consommés</span>
              <span className="text-xl font-bold text-sky-700 tabular-nums">
                {cpPris} <span className="text-xs font-normal text-slate-500">jours</span>
              </span>
            </div>
            <div className="p-3 rounded-xl border border-slate-100 bg-slate-50">
              <span className="text-[11px] font-semibold text-slate-400 block uppercase">Absences Enregistrées</span>
              <span className="text-xl font-bold text-slate-900 tabular-nums">
                {employeAbsences.length}
              </span>
            </div>
            <div className="p-3 rounded-xl border border-slate-100 bg-slate-50">
              <span className="text-[11px] font-semibold text-slate-400 block uppercase">Ancienneté</span>
              <span className="text-xs font-semibold text-slate-800 block mt-1">
                {formatDate(employe.dateEmbauche)}
              </span>
            </div>
          </div>

          {/* Contact Details */}
          <div className="p-4 rounded-xl border border-slate-200/80 bg-slate-50/50 space-y-2 text-xs">
            <div className="font-semibold text-slate-900 mb-2">Coordonnées professionnelles</div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="flex items-center gap-2 text-slate-600">
                <Mail className="w-4 h-4 text-slate-400" />
                <a href={`mailto:${employe.email}`} className="hover:text-sky-600 underline">
                  {employe.email}
                </a>
              </div>
              <div className="flex items-center gap-2 text-slate-600">
                <Phone className="w-4 h-4 text-slate-400" />
                <span>{employe.telephone || 'Non renseigné'}</span>
              </div>
            </div>
          </div>

          {/* Leave History */}
          <div>
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <CalendarCheck className="w-4 h-4 text-slate-500" />
              <span>Historique des Congés ({employeConges.length})</span>
            </h4>
            <div className="border border-slate-200 rounded-xl overflow-hidden divide-y divide-slate-100 text-xs">
              {employeConges.map((c) => (
                <div key={c._id} className="p-3 flex items-center justify-between hover:bg-slate-50 transition-colors">
                  <div>
                    <span className="font-semibold text-slate-800 capitalize mr-2">
                      {c.typeConge === 'paye'
                        ? 'Congé payé'
                        : c.typeConge === 'maladie'
                        ? 'Arrêt maladie'
                        : c.typeConge}
                    </span>
                    <span className="text-slate-500 tabular-nums">
                      {formatDate(c.dateDebut)} &rarr; {formatDate(c.dateFin)}
                    </span>
                    {c.commentaire && <span className="text-slate-400 ml-2 italic">« {c.commentaire} »</span>}
                  </div>
                  <span
                    className={`px-2 py-0.5 rounded text-[11px] font-medium ${
                      c.statut === 'approuve'
                        ? 'bg-emerald-50 text-emerald-700'
                        : c.statut === 'refuse'
                        ? 'bg-rose-50 text-rose-700'
                        : 'bg-amber-50 text-amber-700'
                    }`}
                  >
                    {c.statut === 'approuve' ? 'Approuvé' : c.statut === 'refuse' ? 'Refusé' : 'En attente'}
                  </span>
                </div>
              ))}
              {employeConges.length === 0 && (
                <div className="p-4 text-center text-slate-400">Aucun congé enregistré</div>
              )}
            </div>
          </div>

          {/* Absence History */}
          <div>
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <UserX className="w-4 h-4 text-slate-500" />
              <span>Historique des Absences ({employeAbsences.length})</span>
            </h4>
            <div className="border border-slate-200 rounded-xl overflow-hidden divide-y divide-slate-100 text-xs">
              {employeAbsences.map((a) => (
                <div key={a._id} className="p-3 flex items-center justify-between hover:bg-slate-50 transition-colors">
                  <div>
                    <span className="font-semibold text-slate-800 mr-2">{formatDate(a.date)}</span>
                    <span className="text-slate-600">{a.motif || 'Absence'}</span>
                    {a.commentaire && <span className="text-slate-400 ml-2 italic">« {a.commentaire} »</span>}
                  </div>
                  <span
                    className={`px-2 py-0.5 rounded text-[11px] font-medium ${
                      a.justifiee
                        ? 'bg-emerald-50 text-emerald-700'
                        : 'bg-rose-50 text-rose-700'
                    }`}
                  >
                    {a.justifiee ? 'Justifiée' : 'Non justifiée'}
                  </span>
                </div>
              ))}
              {employeAbsences.length === 0 && (
                <div className="p-4 text-center text-slate-400">Aucune absence enregistrée</div>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer"
          >
            Fermer
          </button>
        </div>
      </div>
    </div>
  );
};
