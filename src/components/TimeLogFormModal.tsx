import React, { useState } from 'react';
import { TimeLog, Employe } from '../types';
import { X } from 'lucide-react';

interface TimeLogFormModalProps {
  isOpen: boolean;
  employes: Employe[];
  onClose: () => void;
  onSave: (data: Omit<TimeLog, '_id'>) => Promise<void>;
}

export const TimeLogFormModal: React.FC<TimeLogFormModalProps> = ({
  isOpen,
  employes,
  onClose,
  onSave,
}) => {
  const [employeId, setEmployeId] = useState(employes[0]?._id || '');
  const [semaine, setSemaine] = useState('2026-W42');
  const [heuresDeclarees, setHeuresDeclarees] = useState(35.0);
  const [heuresSupp, setHeuresSupp] = useState(0);
  const [joursPresentiel, setJoursPresentiel] = useState(3);
  const [joursTeletravail, setJoursTeletravail] = useState(2);
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
        semaine,
        heuresDeclarees: Number(heuresDeclarees),
        heuresSupp: Number(heuresSupp),
        joursPresentiel: Number(joursPresentiel),
        joursTeletravail: Number(joursTeletravail),
        statut: 'en_attente',
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
          <h3 className="text-base font-bold text-slate-900">Déclarer des heures & temps de travail</h3>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-slate-600 rounded">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3 text-xs">
          <div>
            <label className="font-semibold text-slate-700 block mb-1">Collaborateur concerné</label>
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
            <label className="font-semibold text-slate-700 block mb-1">Semaine de travail (ex: 2026-W42)</label>
            <input
              type="text"
              required
              value={semaine}
              onChange={(e) => setSemaine(e.target.value)}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg font-mono"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Heures totales (35h base)</label>
              <input
                type="number"
                step="0.5"
                min="0"
                value={heuresDeclarees}
                onChange={(e) => setHeuresDeclarees(Number(e.target.value))}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-right tabular-nums"
              />
            </div>
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Heures supplémentaires</label>
              <input
                type="number"
                step="0.5"
                min="0"
                value={heuresSupp}
                onChange={(e) => setHeuresSupp(Number(e.target.value))}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-right tabular-nums"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Jours sur site</label>
              <input
                type="number"
                min="0"
                max="5"
                value={joursPresentiel}
                onChange={(e) => setJoursPresentiel(Number(e.target.value))}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-right tabular-nums"
              />
            </div>
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Jours télétravail</label>
              <input
                type="number"
                min="0"
                max="5"
                value={joursTeletravail}
                onChange={(e) => setJoursTeletravail(Number(e.target.value))}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-right tabular-nums"
              />
            </div>
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
              {loading ? 'Enregistrement...' : 'Valider la déclaration'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
