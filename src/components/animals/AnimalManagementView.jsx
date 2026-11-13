// PAW TRACK — Registry list (search, filters, grid/table)

import { MapPin, Search, Plus, PawPrint } from 'lucide-react';
import { StatusBadge } from '../common/StatusBadge.jsx';

export function AnimalManagementView({
  role,
  animals,
  searchQuery,
  setSearchQuery,
  filterLocation,
  setFilterLocation,
  filterHealth,
  setFilterHealth,
  filterVaccination,
  setFilterVaccination,
  filterBehaviour,
  setFilterBehaviour,
  filterAdoption,
  setFilterAdoption,
  displayMode,
  setDisplayMode,
  onSelectAnimal,
  onOpenAdoptModal,
  onAddNew
}) {
  const clearFilters = () => {
    setSearchQuery('');
    setFilterLocation('All');
    setFilterHealth('All');
    setFilterVaccination('All');
    setFilterBehaviour('All');
    setFilterAdoption('All');
  };

  return (
    <div className="space-y-6">
      {/* SEARCH & FILTER BAR */}
      <div className="bg-white rounded-3xl p-5 border border-[#A5B99A]/40 shadow-sm space-y-4">
        <div className="flex flex-col md:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-[#5C6B62] absolute left-3.5 top-3.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by Animal ID (e.g. PT-2026-0001), Name, Breed, or Location..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#FAF8F1] border border-[#A5B99A]/50 text-sm focus:outline-none focus:border-[#174D37]"
            />
          </div>

          <div className="flex items-center gap-2">
            <div className="inline-flex rounded-xl bg-[#FAF8F1] p-1 border border-[#A5B99A]/40">
              <button
                onClick={() => setDisplayMode('grid')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  displayMode === 'grid' ? 'bg-[#174D37] text-white' : 'text-[#5C6B62]'
                }`}
              >
                Grid View
              </button>
              <button
                onClick={() => setDisplayMode('table')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  displayMode === 'table' ? 'bg-[#174D37] text-white' : 'text-[#5C6B62]'
                }`}
              >
                Table View
              </button>
            </div>

            {role !== 'user' && (
              <button
                onClick={onAddNew}
                className="px-4 py-2.5 rounded-xl bg-[#174D37] text-white text-xs font-bold hover:bg-[#226B4D] flex items-center gap-1.5"
              >
                <Plus className="w-4 h-4" /> Add Animal
              </button>
            )}
          </div>
        </div>

        {/* MULTI-ATTRIBUTE FILTERS */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
          <select
            value={filterLocation}
            onChange={(e) => setFilterLocation(e.target.value)}
            className="px-3 py-2 rounded-xl bg-[#FAF8F1] border border-[#A5B99A]/40 text-xs font-semibold text-[#26332B]"
          >
            <option value="All">All Locations</option>
            <option value="Indiranagar">Indiranagar</option>
            <option value="Koramangala">Koramangala</option>
            <option value="HSR Layout">HSR Layout</option>
            <option value="Jayanagar">Jayanagar</option>
            <option value="Whitefield">Whitefield</option>
            <option value="Malleshwaram">Malleshwaram</option>
          </select>

          <select
            value={filterHealth}
            onChange={(e) => setFilterHealth(e.target.value)}
            className="px-3 py-2 rounded-xl bg-[#FAF8F1] border border-[#A5B99A]/40 text-xs font-semibold text-[#26332B]"
          >
            <option value="All">All Health Status</option>
            <option value="Healthy">Healthy</option>
            <option value="Under Treatment">Under Treatment</option>
            <option value="Critical Attention">Critical Attention</option>
          </select>

          <select
            value={filterVaccination}
            onChange={(e) => setFilterVaccination(e.target.value)}
            className="px-3 py-2 rounded-xl bg-[#FAF8F1] border border-[#A5B99A]/40 text-xs font-semibold text-[#26332B]"
          >
            <option value="All">All Vaccination</option>
            <option value="Vaccinated">Vaccinated</option>
            <option value="Partially Vaccinated">Partially Vaccinated</option>
            <option value="Overdue">Overdue</option>
            <option value="Verification Required">Verification Required</option>
          </select>

          <select
            value={filterBehaviour}
            onChange={(e) => setFilterBehaviour(e.target.value)}
            className="px-3 py-2 rounded-xl bg-[#FAF8F1] border border-[#A5B99A]/40 text-xs font-semibold text-[#26332B]"
          >
            <option value="All">All Behaviour</option>
            <option value="Friendly">Friendly</option>
            <option value="Calm">Calm</option>
            <option value="Shy">Shy</option>
            <option value="Fearful">Fearful</option>
            <option value="Aggressive">Aggressive</option>
          </select>

          <select
            value={filterAdoption}
            onChange={(e) => setFilterAdoption(e.target.value)}
            className="px-3 py-2 rounded-xl bg-[#FAF8F1] border border-[#A5B99A]/40 text-xs font-semibold text-[#26332B]"
          >
            <option value="All">All Adoption Status</option>
            <option value="Available for Adoption">Available for Adoption</option>
            <option value="Pending Adoption">Pending Adoption</option>
            <option value="Adopted">Adopted</option>
            <option value="Under Medical Treatment">Under Medical Treatment</option>
            <option value="Not Available">Not Available</option>
          </select>

          <button
            onClick={clearFilters}
            className="px-3 py-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-xs font-bold text-[#5C6B62]"
          >
            Reset Filters ({animals.length})
          </button>
        </div>
      </div>

      {/* RESULTS DISPLAY */}
      {animals.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-[#A5B99A]/40">
          <PawPrint className="w-10 h-10 text-[#A5B99A] mx-auto mb-3" />
          <h3 className="text-lg font-bold text-[#26332B]">No matching animal records found</h3>
          <p className="text-xs text-[#5C6B62] mt-1">
            Try clearing active filters or searching by a different Animal ID.
          </p>
        </div>
      ) : displayMode === 'grid' ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {animals.map((a) => (
            <div
              key={a.id}
              className="bg-white rounded-3xl overflow-hidden border border-[#A5B99A]/40 shadow-sm hover:shadow-lg transition-all flex flex-col"
            >
              <div className="relative h-56">
                <img src={a.photos[0]} alt={a.name} className="w-full h-full object-cover" />
                <span className="absolute top-3 left-3 font-mono text-xs font-extrabold px-2.5 py-1 rounded-lg bg-[#174D37] text-white">
                  {a.animal_code}
                </span>
                <div className="absolute top-3 right-3">
                  <StatusBadge value={a.health_status} />
                </div>
              </div>

              <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                <div>
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-extrabold text-[#26332B]">{a.name}</h3>
                    <span className="text-xs font-semibold text-[#5C6B62]">
                      {a.gender} · {a.estimated_age}
                    </span>
                  </div>
                  <p className="text-xs text-[#5C6B62]">{a.breed}</p>
                  <p className="text-xs text-[#5C6B62] flex items-center gap-1 mt-1.5">
                    <MapPin className="w-3.5 h-3.5 text-[#E8A64A]" /> {a.location_name}
                  </p>

                  <div className="flex flex-wrap gap-1.5 mt-3">
                    <StatusBadge value={a.vaccination_status} />
                    <StatusBadge value={a.behaviour_status} />
                    <StatusBadge value={a.adoption_status} />
                  </div>
                </div>

                <div className="pt-3 border-t border-stone-100 flex items-center gap-2">
                  <button
                    onClick={() => onSelectAnimal(a.id)}
                    className="flex-1 py-2.5 rounded-xl bg-[#174D37] hover:bg-[#226B4D] text-white text-xs font-bold transition-colors"
                  >
                    View Profile & QR
                  </button>
                  {a.adoption_status === 'Available for Adoption' && (
                    <button
                      onClick={() => onOpenAdoptModal(a)}
                      className="px-3.5 py-2.5 rounded-xl bg-[#E8A64A]/20 text-[#8A5408] hover:bg-[#E8A64A]/30 text-xs font-bold"
                    >
                      Adopt
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-3xl border border-[#A5B99A]/40 shadow-sm overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-stone-100 bg-[#FAF8F1] text-[11px] font-extrabold uppercase tracking-wider text-[#5C6B62]">
                <th className="p-4">Animal</th>
                <th className="p-4">Location</th>
                <th className="p-4">Health</th>
                <th className="p-4">Vaccination</th>
                <th className="p-4">Behaviour</th>
                <th className="p-4">Adoption</th>
                <th className="p-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100 text-xs">
              {animals.map((a) => (
                <tr key={a.id} className="hover:bg-[#FAF8F1]/60">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={a.photos[0]}
                        alt={a.name}
                        className="w-10 h-10 rounded-xl object-cover"
                      />
                      <div>
                        <p className="font-mono font-bold text-[#174D37]">{a.animal_code}</p>
                        <p className="font-bold text-[#26332B]">
                          {a.name} <span className="font-normal text-[#5C6B62]">({a.breed})</span>
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="p-4 text-[#5C6B62]">{a.location_name}</td>
                  <td className="p-4">
                    <StatusBadge value={a.health_status} />
                  </td>
                  <td className="p-4">
                    <StatusBadge value={a.vaccination_status} />
                  </td>
                  <td className="p-4">
                    <StatusBadge value={a.behaviour_status} />
                  </td>
                  <td className="p-4">
                    <StatusBadge value={a.adoption_status} />
                  </td>
                  <td className="p-4 text-right">
                    <button
                      onClick={() => onSelectAnimal(a.id)}
                      className="px-3 py-1.5 rounded-lg bg-[#174D37] text-white font-bold"
                    >
                      Open
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

// 4. ANIMAL REGISTRATION & UNIQUE ID GENERATOR FORM
