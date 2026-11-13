// PAW TRACK — Adoption application form

import { useState } from 'react';
import { X, Phone } from 'lucide-react';

export function AdoptionModal({ animal, currentUser, onClose, onSubmit }) {
  const [applicantName, setApplicantName] = useState(currentUser?.name || '');
  const [applicantEmail, setApplicantEmail] = useState(currentUser?.email || '');
  const [applicantPhone, setApplicantPhone] = useState('');
  const [address, setAddress] = useState('');
  const [homeType, setHomeType] = useState('Apartment with balcony / nearby park');
  const [experience, setExperience] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      animal_id: animal.id,
      animal_code: animal.animal_code,
      animal_name: animal.name,
      applicant_name: applicantName,
      applicant_email: applicantEmail,
      applicant_phone: applicantPhone,
      address,
      home_type: homeType,
      experience
    });
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
          <div>
            <span className="font-mono text-xs font-bold text-[#174D37]">{animal.animal_code}</span>
            <h3 className="text-xl font-extrabold text-[#26332B]">Adopt {animal.name}</h3>
          </div>
          <button onClick={onClose}>
            <X className="w-5 h-5 text-[#5C6B62]" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3.5">
          <div>
            <label className="block text-xs font-bold text-[#26332B] mb-1">Full Name *</label>
            <input
              required
              type="text"
              value={applicantName}
              onChange={(e) => setApplicantName(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF8F1] border border-[#A5B99A]/50 text-sm"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-[#26332B] mb-1">Email *</label>
              <input
                required
                type="email"
                value={applicantEmail}
                onChange={(e) => setApplicantEmail(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF8F1] border border-[#A5B99A]/50 text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-[#26332B] mb-1">Phone *</label>
              <input
                required
                type="tel"
                value={applicantPhone}
                onChange={(e) => setApplicantPhone(e.target.value)}
                placeholder="+91 98XXX XXXXX"
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF8F1] border border-[#A5B99A]/50 text-sm"
              />
            </div>
          </div>
          <div>
            <label className="block text-xs font-bold text-[#26332B] mb-1">
              Residential Address *
            </label>
            <input
              required
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF8F1] border border-[#A5B99A]/50 text-sm"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-[#26332B] mb-1">Home Environment</label>
            <select
              value={homeType}
              onChange={(e) => setHomeType(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF8F1] border border-[#A5B99A]/50 text-sm"
            >
              <option>Apartment with balcony / nearby park</option>
              <option>Independent house with fenced yard</option>
              <option>Farmhouse / Rural estate</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-bold text-[#26332B] mb-1">
              Pet Care Experience *
            </label>
            <textarea
              required
              rows={2}
              value={experience}
              onChange={(e) => setExperience(e.target.value)}
              placeholder="Tell us about previous pets or daily routine..."
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF8F1] border border-[#A5B99A]/50 text-sm"
            />
          </div>
          <button
            type="submit"
            className="w-full py-3 rounded-xl bg-[#174D37] hover:bg-[#226B4D] text-white font-bold text-sm"
          >
            Submit Adoption Application
          </button>
        </form>
      </div>
    </div>
  );
}

// QUICK INCIDENT REPORT MODAL (FROM LANDING PAGE)
