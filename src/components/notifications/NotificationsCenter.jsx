// PAW TRACK — Alerts & notifications center

import { useState } from 'react';
import { Bell, X, CheckCheck, AlertTriangle, Info, Clock } from 'lucide-react';

const FILTERS = [
  { id: 'all', label: 'All' },
  { id: 'unread', label: 'Unread' },
  { id: 'critical', label: 'Critical' },
  { id: 'warning', label: 'Warning' },
  { id: 'info', label: 'Info' }
];

const typeStyles = {
  critical: {
    icon: AlertTriangle,
    row: 'bg-red-50/70 border-red-200',
    chip: 'bg-red-100 text-red-700'
  },
  warning: {
    icon: Clock,
    row: 'bg-amber-50/70 border-amber-200',
    chip: 'bg-amber-100 text-amber-800'
  },
  info: {
    icon: Info,
    row: 'bg-[#FAF8F1] border-[#174D37]/30',
    chip: 'bg-[#174D37]/10 text-[#174D37]'
  }
};

export function NotificationsCenter({ notifications, onMarkAllRead, onMarkRead, onDismiss, onSelectAnimal }) {
  const [filter, setFilter] = useState('all');

  const unreadCount = notifications.filter((n) => n.unread).length;

  const countFor = (id) => {
    if (id === 'all') return notifications.length;
    if (id === 'unread') return unreadCount;
    return notifications.filter((n) => n.type === id).length;
  };

  const visible = notifications.filter((n) => {
    if (filter === 'all') return true;
    if (filter === 'unread') return n.unread;
    return n.type === filter;
  });

  return (
    <div className="max-w-3xl mx-auto bg-white rounded-3xl p-6 sm:p-8 border border-[#A5B99A]/40 shadow-sm space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-stone-100 pb-4">
        <div>
          <h2 className="text-xl font-extrabold text-[#26332B]">Alert & Notification Center</h2>
          <p className="text-xs text-[#5C6B62]">
            Automated disease surveillance alerts, vaccination reminders, and workflow updates.
          </p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          {unreadCount > 0 && (
            <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-[#E8A64A]/20 text-[#8A5408]">
              {unreadCount} unread
            </span>
          )}
          <button
            onClick={onMarkAllRead}
            disabled={unreadCount === 0}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#FAF8F1] hover:bg-[#E8EFE5] text-xs font-bold text-[#174D37] disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <CheckCheck className="w-3.5 h-3.5" /> Mark All Read
          </button>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        {FILTERS.map((f) => (
          <button
            key={f.id}
            onClick={() => setFilter(f.id)}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold border transition-colors ${
              filter === f.id
                ? 'bg-[#174D37] text-white border-[#174D37]'
                : 'bg-[#FAF8F1] text-[#5C6B62] border-[#A5B99A]/40 hover:border-[#174D37]'
            }`}
          >
            {f.label}
            <span
              className={`px-1.5 rounded-full text-[10px] ${
                filter === f.id ? 'bg-white/20' : 'bg-stone-100'
              }`}
            >
              {countFor(f.id)}
            </span>
          </button>
        ))}
      </div>

      <div className="space-y-3">
        {visible.map((n) => {
          const style = typeStyles[n.type] || typeStyles.info;
          const Icon = style.icon;
          const linked = !!n.animal_id && !!onSelectAnimal;
          const handleClick = () => {
            if (linked) {
              if (n.unread) onMarkRead(n.id, false);
              onSelectAnimal(n.animal_id);
            } else {
              onMarkRead(n.id, !n.unread);
            }
          };
          return (
            <div
              key={n.id}
              onClick={handleClick}
              className={`p-4 rounded-2xl border flex items-start justify-between gap-4 cursor-pointer transition-all group ${
                n.unread ? style.row : 'bg-white border-stone-100'
              } ${linked ? 'hover:border-[#174D37] hover:shadow-sm' : ''}`}
              title={linked ? 'View animal profile' : n.unread ? 'Mark as read' : 'Mark as unread'}
            >
              <div className="flex items-start gap-3">
                <div
                  className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                    n.unread ? style.chip : 'bg-stone-100 text-[#5C6B62]'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-sm font-bold text-[#26332B]">{n.title}</p>
                  <p className="text-xs text-[#5C6B62] mt-0.5">{n.message}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-[10px] font-semibold text-[#5C6B62]">{n.time}</span>
                    {n.unread && (
                      <span className="text-[10px] font-bold text-[#174D37]">· New</span>
                    )}
                    {linked && (
                      <span className="text-[10px] font-bold text-[#174D37] opacity-0 group-hover:opacity-100 transition-opacity">
                        · View profile →
                      </span>
                    )}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                {n.unread && <span className="w-2.5 h-2.5 rounded-full bg-[#174D37] mt-1.5" />}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onDismiss(n.id);
                  }}
                  className="p-1.5 rounded-lg text-[#5C6B62] hover:bg-stone-100 hover:text-red-600 opacity-0 group-hover:opacity-100 focus:opacity-100 transition-opacity"
                  title="Dismiss"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
          );
        })}

        {visible.length === 0 && (
          <div className="py-12 text-center">
            <Bell className="w-9 h-9 text-[#A5B99A] mx-auto mb-3" />
            <p className="text-sm font-bold text-[#26332B]">You're all caught up</p>
            <p className="text-xs text-[#5C6B62] mt-1">
              No notifications in this view.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
