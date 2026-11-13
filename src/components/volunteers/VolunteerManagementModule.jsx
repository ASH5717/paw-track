// PAW TRACK — Volunteer directory: how many volunteers there are, and remove them

import { useState } from 'react';
import { Users, Search, Trash2, Mail, Phone, MapPin, ShieldCheck, UserMinus } from 'lucide-react';

export function VolunteerManagementModule({ volunteers, onRemoveVolunteer }) {
  const [query, setQuery] = useState('');
  const [confirmId, setConfirmId] = useState(null);

  const filtered = volunteers.filter((v) => {
    const q = query.trim().toLowerCase();
    if (!q) return true;
    return (
      v.name.toLowerCase().includes(q) ||
      v.email.toLowerCase().includes(q) ||
      v.zone.toLowerCase().includes(q)
    );
  });

  const activeCount = volunteers.filter((v) => v.status === 'Active').length;
  const inactiveCount = volunteers.length - activeCount;

  return (
    <div className="bg-white rounded-3xl p-6 border border-[#A5B99A]/40 shadow-sm space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-100 pb-4">
        <div>
          <h2 className="text-xl font-extrabold text-[#26332B] flex items-center gap-2">
            <Users className="w-5 h-5 text-[#174D37]" />
            Volunteer Directory
          </h2>
          <p className="text-xs text-[#5C6B62] mt-0.5">
            Registered community volunteers. Remove a volunteer to revoke their access.
          </p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <span className="px-3 py-1.5 rounded-xl text-xs font-bold bg-[#174D37]/10 text-[#174D37]">
            Total: {volunteers.length}
          </span>
          <span className="px-3 py-1.5 rounded-xl text-xs font-bold bg-emerald-100 text-emerald-800">
            Active: {activeCount}
          </span>
          {inactiveCount > 0 && (
            <span className="px-3 py-1.5 rounded-xl text-xs font-bold bg-stone-100 text-[#5C6B62]">
              Inactive: {inactiveCount}
            </span>
          )}
        </div>
      </div>

      <div className="relative">
        <Search className="w-4 h-4 text-[#5C6B62] absolute left-3.5 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search by name, email or zone..."
          className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#FAF8F1] border border-[#A5B99A]/50 text-sm"
        />
      </div>

      <div className="space-y-3">
        {filtered.map((v) => {
          const confirming = confirmId === v.id;
          return (
            <div
              key={v.id}
              className="p-4 rounded-2xl border border-[#A5B99A]/40 bg-[#FAF8F1]/60 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
            >
              <div className="flex items-start gap-3 min-w-0">
                <div className="w-11 h-11 rounded-2xl bg-[#174D37] text-white flex items-center justify-center font-extrabold shrink-0">
                  {v.name.charAt(0)}
                </div>
                <div className="min-w-0 space-y-1">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-bold text-[#26332B] truncate">{v.name}</p>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        v.status === 'Active'
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-stone-200 text-stone-600'
                      }`}
                    >
                      {v.status}
                    </span>
                  </div>
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-0.5 text-[11px] text-[#5C6B62]">
                    <span className="inline-flex items-center gap-1">
                      <Mail className="w-3 h-3" /> {v.email}
                    </span>
                    <span className="inline-flex items-center gap-1">
                      <Phone className="w-3 h-3" /> {v.phone}
                    </span>
                    <span className="inline-flex items-center gap-1">
                      <MapPin className="w-3 h-3" /> {v.zone}
                    </span>
                    <span className="inline-flex items-center gap-1">
                      <ShieldCheck className="w-3 h-3" /> {v.submissions} submissions
                    </span>
                  </div>
                </div>
              </div>

              {confirming ? (
                <div className="flex items-center gap-2 shrink-0">
                  <span className="text-xs font-bold text-red-700">Remove {v.name.split(' ')[0]}?</span>
                  <button
                    onClick={() => {
                      onRemoveVolunteer(v.id);
                      setConfirmId(null);
                    }}
                    className="px-3 py-2 rounded-xl bg-red-600 text-white text-xs font-bold hover:bg-red-700"
                  >
                    Confirm
                  </button>
                  <button
                    onClick={() => setConfirmId(null)}
                    className="px-3 py-2 rounded-xl bg-white border border-[#A5B99A]/50 text-[#5C6B62] text-xs font-bold"
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setConfirmId(v.id)}
                  className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl bg-red-50 text-red-700 text-xs font-bold hover:bg-red-100 shrink-0"
                >
                  <UserMinus className="w-3.5 h-3.5" /> Remove
                </button>
              )}
            </div>
          );
        })}

        {filtered.length === 0 && (
          <div className="py-12 text-center">
            <Trash2 className="w-9 h-9 text-[#A5B99A] mx-auto mb-3" />
            <p className="text-sm font-bold text-[#26332B]">No volunteers found</p>
            <p className="text-xs text-[#5C6B62] mt-1">Try a different search term.</p>
          </div>
        )}
      </div>
    </div>
  );
}
