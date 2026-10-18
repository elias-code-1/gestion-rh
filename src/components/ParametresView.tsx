import React, { useState, useEffect } from 'react';
import { ParametresRH } from '../types';
import { apiService } from '../services/api';
import { Sliders, Building2, Save, RefreshCw, CheckCircle, AlertCircle, FileSpreadsheet } from 'lucide-react';

interface ParametresViewProps {
  onSuccess: (msg: string) => void;
  onError: (msg: string) => void;
}

export const ParametresView: React.FC<ParametresViewProps> = ({ onSuccess, onError }) => {
  const [params, setParams] = useState<ParametresRH | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [saving, setSaving] = useState<boolean>(false);

  const fetchParams = async () => {
    setLoading(true);
    try {
      const data = await apiService.getParametres();
      setParams(data);
    } catch (err: any) {
      onError(err.message || 'Impossible de charger les paramètres');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchParams();
  }, []);

  const handleChange = (field: keyof ParametresRH, value: any) => {
    if (!params) return;
    setParams({ ...params, [field]: value });
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!params) return;
    setSaving(true);
    try {
      const updated = await apiService.updateParametres(params);
      setParams(updated);
      onSuccess('Paramètres d’entreprise sauvegardés avec succès dans MongoDB !');
    } catch (err: any) {
      onError(err.message || 'Erreur lors de la sauvegarde');
    } finally {
      setSaving(false);
    }
  };

  if (loading || !params) {
    return (
      <div className="p-8 text-center text-slate-500">
        <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2 text-indigo-600" />
        Chargement des paramètres de la société depuis la base de données...
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <Sliders className="w-5 h-5 text-indigo-600" />
            Paramètres Généraux & Société
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Configuration globale des règles de gestion RH, de la convention collective et des avantages sociaux (persistance MongoDB).
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={fetchParams}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Recharger
          </button>
          <button
            type="submit"
            form="params-form"
            disabled={saving}
            className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 disabled:opacity-50 cursor-pointer shadow-xs"
          >
            {saving ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
            Enregistrer les modifications
          </button>
        </div>
      </div>

      <form id="params-form" onSubmit={handleSave} className="space-y-6">
        {/* Section 1: Identité de la Société */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100 text-sm font-semibold text-slate-900">
            <Building2 className="w-4 h-4 text-indigo-600" />
            Identité Légale & Établissement
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">Raison Sociale</label>
              <input
                type="text"
                value={params.nomEntreprise}
                onChange={(e) => handleChange('nomEntreprise', e.target.value)}
                required
                className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg focus:outline-indigo-600"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">Numéro SIRET (14 chiffres)</label>
              <input
                type="text"
                value={params.siret}
                onChange={(e) => handleChange('siret', e.target.value)}
                required
                className="w-full text-xs font-mono px-3 py-2 border border-slate-300 rounded-lg focus:outline-indigo-600"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">Code NAF / APE</label>
              <input
                type="text"
                value={params.codeNAF}
                onChange={(e) => handleChange('codeNAF', e.target.value)}
                className="w-full text-xs font-mono px-3 py-2 border border-slate-300 rounded-lg focus:outline-indigo-600"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs font-medium text-slate-700 mb-1">Convention Collective Nationale (CCN)</label>
              <input
                type="text"
                value={params.conventionCollective}
                onChange={(e) => handleChange('conventionCollective', e.target.value)}
                className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg focus:outline-indigo-600"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">Représentant Légal / DRH</label>
              <input
                type="text"
                value={params.responsableLegal}
                onChange={(e) => handleChange('responsableLegal', e.target.value)}
                className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg focus:outline-indigo-600"
              />
            </div>

            <div className="md:col-span-3">
              <label className="block text-xs font-medium text-slate-700 mb-1">Adresse du Siège Social</label>
              <input
                type="text"
                value={params.adresseEntreprise}
                onChange={(e) => handleChange('adresseEntreprise', e.target.value)}
                className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg focus:outline-indigo-600"
              />
            </div>
          </div>
        </div>

        {/* Section 2: Durée du travail et Congés */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-4">
            <div className="flex items-center gap-2 pb-3 border-b border-slate-100 text-sm font-semibold text-slate-900">
              <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
              Temps de Travail & Congés Annuels
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Durée hebdomadaire légale de travail (heures)
                </label>
                <input
                  type="number"
                  step="0.5"
                  value={params.heuresHebdoLegales}
                  onChange={(e) => handleChange('heuresHebdoLegales', Number(e.target.value))}
                  className="w-full text-xs font-mono px-3 py-2 border border-slate-300 rounded-lg focus:outline-indigo-600"
                />
                <span className="text-[11px] text-slate-400 mt-0.5 block">Base standard : 35 heures par semaine</span>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Droits annuels de congés payés (jours ouvrés)
                </label>
                <input
                  type="number"
                  value={params.joursCongesAnnuels}
                  onChange={(e) => handleChange('joursCongesAnnuels', Number(e.target.value))}
                  className="w-full text-xs font-mono px-3 py-2 border border-slate-300 rounded-lg focus:outline-indigo-600"
                />
                <span className="text-[11px] text-slate-400 mt-0.5 block">Équivalent légal français : 25 jours ouvrés (5 semaines)</span>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Seuil d'alerte pour visite médicale (jours avant échéance)
                </label>
                <input
                  type="number"
                  value={params.seuilAlerteVisiteMedicaleJours}
                  onChange={(e) => handleChange('seuilAlerteVisiteMedicaleJours', Number(e.target.value))}
                  className="w-full text-xs font-mono px-3 py-2 border border-slate-300 rounded-lg focus:outline-indigo-600"
                />
              </div>
            </div>
          </div>

          {/* Section 3: Titres Restaurant & Notifications */}
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-4">
            <div className="flex items-center gap-2 pb-3 border-b border-slate-100 text-sm font-semibold text-slate-900">
              <CheckCircle className="w-4 h-4 text-indigo-600" />
              Avantages Sociaux & Notifications
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Valeur faciale du Titre-Restaurant (€)
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={params.valeurFacialeTicketRestau}
                  onChange={(e) => handleChange('valeurFacialeTicketRestau', Number(e.target.value))}
                  className="w-full text-xs font-mono px-3 py-2 border border-slate-300 rounded-lg focus:outline-indigo-600"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Part patronale de prise en charge (%)
                </label>
                <input
                  type="number"
                  min="50"
                  max="60"
                  value={params.partPatronaleTicketRestau}
                  onChange={(e) => handleChange('partPatronaleTicketRestau', Number(e.target.value))}
                  className="w-full text-xs font-mono px-3 py-2 border border-slate-300 rounded-lg focus:outline-indigo-600"
                />
                <span className="text-[11px] text-slate-400 mt-0.5 block">Exonération URSSAF entre 50% et 60%</span>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Email de notification pour alertes RH
                </label>
                <input
                  type="email"
                  value={params.emailNotificationsRH}
                  onChange={(e) => handleChange('emailNotificationsRH', e.target.value)}
                  className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg focus:outline-indigo-600"
                />
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};
