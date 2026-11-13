// PAW TRACK — Shared status pill

import { CheckCircle2, AlertTriangle, Clock } from 'lucide-react';

export function StatusBadge({ type, value }) {
  const styles = {
    // Health
    'Healthy': 'bg-emerald-50 text-emerald-800 border-emerald-200',
    'Under Treatment': 'bg-amber-50 text-amber-800 border-amber-200',
    'Critical Attention': 'bg-red-50 text-red-700 border-red-200 animate-pulse',
    'Recovering': 'bg-sky-50 text-sky-800 border-sky-200',
    // Vaccination
    'Vaccinated': 'bg-[#174D37]/10 text-[#174D37] border-[#174D37]/20',
    'Partially Vaccinated': 'bg-amber-50 text-amber-800 border-amber-200',
    'Not Vaccinated': 'bg-slate-100 text-slate-700 border-slate-200',
    'Overdue': 'bg-red-50 text-red-700 border-red-200',
    'Verification Required': 'bg-purple-50 text-purple-800 border-purple-200',
    // Behaviour
    'Friendly': 'bg-emerald-50 text-emerald-700 border-emerald-200',
    'Calm': 'bg-teal-50 text-teal-700 border-teal-200',
    'Shy': 'bg-indigo-50 text-indigo-700 border-indigo-200',
    'Fearful': 'bg-amber-50 text-amber-800 border-amber-200',
    'Aggressive': 'bg-rose-50 text-rose-800 border-rose-200',
    'Unknown': 'bg-gray-100 text-gray-700 border-gray-200',
    // Adoption
    'Available for Adoption': 'bg-[#E8A64A]/20 text-[#8A5408] border-[#E8A64A]/40',
    'Pending Adoption': 'bg-blue-50 text-blue-800 border-blue-200',
    'Adopted': 'bg-emerald-100 text-emerald-900 border-emerald-300',
    'Under Medical Treatment': 'bg-orange-50 text-orange-800 border-orange-200',
    'Not Available': 'bg-stone-100 text-stone-600 border-stone-200',
  };

  return (
    <span
      className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold border ${
        styles[value] || 'bg-stone-100 text-stone-700 border-stone-200'
      }`}
    >
      {value === 'Critical Attention' && <AlertTriangle className="w-3 h-3" />}
      {value === 'Overdue' && <Clock className="w-3 h-3" />}
      {value === 'Vaccinated' && <CheckCircle2 className="w-3 h-3" />}
      {value}
    </span>
  );
}

// MAIN APPLICATION COMPONENT
