import React, { useState } from 'react';
import { Formation, Employe } from '../types';
import { X } from 'lucide-react';

interface FormationFormModalProps {
  isOpen: boolean;
  employes: Employe[];
  onClose: () => void;
  onSave: (data: Omit<Formation, '_id'>) => Promise<void>;
}

export const FormationFormModal: React.FC<FormationFormModalProps> = ({
  isOpen,
  employes,
  onClose,
  onSave,
}) => {
  const [employeId, setEmployeId] = useState(employes[0]?._id || '');
  const [titre, setTitre] = useState('');
  const [organisme, setOrganisme] = useState('');
  const [cout, setCout] = useState(1200);
  const [dureeJours, setDureeJours] = useState(3);
  const [datePrevue, setDatePrevue] = useState(new Date().toISOString().slice(0, 10));
  const [statut, setStatut] = useState<'en_attente' | 'validee'>('en_attente');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!titre.trim() || !organisme.trim()) return;

    const emp = employes.find((x) => x._id === employeId);
    try {
      setLoading(true);
      await onSave({
        employeId,
        employeNom: emp ? `${emp.prenom} ${emp.nom}` : undefined,
        titre: titre.trim(),
        organisme: organisme.trim(),
        cout: Number(cout),
        dureeJours: Number(dureeJours),
        datePrevue,
        statut,
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
          <h3 className="text-base font-bold text-slate-900">Inscrire à une formation</h3>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-slate-600 rounded">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3 text-xs">
          <div>
            <label className="font-semibold text-slate-700 block mb-1">Collaborateur bénéficiaire</label>
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

          <div>
            <label className="font-semibold text-slate-700 block mb-1">Titre de la formation</label>
            <input
              type="text"
              required
              placeholder="Ex: Certification AWS Solution Architect..."
              value={titre}
              onChange={(e) => setTitre(e.target.value)}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg"
            />
          </div>

          <div>
            <label className="font-semibold text-slate-700 block mb-1">Organisme formateur</label>
            <input
              type="text"
              required
              placeholder="Ex: CNAM, Coursera, Global Knowledge..."
              value={organisme}
              onChange={(e) => setOrganisme(e.target.value)}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Coût estimé (€)</label>
              <input
                type="number"
                min="0"
                step="50"
                value={cout}
                onChange={(e) => setCout(Number(e.target.value))}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-right tabular-nums"
              />
            </div>
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Durée (jours)</label>
              <input
                type="number"
                min="1"
                value={dureeJours}
                onChange={(e) => setDureeJours(Number(e.target.value))}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-right tabular-nums"
              />
            </div>
          </div>

          <div>
            <label className="font-semibold text-slate-700 block mb-1">Date de démarrage</label>
            <input
              type="date"
              value={datePrevue}
              onChange={(e) => setDatePrevue(e.target.value)}
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
              {loading ? 'Enregistrement...' : 'Enregistrer la formation'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
