/**
 * conges.js
 * CRUD complet pour la ressource /conges.
 *
 * Document Mongoose suggéré :
 * {
 *   employeId: ObjectId (ref 'Employe'), employeNom: String (optionnel),
 *   typeConge: 'paye' | 'maladie' | 'exceptionnel' | 'sans_solde',
 *   dateDebut: Date, dateFin: Date,
 *   statut: 'en_attente' | 'approuve' | 'refuse',
 *   commentaire: String
 * }
 */

const overlay = document.getElementById('overlay');
const panel = document.getElementById('panel');
const form = document.getElementById('conge-form');
const panelTitle = document.getElementById('panel-title');

let congesCache = [];
let employesOptions = [];

const TYPE_LABELS = {
  paye: 'Congé payé',
  maladie: 'Congé maladie',
  exceptionnel: 'Congé exceptionnel',
  sans_solde: 'Sans solde',
};

async function loadConges() {
  const tbody = document.getElementById('conges-body');
  try {
    const [conges, employes] = await Promise.all([
      api.get('/conges'),
      api.get('/employes').catch(() => []),
    ]);
    congesCache = conges || [];
    employesOptions = employes || [];
    fillEmployeSelect();
    renderConges();
  } catch (err) {
    tbody.innerHTML = `<tr class="empty-row"><td colspan="5">Backend non connecté — ${escapeHtml(err.message)}</td></tr>`;
  }
}

function fillEmployeSelect() {
  const select = document.getElementById('conge-employe');
  const current = select.value;
  select.innerHTML = '<option value="">Sélectionner…</option>' + employesOptions.map((e) =>
    `<option value="${e._id}">${escapeHtml(e.prenom)} ${escapeHtml(e.nom)}</option>`
  ).join('');
  select.value = current;
}

function employeLabel(c) {
  if (c.employeNom) return c.employeNom;
  const e = employesOptions.find((x) => x._id === c.employeId);
  return e ? `${e.prenom} ${e.nom}` : (c.employeId || '—');
}

function statutBadge(statut) {
  if (statut === 'approuve') return '<span class="badge badge-green">Approuvé</span>';
  if (statut === 'refuse') return '<span class="badge badge-red">Refusé</span>';
  return '<span class="badge badge-amber">En attente</span>';
}

function renderConges() {
  const tbody = document.getElementById('conges-body');
  if (congesCache.length === 0) {
    tbody.innerHTML = '<tr class="empty-row"><td colspan="5">Aucune demande de congé enregistrée.</td></tr>';
    return;
  }

  const sorted = congesCache.slice().sort((a, b) => new Date(b.dateDebut) - new Date(a.dateDebut));

  tbody.innerHTML = sorted.map((c) => `
    <tr>
      <td class="cell-primary">${escapeHtml(employeLabel(c))}</td>
      <td>${escapeHtml(TYPE_LABELS[c.typeConge] || c.typeConge || '—')}</td>
      <td class="cell-muted">${formatDate(c.dateDebut)} → ${formatDate(c.dateFin)}</td>
      <td>${statutBadge(c.statut)}</td>
      <td class="col-actions">
        <button class="btn btn-ghost btn-sm" onclick="openEditConge('${c._id}')">Modifier</button>
        <button class="btn btn-ghost btn-sm" onclick="deleteConge('${c._id}')">Supprimer</button>
      </td>
    </tr>
  `).join('');
}

function openPanel() {
  overlay.classList.add('open');
  panel.classList.add('open');
}

function closePanel() {
  overlay.classList.remove('open');
  panel.classList.remove('open');
  form.reset();
  document.getElementById('conge-id').value = '';
}

function openNewConge() {
  panelTitle.textContent = 'Nouvelle demande de congé';
  form.reset();
  document.getElementById('conge-id').value = '';
  openPanel();
}

function openEditConge(id) {
  const c = congesCache.find((x) => x._id === id);
  if (!c) return;
  panelTitle.textContent = 'Modifier la demande';
  document.getElementById('conge-id').value = c._id;
  document.getElementById('conge-employe').value = c.employeId || '';
  document.getElementById('conge-type').value = c.typeConge || 'paye';
  document.getElementById('conge-debut').value = c.dateDebut
    ? new Date(c.dateDebut).toISOString().slice(0, 10)
    : '';
  document.getElementById('conge-fin').value = c.dateFin
    ? new Date(c.dateFin).toISOString().slice(0, 10)
    : '';
  document.getElementById('conge-statut').value = c.statut || 'en_attente';
  document.getElementById('conge-commentaire').value = c.commentaire || '';
  openPanel();
}

async function deleteConge(id) {
  if (!confirm('Supprimer cette demande de congé ? Cette action est irréversible.')) return;
  try {
    await api.delete(`/conges/${id}`);
    await loadConges();
  } catch (err) {
    alert(`Suppression impossible : ${err.message}`);
  }
}

form.addEventListener('submit', async (event) => {
  event.preventDefault();

  const id = document.getElementById('conge-id').value;
  const debut = document.getElementById('conge-debut').value;
  const fin = document.getElementById('conge-fin').value;

  if (fin < debut) {
    alert('La date de fin ne peut pas précéder la date de début.');
    return;
  }

  const payload = {
    employeId: document.getElementById('conge-employe').value,
    typeConge: document.getElementById('conge-type').value,
    dateDebut: debut,
    dateFin: fin,
    statut: document.getElementById('conge-statut').value,
    commentaire: document.getElementById('conge-commentaire').value.trim(),
  };

  try {
    if (id) {
      await api.put(`/conges/${id}`, payload);
    } else {
      await api.post('/conges', payload);
    }
    closePanel();
    await loadConges();
  } catch (err) {
    alert(`Enregistrement impossible : ${err.message}`);
  }
});

document.getElementById('btn-new-conge').addEventListener('click', openNewConge);
document.getElementById('btn-cancel').addEventListener('click', closePanel);
document.getElementById('panel-close').addEventListener('click', closePanel);
overlay.addEventListener('click', closePanel);

document.addEventListener('DOMContentLoaded', loadConges);
