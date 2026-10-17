import React, { useState } from 'react';
import { Entretien, Employe } from '../types';
import { X } from 'lucide-react';

interface EntretienFormModalProps {
  isOpen: boolean;
  employes: Employe[];
  onClose: () => void;
  onSave: (data: Omit<Entretien, '_id'>) => Promise<void>;
}

export const EntretienFormModal: React.FC<EntretienFormModalProps> = ({
  isOpen,
  employes,
  onClose,
  onSave,
}) => {
  const [employeId, setEmployeId] = useState(employes[0]?._id || '');
  const [type, setType] = useState<'annuel' | 'professionnel'>('annuel');
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [evaluator, setEvaluator] = useState('Alice Dupont (RH)');
  const [noteGlobale, setNoteGlobale] = useState(4.0);
  const [statut, setStatut] = useState<'planifie' | 'realise'>('planifie');
  const [objectifs, setObjectifs] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const emp = employes.find((x) => x._id === employeId);
    try {
      setLoading(true);
      await onSave({
        employeId,
        employeNom: emp ? `${emp.prenom} ${emp.nom}` : undefined,
        type,
        date,
        evaluator,
        noteGlobale: Number(noteGlobale),
        statut,
        objectifs: objectifs.trim() || undefined,
      });
      onClose();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-md w-full p-5 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <h3 className="text-base font-bold text-slate-900">Programmer un entretien</h3>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-slate-600 rounded">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3 text-xs">
          <div>
            <label className="font-semibold text-slate-700 block mb-1">Collaborateur évalué</label>
            <select
              value={employeId}
              onChange={(e) => setEmployeId(e.target.value)}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg"
            >
              {employes.map((e) => (
                <option key={e._id} value={e._id}>
                  {e.prenom} {e.nom}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Type d'entretien</label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value as any)}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg"
              >
                <option value="annuel">Entretien Annuel (EIA)</option>
                <option value="professionnel">Entretien Professionnel (EP)</option>
              </select>
            </div>
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Date prévue</label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg"
              />
            </div>
          </div>

          <div>
            <label className="font-semibold text-slate-700 block mb-1">Manager ou évaluateur</label>
            <input
              type="text"
              required
              value={evaluator}
              onChange={(e) => setEvaluator(e.target.value)}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Note indicative (/5)</label>
              <input
                type="number"
                min="1"
                max="5"
                step="0.1"
                value={noteGlobale}
                onChange={(e) => setNoteGlobale(Number(e.target.value))}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-right tabular-nums"
              />
            </div>
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Statut initial</label>
              <select
                value={statut}
                onChange={(e) => setStatut(e.target.value as any)}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg"
              >
                <option value="planifie">Planifié</option>
                <option value="realise">Déjà Réalisé</option>
              </select>
            </div>
          </div>

          <div>
            <label className="font-semibold text-slate-700 block mb-1">Objectifs et axes de travail</label>
            <textarea
              rows={2}
              placeholder="Ex: Prise de responsabilité sur le pôle technique..."
              value={objectifs}
              onChange={(e) => setObjectifs(e.target.value)}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg"
            />
          </div>

          <div className="pt-3 border-t border-slate-100 flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-slate-200 rounded-lg text-slate-700 font-semibold cursor-pointer"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-slate-900 text-white rounded-lg font-semibold hover:bg-slate-800 cursor-pointer disabled:opacity-50"
            >
              {loading ? 'Enregistrement...' : 'Programmer l’entretien'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
