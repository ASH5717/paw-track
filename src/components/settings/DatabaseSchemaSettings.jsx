// PAW TRACK — Backend schema & security settings

import { SUPABASE_SCHEMA_SQL } from '../../constants/supabaseSchema.js';

export function DatabaseSchemaSettings({ currentUser, notify }) {
  const copySQL = () => {
    const el = document.createElement('textarea');
    el.value = SUPABASE_SCHEMA_SQL;
    document.body.appendChild(el);
    el.select();
    document.execCommand('copy');
    document.body.removeChild(el);
    notify('SQL Schema Copied', 'PostgreSQL + Supabase RLS policies copied to clipboard.');
  };

  return (
    <div className="space-y-6">
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
