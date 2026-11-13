// PAW TRACK — Public quick incident report modal

import { useState } from 'react';
import { AlertTriangle, X, Phone } from 'lucide-react';

export function QuickIncidentModal({ onClose, onSubmit }) {
  const [type, setType] = useState('Injured / Sick Stray Animal');
  const [reporterName, setReporterName] = useState('');
  const [animalDesc, setAnimalDesc] = useState('');
  const [location, setLocation] = useState('');
  const [urgency, setUrgency] = useState('High');
  const [notes, setNotes] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ type, reporterName, animalDesc, location, urgency, notes });
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-[#A5B99A]/40"
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-red-600" />
            <h3 className="text-xl font-extrabold text-[#26332B]">Report Animal in Need</h3>
          </div>
          <button onClick={onClose}>
            <X className="w-5 h-5 text-[#5C6B62]" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3.5">
          <div>
            <label className="block text-xs font-bold text-[#26332B] mb-1">Issue Type</label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF8F1] border border-[#A5B99A]/50 text-sm font-semibold"
            >
              <option>Injured / Sick Stray Animal</option>
              <option>Unregistered Community Dog</option>
              <option>Abandoned Puppy / Litter</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-bold text-[#26332B] mb-1">Your Name & Phone *</label>
            <input
              required
              type="text"
              value={reporterName}
              onChange={(e) => setReporterName(e.target.value)}
              placeholder="Name & mobile number for responder callback"
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF8F1] border border-[#A5B99A]/50 text-sm"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-[#26332B] mb-1">
              Animal Description or Tag ID *
            </label>
            <input
              required
              type="text"
              value={animalDesc}
              onChange={(e) => setAnimalDesc(e.target.value)}
              placeholder="e.g., Brown Indie dog limping, or PT-2026-XXXX"
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF8F1] border border-[#A5B99A]/50 text-sm"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-[#26332B] mb-1">Exact Landmark *</label>
            <input
              required
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="Street, cross road, or neighborhood"
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF8F1] border border-[#A5B99A]/50 text-sm"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-[#26332B] mb-1">Condition Notes *</label>
            <textarea
              required
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF8F1] border border-[#A5B99A]/50 text-sm"
            />
          </div>
          <button
            type="submit"
            className="w-full py-3 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-sm"
          >
            Dispatch Alert to Rescue Network
          </button>
        </form>
      </div>
    </div>
  );
}
