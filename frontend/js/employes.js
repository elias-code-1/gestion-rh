/**
 * employes.js
 * CRUD complet pour la ressource /employes.
 *
 * Document Mongoose suggéré :
 * {
 *   nom: String, prenom: String, email: String, telephone: String,
 *   poste: String, departement: String,
 *   dateEmbauche: Date, statut: 'actif' | 'inactif'
 * }
 */

const overlay = document.getElementById('overlay');
const panel = document.getElementById('panel');
const form = document.getElementById('employe-form');
const panelTitle = document.getElementById('panel-title');

let employesCache = [];

async function loadEmployes() {
  const tbody = document.getElementById('employes-body');
  try {
    employesCache = await api.get('/employes') || [];
    renderEmployes();
  } catch (err) {
    tbody.innerHTML = `<tr class="empty-row"><td colspan="6">Backend non connecté — ${escapeHtml(err.message)}</td></tr>`;
  }
}

function renderEmployes() {
  const tbody = document.getElementById('employes-body');
  if (employesCache.length === 0) {
    tbody.innerHTML = '<tr class="empty-row"><td colspan="6">Aucun employé enregistré pour l\'instant.</td></tr>';
    return;
  }

  tbody.innerHTML = employesCache.map((e) => `
    <tr>
      <td class="cell-primary">${escapeHtml(e.prenom)} ${escapeHtml(e.nom)}</td>
      <td>${escapeHtml(e.poste || '—')}</td>
      <td class="cell-muted">${escapeHtml(e.departement || '—')}</td>
      <td class="cell-muted">${formatDate(e.dateEmbauche)}</td>
      <td>${statutBadge(e.statut)}</td>
      <td class="col-actions">
        <button class="btn btn-ghost btn-sm" onclick="openEditEmploye('${e._id}')">Modifier</button>
        <button class="btn btn-ghost btn-sm" onclick="deleteEmploye('${e._id}')">Supprimer</button>
      </td>
    </tr>
  `).join('');
}

function statutBadge(statut) {
  return statut === 'inactif'
    ? '<span class="badge badge-muted">Inactif</span>'
    : '<span class="badge badge-green">Actif</span>';
}

function openPanel() {
  overlay.classList.add('open');
  panel.classList.add('open');
}

function closePanel() {
  overlay.classList.remove('open');
  panel.classList.remove('open');
  form.reset();
  document.getElementById('employe-id').value = '';
}

function openNewEmploye() {
  panelTitle.textContent = 'Nouvel employé';
  form.reset();
  document.getElementById('employe-id').value = '';
  openPanel();
}

function openEditEmploye(id) {
  const e = employesCache.find((x) => x._id === id);
  if (!e) return;
  panelTitle.textContent = 'Modifier l\'employé';
  document.getElementById('employe-id').value = e._id;
  document.getElementById('employe-nom').value = e.nom || '';
  document.getElementById('employe-prenom').value = e.prenom || '';
  document.getElementById('employe-email').value = e.email || '';
  document.getElementById('employe-telephone').value = e.telephone || '';
  document.getElementById('employe-poste').value = e.poste || '';
  document.getElementById('employe-departement').value = e.departement || '';
  document.getElementById('employe-date-embauche').value = e.dateEmbauche
    ? new Date(e.dateEmbauche).toISOString().slice(0, 10)
    : '';
  document.getElementById('employe-statut').value = e.statut || 'actif';
  openPanel();
}

async function deleteEmploye(id) {
  const e = employesCache.find((x) => x._id === id);
  const label = e ? `${e.prenom} ${e.nom}` : 'cet employé';
  if (!confirm(`Supprimer ${label} ? Cette action est irréversible.`)) return;

  try {
    await api.delete(`/employes/${id}`);
    await loadEmployes();
  } catch (err) {
    alert(`Suppression impossible : ${err.message}`);
  }
}

form.addEventListener('submit', async (event) => {
  event.preventDefault();

  const id = document.getElementById('employe-id').value;
  const payload = {
    nom: document.getElementById('employe-nom').value.trim(),
    prenom: document.getElementById('employe-prenom').value.trim(),
    email: document.getElementById('employe-email').value.trim(),
    telephone: document.getElementById('employe-telephone').value.trim(),
    poste: document.getElementById('employe-poste').value.trim(),
    departement: document.getElementById('employe-departement').value.trim(),
    dateEmbauche: document.getElementById('employe-date-embauche').value || null,
    statut: document.getElementById('employe-statut').value,
  };

  try {
    if (id) {
      await api.put(`/employes/${id}`, payload);
    } else {
      await api.post('/employes', payload);
    }
    closePanel();
    await loadEmployes();
  } catch (err) {
    alert(`Enregistrement impossible : ${err.message}`);
  }
});

document.getElementById('btn-new-employe').addEventListener('click', openNewEmploye);
document.getElementById('btn-cancel').addEventListener('click', closePanel);
document.getElementById('panel-close').addEventListener('click', closePanel);
overlay.addEventListener('click', closePanel);

document.addEventListener('DOMContentLoaded', loadEmployes);
