import React, { useState, useEffect } from 'react';
import { Employe, StatutEmploye } from '../types';
import { X } from 'lucide-react';

interface EmployeFormModalProps {
  isOpen: boolean;
  employe: Employe | null;
  onClose: () => void;
  onSave: (data: Omit<Employe, '_id'>) => Promise<void>;
}

export const EmployeFormModal: React.FC<EmployeFormModalProps> = ({
  isOpen,
  employe,
  onClose,
  onSave,
}) => {
  const [nom, setNom] = useState('');
  const [prenom, setPrenom] = useState('');
  const [email, setEmail] = useState('');
  const [telephone, setTelephone] = useState('');
  const [poste, setPoste] = useState('');
  const [departement, setDepartement] = useState('');
  const [dateEmbauche, setDateEmbauche] = useState('');
  const [statut, setStatut] = useState<StatutEmploye>('actif');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (employe) {
      setNom(employe.nom || '');
      setPrenom(employe.prenom || '');
      setEmail(employe.email || '');
      setTelephone(employe.telephone || '');
      setPoste(employe.poste || '');
      setDepartement(employe.departement || '');
      setDateEmbauche(employe.dateEmbauche ? employe.dateEmbauche.slice(0, 10) : '');
      setStatut(employe.statut || 'actif');
    } else {
      setNom('');
      setPrenom('');
      setEmail('');
      setTelephone('');
      setPoste('');
      setDepartement('');
      setDateEmbauche(new Date().toISOString().slice(0, 10));
      setStatut('actif');
    }
    setError(null);
  }, [employe, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nom.trim() || !prenom.trim() || !email.trim()) {
      setError('Veuillez renseigner le nom, prénom et email.');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      await onSave({
        nom: nom.trim(),
        prenom: prenom.trim(),
        email: email.trim(),
        telephone: telephone.trim() || undefined,
        poste: poste.trim() || undefined,
        departement: departement.trim() || undefined,
        dateEmbauche: dateEmbauche || undefined,
        statut,
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
            {employe ? 'Modifier le collaborateur' : 'Nouveau collaborateur'}
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

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Prénom *</label>
              <input
                type="text"
                required
                value={prenom}
                onChange={(e) => setPrenom(e.target.value)}
                placeholder="Ex: Alice"
                className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500"
              />
            </div>
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Nom *</label>
              <input
                type="text"
                required
                value={nom}
                onChange={(e) => setNom(e.target.value)}
                placeholder="Ex: Dupont"
                className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500"
              />
            </div>
          </div>

          <div>
            <label className="font-semibold text-slate-700 block mb-1">Email professionnel *</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Ex: alice.dupont@rh-solution.fr"
              className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500"
            />
          </div>

          <div>
            <label className="font-semibold text-slate-700 block mb-1">Numéro de téléphone</label>
            <input
              type="tel"
              value={telephone}
              onChange={(e) => setTelephone(e.target.value)}
              placeholder="Ex: 06 12 34 56 78"
              className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Intitulé du poste</label>
              <input
                type="text"
                value={poste}
                onChange={(e) => setPoste(e.target.value)}
                placeholder="Ex: Ingénieur Logiciel"
                className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500"
              />
            </div>
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Département</label>
              <input
                type="text"
                value={departement}
                onChange={(e) => setDepartement(e.target.value)}
                placeholder="Ex: Informatique"
                className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Date d'embauche</label>
              <input
                type="date"
                value={dateEmbauche}
                onChange={(e) => setDateEmbauche(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500"
              />
            </div>
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Statut du contrat</label>
              <select
                value={statut}
                onChange={(e) => setStatut(e.target.value as StatutEmploye)}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500"
              >
                <option value="actif">Actif</option>
                <option value="inactif">Inactif / Fin de contrat</option>
              </select>
            </div>
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
              {loading ? 'Enregistrement...' : employe ? 'Mettre à jour' : 'Créer le collaborateur'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
