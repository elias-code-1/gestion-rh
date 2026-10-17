import React, { useState, useEffect } from 'react';
import { PrimeItem, Employe } from '../types';
import { apiService, formatDate, formatCurrency, downloadCsv } from '../services/api';
import { Coins, Plus, Download, RefreshCw, CheckCircle2, Clock, Trash2 } from 'lucide-react';

interface PrimesViewProps {
  employes: Employe[];
  onSuccess: (msg: string) => void;
  onError: (msg: string) => void;
}

export const PrimesView: React.FC<PrimesViewProps> = ({ employes, onSuccess, onError }) => {
  const [primes, setPrimes] = useState<PrimeItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [submitting, setSubmitting] = useState<boolean>(false);

  // Form state
  const [employeId, setEmployeId] = useState<string>('');
  const [titre, setTitre] = useState<string>('');
  const [montant, setMontant] = useState<number>(500);
  const [dateVersement, setDateVersement] = useState<string>(new Date().toISOString().slice(0, 10));
  const [motif, setMotif] = useState<string>('Prime de performance projet');

  const fetchPrimes = async () => {
    setLoading(true);
    try {
      const data = await apiService.getPrimes();
      setPrimes(data);
    } catch (err: any) {
      onError(err.message || 'Impossible de charger les primes');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPrimes();
    if (employes.length > 0 && !employeId) {
      setEmployeId(employes[0]._id);
    }
  }, [employes]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!employeId || !titre || montant <= 0) return;
    setSubmitting(true);
    try {
      const selectedEmp = employes.find((e) => e._id === employeId);
      const newPrime = await apiService.createPrime({
        employeId,
        employeNom: selectedEmp ? `${selectedEmp.prenom} ${selectedEmp.nom}` : undefined,
        titre,
        montant,
        dateVersement,
        motif,
        statut: 'en_attente',
      });
      setPrimes([newPrime, ...primes]);
      setShowModal(false);
      setTitre('');
      onSuccess('Prime exceptionnelle enregistrée avec succès dans MongoDB !');
    } catch (err: any) {
      onError(err.message || 'Erreur lors de la création');
    } finally {
      setSubmitting(false);
    }
  };

  const handleUpdateStatut = async (id: string, newStatut: 'en_attente' | 'validee' | 'payee') => {
    try {
      const updated = await apiService.updatePrime(id, { statut: newStatut });
      setPrimes(primes.map((p) => (p._id === id ? updated : p)));
      onSuccess(`Statut de la prime mis à jour : ${newStatut}`);
    } catch (err: any) {
      onError(err.message || 'Erreur lors de la mise à jour');
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Confirmer la suppression de cette prime ?')) return;
    try {
      await apiService.deletePrime(id);
      setPrimes(primes.filter((p) => p._id !== id));
      onSuccess('Prime supprimée de la base de données');
    } catch (err: any) {
      onError(err.message || 'Erreur lors de la suppression');
    }
  };

  const totalPrimes = primes.reduce((acc, p) => acc + (p.montant || 0), 0);
  const totalPayees = primes
    .filter((p) => p.statut === 'payee')
    .reduce((acc, p) => acc + (p.montant || 0), 0);

  const handleExportCSV = () => {
    const headers = ['Salarié', 'Intitulé de la prime', 'Montant (€)', 'Date de versement', 'Motif', 'Statut'];
    const rows = [
      headers,
      ...primes.map((p) => [
        p.employeNom || 'Salarié',
        p.titre,
        String(p.montant),
        formatDate(p.dateVersement),
        p.motif || '',
        p.statut || 'en_attente',
      ]),
    ];
    downloadCsv(`recapitulatif_primes_${new Date().toISOString().slice(0, 10)}.csv`, rows);
    onSuccess('Export des primes téléchargé');
  };

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <Coins className="w-5 h-5 text-amber-500" />
            Primes & Gratifications Exceptionnelles
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Gestion des bonus sur objectifs, primes de fin d'année et gratifications individuelles (données persistées en DB).
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleExportCSV}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            Export CSV
          </button>
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 cursor-pointer shadow-xs"
          >
            <Plus className="w-3.5 h-3.5" />
            Attribuer une Prime
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
          <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Volume Total Alloué</div>
          <div className="text-xl font-bold font-mono text-slate-900 mt-1">{formatCurrency(totalPrimes)}</div>
          <div className="text-[11px] text-slate-400 mt-1">{primes.length} gratification(s) enregistrée(s)</div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
          <div className="text-[11px] font-semibold text-emerald-600 uppercase tracking-wider">Total Déjà Versé</div>
          <div className="text-xl font-bold font-mono text-emerald-700 mt-1">{formatCurrency(totalPayees)}</div>
          <div className="text-[11px] text-slate-400 mt-1">Primes soldées en paie</div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
          <div className="text-[11px] font-semibold text-amber-600 uppercase tracking-wider">En Attente de Validation</div>
          <div className="text-xl font-bold font-mono text-amber-700 mt-1">
            {formatCurrency(totalPrimes - totalPayees)}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">À approuver avant clôture de paie</div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white border border-slate-200 rounded-xl shadow-xs overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-slate-500 text-xs">
            <RefreshCw className="w-5 h-5 animate-spin mx-auto mb-2 text-indigo-600" />
            Chargement des primes depuis MongoDB...
          </div>
        ) : primes.length === 0 ? (
          <div className="p-8 text-center text-slate-500 text-xs">
            Aucune prime n'a été attribuée pour le moment.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold uppercase text-[10px] tracking-wider">
                  <th className="py-3 px-4">Bénéficiaire</th>
                  <th className="py-3 px-4">Intitulé</th>
                  <th className="py-3 px-4">Montant Brut</th>
                  <th className="py-3 px-4">Date de Versement</th>
                  <th className="py-3 px-4">Motif d'Attribution</th>
                  <th className="py-3 px-4">Statut</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {primes.map((prime) => (
                  <tr key={prime._id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3 px-4 font-semibold text-slate-900">{prime.employeNom || 'Collaborateur'}</td>
                    <td className="py-3 px-4 text-slate-800">{prime.titre}</td>
                    <td className="py-3 px-4 font-mono font-bold text-slate-900">{formatCurrency(prime.montant)}</td>
                    <td className="py-3 px-4 font-mono text-slate-600">{formatDate(prime.dateVersement)}</td>
                    <td className="py-3 px-4 text-slate-500">{prime.motif || '—'}</td>
                    <td className="py-3 px-4">
                      {prime.statut === 'payee' ? (
                        <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                          <CheckCircle2 className="w-3 h-3" />
                          Payée
                        </span>
                      ) : prime.statut === 'validee' ? (
                        <span className="text-[10px] font-semibold text-sky-700 bg-sky-50 px-2 py-0.5 rounded border border-sky-200">
                          Validée
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                          <Clock className="w-3 h-3" />
                          En attente
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        {prime.statut === 'en_attente' && (
                          <button
                            onClick={() => handleUpdateStatut(prime._id, 'validee')}
                            className="px-2 py-1 text-[10px] font-medium bg-emerald-50 text-emerald-700 hover:bg-emerald-100 rounded border border-emerald-200 cursor-pointer"
                          >
                            Valider
                          </button>
                        )}
                        {prime.statut === 'validee' && (
                          <button
                            onClick={() => handleUpdateStatut(prime._id, 'payee')}
                            className="px-2 py-1 text-[10px] font-medium bg-indigo-50 text-indigo-700 hover:bg-indigo-100 rounded border border-indigo-200 cursor-pointer"
                          >
                            Marquer payée
                          </button>
                        )}
                        <button
                          onClick={() => handleDelete(prime._id)}
                          className="p-1 text-slate-400 hover:text-rose-600 rounded cursor-pointer"
                          title="Supprimer la prime"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal d'ajout de prime */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl border border-slate-200 w-full max-w-md p-5 space-y-4">
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Coins className="w-4 h-4 text-amber-500" />
              Attribuer une Prime Exceptionnelle
            </h2>

            <form onSubmit={handleSubmit} className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Bénéficiaire</label>
                <select
                  value={employeId}
                  onChange={(e) => setEmployeId(e.target.value)}
                  required
                  className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg focus:outline-indigo-600"
                >
                  {employes.map((emp) => (
                    <option key={emp._id} value={emp._id}>
                      {emp.prenom} {emp.nom} — {emp.poste || emp.departement}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Intitulé de la prime</label>
                <input
                  type="text"
                  placeholder="Ex: Prime de bilan annuel, Prime d'astreinte..."
                  value={titre}
                  onChange={(e) => setTitre(e.target.value)}
                  required
                  className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg focus:outline-indigo-600"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Montant Brut (€)</label>
                  <input
                    type="number"
                    min="1"
                    step="10"
                    value={montant}
                    onChange={(e) => setMontant(Number(e.target.value))}
                    required
                    className="w-full text-xs font-mono px-3 py-2 border border-slate-300 rounded-lg focus:outline-indigo-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Date Prévue</label>
                  <input
                    type="date"
                    value={dateVersement}
                    onChange={(e) => setDateVersement(e.target.value)}
                    required
                    className="w-full text-xs font-mono px-3 py-2 border border-slate-300 rounded-lg focus:outline-indigo-600"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Motif / Justification RH</label>
                <textarea
                  rows={2}
                  value={motif}
                  onChange={(e) => setMotif(e.target.value)}
                  className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg focus:outline-indigo-600"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-3 py-1.5 text-xs text-slate-600 hover:bg-slate-100 rounded-lg cursor-pointer"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-4 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg cursor-pointer shadow-xs"
                >
                  {submitting ? 'Enregistrement...' : 'Enregistrer en DB'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
