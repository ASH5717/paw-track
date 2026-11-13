// PAW TRACK — Alerts & notifications center

import { Bell } from 'lucide-react';

export function NotificationsCenter({ notifications, onMarkAllRead }) {
  return (
    <div className="max-w-3xl mx-auto bg-white rounded-3xl p-6 sm:p-8 border border-[#A5B99A]/40 shadow-sm space-y-5">
      <div className="flex items-center justify-between border-b border-stone-100 pb-4">
        <div>
          <h2 className="text-xl font-extrabold text-[#26332B]">Alert & Notification Center</h2>
          <p className="text-xs text-[#5C6B62]">
            Automated disease surveillance alerts, vaccination reminders, and workflow updates.
          </p>
        </div>
        <button
          onClick={onMarkAllRead}
          className="px-3.5 py-2 rounded-xl bg-[#FAF8F1] hover:bg-[#E8EFE5] text-xs font-bold text-[#174D37]"
        >
          Mark All Read
        </button>
      </div>

      <div className="space-y-3">
        {notifications.map((n) => (
          <div
            key={n.id}
            className={`p-4 rounded-2xl border flex items-start justify-between gap-4 ${
              n.type === 'critical'
                ? 'bg-red-50/70 border-red-200'
                : n.unread
                ? 'bg-[#FAF8F1] border-[#174D37]/30'
                : 'bg-white border-stone-100'
            }`}
          >
            <div className="flex items-start gap-3">
              <div
                className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                  n.type === 'critical'
                    ? 'bg-red-100 text-red-700'
                    : n.type === 'warning'
                    ? 'bg-amber-100 text-amber-800'
                    : 'bg-[#174D37]/10 text-[#174D37]'
                }`}
              >
                <Bell className="w-4 h-4" />
              </div>
              <div>
                <p className="text-sm font-bold text-[#26332B]">{n.title}</p>
                <p className="text-xs text-[#5C6B62] mt-0.5">{n.message}</p>
                <span className="text-[10px] font-semibold text-[#5C6B62] mt-1 block">
                  {n.time}
                </span>
              </div>
            </div>
            {n.unread && <span className="w-2.5 h-2.5 rounded-full bg-[#174D37] shrink-0 mt-1.5" />}
          </div>
        ))}
      </div>
    </div>
  );
}

// 14. REPORTS & ANALYTICS DASHBOARD
