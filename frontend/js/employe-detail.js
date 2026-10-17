const TYPE_LABELS = {
  paye: 'Congé payé',
  maladie: 'Congé maladie',
  exceptionnel: 'Congé exceptionnel',
  sans_solde: 'Sans solde',
};

function getEmployeId() {
  const params = new URLSearchParams(window.location.search);
  return params.get('id');
}

function statutBadgeConge(statut) {
  if (statut === 'approuve') return '<span class="badge badge-green">Approuvé</span>';
  if (statut === 'refuse') return '<span class="badge badge-red">Refusé</span>';
  return '<span class="badge badge-amber">En attente</span>';
}

function renderInfo(e) {
  document.getElementById('fiche-nom').textContent = `${e.prenom || ''} ${e.nom || ''}`.trim() || 'Employé';
  document.getElementById('fiche-poste').textContent = [e.poste, e.departement].filter(Boolean).join(' — ');

  const items = [
    ['Email', e.email || '—'],
    ['Téléphone', e.telephone || '—'],
    ['Poste', e.poste || '—'],
    ['Département', e.departement || '—'],
    ["Date d'embauche", formatDate(e.dateEmbauche)],
    ['Statut', e.statut === 'inactif'
      ? '<span class="badge badge-muted">Inactif</span>'
      : '<span class="badge badge-green">Actif</span>'],
  ];

  document.getElementById('fiche-info-grid').innerHTML = items.map(([label, value]) => `
    <div class="fiche-info-item">
      <div class="fiche-info-label">${escapeHtml(label)}</div>
      <div class="fiche-info-value">${value}</div>
    </div>
  `).join('');
}

function renderAbsences(absences) {
  const tbody = document.getElementById('fiche-absences-body');
  if (!absences || absences.length === 0) {
    tbody.innerHTML = '<tr class="empty-row"><td colspan="4">Aucune absence enregistrée pour cet employé.</td></tr>';
    return;
  }
  const sorted = absences.slice().sort((a, b) => new Date(b.date) - new Date(a.date));
  tbody.innerHTML = sorted.map((a) => `
    <tr>
      <td class="cell-primary">${formatDate(a.date)}</td>
      <td>${escapeHtml(a.motif || '—')}</td>
      <td>${a.justifiee ? '<span class="badge badge-green">Oui</span>' : '<span class="badge badge-red">Non</span>'}</td>
      <td class="cell-muted">${escapeHtml(a.commentaire || '—')}</td>
    </tr>
  `).join('');
}

function renderConges(conges) {
  const tbody = document.getElementById('fiche-conges-body');
  if (!conges || conges.length === 0) {
    tbody.innerHTML = '<tr class="empty-row"><td colspan="4">Aucun congé enregistré pour cet employé.</td></tr>';
    return;
  }
  const sorted = conges.slice().sort((a, b) => new Date(b.dateDebut) - new Date(a.dateDebut));
  tbody.innerHTML = sorted.map((c) => `
    <tr>
      <td class="cell-primary">${escapeHtml(TYPE_LABELS[c.typeConge] || c.typeConge || '—')}</td>
      <td class="cell-muted">${formatDate(c.dateDebut)} → ${formatDate(c.dateFin)}</td>
      <td>${statutBadgeConge(c.statut)}</td>
      <td class="cell-muted">${escapeHtml(c.commentaire || '—')}</td>
    </tr>
  `).join('');
}

async function loadFiche() {
  const id = getEmployeId();
  if (!id) {
    document.getElementById('fiche-nom').textContent = 'Employé introuvable';
    document.getElementById('fiche-poste').textContent = 'Aucun identifiant fourni dans l\'URL.';
    return;
  }

  try {
    const employe = await api.get(`/employes/${id}`);
    renderInfo(employe);
  } catch (err) {
    document.getElementById('fiche-nom').textContent = 'Employé introuvable';
    document.getElementById('fiche-poste').textContent = err.message;
    document.getElementById('fiche-info-grid').innerHTML = '';
  }

  try {
    const absences = await api.get(`/absences?employeId=${id}`);
    renderAbsences((absences || []).filter((a) => (a.employeId?._id || a.employeId) == id));
  } catch (err) {
    document.getElementById('fiche-absences-body').innerHTML =
      `<tr class="empty-row"><td colspan="4">Backend non connecté — ${escapeHtml(err.message)}</td></tr>`;
  }

  try {
    const conges = await api.get(`/conges?employeId=${id}`);
    renderConges((conges || []).filter((c) => (c.employeId?._id || c.employeId) == id));
  } catch (err) {
    document.getElementById('fiche-conges-body').innerHTML =
      `<tr class="empty-row"><td colspan="4">Backend non connecté — ${escapeHtml(err.message)}</td></tr>`;
  }
}

document.addEventListener('DOMContentLoaded', loadFiche);