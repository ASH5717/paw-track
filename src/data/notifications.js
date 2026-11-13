// PAW TRACK — Seed data: alert notifications

export const INITIAL_NOTIFICATIONS = [
  {
    id: 'n1',
    title: 'Critical Infectious Disease Alert',
    message: 'Simba (PT-2026-0003) flagged for Suspected Parvovirus in HSR Sector 2. Isolation protocol active.',
    type: 'critical',
    time: '18 mins ago',
    unread: true
  },
  {
    id: 'n2',
    title: 'Overdue Rabies Booster',
    message: 'Tara (PT-2026-0002) anti-rabies booster is overdue. Schedule post-recovery immunization.',
    type: 'warning',
    time: '2 hours ago',
    unread: true
  },
  {
    id: 'n3',
    title: 'New Adoption Application',
    message: 'Siddharth Kulkarni submitted an adoption application for Bholu (PT-2026-0001).',
    type: 'info',
    time: '5 hours ago',
    unread: true
  },
  {
    id: 'n4',
    title: 'Volunteer Submission Awaiting Review',
    message: 'Ananya Sharma submitted a new stray registration for "Chutki" in Indiranagar.',
    type: 'info',
    time: '1 day ago',
    unread: false
  }
];
