// PAW TRACK — Adoption pipeline management

import { StatusBadge } from '../common/StatusBadge.jsx';

export function AdoptionManagementModule({
  role,
  animals,
  adoptions,
  onDecision,
  onOpenAdoptModal,
  onSelectAnimal
}) {
  const adoptable = animals.filter((a) => a.adoption_status === 'Available for Adoption');

  return (
    <div className="space-y-8">
      {/* ADMIN APPLICATION REVIEW TABLE */}
      {role === 'admin' && (
        <div className="bg-white rounded-3xl p-6 border border-[#A5B99A]/40 shadow-sm">
          <h2 className="text-lg font-extrabold text-[#26332B] mb-4">
            Prospective Adopter Applications
          </h2>
          <div className="space-y-4">
            {adoptions.map((app) => (
              <div
                key={app.id}
                className="p-5 rounded-2xl bg-[#FAF8F1] border border-[#A5B99A]/40 flex flex-col lg:flex-row lg:items-center justify-between gap-4"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-[#174D37] text-white">
                      {app.animal_code} · {app.animal_name}
                    </span>
                    <span
                      className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${
                        app.status === 'Approved'
                          ? 'bg-emerald-100 text-emerald-800'
                          : app.status === 'Rejected'
                          ? 'bg-red-100 text-red-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {app.status}
                    </span>
                  </div>
                  <p className="text-sm font-extrabold text-[#26332B]">
                    Applicant: {app.applicant_name} ({app.applicant_phone})
                  </p>
                  <p className="text-xs text-[#5C6B62]">Home: {app.home_type} · {app.address}</p>
                  <p className="text-xs text-[#26332B] italic">“{app.experience}”</p>
                </div>

                {app.status === 'Pending Review' && (
                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => onDecision(app.id, 'Approved')}
                      className="px-4 py-2 rounded-xl bg-[#174D37] text-white text-xs font-bold hover:bg-[#226B4D]"
                    >
                      Approve Adoption
                    </button>
                    <button
                      onClick={() => onDecision(app.id, 'Rejected')}
                      className="px-4 py-2 rounded-xl bg-red-50 text-red-700 border border-red-200 text-xs font-bold hover:bg-red-100"
                    >
                      Decline
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ADOPTABLE ANIMALS SHOWCASE */}
      <div>
        <h3 className="text-lg font-extrabold text-[#26332B] mb-4">
          Medically Cleared Animals Available for Adoption ({adoptable.length})
        </h3>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {adoptable.map((a) => (
            <div
              key={a.id}
              className="bg-white rounded-3xl overflow-hidden border border-[#A5B99A]/40 shadow-sm flex flex-col"
            >
              <img src={a.photos[0]} alt={a.name} className="w-full h-52 object-cover" />
              <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                <div>
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-bold text-[#174D37]">{a.animal_code}</span>
                    <StatusBadge value={a.behaviour_status} />
                  </div>
                  <h4 className="text-lg font-extrabold text-[#26332B] mt-1">{a.name}</h4>
                  <p className="text-xs text-[#5C6B62]">
                    {a.breed} · {a.estimated_age} · {a.gender}
                  </p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => onSelectAnimal(a.id)}
                    className="flex-1 py-2.5 rounded-xl bg-[#FAF8F1] text-[#174D37] font-bold text-xs border border-[#A5B99A]/40"
                  >
                    Full Profile
                  </button>
                  <button
                    onClick={() => onOpenAdoptModal(a)}
                    className="flex-1 py-2.5 rounded-xl bg-[#174D37] text-white font-bold text-xs"
                  >
                    Request Adoption
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

// 9. VOLUNTEER FIELD REPORTS & PUBLIC INCIDENT REPORTING
