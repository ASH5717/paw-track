// PAW TRACK — Welfare analytics & CSV export

import { Download } from 'lucide-react';
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

export function ReportsAnalyticsModule({ animals, stats, onExportCSV }) {
  const healthDistribution = [
    { name: 'Healthy', value: animals.filter((a) => a.health_status === 'Healthy').length, color: '#174D37' },
    { name: 'Under Treatment', value: animals.filter((a) => a.health_status === 'Under Treatment').length, color: '#E8A64A' },
    { name: 'Critical Attention', value: animals.filter((a) => a.health_status === 'Critical Attention').length, color: '#DC2626' }
  ];

  const behaviourData = ['Friendly', 'Calm', 'Shy', 'Fearful', 'Aggressive'].map((b) => ({
    name: b,
    count: animals.filter((a) => a.behaviour_status === b).length
  }));

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-3xl p-6 border border-[#A5B99A]/40 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-extrabold text-[#26332B]">
            Welfare Analytics & Surveillance Exports
          </h2>
          <p className="text-xs text-[#5C6B62]">
            Generate municipal compliance reports, immunization audits, and population summaries.
          </p>
        </div>
        <button
          onClick={onExportCSV}
          className="px-5 py-3 rounded-xl bg-[#174D37] hover:bg-[#226B4D] text-white text-xs font-bold flex items-center gap-2 self-start"
        >
          <Download className="w-4 h-4" /> Export Registry (CSV)
        </button>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-3xl p-6 border border-[#A5B99A]/40">
          <h3 className="text-base font-extrabold text-[#26332B] mb-4">
            Health Condition Distribution
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={healthDistribution}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={85}
                  label
                >
                  {healthDistribution.map((entry, idx) => (
                    <Cell key={idx} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white rounded-3xl p-6 border border-[#A5B99A]/40">
          <h3 className="text-base font-extrabold text-[#26332B] mb-4">
            Behavioural Temperament Breakdown
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={behaviourData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                <YAxis allowDecimals={false} tick={{ fontSize: 12 }} />
                <Tooltip />
                <Bar dataKey="count" name="Animals" fill="#174D37" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}

// 15 & 16. DATABASE SCHEMA & SECURITY SETTINGS
