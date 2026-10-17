import {
  Employe,
  Absence,
  Conge,
  Formation,
  Entretien,
  NoteFrais,
  OnboardingItem,
  MaterielItem,
  TimeLog,
  PrimeItem,
  ObjectifItem,
  DocumentRH,
  DocumentGenere,
  ParametresRH,
  RUPItem,
  AlerteRH,
  StatsRH,
  AuditLog,
} from '../types';

const API_BASE_URL = '/api';

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const config: RequestInit = {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  };

  const response = await fetch(`${API_BASE_URL}${path}`, config);
  const text = await response.text();
  let data: any = null;
  if (text) {
    try {
      data = JSON.parse(text);
    } catch {
      data = text;
    }
  }

  if (!response.ok) {
    const errorMsg = (data && (data.error || data.message)) || `Erreur serveur (${response.status})`;
    throw new Error(errorMsg);
  }

  return data as T;
}

export const apiService = {
  // Employés
  getEmployes: () => request<Employe[]>('/employes'),
  createEmploye: (data: Omit<Employe, '_id'>) =>
    request<Employe>('/employes', { method: 'POST', body: JSON.stringify(data) }),
  updateEmploye: (id: string, data: Partial<Employe>) =>
    request<Employe>('/employes/' + id, { method: 'PUT', body: JSON.stringify(data) }),
  deleteEmploye: (id: string) =>
    request<{ acknowledged?: boolean }>('/employes/' + id, { method: 'DELETE' }),

  // Absences
  getAbsences: () => request<Absence[]>('/absences'),
  createAbsence: (data: Omit<Absence, '_id'>) =>
    request<Absence>('/absences', { method: 'POST', body: JSON.stringify(data) }),
  updateAbsence: (id: string, data: Partial<Absence>) =>
    request<Absence>('/absences/' + id, { method: 'PUT', body: JSON.stringify(data) }),
  deleteAbsence: (id: string) =>
    request<{ acknowledged?: boolean }>('/absences/' + id, { method: 'DELETE' }),

  // Congés
  getConges: () => request<Conge[]>('/conges'),
  createConge: (data: Omit<Conge, '_id'>) =>
    request<Conge>('/conges', { method: 'POST', body: JSON.stringify(data) }),
  updateConge: (id: string, data: Partial<Conge>) =>
    request<Conge>('/conges/' + id, { method: 'PUT', body: JSON.stringify(data) }),
  deleteConge: (id: string) =>
    request<{ acknowledged?: boolean }>('/conges/' + id, { method: 'DELETE' }),

  // Formations
  getFormations: () => request<Formation[]>('/formations'),
  createFormation: (data: Omit<Formation, '_id'>) =>
    request<Formation>('/formations', { method: 'POST', body: JSON.stringify(data) }),
  updateFormation: (id: string, data: Partial<Formation>) =>
    request<Formation>('/formations/' + id, { method: 'PUT', body: JSON.stringify(data) }),
  deleteFormation: (id: string) =>
    request<{ success?: boolean }>('/formations/' + id, { method: 'DELETE' }),

  // Entretiens
  getEntretiens: () => request<Entretien[]>('/entretiens'),
  createEntretien: (data: Omit<Entretien, '_id'>) =>
    request<Entretien>('/entretiens', { method: 'POST', body: JSON.stringify(data) }),
  updateEntretien: (id: string, data: Partial<Entretien>) =>
    request<Entretien>('/entretiens/' + id, { method: 'PUT', body: JSON.stringify(data) }),
  deleteEntretien: (id: string) =>
    request<{ success?: boolean }>('/entretiens/' + id, { method: 'DELETE' }),

  // Notes de frais
  getNotesFrais: () => request<NoteFrais[]>('/notes-frais'),
  createNoteFrais: (data: Omit<NoteFrais, '_id'>) =>
    request<NoteFrais>('/notes-frais', { method: 'POST', body: JSON.stringify(data) }),
  updateNoteFrais: (id: string, data: Partial<NoteFrais>) =>
    request<NoteFrais>('/notes-frais/' + id, { method: 'PUT', body: JSON.stringify(data) }),
  deleteNoteFrais: (id: string) =>
    request<{ success?: boolean }>('/notes-frais/' + id, { method: 'DELETE' }),

  // Onboarding / Offboarding
  getOnboardings: () => request<OnboardingItem[]>('/onboardings'),
  createOnboarding: (data: Omit<OnboardingItem, '_id'>) =>
    request<OnboardingItem>('/onboardings', { method: 'POST', body: JSON.stringify(data) }),
  updateOnboarding: (id: string, data: Partial<OnboardingItem>) =>
    request<OnboardingItem>('/onboardings/' + id, { method: 'PUT', body: JSON.stringify(data) }),
  deleteOnboarding: (id: string) =>
    request<{ success?: boolean }>('/onboardings/' + id, { method: 'DELETE' }),

  // Matériels
  getMateriels: () => request<MaterielItem[]>('/materiels'),
  createMateriel: (data: Omit<MaterielItem, '_id'>) =>
    request<MaterielItem>('/materiels', { method: 'POST', body: JSON.stringify(data) }),
  updateMateriel: (id: string, data: Partial<MaterielItem>) =>
    request<MaterielItem>('/materiels/' + id, { method: 'PUT', body: JSON.stringify(data) }),
  deleteMateriel: (id: string) =>
    request<{ success?: boolean }>('/materiels/' + id, { method: 'DELETE' }),

  // Feuilles de temps
  getTimeLogs: () => request<TimeLog[]>('/time-logs'),
  createTimeLog: (data: Omit<TimeLog, '_id'>) =>
    request<TimeLog>('/time-logs', { method: 'POST', body: JSON.stringify(data) }),
  updateTimeLog: (id: string, data: Partial<TimeLog>) =>
    request<TimeLog>('/time-logs/' + id, { method: 'PUT', body: JSON.stringify(data) }),
  deleteTimeLog: (id: string) =>
    request<{ success?: boolean }>('/time-logs/' + id, { method: 'DELETE' }),

  // Primes
  getPrimes: () => request<PrimeItem[]>('/primes'),
  createPrime: (data: Omit<PrimeItem, '_id'>) =>
    request<PrimeItem>('/primes', { method: 'POST', body: JSON.stringify(data) }),
  updatePrime: (id: string, data: Partial<PrimeItem>) =>
    request<PrimeItem>('/primes/' + id, { method: 'PUT', body: JSON.stringify(data) }),
  deletePrime: (id: string) =>
    request<{ success?: boolean }>('/primes/' + id, { method: 'DELETE' }),

  // Objectifs
  getObjectifs: () => request<ObjectifItem[]>('/objectifs'),
  createObjectif: (data: Omit<ObjectifItem, '_id'>) =>
    request<ObjectifItem>('/objectifs', { method: 'POST', body: JSON.stringify(data) }),
  updateObjectif: (id: string, data: Partial<ObjectifItem>) =>
    request<ObjectifItem>('/objectifs/' + id, { method: 'PUT', body: JSON.stringify(data) }),
  deleteObjectif: (id: string) =>
    request<{ success?: boolean }>('/objectifs/' + id, { method: 'DELETE' }),

  // Modèles de Documents & Attestations
  getDocuments: () => request<DocumentRH[]>('/documents'),
  createDocument: (data: Omit<DocumentRH, '_id'>) =>
    request<DocumentRH>('/documents', { method: 'POST', body: JSON.stringify(data) }),
  updateDocument: (id: string, data: Partial<DocumentRH>) =>
    request<DocumentRH>('/documents/' + id, { method: 'PUT', body: JSON.stringify(data) }),
  deleteDocument: (id: string) =>
    request<{ success?: boolean }>('/documents/' + id, { method: 'DELETE' }),
  genererDocument: (documentId: string, employeId: string) =>
    request<DocumentGenere>(`/documents/${documentId}/generer`, {
      method: 'POST',
      body: JSON.stringify({ employeId }),
    }),

  // Paramètres RH
  getParametres: () => request<ParametresRH>('/parametres'),
  updateParametres: (data: Partial<ParametresRH>) =>
    request<ParametresRH>('/parametres', { method: 'PUT', body: JSON.stringify(data) }),

  // Registre Unique du Personnel (RUP)
  getRUP: () => request<RUPItem[]>('/rup'),

  // Alertes RH calculées
  getAlertes: () => request<AlerteRH[]>('/alertes'),

  // Statistiques globales RH
  getStats: () => request<StatsRH>('/stats'),

  // Audit Logs
  getAuditLogs: () => request<AuditLog[]>('/audit-logs'),
};

export function formatDate(dateString?: string): string {
  if (!dateString) return '—';
  const d = new Date(dateString);
  if (isNaN(d.getTime())) return dateString;
  return d.toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
}

export function formatDateTime(dateString?: string): string {
  if (!dateString) return '—';
  const d = new Date(dateString);
  if (isNaN(d.getTime())) return dateString;
  return d.toLocaleString('fr-FR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(amount);
}

export function calculateWorkingDays(startDateStr: string, endDateStr: string): number {
  const start = new Date(startDateStr);
  const end = new Date(endDateStr);
  if (isNaN(start.getTime()) || isNaN(end.getTime()) || end < start) return 0;

  let days = 0;
  const cur = new Date(start);
  while (cur <= end) {
    const dayOfWeek = cur.getDay();
    if (dayOfWeek !== 0 && dayOfWeek !== 6) {
      days++;
    }
    cur.setDate(cur.getDate() + 1);
  }
  return Math.max(1, days);
}

export function downloadCsv(filename: string, rows: string[][]): void {
  const processRow = (row: string[]) =>
    row.map((val) => `"${(val || '').replace(/"/g, '""')}"`).join(';');
  const csvContent = '\uFEFF' + rows.map(processRow).join('\r\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.setAttribute('href', url);
  a.setAttribute('download', filename);
  a.click();
  URL.revokeObjectURL(url);
}
