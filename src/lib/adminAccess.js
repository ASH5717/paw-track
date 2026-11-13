// PAW TRACK — Admin access allow-list.
// Admin privileges are locked to the owner account. The owner grants admin
// access to other addresses from Settings → Admin Access Control.
//
// With Supabase configured the list lives in the `admin_emails` table and is
// enforced by RLS (only the owner can grant/revoke). Without Supabase the app
// falls back to localStorage so demo mode keeps working.

import { supabase } from './supabase.js';

const STORAGE_KEY = 'pawtrack.admin.emails';

// The single account that owns the registry and can grant/revoke admin access
export const OWNER_EMAIL = 'akashhabib577@gmail.com';

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const normalizeEmail = (email) => String(email || '').trim().toLowerCase();

export const isOwner = (email) => normalizeEmail(email) === OWNER_EMAIL;

const readLocal = () => {
  try {
    const parsed = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    return Array.isArray(parsed) ? parsed.map(normalizeEmail).filter(Boolean) : [];
  } catch {
    return [];
  }
};

const writeLocal = (emails) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(emails));
  } catch {
    /* storage blocked — owner stays admin, extra grants last this session */
  }
};

// The owner is always included, so admin rights can never be fully revoked
const withOwner = (emails) => Array.from(new Set([OWNER_EMAIL, ...emails]));

export const getAdminEmails = async () => {
  if (!supabase) return withOwner(readLocal());

  const { data, error } = await supabase.from('admin_emails').select('email');
  // If the table is missing or unreadable, fall back to owner-only rather
  // than trusting a local list that the client could have tampered with.
  if (error || !Array.isArray(data)) return [OWNER_EMAIL];

  return withOwner(data.map((row) => normalizeEmail(row.email)));
};

export const isAdminEmail = async (email) => {
  const normalized = normalizeEmail(email);
  if (!normalized) return false;
  return (await getAdminEmails()).includes(normalized);
};

export const grantAdmin = async (email) => {
  const normalized = normalizeEmail(email);
  if (!EMAIL_PATTERN.test(normalized)) {
    return { ok: false, error: 'Enter a valid email address.' };
  }
  if ((await getAdminEmails()).includes(normalized)) {
    return { ok: false, error: `${normalized} already has admin access.` };
  }

  if (supabase) {
    const {
      data: { user }
    } = await supabase.auth.getUser();
    const { error } = await supabase
      .from('admin_emails')
      .insert({ email: normalized, granted_by: user?.id ?? null });
    if (error) return { ok: false, error: error.message };
    return { ok: true, email: normalized };
  }

  writeLocal(withOwner([...readLocal(), normalized]));
  return { ok: true, email: normalized };
};

export const revokeAdmin = async (email) => {
  const normalized = normalizeEmail(email);
  if (isOwner(normalized)) {
    return { ok: false, error: 'The owner account cannot be removed.' };
  }

  if (supabase) {
    const { error } = await supabase.from('admin_emails').delete().eq('email', normalized);
    if (error) return { ok: false, error: error.message };
    return { ok: true, email: normalized };
  }

  writeLocal(withOwner(readLocal()).filter((e) => e !== normalized));
  return { ok: true, email: normalized };
};
