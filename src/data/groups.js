// PAW TRACK — Seed data: volunteer feeding groups

export const INITIAL_GROUPS = [
  {
    id: 'g1',
    name: 'Indiranagar Evening Route',
    description: 'Community dogs fed together near the park every evening.',
    animal_ids: ['a1'],
    created_by: 'Ananya Sharma',
    created_at: '2026-10-02',
    last_fed_at: null,
    last_fed_by: null,
    feed_count: 0
  },
  {
    id: 'g2',
    name: 'South Bengaluru Cluster',
    description: 'Koramangala, HSR and Jayanagar dogs on one shared feeding run.',
    animal_ids: ['a2', 'a3', 'a4'],
    created_by: 'Rahul Nair',
    created_at: '2026-10-11',
    last_fed_at: '2026-11-12',
    last_fed_by: 'Rahul Nair',
    feed_count: 7
  }
];
