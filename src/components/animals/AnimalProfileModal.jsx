// PAW TRACK — Animal profile drawer (5 tabs + QR)

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { MapPin, X, Pencil, Utensils, Trash2, Stethoscope } from 'lucide-react';
import { AnimalQRCode } from '../common/AnimalQRCode.jsx';
import { DogAvatar } from '../common/DogAvatar.jsx';
import { StatusBadge } from '../common/StatusBadge.jsx';
import { RatingScale, RatingSummary } from '../common/CommunityRating.jsx';
import { averageRating } from '../../data/animals.js';

const HEALTH_OPTIONS = ['Healthy', 'Under Treatment', 'Critical Attention'];
const VACCINATION_OPTIONS = [
  'Vaccinated',
  'Partially Vaccinated',
  'Overdue',
  'Verification Required'
];
const BEHAVIOUR_OPTIONS = ['Friendly', 'Calm', 'Shy', 'Fearful', 'Aggressive'];
const ADOPTION_OPTIONS = [
  'Available for Adoption',
  'Pending Adoption',
  'Adopted',
  'Under Medical Treatment',
  'Not Available'
];
const FOOD_OPTIONS = [
  'Dry Kibble',
  'Cooked Rice & Chicken',
  'Milk & Biscuits',
  'Wet Food',
  'Water Refill'
];

const todayIso = () => new Date().toISOString().split('T')[0];

const blankFeed = () => ({
  food_type: FOOD_OPTIONS[0],
  quantity: '1 meal',
  date: todayIso(),
  notes: ''
});

const inputClass =
  'w-full px-3 py-2 rounded-xl bg-[#FAF8F1] border border-[#A5B99A]/50 text-sm focus:outline-none focus:border-[#174D37]';

const labelClass = 'text-[11px] font-bold text-[#5C6B62]';

export function AnimalProfileModal({
  animal,
  activeTab,
  setActiveTab,
  currentUser,
  onClose,
  onOpenAdopt,
  onUpdateAnimal,
  onAddFeeding,
  onDeleteAnimal,
  ratings = [],
  onRate
}) {
  const role = currentUser?.role || 'user';
  const canEdit = role !== 'user';
  const canDelete = role === 'admin';

  const avg = averageRating(ratings);

  const [editing, setEditing] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [justRated, setJustRated] = useState(false);
  const [form, setForm] = useState(animal);
  const [feed, setFeed] = useState(blankFeed);

  // Reset the working copies whenever a different animal is opened
  useEffect(() => {
    setForm(animal);
    setEditing(false);
    setConfirmDelete(false);
    setJustRated(false);
    setFeed(blankFeed());
  }, [animal.id]);

  const setField = (key, value) => setForm((prev) => ({ ...prev, [key]: value }));

  const handleSave = (e) => {
    e.preventDefault();
    onUpdateAnimal(animal.id, {
      name: form.name,
      breed: form.breed,
      estimated_age: form.estimated_age,
      gender: form.gender,
      colour: form.colour,
      identifying_marks: form.identifying_marks,
      location_name: form.location_name,
      assigned_volunteer: form.assigned_volunteer,
      rescue_details: form.rescue_details,
      health_status: form.health_status,
      vaccination_status: form.vaccination_status,
      behaviour_status: form.behaviour_status,
      adoption_status: form.adoption_status,
      sterilized: form.sterilized,
      dewormed: form.dewormed
    });
    setEditing(false);
  };

  const handleFeedSubmit = (e) => {
    e.preventDefault();
    onAddFeeding(animal.id, feed);
    setFeed(blankFeed());
  };

  const tabs = ['Overview', 'Medical History', 'Vaccinations', 'Behaviour', 'Feeding', 'Adoption'];

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
            <DogAvatar
              animal={animal}
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
              <RatingSummary
                value={avg}
                count={ratings.length}
                compact
                className="mt-2"
              />
            </div>
          </div>

          <div className="flex items-center gap-2 self-end sm:self-center">
            {canDelete &&
              (confirmDelete ? (
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => {
                      onDeleteAnimal(animal.id);
                      onClose();
                    }}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-red-600 text-white hover:bg-red-700"
                  >
                    <Trash2 className="w-3.5 h-3.5" /> Confirm Delete
                  </button>
                  <button
                    onClick={() => setConfirmDelete(false)}
                    className="px-3 py-2 rounded-xl text-xs font-bold bg-stone-100 text-[#5C6B62] hover:bg-stone-200"
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setConfirmDelete(true)}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold border bg-[#FAF8F1] text-red-600 border-red-200 hover:bg-red-50"
                  title="Delete this animal"
                >
                  <Trash2 className="w-3.5 h-3.5" /> Delete
                </button>
              ))}
            {canEdit && (
              <button
                onClick={() => {
                  setForm(animal);
                  setActiveTab('Overview');
                  setEditing((prev) => !prev);
                }}
                className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold border transition-colors ${
                  editing
                    ? 'bg-[#174D37] text-white border-[#174D37]'
                    : 'bg-[#FAF8F1] text-[#174D37] border-[#174D37]/25 hover:bg-[#E8EFE5]'
                }`}
              >
                <Pencil className="w-3.5 h-3.5" />
                {editing ? 'Cancel Edit' : 'Edit Details'}
              </button>
            )}
            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-[#FAF8F1] hover:bg-stone-200 text-[#26332B]"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
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
          {activeTab === 'Overview' && editing && (
            <form onSubmit={handleSave} className="space-y-5">
              <div className="bg-white p-5 rounded-2xl border border-[#A5B99A]/40 space-y-4">
                <h4 className="text-xs font-extrabold uppercase tracking-wider text-[#5C6B62]">
                  Registry Details
                </h4>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  <label className="block space-y-1">
                    <span className={labelClass}>Name</span>
                    <input
                      className={inputClass}
                      value={form.name || ''}
                      onChange={(e) => setField('name', e.target.value)}
                    />
                  </label>
                  <label className="block space-y-1">
                    <span className={labelClass}>Breed</span>
                    <input
                      className={inputClass}
                      value={form.breed || ''}
                      onChange={(e) => setField('breed', e.target.value)}
                    />
                  </label>
                  <label className="block space-y-1">
                    <span className={labelClass}>Estimated Age</span>
                    <input
                      className={inputClass}
                      value={form.estimated_age || ''}
                      onChange={(e) => setField('estimated_age', e.target.value)}
                    />
                  </label>
                  <label className="block space-y-1">
                    <span className={labelClass}>Gender</span>
                    <select
                      className={inputClass}
                      value={form.gender || 'Unknown'}
                      onChange={(e) => setField('gender', e.target.value)}
                    >
                      {['Male', 'Female', 'Unknown'].map((g) => (
                        <option key={g} value={g}>
                          {g}
                        </option>
                      ))}
                    </select>
                  </label>
                  <label className="block space-y-1">
                    <span className={labelClass}>Coat Colour</span>
                    <input
                      className={inputClass}
                      value={form.colour || ''}
                      onChange={(e) => setField('colour', e.target.value)}
                    />
                  </label>
                  <label className="block space-y-1">
                    <span className={labelClass}>Assigned Volunteer</span>
                    <input
                      className={inputClass}
                      value={form.assigned_volunteer || ''}
                      onChange={(e) => setField('assigned_volunteer', e.target.value)}
                    />
                  </label>
                </div>
                <label className="block space-y-1">
                  <span className={labelClass}>Location</span>
                  <input
                    className={inputClass}
                    value={form.location_name || ''}
                    onChange={(e) => setField('location_name', e.target.value)}
                  />
                </label>
                <label className="block space-y-1">
                  <span className={labelClass}>Identifying Marks</span>
                  <input
                    className={inputClass}
                    value={form.identifying_marks || ''}
                    onChange={(e) => setField('identifying_marks', e.target.value)}
                  />
                </label>
                <label className="block space-y-1">
                  <span className={labelClass}>Rescue & Community Context</span>
                  <textarea
                    rows={3}
                    className={inputClass}
                    value={form.rescue_details || ''}
                    onChange={(e) => setField('rescue_details', e.target.value)}
                  />
                </label>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-[#A5B99A]/40 space-y-4">
                <h4 className="text-xs font-extrabold uppercase tracking-wider text-[#5C6B62]">
                  Status Fields
                </h4>
                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <label className="block space-y-1">
                    <span className={labelClass}>Health Status</span>
                    <select
                      className={inputClass}
                      value={form.health_status}
                      onChange={(e) => setField('health_status', e.target.value)}
                    >
                      {HEALTH_OPTIONS.map((o) => (
                        <option key={o} value={o}>
                          {o}
                        </option>
                      ))}
                    </select>
                  </label>
                  <label className="block space-y-1">
                    <span className={labelClass}>Vaccination Status</span>
                    <select
                      className={inputClass}
                      value={form.vaccination_status}
                      onChange={(e) => setField('vaccination_status', e.target.value)}
                    >
                      {VACCINATION_OPTIONS.map((o) => (
                        <option key={o} value={o}>
                          {o}
                        </option>
                      ))}
                    </select>
                  </label>
                  <label className="block space-y-1">
                    <span className={labelClass}>Behaviour</span>
                    <select
                      className={inputClass}
                      value={form.behaviour_status}
                      onChange={(e) => setField('behaviour_status', e.target.value)}
                    >
                      {BEHAVIOUR_OPTIONS.map((o) => (
                        <option key={o} value={o}>
                          {o}
                        </option>
                      ))}
                    </select>
                  </label>
                  <label className="block space-y-1">
                    <span className={labelClass}>Adoption Status</span>
                    <select
                      className={inputClass}
                      value={form.adoption_status}
                      onChange={(e) => setField('adoption_status', e.target.value)}
                    >
                      {ADOPTION_OPTIONS.map((o) => (
                        <option key={o} value={o}>
                          {o}
                        </option>
                      ))}
                    </select>
                  </label>
                </div>

                <div className="flex flex-wrap gap-5 pt-1">
                  <label className="inline-flex items-center gap-2 text-xs font-bold text-[#26332B]">
                    <input
                      type="checkbox"
                      className="w-4 h-4 accent-[#174D37]"
                      checked={!!form.sterilized}
                      onChange={(e) => setField('sterilized', e.target.checked)}
                    />
                    ABC Sterilized (Ear Notched)
                  </label>
                  <label className="inline-flex items-center gap-2 text-xs font-bold text-[#26332B]">
                    <input
                      type="checkbox"
                      className="w-4 h-4 accent-[#174D37]"
                      checked={!!form.dewormed}
                      onChange={(e) => setField('dewormed', e.target.checked)}
                    />
                    Dewormed
                  </label>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-[#174D37] text-white text-xs font-bold hover:bg-[#226B4D]"
                >
                  Save Changes
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setForm(animal);
                    setEditing(false);
                  }}
                  className="px-5 py-2.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-xs font-bold text-[#5C6B62]"
                >
                  Cancel
                </button>
              </div>
            </form>
          )}

          {activeTab === 'Overview' && !editing && (
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

                <div className="bg-white p-5 rounded-2xl border border-[#A5B99A]/40">
                  <h4 className="text-xs font-extrabold uppercase tracking-wider text-[#5C6B62] mb-3">
                    Community Rating
                  </h4>
                  <div className="grid sm:grid-cols-2 gap-6 items-center">
                    <RatingSummary value={avg} count={ratings.length} />
                    <div className="sm:border-l sm:border-stone-100 sm:pl-6">
                      <p className="text-xs font-bold text-[#26332B] mb-2">
                        {justRated ? 'Thanks for rating!' : 'Rate this dog'}
                      </p>
                      <RatingScale
                        onRate={(stars) => {
                          onRate?.(stars);
                          setJustRated(true);
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* QR IDENTITY CARD */}
              <div className="md:col-span-4 bg-white p-4 rounded-2xl border border-[#A5B99A]/40 flex flex-col items-center justify-start text-center">
                <AnimalQRCode animal={animal} size={140} />

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
                <div className="bg-white p-8 rounded-2xl border border-[#A5B99A]/40 flex flex-col items-center text-center">
                  <div className="w-12 h-12 rounded-2xl bg-[#EAF1EA] text-[#174D37] flex items-center justify-center mb-3">
                    <Stethoscope className="w-6 h-6" />
                  </div>
                  <h4 className="text-base font-extrabold text-[#26332B]">
                    No clinical incidents logged
                  </h4>
                  <p className="text-xs text-[#5C6B62] mt-1 max-w-xs">
                    Vaccinations, treatments, check-ups and diagnoses for {animal.name} will appear
                    here once they are recorded by the veterinary team.
                  </p>
                </div>
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

              <div className="bg-white p-5 rounded-2xl border border-[#A5B99A]/40">
                <h4 className="text-xs font-extrabold uppercase tracking-wider text-[#5C6B62] mb-3">
                  Community Rating
                </h4>
                <RatingSummary value={avg} count={ratings.length} />
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

          {activeTab === 'Feeding' && (
            <div className="space-y-5">
              <form
                onSubmit={handleFeedSubmit}
                className="bg-white p-6 rounded-2xl border border-[#A5B99A]/40 space-y-4"
              >
                <div className="flex items-center gap-2">
                  <Utensils className="w-4 h-4 text-[#E8A64A]" />
                  <h4 className="text-sm font-extrabold text-[#26332B]">Log a Community Feed</h4>
                </div>
                <div className="grid sm:grid-cols-3 gap-3">
                  <div>
                    <label className={labelClass}>Food Type</label>
                    <select
                      value={feed.food_type}
                      onChange={(e) => setFeed((p) => ({ ...p, food_type: e.target.value }))}
                      className={inputClass}
                    >
                      {FOOD_OPTIONS.map((f) => (
                        <option key={f} value={f}>
                          {f}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className={labelClass}>Quantity</label>
                    <input
                      value={feed.quantity}
                      onChange={(e) => setFeed((p) => ({ ...p, quantity: e.target.value }))}
                      placeholder="1 meal"
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <label className={labelClass}>Date</label>
                    <input
                      type="date"
                      value={feed.date}
                      onChange={(e) => setFeed((p) => ({ ...p, date: e.target.value }))}
                      className={inputClass}
                    />
                  </div>
                </div>
                <div>
                  <label className={labelClass}>Notes</label>
                  <input
                    value={feed.notes}
                    onChange={(e) => setFeed((p) => ({ ...p, notes: e.target.value }))}
                    placeholder="Ate well, refilled water bowl…"
                    className={inputClass}
                  />
                </div>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-[#174D37] text-white text-xs font-bold hover:bg-[#226B4D]"
                >
                  Add Feeding Log
                </button>
              </form>

              <div className="space-y-3">
                <p className="text-xs font-bold text-[#5C6B62]">
                  Feeding History ({animal.feeding_logs?.length || 0})
                </p>
                {(animal.feeding_logs || []).length === 0 && (
                  <p className="text-xs text-[#5C6B62] bg-white p-5 rounded-2xl border border-[#A5B99A]/40">
                    No feeding entries recorded yet.
                  </p>
                )}
                {(animal.feeding_logs || []).map((f) => (
                  <div
                    key={f.id}
                    className="bg-white p-5 rounded-2xl border border-[#A5B99A]/40 flex items-start justify-between gap-4"
                  >
                    <div>
                      <p className="text-sm font-extrabold text-[#26332B]">{f.food_type}</p>
                      {f.notes && <p className="text-xs text-[#5C6B62] mt-1">{f.notes}</p>}
                      <p className="text-[11px] text-[#5C6B62] mt-1">
                        Fed by {f.fed_by}
                        {f.group ? ` · Group: ${f.group}` : ''}
                      </p>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="text-xs font-bold text-[#26332B]">{f.quantity}</p>
                      <p className="text-[11px] text-[#5C6B62]">{f.date}</p>
                    </div>
                  </div>
                ))}
              </div>
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
