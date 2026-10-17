import React, { useState } from 'react';
import { MaterielItem, Employe } from '../types';
import { X } from 'lucide-react';

interface MaterielFormModalProps {
  isOpen: boolean;
  employes: Employe[];
  onClose: () => void;
  onSave: (data: Omit<MaterielItem, '_id'>) => Promise<void>;
}

export const MaterielFormModal: React.FC<MaterielFormModalProps> = ({
  isOpen,
  employes,
  onClose,
  onSave,
}) => {
  const [employeId, setEmployeId] = useState(employes[0]?._id || '');
  const [type, setType] = useState<'ordinateur' | 'smartphone' | 'vehicule' | 'autre'>('ordinateur');
  const [nom, setNom] = useState('');
  const [numeroSerie, setNumeroSerie] = useState('');
  const [dateAttribution, setDateAttribution] = useState(new Date().toISOString().slice(0, 10));
  const [etat, setEtat] = useState<'comme_neuf' | 'tres_bon' | 'bon' | 'usage'>('tres_bon');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nom.trim() || !numeroSerie.trim()) return;
    const emp = employes.find((x) => x._id === employeId);
    try {
      setLoading(true);
      await onSave({
        employeId,
        employeNom: emp ? `${emp.prenom} ${emp.nom}` : undefined,
        type,
        nom: nom.trim(),
        numeroSerie: numeroSerie.trim(),
        dateAttribution,
        etat,
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
          <h3 className="text-base font-bold text-slate-900">Attribuer un équipement</h3>
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

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Catégorie</label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value as any)}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg"
              >
                <option value="ordinateur">Ordinateur portable</option>
                <option value="smartphone">Téléphone pro</option>
                <option value="vehicule">Véhicule de fonction</option>
                <option value="autre">Badge / Clé / Autre</option>
              </select>
            </div>
            <div>
              <label className="font-semibold text-slate-700 block mb-1">État du matériel</label>
              <select
                value={etat}
                onChange={(e) => setEtat(e.target.value as any)}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg"
              >
                <option value="comme_neuf">Comme neuf</option>
                <option value="tres_bon">Très bon état</option>
                <option value="bon">Bon état</option>
                <option value="usage">Usagé</option>
              </select>
            </div>
          </div>

          <div>
            <label className="font-semibold text-slate-700 block mb-1">Modèle de l'équipement</label>
            <input
              type="text"
              required
              placeholder="Ex: MacBook Air 15 M3 16Go..."
              value={nom}
              onChange={(e) => setNom(e.target.value)}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg"
            />
          </div>

          <div>
            <label className="font-semibold text-slate-700 block mb-1">Numéro de série / Identifiant</label>
            <input
              type="text"
              required
              placeholder="Ex: C02G9012MD6T"
              value={numeroSerie}
              onChange={(e) => setNumeroSerie(e.target.value)}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg font-mono"
            />
          </div>

          <div>
            <label className="font-semibold text-slate-700 block mb-1">Date d'attribution</label>
            <input
              type="date"
              value={dateAttribution}
              onChange={(e) => setDateAttribution(e.target.value)}
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
              {loading ? 'Attribution...' : 'Enregistrer le prêt'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
