import React, { useState, useEffect } from 'react';
import { Absence, Employe } from '../types';
import { X } from 'lucide-react';

interface AbsenceFormModalProps {
  isOpen: boolean;
  absence: Absence | null;
  employes: Employe[];
  onClose: () => void;
  onSave: (data: Omit<Absence, '_id'>) => Promise<void>;
}

export const AbsenceFormModal: React.FC<AbsenceFormModalProps> = ({
  isOpen,
  absence,
  employes,
  onClose,
  onSave,
}) => {
  const [employeId, setEmployeId] = useState('');
  const [date, setDate] = useState('');
  const [motif, setMotif] = useState('');
  const [justifiee, setJustifiee] = useState(false);
  const [commentaire, setCommentaire] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (absence) {
      setEmployeId(absence.employeId || '');
      setDate(absence.date ? absence.date.slice(0, 10) : '');
      setMotif(absence.motif || '');
      setJustifiee(!!absence.justifiee);
      setCommentaire(absence.commentaire || '');
    } else {
      setEmployeId(employes[0]?._id || '');
      setDate(new Date().toISOString().slice(0, 10));
      setMotif('Rendez-vous médical');
      setJustifiee(false);
      setCommentaire('');
    }
    setError(null);
  }, [absence, isOpen, employes]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!employeId) {
      setError('Veuillez sélectionner un collaborateur.');
      return;
    }
    if (!date) {
      setError('Veuillez renseigner la date.');
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
        date,
        motif: motif.trim() || undefined,
        justifiee,
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
            {absence ? "Modifier le signalement d'absence" : "Signaler une absence"}
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
            <label className="font-semibold text-slate-700 block mb-1">Date de l'absence *</label>
            <input
              type="date"
              required
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500"
            />
          </div>

          <div>
            <label className="font-semibold text-slate-700 block mb-1">Motif principal</label>
            <input
              type="text"
              value={motif}
              onChange={(e) => setMotif(e.target.value)}
              placeholder="Ex: Rendez-vous médical, transport, urgence familiale..."
              className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500"
            />
          </div>

          <div>
            <label className="font-semibold text-slate-700 block mb-1">Justificatif fourni</label>
            <select
              value={String(justifiee)}
              onChange={(e) => setJustifiee(e.target.value === 'true')}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500"
            >
              <option value="false">Non justifiée (attente de certificat/justificatif)</option>
              <option value="true">Justifiée (certificat médical ou justificatif reçu)</option>
            </select>
          </div>

          <div>
            <label className="font-semibold text-slate-700 block mb-1">Commentaire ou précisions</label>
            <textarea
              rows={2}
              value={commentaire}
              onChange={(e) => setCommentaire(e.target.value)}
              placeholder="Préciser les circonstances..."
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
              {loading ? 'Enregistrement...' : absence ? 'Mettre à jour' : "Enregistrer l'absence"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
