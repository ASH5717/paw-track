// PAW TRACK — FastAPI Client
// Provides high-level asynchronous methods to communicate with the FastAPI backend.

const API_BASE = import.meta.env.VITE_API_URL || '/api';

const getAuthHeaders = () => {
  const token = localStorage.getItem('pawtrack.token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {})
  };
};

const handleResponse = async (res) => {
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({ detail: res.statusText }));
    throw new Error(errorData.detail || errorData.message || 'API request failed');
  }
  if (res.status === 204) return null;
  return res.json();
};

export const api = {
  // General & Health
  health: () => fetch(`${API_BASE}/health`).then(handleResponse),

  // Authentication
  auth: {
    login: (email, password) =>
      fetch(`${API_BASE}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      })
        .then(handleResponse)
        .then((data) => {
          if (data.access_token) localStorage.setItem('pawtrack.token', data.access_token);
          return data;
        }),

    register: (userData) =>
      fetch(`${API_BASE}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData)
      })
        .then(handleResponse)
        .then((data) => {
          if (data.access_token) localStorage.setItem('pawtrack.token', data.access_token);
          return data;
        }),

    demoLogin: (role, customName, customEmail) =>
      fetch(`${API_BASE}/auth/demo-login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role, custom_name: customName, custom_email: customEmail })
      })
        .then(handleResponse)
        .then((data) => {
          if (data.access_token) localStorage.setItem('pawtrack.token', data.access_token);
          return data;
        }),

    me: () =>
      fetch(`${API_BASE}/auth/me`, {
        headers: getAuthHeaders()
      }).then(handleResponse),

    logout: () => {
      localStorage.removeItem('pawtrack.token');
      return fetch(`${API_BASE}/auth/logout`, {
        method: 'POST',
        headers: getAuthHeaders()
      }).then(handleResponse);
    }
  },

  // Animals Registry
  animals: {
    list: (params = {}) => {
      const url = new URL(`${API_BASE}/animals`, window.location.origin);
      Object.entries(params).forEach(([k, v]) => {
        if (v && v !== 'All') url.searchParams.append(k, v);
      });
      return fetch(url.toString(), { headers: getAuthHeaders() }).then(handleResponse);
    },

    get: (id) =>
      fetch(`${API_BASE}/animals/${id}`, { headers: getAuthHeaders() }).then(handleResponse),

    create: (data) =>
      fetch(`${API_BASE}/animals`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(data)
      }).then(handleResponse),

    update: (id, patch) =>
      fetch(`${API_BASE}/animals/${id}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(patch)
      }).then(handleResponse),

    delete: (id) =>
      fetch(`${API_BASE}/animals/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders()
      }).then(handleResponse),

    addMedical: (id, record) =>
      fetch(`${API_BASE}/animals/${id}/medical`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(record)
      }).then(handleResponse),

    addVaccination: (id, vax) =>
      fetch(`${API_BASE}/animals/${id}/vaccination`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(vax)
      }).then(handleResponse),

    addBehaviour: (id, log) =>
      fetch(`${API_BASE}/animals/${id}/behaviour`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(log)
      }).then(handleResponse),

    addFeeding: (id, entry) =>
      fetch(`${API_BASE}/animals/${id}/feeding`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(entry)
      }).then(handleResponse),

    rate: (id, score) =>
      fetch(`${API_BASE}/animals/${id}/ratings`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({ score })
      }).then(handleResponse)
  },

  // Adoptions
  adoptions: {
    list: () => fetch(`${API_BASE}/adoptions`, { headers: getAuthHeaders() }).then(handleResponse),

    submit: (data) =>
      fetch(`${API_BASE}/adoptions`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(data)
      }).then(handleResponse),

    review: (id, status) =>
      fetch(`${API_BASE}/adoptions/${id}/decision`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify({ status })
      }).then(handleResponse)
  },

  // Volunteers
  volunteers: {
    list: () => fetch(`${API_BASE}/volunteers`, { headers: getAuthHeaders() }).then(handleResponse),

    add: (data) =>
      fetch(`${API_BASE}/volunteers`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(data)
      }).then(handleResponse),

    remove: (id) =>
      fetch(`${API_BASE}/volunteers/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders()
      }).then(handleResponse)
  },

  // Volunteer Incident Reports
  volunteerReports: {
    list: () =>
      fetch(`${API_BASE}/volunteer-reports`, { headers: getAuthHeaders() }).then(handleResponse),

    submit: (data) =>
      fetch(`${API_BASE}/volunteer-reports`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(data)
      }).then(handleResponse),

    review: (id, status) =>
      fetch(`${API_BASE}/volunteer-reports/${id}/decision`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify({ status })
      }).then(handleResponse)
  },

  // Feeding Groups
  groups: {
    list: () => fetch(`${API_BASE}/groups`, { headers: getAuthHeaders() }).then(handleResponse),

    create: (data) =>
      fetch(`${API_BASE}/groups`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(data)
      }).then(handleResponse),

    update: (id, patch) =>
      fetch(`${API_BASE}/groups/${id}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(patch)
      }).then(handleResponse),

    delete: (id) =>
      fetch(`${API_BASE}/groups/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders()
      }).then(handleResponse),

    feed: (id, payload) =>
      fetch(`${API_BASE}/groups/${id}/feed`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(payload)
      }).then(handleResponse)
  },

  // Notifications
  notifications: {
    list: () =>
      fetch(`${API_BASE}/notifications`, { headers: getAuthHeaders() }).then(handleResponse),

    markAllRead: () =>
      fetch(`${API_BASE}/notifications/read-all`, {
        method: 'PUT',
        headers: getAuthHeaders()
      }).then(handleResponse),

    markRead: (id, unread) =>
      fetch(`${API_BASE}/notifications/${id}/read?unread=${unread}`, {
        method: 'PUT',
        headers: getAuthHeaders()
      }).then(handleResponse),

    dismiss: (id) =>
      fetch(`${API_BASE}/notifications/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders()
      }).then(handleResponse)
  },

  // Analytics & Exports
  analytics: {
    dashboard: () =>
      fetch(`${API_BASE}/analytics/dashboard`, { headers: getAuthHeaders() }).then(handleResponse),

    monthly: () =>
      fetch(`${API_BASE}/analytics/monthly`, { headers: getAuthHeaders() }).then(handleResponse),

    exportCsvUrl: () => `${API_BASE}/analytics/export-csv`
  },

  // Admin Access Control
  admin: {
    listEmails: () =>
      fetch(`${API_BASE}/admin/emails`, { headers: getAuthHeaders() }).then(handleResponse),

    grant: (email) =>
      fetch(`${API_BASE}/admin/emails`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({ email })
      }).then(handleResponse),

    revoke: (email) =>
      fetch(`${API_BASE}/admin/emails/${encodeURIComponent(email)}`, {
        method: 'DELETE',
        headers: getAuthHeaders()
      }).then(handleResponse)
  }
};
