import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  Employe,
  Conge,
  Absence,
  Formation,
  Entretien,
  NoteFrais,
  OnboardingItem,
  MaterielItem,
  TimeLog,
  AuditLog,
  ActiveTab,
  ToastMessage,
} from './types';
import { apiService, downloadCsv } from './services/api';
import { LandingPage } from './components/LandingPage';

// Components
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { ToastContainer } from './components/Toast';

// 20 Feature Views
import { DashboardView } from './components/DashboardView';
import { StatistiquesView } from './components/StatistiquesView';
import { AlertesView } from './components/AlertesView';
import { EmployesView } from './components/EmployesView';
import { OnboardingView } from './components/OnboardingView';
import { EntretiensView } from './components/EntretiensView';
import { CongesView } from './components/CongesView';
import { AbsencesView } from './components/AbsencesView';
import { CalendrierView } from './components/CalendrierView';
import { FeuillesTempsView } from './components/FeuillesTempsView';
import { CompetencesView } from './components/CompetencesView';
import { FormationsView } from './components/FormationsView';
import { ObjectifsView } from './components/ObjectifsView';
import { SalairesView } from './components/SalairesView';
import { NotesFraisView } from './components/NotesFraisView';
import { TitresRestaurantView } from './components/TitresRestaurantView';
import { OrganigrammeView } from './components/OrganigrammeView';
import { DocumentsView } from './components/DocumentsView';
import { MaterielsView } from './components/MaterielsView';
import { AuditView } from './components/AuditView';
import { ParametresView } from './components/ParametresView';
import { RUPView } from './components/RUPView';
import { PrimesView } from './components/PrimesView';

// Modals
import { EmployeDetailModal } from './components/EmployeDetailModal';
import { EmployeFormModal } from './components/EmployeFormModal';
import { CongeFormModal } from './components/CongeFormModal';
import { AbsenceFormModal } from './components/AbsenceFormModal';
import { FormationFormModal } from './components/FormationFormModal';
import { EntretienFormModal } from './components/EntretienFormModal';
import { NoteFraisFormModal } from './components/NoteFraisFormModal';
import { MaterielFormModal } from './components/MaterielFormModal';
import { TimeLogFormModal } from './components/TimeLogFormModal';

const DashboardApp: React.FC = () => {
  const [activeTab, setActiveTab] = useState<ActiveTab>('dashboard');

  // Core Data Collections
  const [employes, setEmployes] = useState<Employe[]>([]);
  const [conges, setConges] = useState<Conge[]>([]);
  const [absences, setAbsences] = useState<Absence[]>([]);
  const [formations, setFormations] = useState<Formation[]>([]);
  const [entretiens, setEntretiens] = useState<Entretien[]>([]);
  const [notesFrais, setNotesFrais] = useState<NoteFrais[]>([]);
  const [onboardings, setOnboardings] = useState<OnboardingItem[]>([]);
  const [materiels, setMateriels] = useState<MaterielItem[]>([]);
  const [timeLogs, setTimeLogs] = useState<TimeLog[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);

  const [loading, setLoading] = useState(true);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Modals
  const [selectedEmploye, setSelectedEmploye] = useState<Employe | null>(null);
  const [isEmployeModalOpen, setIsEmployeModalOpen] = useState(false);
  const [editingEmploye, setEditingEmploye] = useState<Employe | null>(null);

  const [isCongeModalOpen, setIsCongeModalOpen] = useState(false);
  const [editingConge, setEditingConge] = useState<Conge | null>(null);

  const [isAbsenceModalOpen, setIsAbsenceModalOpen] = useState(false);
  const [editingAbsence, setEditingAbsence] = useState<Absence | null>(null);

  const [isFormationModalOpen, setIsFormationModalOpen] = useState(false);
  const [isEntretienModalOpen, setIsEntretienModalOpen] = useState(false);
  const [isNoteFraisModalOpen, setIsNoteFraisModalOpen] = useState(false);
  const [isMaterielModalOpen, setIsMaterielModalOpen] = useState(false);
  const [isTimeLogModalOpen, setIsTimeLogModalOpen] = useState(false);

  const showToast = useCallback((type: 'success' | 'error' | 'info', message: string) => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, type, message }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4500);
  }, []);

  const dismissToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Load all data
  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      const [
        empData,
        congeData,
        absData,
        formRes,
        entRes,
        ndfRes,
        onbRes,
        matRes,
        timeRes,
        auditRes,
      ] = await Promise.all([
        apiService.getEmployes().catch(() => []),
        apiService.getConges().catch(() => []),
        apiService.getAbsences().catch(() => []),
        apiService.getFormations().catch(() => []),
        apiService.getEntretiens().catch(() => []),
        apiService.getNotesFrais().catch(() => []),
        apiService.getOnboardings().catch(() => []),
        apiService.getMateriels().catch(() => []),
        apiService.getTimeLogs().catch(() => []),
        apiService.getAuditLogs().catch(() => []),
      ]);

      setEmployes(empData || []);
      setConges(congeData || []);
      setAbsences(absData || []);
      setFormations(formRes || []);
      setEntretiens(entRes || []);
      setNotesFrais(ndfRes || []);
      setOnboardings(onbRes || []);
      setMateriels(matRes || []);
      setTimeLogs(timeRes || []);
      setAuditLogs(auditRes || []);
    } catch (err: any) {
      showToast('error', `Chargement des données : ${err.message}`);
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Handlers Employés
  const handleSaveEmploye = async (data: Omit<Employe, '_id'>) => {
    if (editingEmploye) {
      await apiService.updateEmploye(editingEmploye._id, data);
      showToast('success', `Collaborateur ${data.prenom} ${data.nom} mis à jour.`);
    } else {
      await apiService.createEmploye(data);
      showToast('success', `Collaborateur ${data.prenom} ${data.nom} enregistré.`);
    }
    await loadData();
  };

  const handleDeleteEmploye = async (id: string) => {
    const emp = employes.find((e) => e._id === id);
    if (!window.confirm(`Confirmez-vous la suppression de ${emp ? emp.prenom + ' ' + emp.nom : 'cet employé'} ?`)) return;
    await apiService.deleteEmploye(id);
    showToast('info', 'Collaborateur supprimé.');
    await loadData();
  };

  // Handlers Congés
  const handleSaveConge = async (data: Omit<Conge, '_id'>) => {
    if (editingConge) {
      await apiService.updateConge(editingConge._id, data);
      showToast('success', 'Demande de congé mise à jour.');
    } else {
      await apiService.createConge(data);
      showToast('success', 'Nouvelle demande de congé soumise.');
    }
    await loadData();
  };

  const handleApproveConge = async (id: string) => {
    await apiService.updateConge(id, { statut: 'approuve' });
    showToast('success', 'Congé approuvé et décompté !');
    await loadData();
  };

  const handleRejectConge = async (id: string) => {
    await apiService.updateConge(id, { statut: 'refuse' });
    showToast('info', 'Demande de congé refusée.');
    await loadData();
  };

  const handleDeleteConge = async (id: string) => {
    if (!window.confirm('Supprimer cette demande de congé ?')) return;
    await apiService.deleteConge(id);
    showToast('info', 'Congé supprimé.');
    await loadData();
  };

  // Handlers Absences
  const handleSaveAbsence = async (data: Omit<Absence, '_id'>) => {
    if (editingAbsence) {
      await apiService.updateAbsence(editingAbsence._id, data);
      showToast('success', 'Absence mise à jour.');
    } else {
      await apiService.createAbsence(data);
      showToast('success', 'Absence enregistrée au registre.');
    }
    await loadData();
  };

  const handleToggleAbsenceJustifiee = async (absence: Absence) => {
    const newState = !absence.justifiee;
    await apiService.updateAbsence(absence._id, { justifiee: newState });
    showToast('success', `Absence marquée comme ${newState ? 'justifiée' : 'non justifiée'}.`);
    await loadData();
  };

  const handleDeleteAbsence = async (id: string) => {
    if (!window.confirm("Supprimer l'absence enregistrée ?")) return;
    await apiService.deleteAbsence(id);
    showToast('info', 'Absence supprimée.');
    await loadData();
  };

  // Handlers Formations
  const handleSaveFormation = async (data: Omit<Formation, '_id'>) => {
    await apiService.createFormation(data);
    showToast('success', 'Inscription à la formation validée.');
    await loadData();
  };

  const handleUpdateFormationStatus = async (id: string, statut: 'en_attente' | 'validee' | 'terminee' | 'refusee') => {
    await apiService.updateFormation(id, { statut });
    showToast('success', `Statut de formation mis à jour : ${statut}.`);
    await loadData();
  };

  const handleDeleteFormation = async (id: string) => {
    await apiService.deleteFormation(id);
    showToast('info', 'Formation supprimée.');
    await loadData();
  };

  // Handlers Entretiens
  const handleSaveEntretien = async (data: Omit<Entretien, '_id'>) => {
    await apiService.createEntretien(data);
    showToast('success', 'Entretien programmé avec succès.');
    await loadData();
  };

  const handleUpdateEntretienStatus = async (id: string, statut: 'a_planifier' | 'planifie' | 'realise') => {
    await apiService.updateEntretien(id, { statut });
    showToast('success', 'Entretien marqué comme réalisé.');
    await loadData();
  };

  const handleDeleteEntretien = async (id: string) => {
    await apiService.deleteEntretien(id);
    showToast('info', 'Entretien supprimé.');
    await loadData();
  };

  // Handlers Notes de frais
  const handleSaveNoteFrais = async (data: Omit<NoteFrais, '_id'>) => {
    await apiService.createNoteFrais(data);
    showToast('success', 'Note de frais déposée pour validation.');
    await loadData();
  };

  const handleUpdateNoteFraisStatus = async (id: string, statut: 'en_attente' | 'validee' | 'remboursee' | 'refusee') => {
    await apiService.updateNoteFrais(id, { statut });
    showToast('success', `Note de frais ${statut === 'remboursee' ? 'remboursée' : statut}.`);
    await loadData();
  };

  const handleDeleteNoteFrais = async (id: string) => {
    await apiService.deleteNoteFrais(id);
    showToast('info', 'Note de frais supprimée.');
    await loadData();
  };

  // Handlers Onboarding checklist
  const handleToggleOnboardingEtape = async (onboardingId: string, etapeId: string) => {
    const ob = onboardings.find((o) => o._id === onboardingId);
    if (!ob) return;
    const updatedEtapes = ob.etapes.map((e) => (e.id === etapeId ? { ...e, terminee: !e.terminee } : e));
    await apiService.updateOnboarding(onboardingId, { etapes: updatedEtapes });
    await loadData();
  };

  const handleNewOnboarding = async () => {
    const emp = employes[0];
    if (!emp) return;
    const newOb: Omit<OnboardingItem, '_id'> = {
      employeId: emp._id,
      employeNom: `${emp.prenom} ${emp.nom}`,
      phase: 'onboarding',
      dateDebut: new Date().toISOString().slice(0, 10),
      tuteur: 'Direction RH',
      etapes: [
        { id: '1', label: 'Signature du contrat et de la charte informatique', terminee: true },
        { id: '2', label: 'Création des accès email et messagerie d’entreprise', terminee: false },
        { id: '3', label: 'Mise à disposition du poste de travail et badge', terminee: false },
        { id: '4', label: 'Visite médicale d’embauche', terminee: false },
      ],
    };
    await apiService.createOnboarding(newOb);
    showToast('success', `Nouveau parcours d’onboarding ouvert pour ${newOb.employeNom}.`);
    await loadData();
  };

  // Handlers Matériels
  const handleSaveMateriel = async (data: Omit<MaterielItem, '_id'>) => {
    await apiService.createMateriel(data);
    showToast('success', 'Équipement attribué au collaborateur.');
    await loadData();
  };

  const handleDeleteMateriel = async (id: string) => {
    await apiService.deleteMateriel(id);
    showToast('info', 'Matériel restitué ou retiré du parc.');
    await loadData();
  };

  // Handlers Feuilles de temps
  const handleSaveTimeLog = async (data: Omit<TimeLog, '_id'>) => {
    await apiService.createTimeLog(data);
    showToast('success', 'Déclaration hebdomadaire d’heures enregistrée.');
    await loadData();
  };

  const handleValidateTimeLog = async (id: string) => {
    await apiService.updateTimeLog(id, { statut: 'valide' });
    showToast('success', 'Feuille de temps validée pour la paie.');
    await loadData();
  };

  // Handlers Compétences
  const handleAddCompetence = async (
    employeId: string,
    nom: string,
    niveau: 'Débutant' | 'Intermédiaire' | 'Avancé' | 'Expert'
  ) => {
    const emp = employes.find((e) => e._id === employeId);
    if (!emp) return;
    const updatedComp = [...(emp.competences || []), { nom, niveau }];
    await apiService.updateEmploye(employeId, { competences: updatedComp });
    showToast('success', `Compétence ${nom} ajoutée à ${emp.prenom} ${emp.nom}.`);
    await loadData();
  };

  // Export full archive
  const handleExportAll = () => {
    const rows = [
      ['DOSSIER RH — EXPORT SYNTHÉTIQUE COMPLET'],
      ['Date export', new Date().toISOString()],
      ['Effectif total', String(employes.length)],
      [''],
      ['SECTION 1: COLLABORATEURS'],
      ['Nom', 'Prénom', 'Email', 'Poste', 'Département', 'Salaire Brut (€)', 'Statut'],
      ...employes.map((e) => [
        e.nom,
        e.prenom,
        e.email,
        e.poste || '',
        e.departement || '',
        String(e.salaireBrut || 0),
        e.statut,
      ]),
      [''],
      ['SECTION 2: CONGES'],
      ['Employé', 'Type', 'Début', 'Fin', 'Statut', 'Commentaire'],
      ...conges.map((c) => [c.employeNom || '', c.typeConge, c.dateDebut, c.dateFin, c.statut, c.commentaire || '']),
      [''],
      ['SECTION 3: FORMATIONS'],
      ['Employé', 'Titre', 'Organisme', 'Coût (€)', 'Statut'],
      ...formations.map((f) => [f.employeNom || '', f.titre, f.organisme, String(f.cout), f.statut]),
      [''],
      ['SECTION 4: NOTES DE FRAIS'],
      ['Employé', 'Libellé', 'Catégorie', 'Montant (€)', 'Statut'],
      ...notesFrais.map((n) => [n.employeNom || '', n.titre, n.categorie, String(n.montant), n.statut]),
    ];

    downloadCsv('dossier_rh_export_integral.csv', rows);
    showToast('info', 'Export CSV complet téléchargé.');
  };

  // Compute alert and badge counts
  const pendingCongesCount = conges.filter((c) => c.statut === 'en_attente').length;
  const unjustifiedAbsencesCount = absences.filter((a) => !a.justifiee).length;
  const pendingFraisCount = notesFrais.filter((n) => n.statut === 'en_attente').length;
  const alertesCount = pendingCongesCount + unjustifiedAbsencesCount + pendingFraisCount;

  // Primary action button router based on active tab
  const getPrimaryAction = () => {
    switch (activeTab) {
      case 'dashboard':
      case 'employes':
        return () => {
          setEditingEmploye(null);
          setIsEmployeModalOpen(true);
        };
      case 'conges':
        return () => {
          setEditingConge(null);
          setIsCongeModalOpen(true);
        };
      case 'absences':
        return () => {
          setEditingAbsence(null);
          setIsAbsenceModalOpen(true);
        };
      case 'onboarding':
        return handleNewOnboarding;
      case 'entretiens':
        return () => setIsEntretienModalOpen(true);
      case 'formations':
        return () => setIsFormationModalOpen(true);
      case 'notes_frais':
        return () => setIsNoteFraisModalOpen(true);
      case 'materiels':
        return () => setIsMaterielModalOpen(true);
      case 'feuilles_temps':
        return () => setIsTimeLogModalOpen(true);
      default:
        return undefined;
    }
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-slate-100/60 font-sans text-slate-900">
      {/* 6-Category Sidebar */}
      <Sidebar
        activeTab={activeTab}
        onTabChange={setActiveTab}
        pendingCongesCount={pendingCongesCount}
        totalEmployesCount={employes.length}
        unjustifiedAbsencesCount={unjustifiedAbsencesCount}
        pendingFraisCount={pendingFraisCount}
        alertesCount={alertesCount}
      />

      {/* Main Container */}
      <div className="flex flex-col flex-1 h-full overflow-hidden">
        <Header
          activeTab={activeTab}
          totalEmployes={employes.length}
          pendingConges={pendingCongesCount}
          onExportAll={handleExportAll}
          onPrimaryAction={getPrimaryAction()}
        />

        <main className="flex-1 overflow-y-auto p-8">
          {loading ? (
            <div className="flex flex-col items-center justify-center h-64 text-slate-400 gap-3">
              <div className="w-8 h-8 border-3 border-slate-300 border-t-slate-800 rounded-full animate-spin"></div>
              <p className="text-xs font-semibold uppercase tracking-wider">Chargement des données RH...</p>
            </div>
          ) : (
            <>
              {/* Category 1: Pilotage & Direction */}
              {activeTab === 'dashboard' && (
                <DashboardView
                  employes={employes}
                  conges={conges}
                  absences={absences}
                  onNavigate={setActiveTab}
                  onApproveConge={handleApproveConge}
                  onRejectConge={handleRejectConge}
                  onSelectEmploye={(e) => setSelectedEmploye(e)}
                />
              )}
              {activeTab === 'statistiques' && (
                <StatistiquesView
                  employes={employes}
                  conges={conges}
                  absences={absences}
                />
              )}
              {activeTab === 'alertes' && (
                <AlertesView
                  employes={employes}
                  conges={conges}
                  absences={absences}
                  notesFrais={notesFrais}
                  onNavigate={setActiveTab}
                  onApproveConge={handleApproveConge}
                  onToggleAbsenceJustifiee={handleToggleAbsenceJustifiee}
                />
              )}
              {activeTab === 'parametres' && (
                <ParametresView
                  onSuccess={(msg) => showToast('success', msg)}
                  onError={(msg) => showToast('error', msg)}
                />
              )}

              {/* Category 2: Personnel & Organisation */}
              {activeTab === 'employes' && (
                <EmployesView
                  employes={employes}
                  onNewEmploye={() => {
                    setEditingEmploye(null);
                    setIsEmployeModalOpen(true);
                  }}
                  onEditEmploye={(e) => {
                    setEditingEmploye(e);
                    setIsEmployeModalOpen(true);
                  }}
                  onDeleteEmploye={handleDeleteEmploye}
                  onSelectEmploye={(e) => setSelectedEmploye(e)}
                />
              )}
              {activeTab === 'organigramme' && (
                <OrganigrammeView
                  employes={employes}
                  onSelectEmploye={(e) => setSelectedEmploye(e)}
                />
              )}
              {activeTab === 'onboarding' && (
                <OnboardingView
                  onboardings={onboardings}
                  employes={employes}
                  onToggleEtape={handleToggleOnboardingEtape}
                  onNewProtocol={handleNewOnboarding}
                />
              )}
              {activeTab === 'rup' && (
                <RUPView
                  onSuccess={(msg) => showToast('success', msg)}
                  onError={(msg) => showToast('error', msg)}
                />
              )}

              {/* Category 3: Temps & Présences */}
              {activeTab === 'conges' && (
                <CongesView
                  conges={conges}
                  employes={employes}
                  onNewConge={() => {
                    setEditingConge(null);
                    setIsCongeModalOpen(true);
                  }}
                  onEditConge={(c) => {
                    setEditingConge(c);
                    setIsCongeModalOpen(true);
                  }}
                  onDeleteConge={handleDeleteConge}
                  onApproveConge={handleApproveConge}
                  onRejectConge={handleRejectConge}
                />
              )}
              {activeTab === 'absences' && (
                <AbsencesView
                  absences={absences}
                  employes={employes}
                  onNewAbsence={() => {
                    setEditingAbsence(null);
                    setIsAbsenceModalOpen(true);
                  }}
                  onEditAbsence={(a) => {
                    setEditingAbsence(a);
                    setIsAbsenceModalOpen(true);
                  }}
                  onDeleteAbsence={handleDeleteAbsence}
                  onToggleJustifiee={handleToggleAbsenceJustifiee}
                />
              )}
              {activeTab === 'calendrier' && (
                <CalendrierView
                  conges={conges}
                  absences={absences}
                  employes={employes}
                />
              )}
              {activeTab === 'feuilles_temps' && (
                <FeuillesTempsView
                  timeLogs={timeLogs}
                  employes={employes}
                  onNewLog={() => setIsTimeLogModalOpen(true)}
                  onValidateLog={handleValidateTimeLog}
                />
              )}

              {/* Category 4: Talents & Carrières */}
              {activeTab === 'competences' && (
                <CompetencesView
                  employes={employes}
                  onAddCompetence={handleAddCompetence}
                />
              )}
              {activeTab === 'formations' && (
                <FormationsView
                  formations={formations}
                  employes={employes}
                  onNewFormation={() => setIsFormationModalOpen(true)}
                  onUpdateStatus={handleUpdateFormationStatus}
                  onDeleteFormation={handleDeleteFormation}
                />
              )}
              {activeTab === 'entretiens' && (
                <EntretiensView
                  entretiens={entretiens}
                  employes={employes}
                  onNewEntretien={() => setIsEntretienModalOpen(true)}
                  onUpdateStatus={handleUpdateEntretienStatus}
                  onDeleteEntretien={handleDeleteEntretien}
                />
              )}
              {activeTab === 'objectifs' && (
                <ObjectifsView employes={employes} />
              )}

              {/* Category 5: Rémunération & Avantages */}
              {activeTab === 'salaires' && (
                <SalairesView employes={employes} />
              )}
              {activeTab === 'primes' && (
                <PrimesView
                  employes={employes}
                  onSuccess={(msg) => showToast('success', msg)}
                  onError={(msg) => showToast('error', msg)}
                />
              )}
              {activeTab === 'notes_frais' && (
                <NotesFraisView
                  notesFrais={notesFrais}
                  employes={employes}
                  onNewNoteFrais={() => setIsNoteFraisModalOpen(true)}
                  onUpdateStatus={handleUpdateNoteFraisStatus}
                  onDeleteNoteFrais={handleDeleteNoteFrais}
                />
              )}
              {activeTab === 'titres_restaurant' && (
                <TitresRestaurantView
                  employes={employes}
                  conges={conges}
                  absences={absences}
                />
              )}

              {/* Category 6: Conformité & Outils */}
              {activeTab === 'documents' && (
                <DocumentsView employes={employes} />
              )}
              {activeTab === 'materiels' && (
                <MaterielsView
                  materiels={materiels}
                  employes={employes}
                  onNewMateriel={() => setIsMaterielModalOpen(true)}
                  onDeleteMateriel={handleDeleteMateriel}
                />
              )}
              {activeTab === 'audit' && (
                <AuditView auditLogs={auditLogs} />
              )}
            </>
          )}
        </main>
      </div>

      {/* All Functional Modals */}
      <EmployeDetailModal
        employe={selectedEmploye}
        conges={conges}
        absences={absences}
        onClose={() => setSelectedEmploye(null)}
        onEdit={(e) => {
          setSelectedEmploye(null);
          setEditingEmploye(e);
          setIsEmployeModalOpen(true);
        }}
      />

      <EmployeFormModal
        isOpen={isEmployeModalOpen}
        employe={editingEmploye}
        onClose={() => {
          setIsEmployeModalOpen(false);
          setEditingEmploye(null);
        }}
        onSave={handleSaveEmploye}
      />

      <CongeFormModal
        isOpen={isCongeModalOpen}
        conge={editingConge}
        employes={employes}
        onClose={() => {
          setIsCongeModalOpen(false);
          setEditingConge(null);
        }}
        onSave={handleSaveConge}
      />

      <AbsenceFormModal
        isOpen={isAbsenceModalOpen}
        absence={editingAbsence}
        employes={employes}
        onClose={() => {
          setIsAbsenceModalOpen(false);
          setEditingAbsence(null);
        }}
        onSave={handleSaveAbsence}
      />

      <FormationFormModal
        isOpen={isFormationModalOpen}
        employes={employes}
        onClose={() => setIsFormationModalOpen(false)}
        onSave={handleSaveFormation}
      />

      <EntretienFormModal
        isOpen={isEntretienModalOpen}
        employes={employes}
        onClose={() => setIsEntretienModalOpen(false)}
        onSave={handleSaveEntretien}
      />

      <NoteFraisFormModal
        isOpen={isNoteFraisModalOpen}
        employes={employes}
        onClose={() => setIsNoteFraisModalOpen(false)}
        onSave={handleSaveNoteFrais}
      />

      <MaterielFormModal
        isOpen={isMaterielModalOpen}
        employes={employes}
        onClose={() => setIsMaterielModalOpen(false)}
        onSave={handleSaveMateriel}
      />

      <TimeLogFormModal
        isOpen={isTimeLogModalOpen}
        employes={employes}
        onClose={() => setIsTimeLogModalOpen(false)}
        onSave={handleSaveTimeLog}
      />

      {/* Toasts Feedback */}
      <ToastContainer toasts={toasts} onDismiss={dismissToast} />
    </div>
  );
};

export const App: React.FC = () => {
  const [showDashboard, setShowDashboard] = useState(false);

  return showDashboard
    ? <DashboardApp />
    : <LandingPage onEnter={() => setShowDashboard(true)} />;
};
