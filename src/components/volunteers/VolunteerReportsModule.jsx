// PAW TRACK — Volunteer field reports & approvals

import { useState } from 'react';

export function VolunteerReportsModule({ role, reports, onDecision, onSubmitReport }) {
  const [type, setType] = useState('New Animal Discovery');
  const [animalName, setAnimalName] = useState('');
  const [location, setLocation] = useState('');
  const [urgency, setUrgency] = useState('Normal');
  const [notes, setNotes] = useState('');

  const handleCreate = (e) => {
    e.preventDefault();
    onSubmitReport({
      type,
      animal_name: animalName,
      breed: 'Indian Pariah',
      location,
      urgency,
      notes,
      photo: 'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?auto=format&fit=crop&w=600&q=80'
    });
    setAnimalName('');
    setLocation('');
    setNotes('');
  };

  // Admins verify reports rather than submit them, so the intake form is
  // only shown to volunteers (field reports) and public users (incidents).
  const showIntakeForm = role !== 'admin';

  return (
    <div className={showIntakeForm ? 'grid lg:grid-cols-12 gap-6' : ''}>
      {showIntakeForm && (
      <div className="lg:col-span-5 bg-white rounded-3xl p-6 border border-[#A5B99A]/40 shadow-sm h-fit">
        <h2 className="text-lg font-extrabold text-[#26332B]">
          {role === 'user' ? 'Report an Injured or Stray Animal' : 'Submit Field Report to Vets'}
        </h2>
        <p className="text-xs text-[#5C6B62] mt-1">
          All reports remain pending until verified by a licensed veterinarian or administrator.
        </p>

        <form onSubmit={handleCreate} className="mt-5 space-y-4">
          <div>
            <label className="block text-xs font-bold text-[#26332B] mb-1">Report Category</label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF8F1] border border-[#A5B99A]/50 text-sm font-semibold"
            >
              <option value="New Animal Discovery">New Animal Discovery</option>
              <option value="Medical Alert / Injury">Medical Alert / Injury</option>
              <option value="Vaccination Verification">Vaccination Verification</option>
              <option value="Abandoned / Distressed Animal">Abandoned / Distressed Animal</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#26332B] mb-1">
              Animal Name or Existing ID *
            </label>
            <input
              required
              type="text"
              value={animalName}
              onChange={(e) => setAnimalName(e.target.value)}
              placeholder="e.g., PT-2026-0002 or Brown Puppy near Park"
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF8F1] border border-[#A5B99A]/50 text-sm"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-[#26332B] mb-1">Location *</label>
              <input
                required
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Street / Sector"
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF8F1] border border-[#A5B99A]/50 text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-[#26332B] mb-1">Priority Level</label>
              <select
                value={urgency}
                onChange={(e) => setUrgency(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF8F1] border border-[#A5B99A]/50 text-sm font-bold"
              >
                <option value="Normal">Normal</option>
                <option value="High">High (Medical / Injury)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#26332B] mb-1">
              Detailed Observations *
            </label>
            <textarea
              required
              rows={3}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Describe physical condition, symptoms, or landmarks..."
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF8F1] border border-[#A5B99A]/50 text-sm"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 rounded-xl bg-[#174D37] hover:bg-[#226B4D] text-white font-bold text-xs"
          >
            Submit Report for Verification
          </button>
        </form>
      </div>
      )}

      <div className={showIntakeForm ? 'lg:col-span-7 space-y-4' : 'space-y-4'}>
        <h3 className="text-base font-extrabold text-[#26332B]">
          Field Submissions & Approval Tracker
        </h3>
        {reports.map((r) => (
          <div
            key={r.id}
            className="bg-white rounded-3xl p-5 border border-[#A5B99A]/40 shadow-sm flex flex-col sm:flex-row gap-4 justify-between"
          >
            <div className="flex gap-4">
              <img src={r.photo} alt={r.animal_name} className="w-20 h-20 rounded-2xl object-cover shrink-0" />
              <div className="space-y-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-xs font-extrabold text-[#174D37]">{r.type}</span>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      r.status === 'Approved'
                        ? 'bg-emerald-100 text-emerald-800'
                        : r.status === 'Rejected'
                        ? 'bg-red-100 text-red-800'
                        : 'bg-amber-100 text-amber-800'
                    }`}
                  >
                    {r.status}
                  </span>
                </div>
                <h4 className="font-bold text-sm text-[#26332B]">{r.animal_name}</h4>
                <p className="text-xs text-[#5C6B62]">
                  {r.location} · Submitted by {r.submitted_by} ({r.date})
                </p>
                <p className="text-xs text-[#26332B] pt-1">{r.notes}</p>
              </div>
            </div>

            {role === 'admin' && r.status === 'Pending Approval' && (
              <div className="flex sm:flex-col justify-end gap-2 shrink-0">
                <button
                  onClick={() => onDecision(r.id, 'Approved')}
                  className="px-3.5 py-2 rounded-xl bg-[#174D37] text-white text-xs font-bold"
                >
                  Approve
                </button>
                <button
                  onClick={() => onDecision(r.id, 'Rejected')}
                  className="px-3.5 py-2 rounded-xl bg-red-50 text-red-700 text-xs font-bold"
                >
                  Reject
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

// 12. INTERACTIVE MAP & LAST-RECORDED LOCATION MANAGEMENT
