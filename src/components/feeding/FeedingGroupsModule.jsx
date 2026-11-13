// PAW TRACK — Volunteer feeding groups (batch-mark a whole cluster as fed)

import { useState } from 'react';
import { Plus, Trash2, Utensils, PawPrint, Search, Pencil } from 'lucide-react';
import { DogAvatar } from '../common/DogAvatar.jsx';

const FOOD_OPTIONS = [
  'Dry Kibble',
  'Cooked Rice & Chicken',
  'Milk & Biscuits',
  'Wet Food',
  'Water Refill'
];

const inputClass =
  'w-full px-3 py-2 rounded-xl bg-[#FAF8F1] border border-[#A5B99A]/50 text-sm focus:outline-none focus:border-[#174D37]';
const labelClass = 'block text-[11px] font-bold text-[#5C6B62] mb-1';

export function FeedingGroupsModule({
  role,
  groups,
  animals,
  onSelectAnimal,
  onCreateGroup,
  onUpdateGroup,
  onDeleteGroup,
  onMarkFed
}) {
  const canManage = role !== 'user';

  const [formOpen, setFormOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [memberIds, setMemberIds] = useState([]);
  const [search, setSearch] = useState('');
  const [foodType, setFoodType] = useState({});

  const animalById = (id) => animals.find((a) => a.id === id);

  const toggleMember = (id) =>
    setMemberIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));

  const resetForm = () => {
    setFormOpen(false);
    setEditingId(null);
    setName('');
    setDescription('');
    setMemberIds([]);
    setSearch('');
  };

  const startCreate = () => {
    resetForm();
    setFormOpen(true);
  };

  const startEdit = (g) => {
    setEditingId(g.id);
    setName(g.name);
    setDescription(g.description || '');
    setMemberIds(g.animal_ids);
    setSearch('');
    setFormOpen(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim() || memberIds.length === 0) return;
    const payload = { name: name.trim(), description: description.trim(), animal_ids: memberIds };
    if (editingId) onUpdateGroup(editingId, payload);
    else onCreateGroup(payload);
    resetForm();
  };

  const visibleAnimals = animals.filter(
    (a) =>
      a.name.toLowerCase().includes(search.toLowerCase()) ||
      a.animal_code.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-3xl p-6 border border-[#A5B99A]/40 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-extrabold text-[#26332B]">Feeding Groups</h2>
            <p className="text-xs text-[#5C6B62] mt-1">
              Group community dogs that are fed together, then mark the whole group as fed in one
              tap — no need to scan each dog.
            </p>
          </div>
          {canManage && !formOpen && (
            <button
              onClick={startCreate}
              className="px-4 py-2.5 rounded-xl bg-[#174D37] text-white text-xs font-bold hover:bg-[#226B4D] flex items-center gap-1.5 shrink-0"
            >
              <Plus className="w-4 h-4" /> Create Group
            </button>
          )}
        </div>

        {formOpen && (
          <form onSubmit={handleSubmit} className="mt-5 pt-5 border-t border-[#A5B99A]/30 space-y-4">
            <h3 className="text-sm font-extrabold text-[#26332B]">
              {editingId ? 'Edit Group' : 'New Group'}
            </h3>
            <div className="grid sm:grid-cols-2 gap-3">
              <div>
                <label className={labelClass}>Group Name *</label>
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Whitefield Morning Route"
                  className={inputClass}
                  required
                />
              </div>
              <div>
                <label className={labelClass}>Description</label>
                <input
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Feeding schedule / street notes"
                  className={inputClass}
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className={labelClass}>Select Dogs ({memberIds.length} selected) *</label>
                <div className="relative">
                  <Search className="w-3.5 h-3.5 text-[#5C6B62] absolute left-2.5 top-2.5" />
                  <input
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search by name / ID"
                    className="pl-8 pr-3 py-1.5 rounded-lg bg-[#FAF8F1] border border-[#A5B99A]/50 text-xs focus:outline-none focus:border-[#174D37]"
                  />
                </div>
              </div>
              <div className="max-h-56 overflow-y-auto rounded-2xl border border-[#A5B99A]/40 divide-y divide-stone-100">
                {visibleAnimals.map((a) => (
                  <label
                    key={a.id}
                    className="flex items-center gap-3 p-2.5 hover:bg-[#FAF8F1] cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={memberIds.includes(a.id)}
                      onChange={() => toggleMember(a.id)}
                      className="w-4 h-4 accent-[#174D37]"
                    />
                    <DogAvatar animal={a} className="w-8 h-8 rounded-lg object-cover" />
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-[#26332B] truncate">
                        {a.name}{' '}
                        <span className="font-mono font-normal text-[#5C6B62]">
                          {a.animal_code}
                        </span>
                      </p>
                      <p className="text-[11px] text-[#5C6B62] truncate">{a.location_name}</p>
                    </div>
                  </label>
                ))}
                {visibleAnimals.length === 0 && (
                  <p className="p-3 text-xs text-[#5C6B62]">No animals match your search.</p>
                )}
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="submit"
                className="px-5 py-2.5 rounded-xl bg-[#174D37] text-white text-xs font-bold hover:bg-[#226B4D]"
              >
                {editingId ? 'Save Changes' : 'Save Group'}
              </button>
              <button
                type="button"
                onClick={resetForm}
                className="px-4 py-2.5 rounded-xl bg-stone-100 text-[#5C6B62] text-xs font-bold hover:bg-stone-200"
              >
                Cancel
              </button>
            </div>
          </form>
        )}
      </div>

      {groups.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-[#A5B99A]/40">
          <PawPrint className="w-10 h-10 text-[#A5B99A] mx-auto mb-3" />
          <h3 className="text-lg font-bold text-[#26332B]">No feeding groups yet</h3>
          <p className="text-xs text-[#5C6B62] mt-1">
            Create a group to batch-mark a cluster of community dogs as fed.
          </p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-6">
          {groups.map((g) => {
            const members = g.animal_ids.map(animalById).filter(Boolean);
            const selectedFood = foodType[g.id] || FOOD_OPTIONS[0];
            return (
              <div
                key={g.id}
                className="bg-white rounded-3xl p-6 border border-[#A5B99A]/40 shadow-sm flex flex-col justify-between space-y-4"
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h3 className="text-base font-extrabold text-[#26332B]">{g.name}</h3>
                      {g.description && (
                        <p className="text-xs text-[#5C6B62] mt-0.5">{g.description}</p>
                      )}
                    </div>
                    {canManage && (
                      <div className="flex items-center gap-1 shrink-0">
                        <button
                          onClick={() => startEdit(g)}
                          className="p-2 rounded-xl text-[#174D37] hover:bg-[#E8EFE5]"
                          title="Edit group"
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => onDeleteGroup(g.id)}
                          className="p-2 rounded-xl text-red-600 hover:bg-red-50"
                          title="Delete group"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    )}
                  </div>

                  <div className="flex flex-wrap gap-1.5">
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold border bg-[#174D37]/10 text-[#174D37] border-[#174D37]/20">
                      {members.length} dog{members.length === 1 ? '' : 's'}
                    </span>
                    <span className="text-[11px] text-[#5C6B62] self-center">
                      by {g.created_by} · {g.created_at}
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-1.5">
                    {members.map((m) => (
                      <button
                        key={m.id}
                        onClick={() => onSelectAnimal(m.id)}
                        className="inline-flex items-center gap-1.5 pl-1 pr-2.5 py-1 rounded-full bg-[#FAF8F1] border border-[#A5B99A]/40 text-[11px] font-semibold text-[#26332B] hover:border-[#174D37]"
                      >
                        <DogAvatar animal={m} className="w-5 h-5 rounded-full object-cover" />
                        {m.name}
                      </button>
                    ))}
                    {members.length === 0 && (
                      <span className="text-[11px] text-[#5C6B62]">
                        All member dogs have been removed from the registry.
                      </span>
                    )}
                  </div>

                  <div className="text-[11px] text-[#5C6B62]">
                    {g.last_fed_at
                      ? `Last fed ${g.last_fed_at} by ${g.last_fed_by} · ${g.feed_count} batch feed(s)`
                      : 'Not fed yet.'}
                  </div>
                </div>

                <div className="pt-3 border-t border-stone-100 flex items-center gap-2">
                  <select
                    value={selectedFood}
                    onChange={(e) => setFoodType((p) => ({ ...p, [g.id]: e.target.value }))}
                    className="flex-1 px-3 py-2.5 rounded-xl bg-[#FAF8F1] border border-[#A5B99A]/50 text-xs font-semibold text-[#26332B]"
                  >
                    {FOOD_OPTIONS.map((f) => (
                      <option key={f} value={f}>
                        {f}
                      </option>
                    ))}
                  </select>
                  <button
                    onClick={() => onMarkFed(g.id, { food_type: selectedFood, quantity: '1 meal' })}
                    disabled={members.length === 0}
                    className="px-4 py-2.5 rounded-xl bg-[#E8A64A] text-[#26332B] text-xs font-bold hover:bg-[#d9973b] disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1.5"
                  >
                    <Utensils className="w-3.5 h-3.5" /> Mark Group as Fed
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
