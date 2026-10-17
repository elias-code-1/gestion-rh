import React, { useState } from 'react';
import { NoteFrais, Employe } from '../types';
import { X } from 'lucide-react';

interface NoteFraisFormModalProps {
  isOpen: boolean;
  employes: Employe[];
  onClose: () => void;
  onSave: (data: Omit<NoteFrais, '_id'>) => Promise<void>;
}

export const NoteFraisFormModal: React.FC<NoteFraisFormModalProps> = ({
  isOpen,
  employes,
  onClose,
  onSave,
}) => {
  const [employeId, setEmployeId] = useState(employes[0]?._id || '');
  const [titre, setTitre] = useState('');
  const [montant, setMontant] = useState(65.0);
  const [dateDepense, setDateDepense] = useState(new Date().toISOString().slice(0, 10));
  const [categorie, setCategorie] = useState<'transport' | 'repas' | 'hebergement' | 'logiciel' | 'autre'>('repas');
  const [justificatif, setJustificatif] = useState('ticket_caisse.pdf');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!titre.trim() || montant <= 0) return;
    const emp = employes.find((x) => x._id === employeId);
    try {
      setLoading(true);
      await onSave({
        employeId,
        employeNom: emp ? `${emp.prenom} ${emp.nom}` : undefined,
        titre: titre.trim(),
        montant: Number(montant),
        dateDepense,
        categorie,
        statut: 'en_attente',
        justificatif: justificatif.trim() || undefined,
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
          <h3 className="text-base font-bold text-slate-900">Déposer une note de frais</h3>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-slate-600 rounded">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3 text-xs">
          <div>
            <label className="font-semibold text-slate-700 block mb-1">Collaborateur déclarant</label>
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
            <label className="font-semibold text-slate-700 block mb-1">Libellé de la dépense</label>
            <input
              type="text"
              required
              placeholder="Ex: Taxi client, déjeuner travail..."
              value={titre}
              onChange={(e) => setTitre(e.target.value)}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Montant TTC (€)</label>
              <input
                type="number"
                step="0.1"
                min="1"
                required
                value={montant}
                onChange={(e) => setMontant(Number(e.target.value))}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-right tabular-nums"
              />
            </div>
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Catégorie</label>
              <select
                value={categorie}
                onChange={(e) => setCategorie(e.target.value as any)}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg"
              >
                <option value="repas">Repas & Réception</option>
                <option value="transport">Transport & Déplacement</option>
                <option value="hebergement">Hôtel & Hébergement</option>
                <option value="logiciel">Logiciel & Matériel</option>
                <option value="autre">Autre frais</option>
              </select>
            </div>
          </div>

          <div>
            <label className="font-semibold text-slate-700 block mb-1">Date de la dépense</label>
            <input
              type="date"
              value={dateDepense}
              onChange={(e) => setDateDepense(e.target.value)}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg"
            />
          </div>

          <div>
            <label className="font-semibold text-slate-700 block mb-1">Référence du justificatif</label>
            <input
              type="text"
              placeholder="Ex: Facture_SNCF_1234.pdf"
              value={justificatif}
              onChange={(e) => setJustificatif(e.target.value)}
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
              {loading ? 'Enregistrement...' : 'Soumettre pour validation'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
