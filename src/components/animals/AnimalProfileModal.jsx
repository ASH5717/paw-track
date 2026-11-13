// PAW TRACK — Animal profile drawer (5 tabs + QR)

import { motion } from 'framer-motion';
import { MapPin, X } from 'lucide-react';
import { AnimalQRCode } from '../common/AnimalQRCode.jsx';
import { StatusBadge } from '../common/StatusBadge.jsx';

export function AnimalProfileModal({
  animal,
  activeTab,
  setActiveTab,
  currentUser,
  onClose,
  onOpenAdopt
}) {
  const role = currentUser?.role || 'user';
  const tabs = ['Overview', 'Medical History', 'Vaccinations', 'Behaviour', 'Adoption'];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, y: 16 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.95, y: 16 }}
        onClick={(e) => e.stopPropagation()}
        className="bg-[#FAF8F1] rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-[#A5B99A]/50"
      >
        {/* TOP HEADER */}
        <div className="bg-white p-6 border-b border-[#A5B99A]/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4 sticky top-0 z-10">
          <div className="flex items-center gap-4">
            <img
              src={animal.photos[0]}
              alt={animal.name}
              className="w-16 h-16 rounded-2xl object-cover border-2 border-[#174D37]"
            />
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="font-mono text-xs font-extrabold px-2.5 py-0.5 rounded bg-[#174D37] text-white">
                  {animal.animal_code}
                </span>
                <StatusBadge value={animal.health_status} />
                <StatusBadge value={animal.vaccination_status} />
              </div>
              <h2 className="text-2xl font-extrabold text-[#26332B] mt-1">
                {animal.name}{' '}
                <span className="text-sm font-medium text-[#5C6B62]">· {animal.breed}</span>
              </h2>
            </div>
          </div>

          <button
            onClick={onClose}
            className="self-end sm:self-center p-2 rounded-xl bg-[#FAF8F1] hover:bg-stone-200 text-[#26332B]"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* NAVIGATION TABS */}
        <div className="bg-white px-6 border-b border-[#A5B99A]/30 flex items-center gap-2 overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`py-3.5 px-4 text-xs font-extrabold border-b-2 whitespace-nowrap transition-colors ${
                activeTab === tab
                  ? 'border-[#174D37] text-[#174D37]'
                  : 'border-transparent text-[#5C6B62] hover:text-[#26332B]'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* TAB BODY */}
        <div className="p-6 sm:p-8">
          {activeTab === 'Overview' && (
            <div className="grid md:grid-cols-12 gap-6">
              <div className="md:col-span-8 space-y-5">
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 bg-white p-5 rounded-2xl border border-[#A5B99A]/40">
                  <div>
                    <p className="text-[11px] font-bold text-[#5C6B62]">Age & Gender</p>
                    <p className="text-sm font-extrabold text-[#26332B]">
                      {animal.estimated_age} · {animal.gender}
                    </p>
                  </div>
                  <div>
                    <p className="text-[11px] font-bold text-[#5C6B62]">Coat Colour</p>
                    <p className="text-sm font-extrabold text-[#26332B]">{animal.colour}</p>
                  </div>
                  <div>
                    <p className="text-[11px] font-bold text-[#5C6B62]">ABC Sterilized</p>
                    <p className="text-sm font-extrabold text-[#174D37]">
                      {animal.sterilized ? 'Yes (Ear Notched)' : 'Pending'}
                    </p>
                  </div>
                  <div className="col-span-2 sm:col-span-3">
                    <p className="text-[11px] font-bold text-[#5C6B62]">Identifying Marks</p>
                    <p className="text-sm font-semibold text-[#26332B]">
                      {animal.identifying_marks}
                    </p>
                  </div>
                  <div className="col-span-2 sm:col-span-3">
                    <p className="text-[11px] font-bold text-[#5C6B62]">Last Recorded Location</p>
                    <p className="text-sm font-semibold text-[#26332B] flex items-center gap-1">
                      <MapPin className="w-4 h-4 text-[#E8A64A]" /> {animal.location_name}
                    </p>
                  </div>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-[#A5B99A]/40">
                  <h4 className="text-xs font-extrabold uppercase tracking-wider text-[#5C6B62] mb-2">
                    Rescue & Community Context
                  </h4>
                  <p className="text-sm text-[#26332B] leading-relaxed">{animal.rescue_details}</p>
                  <p className="text-xs text-[#5C6B62] mt-3">
                    Assigned Volunteer: <strong>{animal.assigned_volunteer}</strong> · Last Updated:{' '}
                    {animal.updated_at}
                  </p>
                </div>
              </div>

              {/* QR IDENTITY CARD */}
              <div className="md:col-span-4 bg-white p-6 rounded-2xl border border-[#A5B99A]/40 flex flex-col items-center justify-center text-center space-y-3">
                <AnimalQRCode animalCode={animal.animal_code} size={135} />
                <p className="text-xs font-bold text-[#26332B]">Official Digital Collar QR</p>
                <p className="text-[11px] text-[#5C6B62]">
                  Scan to verify Rabies immunization, sterilization, and emergency handler contacts.
                </p>
              </div>
            </div>
          )}

          {activeTab === 'Medical History' && (
            <div className="space-y-4">
              {role === 'user' && (
                <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200 text-xs text-amber-900 font-semibold">
                  Public Summary View: Detailed private clinical attachments are restricted to
                  authorized veterinary staff.
                </div>
              )}
              {animal.medical_history.length === 0 ? (
                <p className="text-sm text-[#5C6B62]">No clinical incidents logged yet.</p>
              ) : (
                animal.medical_history.map((m) => (
                  <div
                    key={m.id}
                    className="bg-white p-5 rounded-2xl border border-[#A5B99A]/40 space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-extrabold text-[#174D37]">{m.date}</span>
                      {m.disease_flag !== 'None' && (
                        <span className="px-2.5 py-0.5 rounded-full bg-red-100 text-red-800 text-xs font-bold">
                          {m.disease_flag}
                        </span>
                      )}
                    </div>
                    <h4 className="text-base font-extrabold text-[#26332B]">{m.diagnosis}</h4>
                    <p className="text-xs text-[#5C6B62]">
                      <strong>Symptoms:</strong> {m.symptoms}
                    </p>
                    {role !== 'user' && (
                      <>
                        <p className="text-xs text-[#26332B]">
                          <strong>Treatment:</strong> {m.treatment} ({m.medications})
                        </p>
                        <p className="text-xs text-[#5C6B62] italic">Notes: {m.vet_notes}</p>
                      </>
                    )}
                    <p className="text-[11px] font-bold text-[#174D37] pt-1">
                      Certified by {m.veterinarian}
                    </p>
                  </div>
                ))
              )}
            </div>
          )}

          {activeTab === 'Vaccinations' && (
            <div className="space-y-3">
              {animal.vaccinations.map((v) => (
                <div
                  key={v.id}
                  className="bg-white p-5 rounded-2xl border border-[#A5B99A]/40 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                >
                  <div>
                    <h4 className="font-extrabold text-sm text-[#26332B]">{v.vaccine}</h4>
                    <p className="text-xs text-[#5C6B62]">
                      Administered: <strong>{v.date}</strong> · Next Due:{' '}
                      <strong>{v.next_due}</strong>
                    </p>
                    <p className="text-[11px] text-[#5C6B62]">
                      Veterinarian: {v.vet} · Batch: {v.batch}
                    </p>
                  </div>
                  <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold self-start">
                    {v.status}
                  </span>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'Behaviour' && (
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <span className="text-xs font-bold text-[#5C6B62]">Current Verified Badge:</span>
                <StatusBadge value={animal.behaviour_status} />
              </div>
              {animal.behaviour_logs.map((b) => (
                <div
                  key={b.id}
                  className="bg-white p-5 rounded-2xl border border-[#A5B99A]/40 space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <StatusBadge value={b.label} />
                    <span className="text-xs text-[#5C6B62]">{b.date}</span>
                  </div>
                  <p className="text-sm text-[#26332B]">{b.notes}</p>
                  <p className="text-xs font-semibold text-amber-800">
                    Safety Precaution: {b.precautions}
                  </p>
                  <p className="text-[11px] text-[#5C6B62]">Observer: {b.observer}</p>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'Adoption' && (
            <div className="bg-white p-6 rounded-2xl border border-[#A5B99A]/40 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-[#5C6B62]">Current Adoption Eligibility</p>
                  <h4 className="text-lg font-extrabold text-[#26332B] mt-0.5">
                    {animal.adoption_status}
                  </h4>
                </div>
                <StatusBadge value={animal.adoption_status} />
              </div>

              {animal.adoption_status === 'Available for Adoption' ? (
                <div className="pt-2">
                  <p className="text-sm text-[#5C6B62] mb-4">
                    {animal.name} has been cleared by veterinary staff for adoption into a caring
                    home.
                  </p>
                  <button
                    onClick={() => onOpenAdopt(animal)}
                    className="px-6 py-3 rounded-xl bg-[#174D37] text-white text-xs font-bold hover:bg-[#226B4D]"
                  >
                    Submit Adoption Interest Application
                  </button>
                </div>
              ) : (
                <p className="text-xs text-[#5C6B62]">
                  This animal is currently not open for public adoption applications.
                </p>
              )}
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}

// ADOPTION APPLICATION MODAL
