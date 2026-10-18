import React, { useState, useEffect } from 'react';
import { RUPItem } from '../types';
import { apiService, formatDate, downloadCsv } from '../services/api';
import { BookOpen, Download, Search, RefreshCw, ShieldCheck, CheckCircle2 } from 'lucide-react';

interface RUPViewProps {
  onSuccess: (msg: string) => void;
  onError: (msg: string) => void;
}

export const RUPView: React.FC<RUPViewProps> = ({ onSuccess, onError }) => {
  const [rupList, setRupList] = useState<RUPItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchTerm, setSearchTerm] = useState<string>('');

  const fetchRUP = async () => {
    setLoading(true);
    try {
      const data = await apiService.getRUP();
      setRupList(data);
    } catch (err: any) {
      onError(err.message || 'Impossible de charger le registre unique du personnel');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRUP();
  }, []);

  const filteredRUP = rupList.filter((item) => {
    const q = searchTerm.toLowerCase();
    return (
      item.nom.toLowerCase().includes(q) ||
      item.prenom.toLowerCase().includes(q) ||
      item.matricule.toLowerCase().includes(q) ||
      item.poste.toLowerCase().includes(q) ||
      item.departement.toLowerCase().includes(q)
    );
  });

  const handleExportCSV = () => {
    const headers = [
      'Ordre d’embauche',
      'Matricule RH',
      'Nom de famille',
      'Prénom',
      'Nationalité',
      'Emploi / Poste',
      'Département',
      'Type de contrat',
      'Date d’entrée',
      'Statut actuel',
      'Dernière visite médicale',
    ];

    const rows = [
      headers,
      ...filteredRUP.map((r) => [
        String(r.ordre),
        r.matricule,
        r.nom,
        r.prenom,
        r.nationalite,
        r.poste,
        r.departement,
        r.typeContrat,
        formatDate(r.dateEmbauche),
        r.statut === 'actif' ? 'Présent dans les effectifs' : 'Sorti des effectifs',
        formatDate(r.visiteMedicale),
      ]),
    ];

    downloadCsv(`registre_unique_du_personnel_${new Date().toISOString().slice(0, 10)}.csv`, rows);
    onSuccess('Export CSV du Registre Unique du Personnel généré avec succès !');
  };

  return (
    <div className="space-y-5">
      {/* En-tête */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-indigo-600" />
            Registre Unique du Personnel (RUP)
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Document légal obligatoire (Articles L1221-13 à L1221-15 du Code du travail) tenu à la disposition de l'Inspection du Travail.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={fetchRUP}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Actualiser
          </button>
          <button
            onClick={handleExportCSV}
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 cursor-pointer shadow-xs"
          >
            <Download className="w-3.5 h-3.5" />
            Export Officiel CSV (Inspection)
          </button>
        </div>
      </div>

      {/* Cadre de conformité légale */}
      <div className="bg-sky-50 border border-sky-200 rounded-xl p-4 flex items-start gap-3">
        <ShieldCheck className="w-5 h-5 text-sky-600 shrink-0 mt-0.5" />
        <div className="text-xs text-sky-900">
          <span className="font-semibold">Mentions obligatoires vérifiées :</span> Tous les salariés de l'entreprise sont inscrits dans l'ordre chronologique de leur embauche, avec mention de leur qualification, type de contrat et nationalité, garantissant une conformité totale lors des contrôles URSSAF et Inspection du Travail.
        </div>
      </div>

      {/* Recherche et filtres */}
      <div className="bg-white border border-slate-200 rounded-xl p-3 shadow-xs flex items-center justify-between gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Rechercher par nom, matricule, poste..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs border border-slate-300 rounded-lg focus:outline-indigo-600"
          />
        </div>
        <div className="text-xs font-mono text-slate-500">
          Total inscrits : <span className="font-bold text-slate-800">{filteredRUP.length}</span> collaborateur(s)
        </div>
      </div>

      {/* Tableau RUP */}
      <div className="bg-white border border-slate-200 rounded-xl shadow-xs overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-slate-500 text-xs">
            <RefreshCw className="w-5 h-5 animate-spin mx-auto mb-2 text-indigo-600" />
            Extraction du registre légal depuis MongoDB...
          </div>
        ) : filteredRUP.length === 0 ? (
          <div className="p-8 text-center text-slate-500 text-xs">
            Aucun salarié ne correspond à votre recherche.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold uppercase text-[10px] tracking-wider">
                  <th className="py-3 px-4">N° Ordre</th>
                  <th className="py-3 px-4">Matricule</th>
                  <th className="py-3 px-4">Salarié</th>
                  <th className="py-3 px-4">Nationalité</th>
                  <th className="py-3 px-4">Poste Occupé</th>
                  <th className="py-3 px-4">Département</th>
                  <th className="py-3 px-4">Contrat</th>
                  <th className="py-3 px-4">Date d’Embauche</th>
                  <th className="py-3 px-4">Statut</th>
                  <th className="py-3 px-4">Visite Médicale</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredRUP.map((item) => (
                  <tr key={item.matricule} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3 px-4 font-mono font-medium text-slate-500">{item.ordre}</td>
                    <td className="py-3 px-4 font-mono font-semibold text-slate-900">{item.matricule}</td>
                    <td className="py-3 px-4 font-medium text-slate-900">
                      {item.prenom} {item.nom.toUpperCase()}
                    </td>
                    <td className="py-3 px-4 text-slate-600">{item.nationalite}</td>
                    <td className="py-3 px-4 text-slate-800">{item.poste}</td>
                    <td className="py-3 px-4 text-slate-600">{item.departement}</td>
                    <td className="py-3 px-4">
                      <span className="font-mono text-[10px] px-2 py-0.5 rounded bg-indigo-50 text-indigo-700 font-semibold border border-indigo-200">
                        {item.typeContrat}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-mono text-slate-700">{formatDate(item.dateEmbauche)}</td>
                    <td className="py-3 px-4">
                      {item.statut === 'actif' ? (
                        <span className="inline-flex items-center gap-1 text-[10px] text-emerald-700 font-medium bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                          <CheckCircle2 className="w-3 h-3" />
                          Actif
                        </span>
                      ) : (
                        <span className="text-[10px] text-slate-500 font-medium bg-slate-100 px-2 py-0.5 rounded">
                          Inactif
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4 font-mono text-slate-600">{formatDate(item.visiteMedicale)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
