import React, { useState, useMemo } from 'react';
import { Employe, Conge, Absence } from '../types';
import { formatCurrency, downloadCsv } from '../services/api';
import {
  UtensilsCrossed,
  Download,
  Calculator,
  Calendar,
  Layers,
} from 'lucide-react';

interface TitresRestaurantViewProps {
  employes: Employe[];
  conges: Conge[];
  absences: Absence[];
}

export const TitresRestaurantView: React.FC<TitresRestaurantViewProps> = ({
  employes,
  conges,
  absences,
}) => {
  const [valeurFaciale, setValeurFaciale] = useState(10.5); // Valeur faciale ticket
  const [partEmployeurPct, setPartEmployeurPct] = useState(60); // 60% pris en charge par l'employeur
  const [selectedMonth, setSelectedMonth] = useState('2026-10'); // Mois d'octobre 2026

  const joursOuvresMois = 22; // Moyenne 21-22 jours ouvrés par mois

  const actifs = employes.filter((e) => (e.statut || 'actif') === 'actif');

  // Compute tickets per active employee
  const calculs = useMemo(() => {
    return actifs.map((e) => {
      // Absences this month for this employee
      const empAbsences = absences.filter(
        (a) =>
          (a.employeId === e._id || (a.employeNom && a.employeNom.includes(e.nom))) &&
          a.date.startsWith(selectedMonth)
      ).length;

      // Approved leaves this month for this employee
      const empConges = conges
        .filter(
          (c) =>
            c.statut === 'approuve' &&
            (c.employeId === e._id || (c.employeNom && c.employeNom.includes(e.nom))) &&
            c.dateDebut.startsWith(selectedMonth)
        )
        .reduce((sum, c) => sum + 2, 0); // estimation

      const joursDeduits = empAbsences + empConges;
      const ticketsDus = Math.max(0, joursOuvresMois - joursDeduits);
      const partEmployeur = ticketsDus * valeurFaciale * (partEmployeurPct / 100);
      const partSalarie = ticketsDus * valeurFaciale * ((100 - partEmployeurPct) / 100);

      return {
        employe: e,
        joursOuvresMois,
        joursDeduits,
        ticketsDus,
        partEmployeur,
        partSalarie,
        totalTitre: ticketsDus * valeurFaciale,
      };
    });
  }, [actifs, absences, conges, selectedMonth, valeurFaciale, partEmployeurPct]);

  const totalTickets = calculs.reduce((acc, c) => acc + c.ticketsDus, 0);
  const totalPartEmployeur = calculs.reduce((acc, c) => acc + c.partEmployeur, 0);
  const totalPartSalarie = calculs.reduce((acc, c) => acc + c.partSalarie, 0);

  const handleExportCsv = () => {
    const headers = [
      'Collaborateur',
      'Mois',
      'Jours Ouvrés',
      'Jours Déduits (Absences/Congés)',
      'Titres Dus',
      'Part Employeur (€)',
      'Part Salarié (€)',
      'Total (€)',
    ];
    const rows = calculs.map((c) => [
      `${c.employe.prenom} ${c.employe.nom}`,
      selectedMonth,
      String(c.joursOuvresMois),
      String(c.joursDeduits),
      String(c.ticketsDus),
      c.partEmployeur.toFixed(2),
      c.partSalarie.toFixed(2),
      c.totalTitre.toFixed(2),
    ]);
    downloadCsv(`titres_restaurant_${selectedMonth}.csv`, [headers, ...rows]);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Control and parameter banner */}
      <div className="bg-white p-5 rounded-xl border border-slate-200/90 shadow-xs flex flex-col md:flex-row items-center justify-between gap-4">
        <div>
          <h2 className="text-base font-bold text-slate-900">Décompte & Commande des Titres-Restaurant</h2>
          <p className="text-xs text-slate-500">
            Calcul automatique déduisant les jours de congés et absences du mois
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2 text-xs">
            <span className="text-slate-500 font-semibold">Mois :</span>
            <input
              type="month"
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="py-1 px-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs"
            />
          </div>

          <div className="flex items-center gap-2 text-xs">
            <span className="text-slate-500 font-semibold">Valeur unitaire :</span>
            <input
              type="number"
              step="0.5"
              min="5"
              max="20"
              value={valeurFaciale}
              onChange={(e) => setValeurFaciale(Number(e.target.value))}
              className="w-20 py-1 px-2 bg-slate-50 border border-slate-200 rounded-lg text-xs tabular-nums text-right"
            />
            <span>€</span>
          </div>

          <button
            onClick={handleExportCsv}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Exporter commande</span>
          </button>
        </div>
      </div>

      {/* KPI strips */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div className="bg-white p-5 rounded-xl border border-slate-200/90 shadow-xs">
          <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Volume de Titres à Commander</div>
          <div className="text-2xl font-bold text-slate-900 mt-1 tabular-nums">
            {totalTickets} <span className="text-sm font-normal text-slate-500">titres</span>
          </div>
          <p className="text-xs text-slate-400 mt-1">Pour {actifs.length} collaborateurs actifs</p>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200/90 shadow-xs">
          <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Part Entreprise (60%)</div>
          <div className="text-2xl font-bold text-emerald-700 mt-1 tabular-nums">
            {formatCurrency(totalPartEmployeur)}
          </div>
          <p className="text-xs text-slate-400 mt-1">Prise en charge employeur exonérée</p>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200/90 shadow-xs">
          <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Part Salariés (40%)</div>
          <div className="text-2xl font-bold text-slate-700 mt-1 tabular-nums">
            {formatCurrency(totalPartSalarie)}
          </div>
          <p className="text-xs text-slate-400 mt-1">Retenue sur fiche de paie mensuelle</p>
        </div>
      </div>

      {/* Roster Table */}
      <div className="bg-white rounded-xl border border-slate-200/90 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                <th className="py-3.5 px-6">Collaborateur</th>
                <th className="py-3.5 px-6 text-center">Jours Travaillés</th>
                <th className="py-3.5 px-6 text-center">Déductions</th>
                <th className="py-3.5 px-6 text-center">Titres Attribués</th>
                <th className="py-3.5 px-6 text-right">Part Entreprise</th>
                <th className="py-3.5 px-6 text-right">Part Salarié</th>
                <th className="py-3.5 px-6 text-right">Montant Global</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {calculs.map((c) => (
                <tr key={c.employe._id} className="hover:bg-slate-50/70">
                  <td className="py-3.5 px-6 font-semibold text-slate-900 text-xs">
                    {c.employe.prenom} {c.employe.nom}
                  </td>
                  <td className="py-3.5 px-6 text-center text-xs tabular-nums text-slate-600">
                    {c.joursOuvresMois} j
                  </td>
                  <td className="py-3.5 px-6 text-center text-xs tabular-nums text-rose-600 font-medium">
                    {c.joursDeduits > 0 ? `-${c.joursDeduits} j` : '0 j'}
                  </td>
                  <td className="py-3.5 px-6 text-center font-bold text-slate-900 text-xs tabular-nums">
                    {c.ticketsDus}
                  </td>
                  <td className="py-3.5 px-6 text-right font-mono font-semibold text-emerald-700 text-xs tabular-nums">
                    {formatCurrency(c.partEmployeur)}
                  </td>
                  <td className="py-3.5 px-6 text-right font-mono text-slate-600 text-xs tabular-nums">
                    {formatCurrency(c.partSalarie)}
                  </td>
                  <td className="py-3.5 px-6 text-right font-mono font-bold text-slate-900 text-xs tabular-nums">
                    {formatCurrency(c.totalTitre)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
