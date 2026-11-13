// PAW TRACK — Backend schema & security settings

import { useEffect, useState } from 'react';
import { Shield, UserPlus, Trash2 } from 'lucide-react';
import { SUPABASE_SCHEMA_SQL } from '../../constants/supabaseSchema.js';
import {
  getAdminEmails,
  grantAdmin,
  revokeAdmin,
  isOwner
} from '../../lib/adminAccess.js';

export function DatabaseSchemaSettings({ currentUser, notify }) {
  const [adminEmails, setAdminEmails] = useState([]);
  const [newAdminEmail, setNewAdminEmail] = useState('');
  const [saving, setSaving] = useState(false);
  const ownerViewing = isOwner(currentUser?.email);

  useEffect(() => {
    if (!ownerViewing) return undefined;
    let active = true;
    getAdminEmails().then((list) => {
      if (active) setAdminEmails(list);
    });
    return () => {
      active = false;
    };
  }, [ownerViewing]);

  const copySQL = () => {
    const el = document.createElement('textarea');
    el.value = SUPABASE_SCHEMA_SQL;
    document.body.appendChild(el);
    el.select();
    document.execCommand('copy');
    document.body.removeChild(el);
    notify('SQL Schema Copied', 'PostgreSQL + Supabase RLS policies copied to clipboard.');
  };

  const handleGrant = async (e) => {
    e.preventDefault();
    setSaving(true);
    const result = await grantAdmin(newAdminEmail);
    setSaving(false);
    if (!result.ok) {
      notify('Cannot Grant Access', result.error);
      return;
    }
    setAdminEmails(await getAdminEmails());
    setNewAdminEmail('');
    notify('Admin Access Granted', `${result.email} now has admin privileges on next sign-in.`);
  };

  const handleRevoke = async (email) => {
    setSaving(true);
    const result = await revokeAdmin(email);
    setSaving(false);
    if (!result.ok) {
      notify('Cannot Revoke Access', result.error);
      return;
    }
    setAdminEmails(await getAdminEmails());
    notify('Admin Access Revoked', `${result.email} can no longer sign in as admin.`);
  };

  return (
    <div className="space-y-6">
      {ownerViewing && (
        <div className="bg-white rounded-3xl p-6 border border-[#A5B99A]/40">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#174D37] text-white flex items-center justify-center shrink-0">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-extrabold text-[#26332B]">Admin Access Control</h2>
              <p className="text-xs text-[#5C6B62] mt-1">
                Admin privileges are locked to the owner account. Grant access to additional email
                addresses below — they receive admin rights the next time they sign in.
              </p>
            </div>
          </div>

          <form onSubmit={handleGrant} className="mt-5 flex flex-col sm:flex-row gap-3">
            <input
              type="email"
              value={newAdminEmail}
              onChange={(e) => setNewAdminEmail(e.target.value)}
              placeholder="colleague@example.com"
              className="flex-1 px-4 py-2.5 rounded-xl bg-[#FAF8F1] border border-[#A5B99A]/50 text-sm focus:outline-none focus:border-[#174D37]"
            />
            <button
              type="submit"
              disabled={saving}
              className="px-4 py-2.5 rounded-xl bg-[#174D37] text-white text-xs font-bold hover:bg-[#226B4D] inline-flex items-center justify-center gap-2 shrink-0 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              <UserPlus className="w-4 h-4" />
              Grant Admin Access
            </button>
          </form>

          <ul className="mt-5 divide-y divide-stone-100 border-t border-stone-100">
            {adminEmails.map((email) => (
              <li key={email} className="py-3 flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-[#26332B] truncate">{email}</p>
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#174D37]">
                    {isOwner(email) ? 'Owner · Permanent' : 'Admin'}
                  </span>
                </div>
                {!isOwner(email) && (
                  <button
                    onClick={() => handleRevoke(email)}
                    disabled={saving}
                    className="px-3 py-1.5 rounded-lg text-[11px] font-bold text-red-700 bg-red-50 border border-red-200 hover:bg-red-100 inline-flex items-center gap-1.5 shrink-0 disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    Remove
                  </button>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="bg-white rounded-3xl p-6 border border-[#A5B99A]/40 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-extrabold text-[#26332B]">
            Backend Architecture, PostgreSQL Schema & Row-Level Security
          </h2>
          <p className="text-xs text-[#5C6B62] mt-1">
            Production database schema with foreign keys, role-based RLS policies, and audit trails.
          </p>
        </div>
        <button
          onClick={copySQL}
          className="px-4 py-2.5 rounded-xl bg-[#174D37] text-white text-xs font-bold hover:bg-[#226B4D] shrink-0"
        >
          Copy Supabase SQL Migration
        </button>
      </div>

      <div className="bg-[#26332B] text-[#FAF8F1] rounded-3xl p-6 overflow-x-auto">
        <pre className="text-xs font-mono leading-relaxed text-emerald-200">
          {SUPABASE_SCHEMA_SQL}
        </pre>
      </div>
    </div>
  );
}

// 11. DETAILED ANIMAL PROFILE MODAL (5 TABS + QR CODE + ROLE-BASED ACCESS)
