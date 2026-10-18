import React, { useState, useEffect, useMemo } from 'react';
import { Employe, PrimeItem } from '../types';
import { apiService, formatCurrency, downloadCsv } from '../services/api';
import {
  DollarSign,
  TrendingUp,
  PieChart,
  Download,
  Building,
  Award,
  Plus,
} from 'lucide-react';

interface SalairesViewProps {
  employes: Employe[];
  primes?: PrimeItem[];
  onAddPrime?: (employeId: string, titre: string, montant: number) => Promise<void>;
}

export const SalairesView: React.FC<SalairesViewProps> = ({
  employes,
  primes: initialPrimes,
  onAddPrime,
}) => {
  const [primesList, setPrimesList] = useState<PrimeItem[]>(initialPrimes || []);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [primeEmpId, setPrimeEmpId] = useState(employes[0]?._id || '');
  const [primeTitre, setPrimeTitre] = useState('');
  const [primeMontant, setPrimeMontant] = useState(500);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (initialPrimes) {
      setPrimesList(initialPrimes);
    } else {
      apiService.getPrimes().then(setPrimesList).catch(() => {});
    }
  }, [initialPrimes]);

  // Financial aggregates calculated directly from real DB records
  const actifs = employes.filter((e) => (e.statut || 'actif') === 'actif');
  const masseSalarialeBrute = actifs.reduce((acc, e) => acc + (e.salaireBrut || 3500), 0);
  const chargesPatronalesEstimees = masseSalarialeBrute * 0.42; // ~42% charges en France
  const coutTotalEmployeur = masseSalarialeBrute + chargesPatronalesEstimees;
  const salaireMoyen = actifs.length > 0 ? masseSalarialeBrute / actifs.length : 0;

  // Department payroll breakdown from DB
  const deptBreakdown = useMemo(() => {
    const map = new Map<string, { total: number; count: number }>();
    actifs.forEach((e) => {
      const d = e.departement || 'Général';
      const sal = e.salaireBrut || 3500;
      if (!map.has(d)) map.set(d, { total: 0, count: 0 });
      map.get(d)!.total += sal;
      map.get(d)!.count += 1;
    });
    return Array.from(map.entries()).map(([dept, val]) => ({
      dept,
      total: val.total,
      count: val.count,
      moyen: Math.round(val.total / val.count),
    }));
  }, [actifs]);

  const handleAddPrimeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!primeTitre.trim() || primeMontant <= 0 || !primeEmpId) return;
    try {
      setLoading(true);
      if (onAddPrime) {
        await onAddPrime(primeEmpId, primeTitre.trim(), Number(primeMontant));
      } else {
        const emp = employes.find((e) => e._id === primeEmpId);
        const created = await apiService.createPrime({
          employeId: primeEmpId,
          employeNom: emp ? `${emp.prenom} ${emp.nom}` : undefined,
          titre: primeTitre.trim(),
          montant: Number(primeMontant),
          dateVersement: new Date().toISOString().slice(0, 10),
          statut: 'validee',
        });
        setPrimesList([created, ...primesList]);
      }
      setPrimeTitre('');
      setIsModalOpen(false);
    } finally {
      setLoading(false);
    }
  };

  const handleExportCsv = () => {
    const headers = ['Collaborateur', 'Poste', 'Département', 'Salaire Brut Mensuel (€)', 'Charges Estimées (€)', 'Coût Total (€)'];
    const rows = actifs.map((e) => {
      const brut = e.salaireBrut || 3500;
      const charges = brut * 0.42;
      return [
        `${e.prenom} ${e.nom}`,
        e.poste || '',
        e.departement || '',
        String(brut),
        String(charges.toFixed(2)),
        String((brut + charges).toFixed(2)),
      ];
    });
    downloadCsv('masse_salariale_rh.csv', [headers, ...rows]);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-white p-5 rounded-xl border border-slate-200/90 shadow-xs">
          <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Masse Salariale Brute</div>
          <div className="text-2xl font-bold text-slate-900 mt-1 tabular-nums">{formatCurrency(masseSalarialeBrute)}</div>
          <p className="text-xs text-slate-400 mt-1">Par mois pour {actifs.length} salariés</p>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200/90 shadow-xs">
          <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Charges Patronales (Est.)</div>
          <div className="text-2xl font-bold text-slate-700 mt-1 tabular-nums">{formatCurrency(chargesPatronalesEstimees)}</div>
          <p className="text-xs text-slate-400 mt-1">Cotisations sociales (~42%)</p>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200/90 shadow-xs">
          <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Coût Global Entreprise</div>
          <div className="text-2xl font-bold text-indigo-700 mt-1 tabular-nums">{formatCurrency(coutTotalEmployeur)}</div>
          <p className="text-xs text-slate-400 mt-1">Budget RH mensuel complet</p>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200/90 shadow-xs">
          <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Salaire Moyen Brut</div>
          <div className="text-2xl font-bold text-emerald-700 mt-1 tabular-nums">{formatCurrency(salaireMoyen)}</div>
          <p className="text-xs text-slate-400 mt-1">Rémunération mensuelle moyenne</p>
        </div>
      </div>

      {/* Grid: Department summary + Primes */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Department Table */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200/90 shadow-xs p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-bold text-slate-900">Masse Salariale par Département</h3>
              <p className="text-xs text-slate-500">Données calculées en temps réel depuis la base MongoDB</p>
            </div>
            <button
              onClick={handleExportCsv}
              className="p-2 border border-slate-200 hover:bg-slate-50 text-slate-600 rounded-lg transition-colors cursor-pointer"
              title="Exporter en CSV"
            >
              <Download className="w-4 h-4" />
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-slate-200 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  <th className="pb-3">Département</th>
                  <th className="pb-3 text-center">Effectif</th>
                  <th className="pb-3 text-right">Salaire Moyen</th>
                  <th className="pb-3 text-right">Budget Total Brut</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {deptBreakdown.map((row) => (
                  <tr key={row.dept} className="hover:bg-slate-50/70">
                    <td className="py-3 font-semibold text-slate-900 text-xs">{row.dept}</td>
                    <td className="py-3 text-center text-xs font-mono tabular-nums text-slate-600">
                      {row.count} salarié{row.count > 1 ? 's' : ''}
                    </td>
                    <td className="py-3 text-right text-xs font-mono tabular-nums text-slate-700">
                      {formatCurrency(row.moyen)}
                    </td>
                    <td className="py-3 text-right text-xs font-mono font-bold text-slate-900 tabular-nums">
                      {formatCurrency(row.total)}
                    </td>
                  </tr>
                ))}
                {deptBreakdown.length === 0 && (
                  <tr>
                    <td colSpan={4} className="py-6 text-center text-slate-400 text-xs">
                      Aucun collaborateur actif en base
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Primes & Bonus Module */}
        <div className="bg-white rounded-xl border border-slate-200/90 shadow-xs p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-base font-bold text-slate-900">Primes & Bonus en Base</h3>
                <p className="text-xs text-slate-500">Historique réel des gratifications attribuées</p>
              </div>
              <button
                onClick={() => setIsModalOpen(true)}
                className="text-xs font-semibold text-sky-600 hover:underline cursor-pointer"
              >
                + Attribuer
              </button>
            </div>

            <div className="space-y-3">
              {primesList.map((p) => (
                <div key={p._id} className="p-3 rounded-lg border border-slate-100 bg-slate-50/60 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-slate-900">
                      {p.employeNom || 'Salarié'}
                    </span>
                    <span className="font-bold text-emerald-700 font-mono tabular-nums">
                      +{formatCurrency(p.montant)}
                    </span>
                  </div>
                  <div className="text-slate-600 text-[11px] mt-1">{p.titre}</div>
                </div>
              ))}
              {primesList.length === 0 && (
                <div className="py-8 text-center text-slate-400 text-xs">
                  Aucune prime attribuée pour l'instant
                </div>
              )}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 text-[11px] text-slate-400 text-center">
            Persistance intégrale en base MongoDB
          </div>
        </div>
      </div>

      {/* Modal attribution prime */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-md w-full p-5 space-y-4">
            <h3 className="text-base font-bold text-slate-900">Attribuer une prime / bonus</h3>

            <form onSubmit={handleAddPrimeSubmit} className="space-y-3 text-xs">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Collaborateur bénéficiaire</label>
                <select
                  value={primeEmpId}
                  onChange={(e) => setPrimeEmpId(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg"
                >
                  {actifs.map((e) => (
                    <option key={e._id} value={e._id}>
                      {e.prenom} {e.nom}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Motif de la prime</label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Prime de performance, résultat exceptionnel..."
                  value={primeTitre}
                  onChange={(e) => setPrimeTitre(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Montant brut (€)</label>
                <input
                  type="number"
                  min="50"
                  step="50"
                  required
                  value={primeMontant}
                  onChange={(e) => setPrimeMontant(Number(e.target.value))}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-right tabular-nums"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border border-slate-200 rounded-lg text-slate-700 font-semibold cursor-pointer"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-4 py-2 bg-slate-900 text-white rounded-lg font-semibold hover:bg-slate-800 cursor-pointer disabled:opacity-50"
                >
                  {loading ? 'Enregistrement...' : 'Confirmer la prime en base'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
