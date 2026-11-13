// PAW TRACK — Behaviour monitoring module

import { useState } from 'react';
import { StatusBadge } from '../common/StatusBadge.jsx';
import { DogAvatar } from '../common/DogAvatar.jsx';

export function BehaviourMonitoringModule({ role, animals, onSelectAnimal, onAddBehaviour }) {
  const [selectedId, setSelectedId] = useState(animals[0]?.id || '');
  const [label, setLabel] = useState('Friendly');
  const [notes, setNotes] = useState('');
  const [precautions, setPrecautions] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onAddBehaviour(selectedId, { label, notes, precautions });
    setNotes('');
    setPrecautions('');
  };

  return (
    <div className="grid lg:grid-cols-12 gap-6">
      <div className="lg:col-span-5 bg-white rounded-3xl p-6 border border-[#A5B99A]/40 shadow-sm h-fit">
        <h2 className="text-lg font-extrabold text-[#26332B]">
          {role === 'admin' ? 'Update Verified Behaviour Profile' : 'Submit Field Behaviour Observation'}
        </h2>
        <p className="text-xs text-[#5C6B62] mt-1">
          {role === 'admin'
            ? 'Directly updates the animal’s public safety temperament badge.'
            : 'Volunteer observations are logged and queued for administrator verification.'}
        </p>

        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
          <div>
            <label className="block text-xs font-bold text-[#26332B] mb-1">Select Animal</label>
            <select
              value={selectedId}
              onChange={(e) => setSelectedId(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF8F1] border border-[#A5B99A]/50 text-sm font-bold"
            >
              {animals.map((a) => (
                <option key={a.id} value={a.id}>
                  {a.animal_code} — {a.name} ({a.behaviour_status})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#26332B] mb-1">
              Observed Temperament
            </label>
            <div className="grid grid-cols-3 gap-2">
              {['Friendly', 'Calm', 'Shy', 'Fearful', 'Aggressive', 'Unknown'].map((b) => (
                <button
                  type="button"
                  key={b}
                  onClick={() => setLabel(b)}
                  className={`py-2 px-2 rounded-xl text-xs font-bold border transition-all ${
                    label === b
                      ? 'bg-[#174D37] text-white border-[#174D37]'
                      : 'bg-[#FAF8F1] text-[#26332B] border-[#A5B99A]/40'
                  }`}
                >
                  {b}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#26332B] mb-1">
              Observation Notes *
            </label>
            <textarea
              required
              rows={3}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Interaction with children, other dogs, traffic, or feeders..."
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF8F1] border border-[#A5B99A]/50 text-sm"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#26332B] mb-1">
              Handling & Safety Precautions
            </label>
            <input
              type="text"
              value={precautions}
              onChange={(e) => setPrecautions(e.target.value)}
              placeholder="e.g., Approach slowly; avoid sudden loud noises"
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF8F1] border border-[#A5B99A]/50 text-sm"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 rounded-xl bg-[#174D37] hover:bg-[#226B4D] text-white font-bold text-xs"
          >
            {role === 'admin' ? 'Publish Verified Behaviour Badge' : 'Submit Observation for Review'}
          </button>
        </form>
      </div>

      <div className="lg:col-span-7 space-y-4">
        <h3 className="text-base font-extrabold text-[#26332B]">
          Temperament & Safety Matrix Across Registered Animals
        </h3>
        {animals.map((a) => (
          <div
            key={a.id}
            onClick={() => onSelectAnimal(a.id, 'Behaviour')}
            className="bg-white rounded-2xl p-5 border border-[#A5B99A]/40 shadow-sm hover:border-[#174D37] cursor-pointer transition-all"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <DogAvatar animal={a} className="w-12 h-12 rounded-xl object-cover" />
                <div>
                  <p className="font-mono text-xs font-bold text-[#174D37]">{a.animal_code}</p>
                  <h4 className="font-extrabold text-[#26332B]">{a.name}</h4>
                </div>
              </div>
              <StatusBadge value={a.behaviour_status} />
            </div>
            {a.behaviour_logs[0] && (
              <div className="mt-3 pt-3 border-t border-stone-100 text-xs space-y-1">
                <p className="text-[#26332B]">{a.behaviour_logs[0].notes}</p>
                <p className="text-[#5C6B62] font-semibold">
                  Precaution: {a.behaviour_logs[0].precautions}
                </p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

// 8. ADOPTION MANAGEMENT MODULE
