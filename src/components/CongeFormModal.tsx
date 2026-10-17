import React, { useState, useEffect } from 'react';
import { Conge, Employe, TypeConge, StatutConge } from '../types';
import { calculateWorkingDays } from '../services/api';
import { X, Calendar } from 'lucide-react';

interface CongeFormModalProps {
  isOpen: boolean;
  conge: Conge | null;
  employes: Employe[];
  onClose: () => void;
  onSave: (data: Omit<Conge, '_id'>) => Promise<void>;
}

export const CongeFormModal: React.FC<CongeFormModalProps> = ({
  isOpen,
  conge,
  employes,
  onClose,
  onSave,
}) => {
  const [employeId, setEmployeId] = useState('');
  const [typeConge, setTypeConge] = useState<TypeConge>('paye');
  const [dateDebut, setDateDebut] = useState('');
  const [dateFin, setDateFin] = useState('');
  const [statut, setStatut] = useState<StatutConge>('en_attente');
  const [commentaire, setCommentaire] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (conge) {
      setEmployeId(conge.employeId || '');
      setTypeConge(conge.typeConge || 'paye');
      setDateDebut(conge.dateDebut ? conge.dateDebut.slice(0, 10) : '');
      setDateFin(conge.dateFin ? conge.dateFin.slice(0, 10) : '');
      setStatut(conge.statut || 'en_attente');
      setCommentaire(conge.commentaire || '');
    } else {
      setEmployeId(employes[0]?._id || '');
      setTypeConge('paye');
      const today = new Date().toISOString().slice(0, 10);
      setDateDebut(today);
      setDateFin(today);
      setStatut('en_attente');
      setCommentaire('');
    }
    setError(null);
  }, [conge, isOpen, employes]);

  if (!isOpen) return null;

  const workingDays = calculateWorkingDays(dateDebut, dateFin);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!employeId) {
      setError('Veuillez sélectionner un collaborateur.');
      return;
    }
    if (!dateDebut || !dateFin) {
      setError('Veuillez renseigner les dates de début et de fin.');
      return;
    }
    if (dateFin < dateDebut) {
      setError('La date de fin ne peut pas être antérieure à la date de début.');
      return;
    }

    const selectedEmp = employes.find((e) => e._id === employeId);
    const employeNom = selectedEmp ? `${selectedEmp.prenom} ${selectedEmp.nom}` : undefined;

    try {
      setLoading(true);
      setError(null);
      await onSave({
        employeId,
        employeNom,
        typeConge,
        dateDebut,
        dateFin,
        statut,
        commentaire: commentaire.trim() || undefined,
      });
      onClose();
    } catch (err: any) {
      setError(err.message || 'Erreur lors de l’enregistrement');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-lg w-full overflow-hidden">
        <div className="p-5 border-b border-slate-200 flex items-center justify-between">
          <h2 className="text-base font-bold text-slate-900">
            {conge ? 'Modifier la demande de congé' : 'Nouvelle demande de congé'}
          </h2>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg transition-colors cursor-pointer"
            aria-label="Fermer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4 text-xs">
          {error && (
            <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-800 font-medium">
              {error}
            </div>
          )}

          <div>
            <label className="font-semibold text-slate-700 block mb-1">Collaborateur concerné *</label>
            <select
              value={employeId}
              onChange={(e) => setEmployeId(e.target.value)}
              required
              className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500"
            >
              <option value="">Sélectionner un employé...</option>
              {employes.map((e) => (
                <option key={e._id} value={e._id}>
                  {e.prenom} {e.nom} ({e.poste || e.departement || 'Salarié'})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="font-semibold text-slate-700 block mb-1">Type de congé</label>
            <select
              value={typeConge}
              onChange={(e) => setTypeConge(e.target.value as TypeConge)}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500"
            >
              <option value="paye">Congé Payé (CP)</option>
              <option value="maladie">Arrêt Maladie</option>
              <option value="exceptionnel">Événement familial (Mariage, Naissance, etc.)</option>
              <option value="sans_solde">Congé Sans Solde</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Date de début *</label>
              <input
                type="date"
                required
                value={dateDebut}
                onChange={(e) => setDateDebut(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500"
              />
            </div>
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Date de fin *</label>
              <input
                type="date"
                required
                value={dateFin}
                onChange={(e) => setDateFin(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500"
              />
            </div>
          </div>

          {dateDebut && dateFin && dateFin >= dateDebut && (
            <div className="p-3 bg-sky-50 border border-sky-100 rounded-lg text-sky-900 flex items-center justify-between">
              <span className="font-medium">Durée calculée :</span>
              <span className="font-bold tabular-nums">
                {workingDays} jour{workingDays > 1 ? 's' : ''} ouvré{workingDays > 1 ? 's' : ''}
              </span>
            </div>
          )}

          <div>
            <label className="font-semibold text-slate-700 block mb-1">Statut d'approbation</label>
            <select
              value={statut}
              onChange={(e) => setStatut(e.target.value as StatutConge)}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500"
            >
              <option value="en_attente">En attente de validation</option>
              <option value="approuve">Approuvé directement</option>
              <option value="refuse">Refusé</option>
            </select>
          </div>

          <div>
            <label className="font-semibold text-slate-700 block mb-1">Motif ou commentaire</label>
            <textarea
              rows={2}
              value={commentaire}
              onChange={(e) => setCommentaire(e.target.value)}
              placeholder="Ex: Vacances scolaires, certificat médical joint..."
              className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500"
            />
          </div>

          <div className="pt-4 border-t border-slate-200 flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-slate-200 text-slate-700 hover:bg-slate-100 rounded-lg font-semibold transition-colors cursor-pointer"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg font-semibold shadow-xs transition-colors cursor-pointer disabled:opacity-50"
            >
              {loading ? 'Enregistrement...' : conge ? 'Mettre à jour' : 'Soumettre la demande'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
