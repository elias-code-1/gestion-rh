/**
 * dashboard.js
 * Charge des compteurs simples et les dernières demandes de congé.
 * S'appuie uniquement sur les routes GET /employes, /absences, /conges
 * (aucune route dédiée au dashboard n'est requise côté backend).
 */

async function loadDashboard() {
  await Promise.all([loadCounts(), loadRecentConges()]);
}

async function loadCounts() {
  try {
    const employes = await api.get('/employes');
    const actifs = (employes || []).filter((e) => (e.statut || 'actif') === 'actif');
    document.getElementById('stat-employes').textContent = actifs.length;
  } catch (err) {
    document.getElementById('stat-employes').textContent = '–';
  }

  try {
    const absences = await api.get('/absences');
    const now = new Date();
    const ceMois = (absences || []).filter((a) => {
      const d = new Date(a.date);
      return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
    });
    document.getElementById('stat-absences').textContent = ceMois.length;
  } catch (err) {
    document.getElementById('stat-absences').textContent = '–';
  }

  try {
    const conges = await api.get('/conges');
    const enAttente = (conges || []).filter((c) => c.statut === 'en_attente');
    document.getElementById('stat-conges').textContent = enAttente.length;
  } catch (err) {
    document.getElementById('stat-conges').textContent = '–';
  }
}

async function loadRecentConges() {
  const tbody = document.getElementById('dashboard-conges-body');
  try {
    const conges = await api.get('/conges');
    const recents = (conges || [])
      .slice()
      .sort((a, b) => new Date(b.dateDebut) - new Date(a.dateDebut))
      .slice(0, 6);

    if (recents.length === 0) {
      tbody.innerHTML = '<tr class="empty-row"><td colspan="4">Aucune demande de congé enregistrée.</td></tr>';
      return;
    }

    tbody.innerHTML = recents.map((c) => `
      <tr>
        <td class="cell-primary">${escapeHtml(c.employeNom || c.employeId || '—')}</td>
        <td>${escapeHtml(c.typeConge || '—')}</td>
        <td class="cell-muted">${formatDate(c.dateDebut)} → ${formatDate(c.dateFin)}</td>
        <td>${congeBadge(c.statut)}</td>
      </tr>
    `).join('');
  } catch (err) {
    tbody.innerHTML = `<tr class="empty-row"><td colspan="4">Backend non connecté — ${escapeHtml(err.message)}</td></tr>`;
  }
}

function congeBadge(statut) {
  if (statut === 'approuve') return '<span class="badge badge-green">Approuvé</span>';
  if (statut === 'refuse') return '<span class="badge badge-red">Refusé</span>';
  return '<span class="badge badge-amber">En attente</span>';
}

document.addEventListener('DOMContentLoaded', loadDashboard);
