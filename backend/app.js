require('dotenv').config();
const path = require('path');
const fs = require('fs');
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

// Existing Routes
const congeRoutes = require('./routes/conge');
const employeRoutes = require('./routes/Employe');
const absenceRoutes = require('./routes/Absence');

// Real Mongoose Models for ALL resources
const Employe = require('./models/Employe');
const Formation = require('./models/Formation');
const Entretien = require('./models/Entretien');
const NoteFrais = require('./models/NoteFrais');
const Onboarding = require('./models/Onboarding');
const Materiel = require('./models/Materiel');
const TimeLog = require('./models/TimeLog');
const AuditLog = require('./models/AuditLog');
const Prime = require('./models/Prime');
const Objectif = require('./models/Objectif');
const Document = require('./models/DocumentModel');
const ParametreRH = require('./models/ParametreRH');
const Conge = require('./models/conge');
const Absence = require('./models/Absence');
const ModuleRecord = require('./models/ModuleRecord');

const { seedDatabaseIfEmpty } = require('./dbSeeder');

const app = express();

// --- Connexion MongoDB ---------------------------------------------------
mongoose.set('bufferCommands', Boolean(process.env.MONGODB_URI));
if (process.env.MONGODB_URI) {
  mongoose
    .connect(process.env.MONGODB_URI)
    .then(async () => {
      console.log('Connexion directe et persistante à MongoDB Atlas réussie !');
      await seedDatabaseIfEmpty();
    })
    .catch((error) => console.error('Erreur de connexion MongoDB :', error.message));
} else {
  console.warn('Attention : MONGODB_URI absent !');
}

// --- Middlewares -----------------------------------------------------------
app.use(cors());
app.use(express.json());

// Helper function to resolve employee name if missing
async function resolveEmployeName(employeId) {
  if (!employeId) return '';
  const emp = await Employe.findById(employeId).catch(() => null);
  return emp ? `${emp.prenom} ${emp.nom}` : '';
}

// --- API Routes : Collaborateurs, Absences, Congés ------------------------
app.use('/api/employes', employeRoutes);
app.use('/api/absences', absenceRoutes);
app.use('/api/conges', congeRoutes);

// --- API Routes : Formations (MongoDB) -----------------------------------
app.get('/api/formations', async (req, res) => {
  try {
    const list = await Formation.find().sort({ createdAt: -1 });
    res.json(list);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
app.post('/api/formations', async (req, res) => {
  try {
    let employeNom = req.body.employeNom;
    if (!employeNom && req.body.employeId) {
      employeNom = await resolveEmployeName(req.body.employeId);
    }
    const item = new Formation({ ...req.body, employeNom: employeNom || req.body.employeNom });
    const saved = await item.save();

    await AuditLog.create({
      action: 'Demande formation',
      auteur: 'Gestionnaire RH',
      details: `Ajout formation : ${saved.titre} pour ${saved.employeNom || 'Salarié'} (${saved.cout} €)`,
      type: 'creation',
    }).catch(() => {});

    res.status(201).json(saved);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});
app.put('/api/formations/:id', async (req, res) => {
  try {
    const item = await Formation.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (req.body.statut) {
      await AuditLog.create({
        action: `Formation ${req.body.statut}`,
        auteur: 'Validateur RH',
        details: `Statut de la formation ${item.titre} passé à ${req.body.statut}`,
        type: 'validation',
      }).catch(() => {});
    }
    res.json(item);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});
app.delete('/api/formations/:id', async (req, res) => {
  try {
    const item = await Formation.findById(req.params.id);
    await Formation.findByIdAndDelete(req.params.id);
    if (item) {
      await AuditLog.create({
        action: 'Suppression formation',
        auteur: 'Gestionnaire RH',
        details: `Suppression de la formation ${item.titre}`,
        type: 'suppression',
      }).catch(() => {});
    }
    res.json({ success: true });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// --- API Routes : Entretiens Annuels & Professionnels (MongoDB) -----------
app.get('/api/entretiens', async (req, res) => {
  try {
    const list = await Entretien.find().sort({ date: -1 });
    res.json(list);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
app.post('/api/entretiens', async (req, res) => {
  try {
    let employeNom = req.body.employeNom;
    if (!employeNom && req.body.employeId) {
      employeNom = await resolveEmployeName(req.body.employeId);
    }
    const item = new Entretien({ ...req.body, employeNom: employeNom || req.body.employeNom });
    const saved = await item.save();

    await AuditLog.create({
      action: 'Planification entretien',
      auteur: saved.evaluator || 'Manager',
      details: `Entretien ${saved.type} planifié pour ${saved.employeNom}`,
      type: 'creation',
    }).catch(() => {});

    res.status(201).json(saved);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});
app.put('/api/entretiens/:id', async (req, res) => {
  try {
    const item = await Entretien.findByIdAndUpdate(req.params.id, req.body, { new: true });
    await AuditLog.create({
      action: 'Mise à jour entretien',
      auteur: item.evaluator || 'Manager',
      details: `Entretien ${item.type} mis à jour (note: ${item.noteGlobale}/5)`,
      type: 'modification',
    }).catch(() => {});
    res.json(item);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});
app.delete('/api/entretiens/:id', async (req, res) => {
  try {
    await Entretien.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// --- API Routes : Notes de Frais (MongoDB) -------------------------------
app.get('/api/notes-frais', async (req, res) => {
  try {
    const list = await NoteFrais.find().sort({ dateDepense: -1 });
    res.json(list);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
app.post('/api/notes-frais', async (req, res) => {
  try {
    let employeNom = req.body.employeNom;
    if (!employeNom && req.body.employeId) {
      employeNom = await resolveEmployeName(req.body.employeId);
    }
    const item = new NoteFrais({ ...req.body, employeNom: employeNom || req.body.employeNom });
    const saved = await item.save();

    await AuditLog.create({
      action: 'Note de frais déposée',
      auteur: saved.employeNom || 'Salarié',
      details: `Dépense ${saved.titre} de ${saved.montant} € (${saved.categorie})`,
      type: 'frais',
    }).catch(() => {});

    res.status(201).json(saved);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});
app.put('/api/notes-frais/:id', async (req, res) => {
  try {
    const item = await NoteFrais.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (req.body.statut) {
      await AuditLog.create({
        action: `Note de frais ${req.body.statut}`,
        auteur: 'Comptable / DRH',
        details: `Note ${item.titre} (${item.montant} €) pour ${item.employeNom} : ${req.body.statut}`,
        type: 'validation',
      }).catch(() => {});
    }
    res.json(item);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});
app.delete('/api/notes-frais/:id', async (req, res) => {
  try {
    await NoteFrais.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// --- API Routes : Onboarding / Offboarding (MongoDB) --------------------
app.get('/api/onboardings', async (req, res) => {
  try {
    const list = await Onboarding.find().sort({ createdAt: -1 });
    res.json(list);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
app.post('/api/onboardings', async (req, res) => {
  try {
    let employeNom = req.body.employeNom;
    if (!employeNom && req.body.employeId) {
      employeNom = await resolveEmployeName(req.body.employeId);
    }
    const item = new Onboarding({ ...req.body, employeNom: employeNom || req.body.employeNom });
    const saved = await item.save();

    await AuditLog.create({
      action: 'Création parcours intégration',
      auteur: 'Responsable RH',
      details: `Parcours ${saved.phase} initialisé pour ${saved.employeNom}`,
      type: 'creation',
    }).catch(() => {});

    res.status(201).json(saved);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});
app.put('/api/onboardings/:id', async (req, res) => {
  try {
    const item = await Onboarding.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(item);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});
app.delete('/api/onboardings/:id', async (req, res) => {
  try {
    await Onboarding.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// --- API Routes : Matériels Prêtés (MongoDB) ----------------------------
app.get('/api/materiels', async (req, res) => {
  try {
    const list = await Materiel.find().sort({ createdAt: -1 });
    res.json(list);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
app.post('/api/materiels', async (req, res) => {
  try {
    let employeNom = req.body.employeNom;
    if (!employeNom && req.body.employeId) {
      employeNom = await resolveEmployeName(req.body.employeId);
    }
    const item = new Materiel({ ...req.body, employeNom: employeNom || req.body.employeNom });
    const saved = await item.save();

    await AuditLog.create({
      action: 'Attribution matériel',
      auteur: 'IT / Moyens Généraux',
      details: `Attribution de ${saved.nom} (S/N: ${saved.numeroSerie}) à ${saved.employeNom}`,
      type: 'creation',
    }).catch(() => {});

    res.status(201).json(saved);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});
app.put('/api/materiels/:id', async (req, res) => {
  try {
    const item = await Materiel.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(item);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});
app.delete('/api/materiels/:id', async (req, res) => {
  try {
    await Materiel.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// --- API Routes : Feuilles de Temps & 35h (MongoDB) ---------------------
app.get('/api/time-logs', async (req, res) => {
  try {
    const list = await TimeLog.find().sort({ createdAt: -1 });
    res.json(list);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
app.post('/api/time-logs', async (req, res) => {
  try {
    let employeNom = req.body.employeNom;
    if (!employeNom && req.body.employeId) {
      employeNom = await resolveEmployeName(req.body.employeId);
    }
    const item = new TimeLog({ ...req.body, employeNom: employeNom || req.body.employeNom });
    const saved = await item.save();

    await AuditLog.create({
      action: 'Déclaration feuille de temps',
      auteur: saved.employeNom || 'Salarié',
      details: `Semaine ${saved.semaine} : ${saved.heuresDeclarees}h déclarées (${saved.heuresSupp}h sup)`,
      type: 'creation',
    }).catch(() => {});

    res.status(201).json(saved);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});
app.put('/api/time-logs/:id', async (req, res) => {
  try {
    const item = await TimeLog.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(item);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});
app.delete('/api/time-logs/:id', async (req, res) => {
  try {
    await TimeLog.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// --- API Routes : Primes (MongoDB) --------------------------------------
app.get('/api/primes', async (req, res) => {
  try {
    const list = await Prime.find().sort({ createdAt: -1 });
    res.json(list);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
app.post('/api/primes', async (req, res) => {
  try {
    let employeNom = req.body.employeNom;
    if (!employeNom && req.body.employeId) {
      employeNom = await resolveEmployeName(req.body.employeId);
    }
    const item = new Prime({ ...req.body, employeNom: employeNom || req.body.employeNom });
    const saved = await item.save();

    await AuditLog.create({
      action: 'Attribution prime',
      auteur: 'Direction RH',
      details: `Prime ${saved.titre} de ${saved.montant} € pour ${saved.employeNom}`,
      type: 'creation',
    }).catch(() => {});

    res.status(201).json(saved);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});
app.put('/api/primes/:id', async (req, res) => {
  try {
    const item = await Prime.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(item);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});
app.delete('/api/primes/:id', async (req, res) => {
  try {
    await Prime.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// --- API Routes : Objectifs & OKR (MongoDB) ------------------------------
app.get('/api/objectifs', async (req, res) => {
  try {
    const list = await Objectif.find().sort({ createdAt: -1 });
    res.json(list);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
app.post('/api/objectifs', async (req, res) => {
  try {
    let employeNom = req.body.employeNom;
    if (!employeNom && req.body.employeId) {
      employeNom = await resolveEmployeName(req.body.employeId);
    }
    const item = new Objectif({ ...req.body, employeNom: employeNom || req.body.employeNom });
    const saved = await item.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});
app.put('/api/objectifs/:id', async (req, res) => {
  try {
    const item = await Objectif.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(item);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});
app.delete('/api/objectifs/:id', async (req, res) => {
  try {
    await Objectif.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// --- API Routes : Modèles de Documents & Attestations (MongoDB) ---------
app.get('/api/documents', async (req, res) => {
  try {
    const list = await Document.find().sort({ createdAt: -1 });
    res.json(list);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
app.post('/api/documents', async (req, res) => {
  try {
    const doc = new Document(req.body);
    const saved = await doc.save();
    await AuditLog.create({
      action: 'Nouveau modèle document',
      auteur: 'Juridique RH',
      details: `Création du modèle : ${saved.titre} (${saved.categorie})`,
      type: 'creation',
    }).catch(() => {});
    res.status(201).json(saved);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});
app.put('/api/documents/:id', async (req, res) => {
  try {
    const item = await Document.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(item);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});
app.delete('/api/documents/:id', async (req, res) => {
  try {
    await Document.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Génération dynamique d'une attestation pour un salarié donné
app.post('/api/documents/:id/generer', async (req, res) => {
  try {
    const doc = await Document.findById(req.params.id);
    if (!doc) return res.status(404).json({ error: 'Modèle introuvable' });

    const { employeId } = req.body;
    const employe = await Employe.findById(employeId);
    if (!employe) return res.status(404).json({ error: 'Employé introuvable' });

    const todayStr = new Date().toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    });
    const dateEmbaucheStr = employe.dateEmbauche
      ? new Date(employe.dateEmbauche).toLocaleDateString('fr-FR')
      : 'Date non renseignée';

    let rendu = doc.contenuTemplate
      .replace(/{{NOM_PRENOM}}/g, `${employe.prenom} ${employe.nom}`)
      .replace(/{{POSTE}}/g, employe.poste || 'Collaborateur')
      .replace(/{{DEPARTEMENT}}/g, employe.departement || 'Non spécifié')
      .replace(/{{DATE_EMBAUCHE}}/g, dateEmbaucheStr)
      .replace(/{{DATE_DU_JOUR}}/g, todayStr)
      .replace(/{{JOURS_TELETRAVAIL}}/g, String(employe.teletravailJours || 2))
      .replace(/{{SALAIRE_BRUT}}/g, `${employe.salaireBrut || 3500} €`)
      .replace(/{{MATRICULE}}/g, employe.matricule || `EMP-${employe._id}`)
      .replace(/{{DATE_SORTIE}}/g, todayStr)
      .replace(/{{MONTANT_TOTAL}}/g, `${((employe.salaireBrut || 3500) * 1.15).toFixed(2)}`);

    doc.dernierUsage = new Date().toISOString();
    await doc.save();

    await AuditLog.create({
      action: 'Génération document RH',
      auteur: 'Gestionnaire RH',
      details: `Génération de ${doc.titre} pour ${employe.prenom} ${employe.nom}`,
      type: 'validation',
    }).catch(() => {});

    res.json({
      titre: doc.titre,
      employeNom: `${employe.prenom} ${employe.nom}`,
      dateGeneration: todayStr,
      texteGenere: rendu,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// --- API Routes : Paramètres RH de l'entreprise (MongoDB) ----------------
app.get('/api/parametres', async (req, res) => {
  try {
    let params = await ParametreRH.findOne();
    if (!params) {
      params = await ParametreRH.create({});
    }
    res.json(params);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
app.put('/api/parametres', async (req, res) => {
  try {
    let params = await ParametreRH.findOne();
    if (!params) {
      params = new ParametreRH(req.body);
    } else {
      Object.assign(params, req.body);
    }
    const saved = await params.save();

    await AuditLog.create({
      action: 'Modification paramètres RH',
      auteur: 'Administrateur RH',
      details: `Mise à jour configuration : ${saved.nomEntreprise}`,
      type: 'modification',
    }).catch(() => {});

    res.json(saved);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// --- API Routes : Registre Unique du Personnel (RUP) ---------------------
app.get('/api/rup', async (req, res) => {
  try {
    const employes = await Employe.find().sort({ dateEmbauche: 1 });
    const rupList = employes.map((e, index) => ({
      ordre: index + 1,
      matricule: e.matricule || `EMP-${String(e._id).slice(-4).toUpperCase()}`,
      nom: e.nom,
      prenom: e.prenom,
      nationalite: e.nationalite || 'Française',
      poste: e.poste || 'Non spécifié',
      departement: e.departement || 'Général',
      typeContrat: e.typeContrat || 'CDI',
      dateEmbauche: e.dateEmbauche,
      statut: e.statut,
      visiteMedicale: e.visiteMedicale,
    }));
    res.json(rupList);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// --- API Routes : Alertes & Vigies RH (Calculées en temps réel sur MongoDB) -
app.get('/api/alertes', async (req, res) => {
  try {
    const alertes = [];
    const now = new Date();

    // 1. Congés en attente
    const pendingConges = await Conge.find({ statut: 'en_attente' });
    for (const c of pendingConges) {
      alertes.push({
        id: `conge-${c._id}`,
        categorie: 'conges',
        niveau: 'urgent',
        titre: `Demande de congé en attente de validation`,
        description: `Demande de ${c.employeNom || 'Salarié'} (${c.typeConge}) pour la période du ${new Date(c.dateDebut).toLocaleDateString('fr-FR')} au ${new Date(c.dateFin).toLocaleDateString('fr-FR')}`,
        lienTab: 'conges',
        date: c.createdAt || c.dateDebut,
      });
    }

    // 2. Absences non justifiées
    const unjustAbsences = await Absence.find({ justifiee: false });
    for (const a of unjustAbsences) {
      alertes.push({
        id: `absence-${a._id}`,
        categorie: 'absences',
        niveau: 'moyen',
        titre: `Absence sans justificatif médical`,
        description: `Absence de ${a.employeNom || 'Salarié'} du ${new Date(a.date).toLocaleDateString('fr-FR')} non justifiée (${a.motif || 'motif inconnu'})`,
        lienTab: 'absences',
        date: a.date,
      });
    }

    // 3. Visites médicales échues ou proches (< 30 jours)
    const emps = await Employe.find({ statut: 'actif' });
    const in30Days = new Date(now.getTime() + 30 * 24 * 3600 * 1000);
    for (const emp of emps) {
      if (emp.visiteMedicale) {
        const vmDate = new Date(emp.visiteMedicale);
        if (vmDate < now) {
          alertes.push({
            id: `vm-expired-${emp._id}`,
            categorie: 'conformite',
            niveau: 'urgent',
            titre: `Visite médicale du travail échue !`,
            description: `La visite médicale de ${emp.prenom} ${emp.nom} a expiré le ${vmDate.toLocaleDateString('fr-FR')}. Prendre RDV d'urgence.`,
            lienTab: 'employes',
            date: vmDate,
          });
        } else if (vmDate <= in30Days) {
          alertes.push({
            id: `vm-soon-${emp._id}`,
            categorie: 'conformite',
            niveau: 'moyen',
            titre: `Visite médicale à programmer sous 30 jours`,
            description: `Échéance fixée au ${vmDate.toLocaleDateString('fr-FR')} pour ${emp.prenom} ${emp.nom}.`,
            lienTab: 'employes',
            date: vmDate,
          });
        }
      }
    }

    // 4. Notes de frais en attente
    const pendingNdf = await NoteFrais.find({ statut: 'en_attente' });
    for (const n of pendingNdf) {
      alertes.push({
        id: `ndf-${n._id}`,
        categorie: 'remuneration',
        niveau: 'moyen',
        titre: `Note de frais en attente de remboursement`,
        description: `${n.employeNom || 'Salarié'} : ${n.titre} (${n.montant} €)`,
        lienTab: 'notes_frais',
        date: n.createdAt || n.dateDepense,
      });
    }

    res.json(alertes);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// --- API Routes : Statistiques RH Exécutives (Calculées sur MongoDB) -------
app.get('/api/stats', async (req, res) => {
  try {
    const employes = await Employe.find();
    const conges = await Conge.find();
    const absences = await Absence.find();
    const formations = await Formation.find();
    const notesFrais = await NoteFrais.find();
    const materiels = await Materiel.find();
    const entretiens = await Entretien.find();

    const actifs = employes.filter((e) => e.statut === 'actif');
    const inactifs = employes.filter((e) => e.statut === 'inactif');

    // Masse salariale brute mensuelle
    const masseSalarialeBrute = actifs.reduce((acc, curr) => acc + (curr.salaireBrut || 0), 0);
    const masseSalarialeAnnuelle = masseSalarialeBrute * 12;
    const coutPatronalEstime = masseSalarialeBrute * 0.42;

    // Répartition par département
    const parDepartement = {};
    for (const e of actifs) {
      const dep = e.departement || 'Autre';
      parDepartement[dep] = (parDepartement[dep] || 0) + 1;
    }

    // Congés & Absences
    const congesEnAttente = conges.filter((c) => c.statut === 'en_attente').length;
    const congesApprouves = conges.filter((c) => c.statut === 'approuve').length;

    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    const absencesCeMois = absences.filter((a) => {
      const d = new Date(a.date);
      return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
    }).length;

    const absencesInjustifiees = absences.filter((a) => !a.justifiee).length;

    // Formations
    const budgetFormationEngage = formations
      .filter((f) => f.statut === 'validee' || f.statut === 'terminee')
      .reduce((sum, f) => sum + (f.cout || 0), 0);

    // Notes de frais
    const fraisEnAttenteTotal = notesFrais
      .filter((n) => n.statut === 'en_attente')
      .reduce((sum, n) => sum + (n.montant || 0), 0);
    const fraisRemboursesTotal = notesFrais
      .filter((n) => n.statut === 'remboursee')
      .reduce((sum, n) => sum + (n.montant || 0), 0);

    // Matériels
    const materielsAttribues = materiels.filter((m) => m.statut === 'attribue').length;

    // Taux d'absentéisme estimé (jours absents / jours théoriques travaillés sur le mois)
    const joursTheoriquesTotal = Math.max(1, actifs.length * 21.67);
    const tauxAbsenteisme = ((absencesCeMois / joursTheoriquesTotal) * 100).toFixed(1);

    // Télétravail moyen
    const teletravailMoyenJours =
      actifs.length > 0
        ? (actifs.reduce((sum, e) => sum + (e.teletravailJours || 2), 0) / actifs.length).toFixed(1)
        : '2.0';

    res.json({
      totalEmployes: employes.length,
      employesActifs: actifs.length,
      employesInactifs: inactifs.length,
      masseSalarialeBrute,
      masseSalarialeAnnuelle,
      coutPatronalEstime,
      parDepartement,
      congesEnAttente,
      congesApprouves,
      absencesCeMois,
      absencesInjustifiees,
      budgetFormationEngage,
      fraisEnAttenteTotal,
      fraisRemboursesTotal,
      materielsAttribues,
      totalMateriels: materiels.length,
      entretiensPlanifies: entretiens.filter((e) => e.statut === 'planifie').length,
      tauxAbsenteisme: Number(tauxAbsenteisme),
      teletravailMoyenJours: Number(teletravailMoyenJours),
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// --- API Routes : Journal d'Audit & Sécurité (MongoDB) -------------------
app.get('/api/audit-logs', async (req, res) => {
  try {
    const list = await AuditLog.find().sort({ horodatage: -1 }).limit(150);
    res.json(list);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// --- API Routes : Modules Métiers RH Spécifiques (MongoDB) ----------------
app.get('/api/modules/:moduleKey', async (req, res) => {
  try {
    const { moduleKey } = req.params;
    const { search, statut, employeId } = req.query;
    const filter = { moduleKey };
    if (statut && statut !== 'tous') filter.statut = statut;
    if (employeId) filter.employeId = employeId;
    if (search) {
      filter.$or = [
        { titre: { $regex: search, $options: 'i' } },
        { employeNom: { $regex: search, $options: 'i' } },
        { categorie: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }
    const list = await ModuleRecord.find(filter).sort({ createdAt: -1 });
    res.json(list);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/modules/:moduleKey', async (req, res) => {
  try {
    const { moduleKey } = req.params;
    let employeNom = req.body.employeNom;
    if (!employeNom && req.body.employeId) {
      employeNom = await resolveEmployeName(req.body.employeId);
    }
    const record = new ModuleRecord({
      ...req.body,
      moduleKey,
      employeNom: employeNom || req.body.employeNom,
    });
    const saved = await record.save();

    await AuditLog.create({
      action: `Création enregistrement [${moduleKey}]`,
      auteur: req.body.responsable || 'Gestionnaire RH',
      details: `${saved.titre}${saved.employeNom ? ' pour ' + saved.employeNom : ''}`,
      type: 'creation',
    }).catch(() => {});

    res.status(201).json(saved);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.put('/api/modules/:moduleKey/:id', async (req, res) => {
  try {
    const item = await ModuleRecord.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!item) return res.status(404).json({ error: 'Élément introuvable' });

    await AuditLog.create({
      action: `Mise à jour [${req.params.moduleKey}]`,
      auteur: req.body.responsable || 'Gestionnaire RH',
      details: `Modification de ${item.titre}`,
      type: 'modification',
    }).catch(() => {});

    res.json(item);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.delete('/api/modules/:moduleKey/:id', async (req, res) => {
  try {
    const item = await ModuleRecord.findByIdAndDelete(req.params.id);
    if (!item) return res.status(404).json({ error: 'Élément introuvable' });

    await AuditLog.create({
      action: `Suppression [${req.params.moduleKey}]`,
      auteur: 'Gestionnaire RH',
      details: `Suppression de ${item.titre}`,
      type: 'suppression',
    }).catch(() => {});

    res.json({ success: true });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// --- Frontend Statique -----------------------------------------------------
const distDir = path.join(__dirname, '../dist');
const frontendDir = path.join(__dirname, '../frontend');
const staticDir = fs.existsSync(distDir) ? distDir : frontendDir;
app.use(express.static(staticDir));

app.get('/{*path}', (req, res, next) => {
  if (req.path.startsWith('/api')) {
    return next();
  }
  const indexPath = fs.existsSync(path.join(distDir, 'index.html'))
    ? path.join(distDir, 'index.html')
    : path.join(frontendDir, 'index.html');
  res.sendFile(indexPath);
});

// Middleware d'erreur globale
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: err.message || 'Erreur interne du serveur' });
});

module.exports = app;