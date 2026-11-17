// PAW TRACK — shared data layer.
//
// Every record of the app is one row in Supabase: a text `id` plus the record
// itself inside a `data` jsonb column. Ratings are a real table so the
// community average is computed across every user, not just the current tab.
//
// When Supabase is not configured (no `.env`) nothing here runs and the app
// keeps working from the bundled demo data in `src/data`.

import { supabase, isSupabaseConfigured } from './supabase.js';

// App state key -> database table
export const SYNC_TABLES = {
  animals: 'animals',
  adoptions: 'adoptions',
  groups: 'feeding_groups',
  notifications: 'notifications',
  volunteerReports: 'volunteer_reports',
  volunteers: 'volunteers',
  activityLogs: 'activity_logs'
};

export const RATINGS_TABLE = 'animal_ratings';

// True when the shared database is active
export const isShared = isSupabaseConfigured;

const docsFromRows = (rows) => (rows || []).map((row) => ({ ...(row.data || {}), id: row.id }));

// --- Reads -----------------------------------------------------------

export const fetchCollection = async (table) => {
  const { data, error } = await supabase
    .from(table)
    .select('id, data')
    .order('created_at', { ascending: false });
  if (error) throw error;
  return docsFromRows(data);
};

// Returns { [animalId]: [score, score, ...] }
export const fetchRatings = async () => {
  const { data, error } = await supabase.from(RATINGS_TABLE).select('animal_id, score');
  if (error) throw error;
  const map = {};
  (data || []).forEach(({ animal_id: animalId, score }) => {
    if (!animalId) return;
    map[animalId] = [...(map[animalId] || []), score];
  });
  return map;
};

export const fetchAll = async () => {
  const [
    animals,
    ratings,
    adoptions,
    groups,
    notifications,
    volunteerReports,
    volunteers,
    activityLogs
  ] = await Promise.all([
    fetchCollection(SYNC_TABLES.animals),
    fetchRatings(),
    fetchCollection(SYNC_TABLES.adoptions),
    fetchCollection(SYNC_TABLES.groups),
    fetchCollection(SYNC_TABLES.notifications),
    fetchCollection(SYNC_TABLES.volunteerReports),
    fetchCollection(SYNC_TABLES.volunteers),
    fetchCollection(SYNC_TABLES.activityLogs)
  ]);

  return {
    animals,
    ratings,
    adoptions,
    groups,
    notifications,
    volunteerReports,
    volunteers,
    activityLogs
  };
};

// --- Writes ----------------------------------------------------------

export const upsertDoc = (table, doc) =>
  supabase
    .from(table)
    .upsert({ id: doc.id, data: doc, updated_at: new Date().toISOString() });

export const deleteDoc = (table, id) => supabase.from(table).delete().eq('id', id);

export const insertRating = (animalId, score, ratedBy) =>
  supabase.from(RATINGS_TABLE).insert({ animal_id: animalId, score, rated_by: ratedBy });

// --- Live updates ----------------------------------------------------

// Calls `onTableChange(tableName)` whenever any shared table changes, on any
// device. Returns an unsubscribe function.
export const subscribeToChanges = (onTableChange) => {
  const channel = supabase
    .channel('pawtrack-shared-data')
    .on('postgres_changes', { event: '*', schema: 'public' }, (payload) => {
      onTableChange(payload.table);
    })
    .subscribe();

  return () => supabase.removeChannel(channel);
};
