/**
 * api.js
 * -----------------------------------------------------------------------
 * Petit client HTTP partagé par toutes les pages.
 * Le backend (Node.js / Express / MongoDB via Mongoose) n'existe pas encore :
 * change simplement API_BASE_URL une fois qu'il tourne (ex: http://localhost:5000/api).
 *
 * Routes REST attendues côté backend (à adapter si besoin) :
 *
 *   Employés
 *     GET    /employes            -> liste des employés
 *     POST   /employes            -> créer un employé
 *     PUT    /employes/:id        -> modifier un employé
 *     DELETE /employes/:id        -> supprimer un employé
 *
 *   Absences
 *     GET    /absences            -> liste des absences (avec employeNom si possible)
 *     POST   /absences
 *     PUT    /absences/:id
 *     DELETE /absences/:id
 *
 *   Congés
 *     GET    /conges
 *     POST   /conges
 *     PUT    /conges/:id
 *     DELETE /conges/:id
 *
 * Champs suggérés : voir les commentaires en tête de chaque fichier JS de page.
 * -----------------------------------------------------------------------
 */

const API_BASE_URL = 'http://localhost:5000/api';

/**
 * Effectue une requête HTTP vers l'API et retourne le JSON parsé.
 * Lève une erreur avec un message lisible en cas d'échec.
 */
async function apiRequest(path, { method = 'GET', body } = {}) {
  const options = {
    method,
    headers: { 'Content-Type': 'application/json' },
  };
  if (body !== undefined) {
    options.body = JSON.stringify(body);
  }

  let response;
  try {
    response = await fetch(`${API_BASE_URL}${path}`, options);
  } catch (networkError) {
    throw new Error(
      `Impossible de joindre le serveur (${API_BASE_URL}). Le backend est-il lancé ?`
    );
  }

  let data = null;
  const text = await response.text();
  if (text) {
    try {
      data = JSON.parse(text);
    } catch {
      data = null;
    }
  }

  if (!response.ok) {
    const message = (data && (data.message || data.error)) || `Erreur ${response.status}`;
    throw new Error(message);
  }

  return data;
}

const api = {
  get: (path) => apiRequest(path, { method: 'GET' }),
  post: (path, body) => apiRequest(path, { method: 'POST', body }),
  put: (path, body) => apiRequest(path, { method: 'PUT', body }),
  delete: (path) => apiRequest(path, { method: 'DELETE' }),
};

/** Formate une date ISO (ou string) en jj/mm/aaaa pour l'affichage. */
function formatDate(value) {
  if (!value) return '—';
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return value;
  return d.toLocaleDateString('fr-FR');
}

/** Échappe du texte avant insertion dans le HTML (évite les injections basiques). */
function escapeHtml(str) {
  if (str === null || str === undefined) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}
