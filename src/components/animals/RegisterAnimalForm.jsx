// PAW TRACK — Animal registration & unique ID minting

import { useRef, useState } from 'react';
import { QrCode, Navigation, Upload } from 'lucide-react';

export function RegisterAnimalForm({ role, nextAnimalCode, currentUser, onSubmit, onCancel }) {
  const [name, setName] = useState('');
  const [breed, setBreed] = useState('Indian Pariah (Indie)');
  const [age, setAge] = useState('1.5 Years');
  const [gender, setGender] = useState('Male');
  const [colour, setColour] = useState('');
  const [marks, setMarks] = useState('');
  const [locationName, setLocationName] = useState('');
  const [coords, setCoords] = useState({ lat: 12.9716, lng: 77.5946 });
  const [rescueDetails, setRescueDetails] = useState('');
  const [healthStatus, setHealthStatus] = useState('Healthy');
  const [vaxStatus, setVaxStatus] = useState(
    role === 'admin' ? 'Vaccinated' : 'Verification Required'
  );
  const [behaviourStatus, setBehaviourStatus] = useState('Friendly');
  const [adoptionStatus, setAdoptionStatus] = useState('Available for Adoption');
  const [photoPreset, setPhotoPreset] = useState(
    'https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&w=900&q=80'
  );
  const [uploadedPhoto, setUploadedPhoto] = useState(null);
  const photoInputRef = useRef(null);
  const [gpsStatus, setGpsStatus] = useState('');

  // Read a locally picked image into a data URL so it can be stored with the record
  const handlePhotoUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      setUploadedPhoto(reader.result);
      setPhotoPreset(reader.result);
    };
    reader.readAsDataURL(file);
    // Allow re-selecting the same file
    e.target.value = '';
  };

  const handleCaptureGPS = () => {
    setGpsStatus('Capturing coordinates...');
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setCoords({
            lat: Number(pos.coords.latitude.toFixed(4)),
            lng: Number(pos.coords.longitude.toFixed(4))
          });
          setGpsStatus(
            `GPS Locked: ${pos.coords.latitude.toFixed(4)}, ${pos.coords.longitude.toFixed(4)}`
          );
        },
        () => {
          setGpsStatus('Location permission denied — using default municipal zone coordinates.');
        }
      );
    } else {
      setGpsStatus('Geolocation unavailable — using manual zone.');
    }
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      name: name || 'Unnamed Community Dog',
      breed,
      estimated_age: age,
      gender,
      colour: colour || 'Fawn / Tan',
      identifying_marks: marks || 'None recorded',
      location_name: locationName || 'Central Community Zone',
      lat: coords.lat,
      lng: coords.lng,
      rescue_details: rescueDetails || 'Registered during community welfare survey.',
      assigned_volunteer: currentUser?.name || 'Ananya Sharma',
      health_status: healthStatus,
      vaccination_status: vaxStatus,
      behaviour_status: behaviourStatus,
      adoption_status: adoptionStatus,
      sterilized: false,
      dewormed: true,
      photos: [photoPreset]
    });
  };

  return (
    <div className="max-w-4xl mx-auto bg-white rounded-3xl p-6 sm:p-8 border border-[#A5B99A]/40 shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-stone-100">
        <div>
          <span className="text-xs font-extrabold uppercase tracking-wider text-[#174D37] bg-[#E8EFE5] px-3 py-1 rounded-full">
            Digital Identity Minting
          </span>
          <h2 className="text-2xl font-extrabold text-[#26332B] mt-2">
            Register New Community Animal
          </h2>
          <p className="text-xs text-[#5C6B62] mt-0.5">
            Automatically generates a permanent Unique Animal ID and scannable QR profile.
          </p>
        </div>

        <div className="flex items-center gap-3 bg-[#FAF8F1] p-3 rounded-2xl border border-[#A5B99A]/40">
          <div>
            <p className="text-[10px] font-bold uppercase text-[#5C6B62]">Auto-Assigned ID</p>
            <p className="font-mono text-base font-extrabold text-[#174D37]">{nextAnimalCode}</p>
          </div>
          <QrCode className="w-8 h-8 text-[#174D37]" />
        </div>
      </div>

      <form onSubmit={handleFormSubmit} className="mt-6 space-y-6">
        {/* PHOTOGRAPH SELECTION / UPLOAD */}
        <div>
          <label className="block text-xs font-bold text-[#26332B] mb-2">
            Animal Photograph (Select Sample or Upload Local Photo)
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
            {[
              {
                label: 'Golden Indie',
                url: 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&w=900&q=80'
              },
              {
                label: 'Brindle Hound',
                url: 'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?auto=format&fit=crop&w=900&q=80'
              },
              {
                label: 'Community Pup',
                url: 'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?auto=format&fit=crop&w=900&q=80'
              },
              {
                label: 'White Spitz Mix',
                url: 'https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&w=900&q=80'
              }
            ].map((img, i) => (
              <button
                type="button"
                key={i}
                onClick={() => setPhotoPreset(img.url)}
                className={`relative rounded-2xl overflow-hidden border-2 h-24 transition-all ${
                  photoPreset === img.url ? 'border-[#174D37] ring-2 ring-[#174D37]/30' : 'border-transparent'
                }`}
              >
                <img src={img.url} alt={img.label} className="w-full h-full object-cover" />
                <span className="absolute bottom-1 left-1 right-1 bg-black/60 text-white text-[10px] font-bold py-0.5 rounded">
                  {img.label}
                </span>
              </button>
            ))}

            {/* LOCAL PHOTO UPLOAD */}
            {uploadedPhoto ? (
              <button
                type="button"
                onClick={() => photoInputRef.current?.click()}
                title="Click to choose a different photo"
                className={`relative rounded-2xl overflow-hidden border-2 h-24 transition-all ${
                  photoPreset === uploadedPhoto
                    ? 'border-[#174D37] ring-2 ring-[#174D37]/30'
                    : 'border-transparent'
                }`}
              >
                <img src={uploadedPhoto} alt="Uploaded animal" className="w-full h-full object-cover" />
                <span className="absolute bottom-1 left-1 right-1 bg-black/60 text-white text-[10px] font-bold py-0.5 rounded">
                  Your Upload · Change
                </span>
              </button>
            ) : (
              <button
                type="button"
                onClick={() => photoInputRef.current?.click()}
                className="rounded-2xl border-2 border-dashed border-[#A5B99A] h-24 flex flex-col items-center justify-center gap-1 text-[#5C6B62] hover:bg-[#E8EFE5]/60 transition-colors"
              >
                <Upload className="w-5 h-5 text-[#174D37]" />
                <span className="text-[10px] font-bold">Upload Photo</span>
              </button>
            )}
          </div>

          <input
            ref={photoInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handlePhotoUpload}
          />
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-[#26332B] mb-1">
              Name / Temporary Call Name *
            </label>
            <input
              required
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., Rocky, Gauri, Chintu"
              className="w-full px-4 py-2.5 rounded-xl bg-[#FAF8F1] border border-[#A5B99A]/50 text-sm"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#26332B] mb-1">Breed / Mix *</label>
            <input
              required
              type="text"
              value={breed}
              onChange={(e) => setBreed(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-[#FAF8F1] border border-[#A5B99A]/50 text-sm"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#26332B] mb-1">Estimated Age</label>
            <input
              type="text"
              value={age}
              onChange={(e) => setAge(e.target.value)}
              placeholder="e.g., 8 Months, 3 Years"
              className="w-full px-4 py-2.5 rounded-xl bg-[#FAF8F1] border border-[#A5B99A]/50 text-sm"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#26332B] mb-1">Gender</label>
            <select
              value={gender}
              onChange={(e) => setGender(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-[#FAF8F1] border border-[#A5B99A]/50 text-sm"
            >
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Unknown">Unknown</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#26332B] mb-1">Coat Colour</label>
            <input
              type="text"
              value={colour}
              onChange={(e) => setColour(e.target.value)}
              placeholder="e.g., Golden Tan & White"
              className="w-full px-4 py-2.5 rounded-xl bg-[#FAF8F1] border border-[#A5B99A]/50 text-sm"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#26332B] mb-1">
              Identifying Marks / Ear Notch
            </label>
            <input
              type="text"
              value={marks}
              onChange={(e) => setMarks(e.target.value)}
              placeholder="e.g., Left ear V-notch, white tail tip"
              className="w-full px-4 py-2.5 rounded-xl bg-[#FAF8F1] border border-[#A5B99A]/50 text-sm"
            />
          </div>
        </div>

        {/* LOCATION & GPS CAPTURE */}
        <div className="p-4 rounded-2xl bg-[#FAF8F1] border border-[#A5B99A]/40 space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <label className="text-xs font-bold text-[#26332B]">
              Last Recorded Neighborhood / Landmark *
            </label>
            <button
              type="button"
              onClick={handleCaptureGPS}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-[#174D37] bg-white px-3 py-1.5 rounded-xl border border-[#A5B99A]/50 hover:bg-[#E8EFE5]"
            >
              <Navigation className="w-3.5 h-3.5" /> Capture GPS Coordinates
            </button>
          </div>
          <input
            required
            type="text"
            value={locationName}
            onChange={(e) => setLocationName(e.target.value)}
            placeholder="e.g., Indiranagar 100ft Road, Sector 3"
            className="w-full px-4 py-2.5 rounded-xl bg-white border border-[#A5B99A]/50 text-sm"
          />
          {gpsStatus && <p className="text-[11px] font-semibold text-[#174D37]">{gpsStatus}</p>}
        </div>

        {/* HEALTH, BEHAVIOUR & ADOPTION CLASSIFICATION */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label className="block text-xs font-bold text-[#26332B] mb-1">Health Condition</label>
            <select
              value={healthStatus}
              onChange={(e) => setHealthStatus(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl bg-[#FAF8F1] border border-[#A5B99A]/50 text-xs font-bold"
            >
              <option value="Healthy">Healthy</option>
              <option value="Under Treatment">Under Treatment</option>
              <option value="Critical Attention">Critical Attention</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#26332B] mb-1">Vaccination Status</label>
            <select
              value={vaxStatus}
              onChange={(e) => setVaxStatus(e.target.value)}
              disabled={role === 'volunteer'}
              className="w-full px-3 py-2.5 rounded-xl bg-[#FAF8F1] border border-[#A5B99A]/50 text-xs font-bold disabled:opacity-70"
            >
              {role === 'admin' ? (
                <>
                  <option value="Vaccinated">Vaccinated</option>
                  <option value="Partially Vaccinated">Partially Vaccinated</option>
                  <option value="Not Vaccinated">Not Vaccinated</option>
                  <option value="Overdue">Overdue</option>
                </>
              ) : (
                <option value="Verification Required">Verification Required (Pending Vet)</option>
              )}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#26332B] mb-1">Behaviour Status</label>
            <select
              value={behaviourStatus}
              onChange={(e) => setBehaviourStatus(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl bg-[#FAF8F1] border border-[#A5B99A]/50 text-xs font-bold"
            >
              <option value="Friendly">Friendly</option>
              <option value="Calm">Calm</option>
              <option value="Shy">Shy</option>
              <option value="Fearful">Fearful</option>
              <option value="Aggressive">Aggressive</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#26332B] mb-1">Adoption Status</label>
            <select
              value={adoptionStatus}
              onChange={(e) => setAdoptionStatus(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl bg-[#FAF8F1] border border-[#A5B99A]/50 text-xs font-bold"
            >
              <option value="Available for Adoption">Available for Adoption</option>
              <option value="Not Available">Not Available (Community Dog)</option>
              <option value="Under Medical Treatment">Under Medical Treatment</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-[#26332B] mb-1">
            Rescue / Discovery Context Notes
          </label>
          <textarea
            rows={3}
            value={rescueDetails}
            onChange={(e) => setRescueDetails(e.target.value)}
            placeholder="Describe where and how the animal was found, feeder contacts, or immediate needs..."
            className="w-full px-4 py-2.5 rounded-xl bg-[#FAF8F1] border border-[#A5B99A]/50 text-sm"
          />
        </div>

        <div className="flex items-center justify-end gap-3 pt-4 border-t border-stone-100">
          <button
            type="button"
            onClick={onCancel}
            className="px-5 py-2.5 rounded-xl text-xs font-bold text-[#5C6B62] hover:bg-stone-100"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-6 py-3 rounded-xl text-xs font-bold text-white bg-[#174D37] hover:bg-[#226B4D] shadow-md"
          >
            Generate ID ({nextAnimalCode}) & Save Record
          </button>
        </div>
      </form>
    </div>
  );
}

// 6. MEDICAL & VACCINATION MANAGEMENT (HIGHEST PRIORITY MODULE)
