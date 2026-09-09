/**
 * absences.js
 * CRUD complet pour la ressource /absences.
 *
 * Document Mongoose suggéré :
 * {
 *   employeId: ObjectId (ref 'Employe'), employeNom: String (optionnel, pratique à retourner),
 *   date: Date, motif: String, justifiee: Boolean, commentaire: String
 * }
 *
 * Le select "Employé" du formulaire est rempli via GET /employes.
 */

const overlay = document.getElementById('overlay');
const panel = document.getElementById('panel');
const form = document.getElementById('absence-form');
const panelTitle = document.getElementById('panel-title');

let absencesCache = [];
let employesOptions = [];

async function loadAbsences() {
  const tbody = document.getElementById('absences-body');
  try {
    const [absences, employes] = await Promise.all([
      api.get('/absences'),
      api.get('/employes').catch(() => []),
    ]);
    absencesCache = absences || [];
    employesOptions = employes || [];
    fillEmployeSelect();
    renderAbsences();
  } catch (err) {
    tbody.innerHTML = `<tr class="empty-row"><td colspan="5">Backend non connecté — ${escapeHtml(err.message)}</td></tr>`;
  }
}

function fillEmployeSelect() {
  const select = document.getElementById('absence-employe');
  const current = select.value;
  select.innerHTML = '<option value="">Sélectionner…</option>' + employesOptions.map((e) =>
    `<option value="${e._id}">${escapeHtml(e.prenom)} ${escapeHtml(e.nom)}</option>`
  ).join('');
  select.value = current;
}

function employeLabel(a) {
  if (a.employeNom) return a.employeNom;
  const e = employesOptions.find((x) => x._id === a.employeId);
  return e ? `${e.prenom} ${e.nom}` : (a.employeId || '—');
}

function renderAbsences() {
  const tbody = document.getElementById('absences-body');
  if (absencesCache.length === 0) {
    tbody.innerHTML = '<tr class="empty-row"><td colspan="5">Aucune absence enregistrée.</td></tr>';
    return;
  }

  const sorted = absencesCache.slice().sort((a, b) => new Date(b.date) - new Date(a.date));

  tbody.innerHTML = sorted.map((a) => `
    <tr>
      <td class="cell-primary">${escapeHtml(employeLabel(a))}</td>
      <td class="cell-muted">${formatDate(a.date)}</td>
      <td>${escapeHtml(a.motif || '—')}</td>
      <td>${a.justifiee ? '<span class="badge badge-green">Oui</span>' : '<span class="badge badge-red">Non</span>'}</td>
      <td class="col-actions">
        <button class="btn btn-ghost btn-sm" onclick="openEditAbsence('${a._id}')">Modifier</button>
        <button class="btn btn-ghost btn-sm" onclick="deleteAbsence('${a._id}')">Supprimer</button>
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
  document.getElementById('absence-id').value = '';
}

function openNewAbsence() {
  panelTitle.textContent = 'Nouvelle absence';
  form.reset();
  document.getElementById('absence-id').value = '';
  openPanel();
}

function openEditAbsence(id) {
  const a = absencesCache.find((x) => x._id === id);
  if (!a) return;
  panelTitle.textContent = 'Modifier l\'absence';
  document.getElementById('absence-id').value = a._id;
  document.getElementById('absence-employe').value = a.employeId || '';
  document.getElementById('absence-date').value = a.date
    ? new Date(a.date).toISOString().slice(0, 10)
    : '';
  document.getElementById('absence-motif').value = a.motif || '';
  document.getElementById('absence-justifiee').value = String(!!a.justifiee);
  document.getElementById('absence-commentaire').value = a.commentaire || '';
  openPanel();
}

async function deleteAbsence(id) {
  if (!confirm('Supprimer cette absence ? Cette action est irréversible.')) return;
  try {
    await api.delete(`/absences/${id}`);
    await loadAbsences();
  } catch (err) {
    alert(`Suppression impossible : ${err.message}`);
  }
}

form.addEventListener('submit', async (event) => {
  event.preventDefault();

  const id = document.getElementById('absence-id').value;
  const payload = {
    employeId: document.getElementById('absence-employe').value,
    date: document.getElementById('absence-date').value,
    motif: document.getElementById('absence-motif').value.trim(),
    justifiee: document.getElementById('absence-justifiee').value === 'true',
    commentaire: document.getElementById('absence-commentaire').value.trim(),
  };

  try {
    if (id) {
      await api.put(`/absences/${id}`, payload);
    } else {
      await api.post('/absences', payload);
    }
    closePanel();
    await loadAbsences();
  } catch (err) {
    alert(`Enregistrement impossible : ${err.message}`);
  }
});

document.getElementById('btn-new-absence').addEventListener('click', openNewAbsence);
document.getElementById('btn-cancel').addEventListener('click', closePanel);
document.getElementById('panel-close').addEventListener('click', closePanel);
overlay.addEventListener('click', closePanel);

document.addEventListener('DOMContentLoaded', loadAbsences);
