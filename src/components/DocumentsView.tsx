import React, { useState, useEffect } from 'react';
import { Employe, DocumentRH, DocumentGenere } from '../types';
import { apiService, formatDate } from '../services/api';
import {
  FileText,
  Printer,
  Copy,
  Check,
  Building,
  RefreshCw,
  Plus,
  Download,
  Stamp,
  Sparkles,
} from 'lucide-react';

interface DocumentsViewProps {
  employes: Employe[];
}

export const DocumentsView: React.FC<DocumentsViewProps> = ({ employes }) => {
  const [documents, setDocuments] = useState<DocumentRH[]>([]);
  const [selectedDocId, setSelectedDocId] = useState<string>('');
  const [selectedEmpId, setSelectedEmpId] = useState<string>(employes[0]?._id || '');
  const [documentGenere, setDocumentGenere] = useState<DocumentGenere | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [generating, setGenerating] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);

  // Modal new template
  const [showModal, setShowModal] = useState<boolean>(false);
  const [newTitre, setNewTitre] = useState<string>('');
  const [newCategorie, setNewCategorie] = useState<'attestation' | 'contrat' | 'avenant' | 'certificat'>('attestation');
  const [newTemplate, setNewTemplate] = useState<string>('');

  const fetchDocuments = async () => {
    setLoading(true);
    try {
      const data = await apiService.getDocuments();
      setDocuments(data);
      if (data.length > 0 && !selectedDocId) {
        setSelectedDocId(data[0]._id);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDocuments();
    if (employes.length > 0 && !selectedEmpId) {
      setSelectedEmpId(employes[0]._id);
    }
  }, [employes]);

  const handleGenerate = async (docId?: string, empId?: string) => {
    const dId = docId || selectedDocId;
    const eId = empId || selectedEmpId;
    if (!dId || !eId) return;

    setGenerating(true);
    try {
      const res = await apiService.genererDocument(dId, eId);
      setDocumentGenere(res);
    } catch (err) {
      console.error('Erreur génération', err);
    } finally {
      setGenerating(false);
    }
  };

  useEffect(() => {
    if (selectedDocId && selectedEmpId) {
      handleGenerate(selectedDocId, selectedEmpId);
    }
  }, [selectedDocId, selectedEmpId]);

  const handleCreateTemplate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitre || !newTemplate) return;
    try {
      const created = await apiService.createDocument({
        titre: newTitre,
        categorie: newCategorie,
        contenuTemplate: newTemplate,
        statut: 'actif',
      });
      setDocuments([created, ...documents]);
      setSelectedDocId(created._id);
      setShowModal(false);
      setNewTitre('');
      setNewTemplate('');
    } catch (err) {
      console.error(err);
    }
  };

  const handleCopy = () => {
    if (!documentGenere) return;
    navigator.clipboard.writeText(documentGenere.texteGenere);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleDownloadTxt = () => {
    if (!documentGenere) return;
    const blob = new Blob([documentGenere.texteGenere], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${documentGenere.titre.toLowerCase().replace(/\s+/g, '_')}_${documentGenere.employeNom.toLowerCase().replace(/\s+/g, '_')}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header Controls */}
      <div className="bg-white p-5 rounded-xl border border-slate-200/90 shadow-xs flex flex-col md:flex-row items-center justify-between gap-4">
        <div>
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <FileText className="w-4 h-4 text-indigo-600" />
            Générateur de Documents Juridiques RH (Base MongoDB)
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Édition et complétion dynamique de courriers certifiés à partir des modèles stockés en DB
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <select
            value={selectedEmpId}
            onChange={(e) => setSelectedEmpId(e.target.value)}
            className="py-1.5 px-3 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium cursor-pointer"
          >
            {employes.map((e) => (
              <option key={e._id} value={e._id}>
                {e.prenom} {e.nom} — {e.poste || 'Salarié'}
              </option>
            ))}
          </select>

          <select
            value={selectedDocId}
            onChange={(e) => setSelectedDocId(e.target.value)}
            className="py-1.5 px-3 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium cursor-pointer"
          >
            {documents.map((d) => (
              <option key={d._id} value={d._id}>
                {d.titre} ({d.categorie})
              </option>
            ))}
          </select>

          <button
            onClick={() => setShowModal(true)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-indigo-50 text-indigo-700 hover:bg-indigo-100 rounded-lg text-xs font-semibold border border-indigo-200 cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            Nouveau modèle
          </button>
        </div>
      </div>

      {/* Document Sheet Preview */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden p-8 max-w-3xl mx-auto">
        <div className="flex items-center justify-between pb-6 border-b border-slate-200 mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-slate-900 text-white flex items-center justify-center font-bold shadow-xs">
              <Building className="w-5 h-5" />
            </div>
            <div>
              <div className="font-bold text-slate-900 text-sm">DOSSIER RH SOLUTIONS SAS</div>
              <div className="text-[11px] text-slate-400">Direction des Ressources Humaines · Document Officiel Certifié</div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopy}
              disabled={!documentGenere}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 border border-slate-200 hover:bg-slate-50 rounded-lg text-xs font-semibold text-slate-700 transition-colors cursor-pointer disabled:opacity-50"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copié !' : 'Copier'}</span>
            </button>
            <button
              onClick={handleDownloadTxt}
              disabled={!documentGenere}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 border border-slate-200 hover:bg-slate-50 rounded-lg text-xs font-semibold text-slate-700 transition-colors cursor-pointer disabled:opacity-50"
            >
              <Download className="w-3.5 h-3.5 text-indigo-600" />
              <span>Télécharger</span>
            </button>
            <button
              onClick={handlePrint}
              disabled={!documentGenere}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold transition-colors cursor-pointer shadow-xs disabled:opacity-50"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Imprimer / PDF</span>
            </button>
          </div>
        </div>

        {/* Paper Text */}
        {generating ? (
          <div className="p-12 text-center text-slate-400 text-xs">
            <RefreshCw className="w-5 h-5 animate-spin mx-auto mb-2 text-indigo-600" />
            Génération et substitution dynamique des variables depuis MongoDB...
          </div>
        ) : documentGenere ? (
          <div className="p-8 bg-slate-50/70 border border-slate-200/80 rounded-xl font-mono text-xs leading-relaxed text-slate-800 whitespace-pre-wrap select-all">
            {documentGenere.texteGenere}
          </div>
        ) : (
          <div className="p-12 text-center text-slate-400 text-xs">
            Sélectionnez un collaborateur et un modèle de document pour générer l'attestation.
          </div>
        )}
      </div>

      {/* Modal Création de Modèle */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl border border-slate-200 w-full max-w-lg p-5 space-y-4">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Plus className="w-4 h-4 text-indigo-600" />
              Nouveau Modèle de Document RH
            </h3>

            <form onSubmit={handleCreateTemplate} className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Intitulé du Modèle</label>
                <input
                  type="text"
                  placeholder="Ex: Avenant Augmentation Salariale, Notification Rupture..."
                  value={newTitre}
                  onChange={(e) => setNewTitre(e.target.value)}
                  required
                  className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg focus:outline-indigo-600"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Catégorie</label>
                <select
                  value={newCategorie}
                  onChange={(e) => setNewCategorie(e.target.value as any)}
                  className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg focus:outline-indigo-600"
                >
                  <option value="attestation">Attestation légale</option>
                  <option value="avenant">Avenant contractuel</option>
                  <option value="contrat">Modèle de contrat</option>
                  <option value="certificat">Certificat de travail</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Corps du Template (avec balises dynamiques)
                </label>
                <textarea
                  rows={8}
                  value={newTemplate}
                  onChange={(e) => setNewTemplate(e.target.value)}
                  placeholder="Variables disponibles : {{NOM_PRENOM}}, {{POSTE}}, {{DATE_EMBAUCHE}}, {{DATE_DU_JOUR}}, {{SALAIRE_BRUT}}, {{MATRICULE}}"
                  required
                  className="w-full text-xs font-mono px-3 py-2 border border-slate-300 rounded-lg focus:outline-indigo-600"
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
                  className="px-4 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg cursor-pointer shadow-xs"
                >
                  Enregistrer en Base MongoDB
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
