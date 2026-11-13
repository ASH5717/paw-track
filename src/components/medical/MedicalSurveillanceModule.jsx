// PAW TRACK — Veterinary clinical & vaccination module

import { useState } from 'react';
import { Syringe, Stethoscope, Thermometer } from 'lucide-react';

export function MedicalSurveillanceModule({
  role,
  animals,
  onSelectAnimal,
  onAddMedical,
  onAddVaccination
}) {
  const [selectedId, setSelectedId] = useState(animals[0]?.id || '');
  const [diagnosis, setDiagnosis] = useState('');
  const [symptoms, setSymptoms] = useState('');
  const [treatment, setTreatment] = useState('');
  const [medications, setMedications] = useState('');
  const [diseaseFlag, setDiseaseFlag] = useState('None');
  const [newHealthStatus, setNewHealthStatus] = useState('Healthy');

  const [vaccineType, setVaccineType] = useState('Anti-Rabies Annual Booster');
  const [batchNumber, setBatchNumber] = useState('RB-2026-881');
  const [nextDueDate, setNextDueDate] = useState('2027-11-13');

  const targetAnimal = animals.find((a) => a.id === selectedId) || animals[0];

  const handleSaveClinical = (e) => {
    e.preventDefault();
    if (!targetAnimal) return;
    onAddMedical(targetAnimal.id, {
      diagnosis,
      symptoms,
      treatment,
      medications,
      vet_notes: treatment,
      disease_flag: diseaseFlag,
      new_health_status: newHealthStatus,
      next_checkup: nextDueDate
    });
    setDiagnosis('');
    setSymptoms('');
    setTreatment('');
    setMedications('');
  };

  const handleSaveVaccine = (e) => {
    e.preventDefault();
    if (!targetAnimal) return;
    onAddVaccination(targetAnimal.id, {
      vaccine: vaccineType,
      date: new Date().toISOString().split('T')[0],
      next_due: nextDueDate,
      batch: batchNumber
    });
  };

  return (
    <div className="space-y-8">
      {/* DISEASE SURVEILLANCE BANNER */}
      <div className="rounded-3xl bg-white p-6 border border-[#A5B99A]/40 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-2xl bg-[#174D37] text-white flex items-center justify-center shrink-0">
            <Stethoscope className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-lg font-extrabold text-[#26332B]">
              Veterinary Clinical & Zoonotic Disease Surveillance
            </h2>
            <p className="text-xs text-[#5C6B62] mt-0.5 max-w-2xl">
              Manage Rabies & Parvovirus immunization timelines, log clinical treatments, and trigger
              verified isolation workflows. Suspected infectious cases must always be referred to
              licensed veterinary officers.
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <span className="px-3 py-1.5 rounded-xl bg-red-50 text-red-700 border border-red-200 text-xs font-bold">
            1 Active Isolation Case
          </span>
        </div>
      </div>

      {/* ANIMAL SELECTOR BAR */}
      <div className="bg-white rounded-3xl p-5 border border-[#A5B99A]/40 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <label className="text-xs font-extrabold uppercase tracking-wider text-[#5C6B62]">
            Select Animal Record:
          </label>
          <select
            value={selectedId}
            onChange={(e) => setSelectedId(e.target.value)}
            className="px-4 py-2.5 rounded-xl bg-[#FAF8F1] border border-[#A5B99A]/50 text-sm font-bold text-[#174D37]"
          >
            {animals.map((a) => (
              <option key={a.id} value={a.id}>
                {a.animal_code} — {a.name} ({a.health_status})
              </option>
            ))}
          </select>
        </div>

        {targetAnimal && (
          <button
            onClick={() => onSelectAnimal(targetAnimal.id, 'Medical History')}
            className="text-xs font-bold text-[#174D37] hover:underline"
          >
            Open Full Patient Chart & QR →
          </button>
        )}
      </div>

      {/* CLINICAL ENTRY & VACCINATION CERTIFICATION FORMS (ADMIN / VET ONLY) */}
      {role === 'admin' && targetAnimal && (
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Add Clinical Diagnosis */}
          <form
            onSubmit={handleSaveClinical}
            className="bg-white rounded-3xl p-6 border border-[#A5B99A]/40 shadow-sm space-y-4"
          >
            <h3 className="text-base font-extrabold text-[#26332B] flex items-center gap-2">
              <Thermometer className="w-4 h-4 text-[#174D37]" />
              Add Verified Veterinary Clinical Record
            </h3>

            <div>
              <label className="block text-xs font-bold text-[#26332B] mb-1">
                Clinical Diagnosis / Assessment *
              </label>
              <input
                required
                type="text"
                value={diagnosis}
                onChange={(e) => setDiagnosis(e.target.value)}
                placeholder="e.g., Post-operative wound check, Tick fever prophylaxis"
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF8F1] border border-[#A5B99A]/50 text-sm"
              />
            </div>

            <div className="grid sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-[#26332B] mb-1">
                  Infectious Disease Surveillance Flag
                </label>
                <select
                  value={diseaseFlag}
                  onChange={(e) => setDiseaseFlag(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl bg-[#FAF8F1] border border-[#A5B99A]/50 text-xs font-bold"
                >
                  <option value="None">None (Standard Care)</option>
                  <option value="Suspected Rabies - Isolate">
                    Suspected Rabies — Refer & Isolate
                  </option>
                  <option value="Suspected Parvovirus - Isolate">
                    Suspected Parvovirus — Refer & Isolate
                  </option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#26332B] mb-1">
                  Updated Health Status
                </label>
                <select
                  value={newHealthStatus}
                  onChange={(e) => setNewHealthStatus(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl bg-[#FAF8F1] border border-[#A5B99A]/50 text-xs font-bold"
                >
                  <option value="Healthy">Healthy</option>
                  <option value="Under Treatment">Under Treatment</option>
                  <option value="Critical Attention">Critical Attention</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#26332B] mb-1">
                Observed Symptoms
              </label>
              <input
                type="text"
                value={symptoms}
                onChange={(e) => setSymptoms(e.target.value)}
                placeholder="e.g., Normal appetite, clean healing incision"
                className="w-full px-3.5 py-2 rounded-xl bg-[#FAF8F1] border border-[#A5B99A]/50 text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#26332B] mb-1">
                Treatment & Prescribed Medications *
              </label>
              <textarea
                required
                rows={2}
                value={treatment}
                onChange={(e) => setTreatment(e.target.value)}
                placeholder="Dosage, fluid therapy, isolation instructions..."
                className="w-full px-3.5 py-2 rounded-xl bg-[#FAF8F1] border border-[#A5B99A]/50 text-sm"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-[#174D37] hover:bg-[#226B4D] text-white font-bold text-xs"
            >
              Certify & Append Medical Record
            </button>
          </form>

          {/* Issue Vaccination Certificate */}
          <form
            onSubmit={handleSaveVaccine}
            className="bg-white rounded-3xl p-6 border border-[#A5B99A]/40 shadow-sm space-y-4 flex flex-col justify-between"
          >
            <div className="space-y-4">
              <h3 className="text-base font-extrabold text-[#26332B] flex items-center gap-2">
                <Syringe className="w-4 h-4 text-[#174D37]" />
                Administer & Certify Vaccination
              </h3>

              <div>
                <label className="block text-xs font-bold text-[#26332B] mb-1">Vaccine Type</label>
                <select
                  value={vaccineType}
                  onChange={(e) => setVaccineType(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF8F1] border border-[#A5B99A]/50 text-sm font-semibold"
                >
                  <option value="Anti-Rabies Annual Booster">Anti-Rabies Annual Booster</option>
                  <option value="DHPPi + L (Parvovirus / Distemper)">
                    DHPPi + L (Parvovirus / Distemper)
                  </option>
                  <option value="Puppy DP Primary Immunization">
                    Puppy DP Primary Immunization
                  </option>
                  <option value="Kennel Cough (Bordetella)">Kennel Cough (Bordetella)</option>
                </select>
              </div>

              <div className="grid sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-[#26332B] mb-1">
                    Vaccine Batch / Lot #
                  </label>
                  <input
                    required
                    type="text"
                    value={batchNumber}
                    onChange={(e) => setBatchNumber(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF8F1] border border-[#A5B99A]/50 text-sm font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#26332B] mb-1">
                    Next Booster Due Date
                  </label>
                  <input
                    required
                    type="date"
                    value={nextDueDate}
                    onChange={(e) => setNextDueDate(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF8F1] border border-[#A5B99A]/50 text-sm"
                  />
                </div>
              </div>

              {/* Visual Vaccination Timeline for Selected Animal */}
              <div className="pt-2">
                <p className="text-xs font-extrabold uppercase tracking-wider text-[#5C6B62] mb-2">
                  Current Immunization Timeline ({targetAnimal.name})
                </p>
                <div className="space-y-2 max-h-40 overflow-y-auto">
                  {targetAnimal.vaccinations.map((v) => (
                    <div
                      key={v.id}
                      className="p-3 rounded-xl bg-[#FAF8F1] border border-[#A5B99A]/40 flex items-center justify-between text-xs"
                    >
                      <div>
                        <p className="font-bold text-[#174D37]">{v.vaccine}</p>
                        <p className="text-[#5C6B62]">
                          Given: {v.date} · Next Due: <strong>{v.next_due}</strong>
                        </p>
                      </div>
                      <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold text-[10px]">
                        {v.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-[#E8A64A] hover:bg-[#df9a38] text-[#26332B] font-extrabold text-xs shadow-sm"
            >
              Issue Digital Vaccination Certificate
            </button>
          </form>
        </div>
      )}
    </div>
  );
}

// 7. BEHAVIOUR MONITORING MODULE
