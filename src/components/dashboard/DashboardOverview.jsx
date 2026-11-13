// PAW TRACK — Role-aware dashboard overview

import { Heart, Activity, Syringe, Search, AlertTriangle, Stethoscope, PawPrint } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { ANALYTICS_MONTHLY } from '../../data/analytics.js';
import { StatusBadge } from '../common/StatusBadge.jsx';

export function DashboardOverview({
  role,
  stats,
  animals,
  adoptions,
  volunteerReports,
  activityLogs,
  onSelectAnimal,
  onNavigateTab,
  onOpenAdoptModal
}) {
  const criticalAnimals = animals.filter((a) =>
    ['Critical Attention', 'Under Treatment'].includes(a.health_status)
  );
  const overdueAnimals = animals.filter((a) =>
    ['Overdue', 'Partially Vaccinated', 'Not Vaccinated'].includes(a.vaccination_status)
  );

  // PUBLIC USER DASHBOARD
  if (role === 'user') {
    const adoptable = animals.filter((a) => a.adoption_status === 'Available for Adoption');
    return (
      <div className="space-y-8">
        <div className="rounded-3xl bg-[#174D37] text-white p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-xl">
            <span className="text-xs font-bold uppercase tracking-wider text-[#E8A64A]">
              Community Member Portal
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold">
              Protect Neighborhood Animals & Find Your Companion
            </h2>
            <p className="text-sm text-[#FAF8F1]/80">
              Verify vaccination status of street dogs in your area, submit adoption requests, or
              alert rescue teams to injured animals.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => onNavigateTab('animals')}
              className="px-5 py-3 rounded-xl bg-[#E8A64A] text-[#26332B] font-bold text-sm"
            >
              Search by Animal ID
            </button>
            <button
              onClick={() => onNavigateTab('volunteers')}
              className="px-5 py-3 rounded-xl bg-white/15 hover:bg-white/25 text-white font-bold text-sm"
            >
              Report Injured Stray
            </button>
          </div>
        </div>

        <div>
          <h3 className="text-xl font-extrabold text-[#26332B] mb-4">
            Featured Animals Available for Adoption
          </h3>
          <div className="grid md:grid-cols-3 gap-6">
            {adoptable.map((a) => (
              <div
                key={a.id}
                className="bg-white rounded-3xl overflow-hidden border border-[#A5B99A]/40 shadow-sm"
              >
                <img src={a.photos[0]} alt={a.name} className="w-full h-52 object-cover" />
                <div className="p-5 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-bold text-[#174D37]">{a.animal_code}</span>
                    <StatusBadge value={a.behaviour_status} />
                  </div>
                  <h4 className="text-lg font-extrabold text-[#26332B]">{a.name}</h4>
                  <p className="text-xs text-[#5C6B62]">{a.location_name}</p>
                  <div className="flex gap-2 pt-2">
                    <button
                      onClick={() => onSelectAnimal(a.id)}
                      className="flex-1 py-2 rounded-xl text-xs font-bold bg-[#FAF8F1] text-[#174D37] border border-[#A5B99A]/40"
                    >
                      View Profile
                    </button>
                    <button
                      onClick={() => onOpenAdoptModal(a)}
                      className="flex-1 py-2 rounded-xl text-xs font-bold bg-[#174D37] text-white"
                    >
                      Apply to Adopt
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // ADMIN & VOLUNTEER DASHBOARD
  return (
    <div className="space-y-8">
      {/* KPI CARDS */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        {[
          { label: 'Total Registered Animals', value: stats.total, icon: PawPrint, bg: '#174D37', text: '#FFFFFF' },
          { label: 'Vaccinated & Verified', value: stats.vaccinated, icon: Syringe, bg: '#FFFFFF', text: '#26332B' },
          { label: 'Requiring Medical Care', value: stats.medicalAttention, icon: Stethoscope, bg: '#FFFFFF', text: '#DC2626' },
          { label: 'Available for Adoption', value: stats.availableAdoption, icon: Heart, bg: '#FFFFFF', text: '#174D37' }
        ].map((kpi, i) => (
          <div
            key={i}
            style={{ backgroundColor: kpi.bg, color: kpi.text }}
            className="rounded-3xl p-6 border border-[#A5B99A]/40 shadow-sm flex flex-col justify-between"
          >
            <div className="flex items-center justify-between mb-4">
              <div
                className={`w-10 h-10 rounded-2xl flex items-center justify-center ${
                  i === 0 ? 'bg-white/15 text-[#E8A64A]' : 'bg-[#FAF8F1] text-[#174D37]'
                }`}
              >
                <kpi.icon className="w-5 h-5" />
              </div>
              {i === 2 && stats.medicalAttention > 0 && (
                <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-red-100 text-red-700">
                  Attention
                </span>
              )}
            </div>
            <div>
              <p className="text-3xl font-extrabold">{kpi.value}</p>
              <p className={`text-xs font-semibold mt-1 ${i === 0 ? 'text-white/80' : 'text-[#5C6B62]'}`}>
                {kpi.label}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* CRITICAL MEDICAL ALERTS & VACCINATION REMINDERS */}
      <div className="grid lg:grid-cols-12 gap-6">
        <div className="lg:col-span-7 bg-white rounded-3xl p-6 border border-[#A5B99A]/40 shadow-sm">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3 className="text-base font-extrabold text-[#26332B]">
                Vaccination Coverage & Registration Growth
              </h3>
              <p className="text-xs text-[#5C6B62]">6-Month Community Surveillance Trend</p>
            </div>
            <button
              onClick={() => onNavigateTab('reports')}
              className="text-xs font-bold text-[#174D37] hover:underline"
            >
              Full Analytics →
            </button>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={ANALYTICS_MONTHLY}>
                <defs>
                  <linearGradient id="colorReg" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#174D37" stopOpacity={0.25} />
                    <stop offset="95%" stopColor="#174D37" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorVax" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#E8A64A" stopOpacity={0.35} />
                    <stop offset="95%" stopColor="#E8A64A" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip />
                <Legend />
                <Area
                  type="monotone"
                  dataKey="registered"
                  name="Registered Animals"
                  stroke="#174D37"
                  strokeWidth={2.5}
                  fillOpacity={1}
                  fill="url(#colorReg)"
                />
                <Area
                  type="monotone"
                  dataKey="vaccinated"
                  name="Vaccinated"
                  stroke="#E8A64A"
                  strokeWidth={2.5}
                  fillOpacity={1}
                  fill="url(#colorVax)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* CRITICAL ALERTS & OVERDUE VACCINATIONS PANEL */}
        <div className="lg:col-span-5 bg-white rounded-3xl p-6 border border-[#A5B99A]/40 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-extrabold text-[#26332B] flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-red-600" />
                Clinical & Vaccination Alerts
              </h3>
              <span className="text-xs font-bold text-red-700 bg-red-50 px-2.5 py-0.5 rounded-full">
                {criticalAnimals.length + overdueAnimals.length} Active
              </span>
            </div>

            <div className="space-y-3">
              {criticalAnimals.map((a) => (
                <div
                  key={a.id}
                  onClick={() => onSelectAnimal(a.id, 'Medical History')}
                  className="p-3.5 rounded-2xl bg-red-50/80 border border-red-200 cursor-pointer hover:bg-red-100/70 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-extrabold text-red-900">
                      {a.animal_code} · {a.name}
                    </span>
                    <StatusBadge value={a.health_status} />
                  </div>
                  <p className="text-xs text-red-800 mt-1 line-clamp-1">
                    {a.medical_history[0]?.diagnosis || 'Requires immediate veterinary evaluation'}
                  </p>
                </div>
              ))}

              {overdueAnimals.slice(0, 2).map((a) => (
                <div
                  key={a.id}
                  onClick={() => onSelectAnimal(a.id, 'Vaccinations')}
                  className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200 cursor-pointer hover:bg-amber-100/70 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-extrabold text-amber-950">
                      {a.animal_code} · {a.name}
                    </span>
                    <StatusBadge value={a.vaccination_status} />
                  </div>
                  <p className="text-xs text-amber-800 mt-1">
                    Location: {a.location_name} — Booster verification needed.
                  </p>
                </div>
              ))}
            </div>
          </div>

          {role === 'admin' && (
            <button
              onClick={() => onNavigateTab('medical')}
              className="mt-4 w-full py-2.5 rounded-xl bg-[#174D37] text-white text-xs font-bold hover:bg-[#226B4D]"
            >
              Open Veterinary Surveillance Center
            </button>
          )}
        </div>
      </div>

      {/* PENDING APPROVALS & AUDIT ACTIVITY LOG */}
      <div className="grid lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-3xl p-6 border border-[#A5B99A]/40 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-extrabold text-[#26332B]">
              Pending Volunteer & Adoption Queue
            </h3>
            <span className="text-xs font-bold text-[#174D37]">
              {volunteerReports.filter((r) => r.status === 'Pending Approval').length} Reports ·{' '}
              {adoptions.filter((a) => a.status === 'Pending Review').length} Adoptions
            </span>
          </div>
          <div className="space-y-3">
            {volunteerReports.slice(0, 2).map((r) => (
              <div
                key={r.id}
                className="p-3.5 rounded-2xl bg-[#FAF8F1] border border-[#A5B99A]/40 flex items-center justify-between gap-3"
              >
                <div className="min-w-0">
                  <p className="text-xs font-extrabold text-[#26332B] truncate">
                    {r.type}: {r.animal_name}
                  </p>
                  <p className="text-[11px] text-[#5C6B62] truncate">
                    {r.location} · By {r.submitted_by}
                  </p>
                </div>
                <button
                  onClick={() => onNavigateTab('volunteers')}
                  className="px-3 py-1.5 rounded-xl bg-white border border-[#A5B99A]/50 text-xs font-bold text-[#174D37] shrink-0"
                >
                  Review
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-3xl p-6 border border-[#A5B99A]/40 shadow-sm">
          <h3 className="text-base font-extrabold text-[#26332B] mb-4">
            System Audit & Activity Trail
          </h3>
          <div className="space-y-3">
            {activityLogs.map((log) => (
              <div key={log.id} className="flex items-start gap-3 text-xs">
                <div className="w-2 h-2 rounded-full bg-[#174D37] mt-1.5 shrink-0" />
                <div>
                  <p className="font-semibold text-[#26332B]">{log.action}</p>
                  <p className="text-[#5C6B62]">
                    {log.actor} · {log.time}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// 5. ANIMAL MANAGEMENT (SEARCH, MULTI-FILTER, GRID & TABLE VIEW)
