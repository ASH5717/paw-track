// PAW TRACK — Seed data: registered animals registry

import { Plus } from 'lucide-react';

export const INITIAL_ANIMALS = [
  {
    id: 'a1',
    animal_code: 'PT-2026-0001',
    name: 'Bholu',
    breed: 'Indian Pariah (Indie)',
    estimated_age: '2.5 Years',
    gender: 'Male',
    colour: 'Golden Fawn & White',
    identifying_marks: 'White diamond patch on chest, notched left ear (ABC sterilized)',
    location_name: 'Indiranagar Sector 4, Bengaluru',
    lat: 12.9784,
    lng: 77.6408,
    registered_date: '2026-01-14',
    updated_at: '2026-11-10',
    rescue_details: 'Found near community park; friendly neighborhood dog cared for by local feeders.',
    assigned_volunteer: 'Ananya Sharma',
    health_status: 'Healthy',
    vaccination_status: 'Vaccinated',
    behaviour_status: 'Friendly',
    adoption_status: 'Available for Adoption',
    sterilized: true,
    dewormed: true,
    photos: [
      'https://images.unsplash.com/photo-1587300003388-59208cc962cb?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&w=900&q=80'
    ],
    medical_history: [
      {
        id: 'm101',
        date: '2026-09-18',
        diagnosis: 'Annual Wellness & Tick Prophylaxis',
        symptoms: 'None — routine preventive exam',
        treatment: 'Administered Bravecto oral chew and multivitamin supplement',
        medications: 'Fluralaner 250mg',
        vet_notes: 'Excellent coat condition, healthy weight (18.4 kg). Cleared for adoption.',
        disease_flag: 'None',
        veterinarian: 'Dr. Kavita Rao (BVSc, MVSc)',
        next_checkup: '2027-03-18'
      }
    ],
    vaccinations: [
      {
        id: 'v101',
        vaccine: 'Anti-Rabies (Nobivac Rabies)',
        date: '2026-09-18',
        next_due: '2027-09-18',
        vet: 'Dr. Kavita Rao',
        batch: 'RB-8841A',
        status: 'Verified'
      },
      {
        id: 'v102',
        vaccine: 'DHPPi + L (Parvovirus / Distemper)',
        date: '2026-09-18',
        next_due: '2027-09-18',
        vet: 'Dr. Kavita Rao',
        batch: 'DH-3309C',
        status: 'Verified'
      }
    ],
    behaviour_logs: [
      {
        id: 'b101',
        date: '2026-10-25',
        label: 'Friendly',
        notes: 'Gentle with children and other dogs. Walks calmly on a leash.',
        precautions: 'Standard leash handling.',
        observer: 'Ananya Sharma',
        verified: true
      }
    ]
  },
  {
    id: 'a2',
    animal_code: 'PT-2026-0002',
    name: 'Tara',
    breed: 'Indie / Hound Mix',
    estimated_age: '1.5 Years',
    gender: 'Female',
    colour: 'Brindle Brown',
    identifying_marks: 'Dark muzzle, white front paws',
    location_name: 'Koramangala 6th Block',
    lat: 12.9352,
    lng: 77.6245,
    registered_date: '2026-02-22',
    updated_at: '2026-11-12',
    rescue_details: 'Rescued from highway service road after minor hind-limb sprain.',
    assigned_volunteer: 'Rohan Deshmukh',
    health_status: 'Under Treatment',
    vaccination_status: 'Overdue',
    behaviour_status: 'Shy',
    adoption_status: 'Under Medical Treatment',
    sterilized: true,
    dewormed: true,
    photos: [
      'https://images.unsplash.com/photo-1517849845537-4d257902454a?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?auto=format&fit=crop&w=900&q=80'
    ],
    medical_history: [
      {
        id: 'm102',
        date: '2026-11-05',
        diagnosis: 'Soft Tissue Contusion & Mild Dermatitis',
        symptoms: 'Slight limp on left hind leg, localized dry skin patch',
        treatment: 'Anti-inflammatory therapy + medicated chlorhexidine wash',
        medications: 'Meloxicam 1.5mg/ml (5 days), Omega-3 fatty acids',
        vet_notes: 'Responding well to rest. Booster vaccination scheduled once off anti-inflammatories.',
        disease_flag: 'None',
        veterinarian: 'Dr. Vikram Menon',
        next_checkup: '2026-11-20'
      }
    ],
    vaccinations: [
      {
        id: 'v103',
        vaccine: 'Anti-Rabies Primary',
        date: '2025-10-10',
        next_due: '2026-10-10',
        vet: 'Dr. Vikram Menon',
        batch: 'RB-4102K',
        status: 'Verified'
      }
    ],
    behaviour_logs: [
      {
        id: 'b102',
        date: '2026-11-06',
        label: 'Shy',
        notes: 'Initially retreats from sudden loud noises, warms up quickly with soft voice and treats.',
        precautions: 'Approach slowly from the side; avoid sudden overhead movements.',
        observer: 'Rohan Deshmukh',
        verified: true
      }
    ]
  },
  {
    id: 'a3',
    animal_code: 'PT-2026-0003',
    name: 'Simba',
    breed: 'Labrador / Indie Cross',
    estimated_age: '4 Months',
    gender: 'Male',
    colour: 'Cream & Biscuit',
    identifying_marks: 'Floppy ears, amber eyes',
    location_name: 'HSR Layout Sector 2',
    lat: 12.9121,
    lng: 77.6446,
    registered_date: '2026-10-28',
    updated_at: '2026-11-13',
    rescue_details: 'Found orphaned near construction perimeter; placed in foster care.',
    assigned_volunteer: 'Meera Nair',
    health_status: 'Critical Attention',
    vaccination_status: 'Partially Vaccinated',
    behaviour_status: 'Fearful',
    adoption_status: 'Under Medical Treatment',
    sterilized: false,
    dewormed: true,
    photos: [
      'https://images.unsplash.com/photo-1537151625747-768eb6cf92b2?auto=format&fit=crop&w=900&q=80'
    ],
    medical_history: [
      {
        id: 'm103',
        date: '2026-11-12',
        diagnosis: 'Suspected Canine Parvovirus — Isolation Protocol Active',
        symptoms: 'Lethargy, acute vomiting, loss of appetite',
        treatment: 'Immediate isolation ward admission, IV Ringer Lactate fluid therapy, antiemetics',
        medications: 'Ondansetron IV, Ceftriaxone prophylactic, Probiotic paste',
        vet_notes: 'CRITICAL: Referred to senior veterinary officer. Strict biosecurity & sanitation enforced in HSR Sector 2.',
        disease_flag: 'Suspected Parvovirus - Isolate',
        veterinarian: 'Dr. Kavita Rao (BVSc, MVSc)',
        next_checkup: '2026-11-14'
      }
    ],
    vaccinations: [
      {
        id: 'v104',
        vaccine: 'Puppy DP (First Dose)',
        date: '2026-10-30',
        next_due: '2026-11-20',
        vet: 'Dr. Kavita Rao',
        batch: 'DP-9921X',
        status: 'Verified'
      }
    ],
    behaviour_logs: [
      {
        id: 'b103',
        date: '2026-11-12',
        label: 'Fearful',
        notes: 'Submissive and weak due to illness. Needs quiet isolation environment.',
        precautions: 'Use PPE gloves and shoe covers before entering quarantine kennel.',
        observer: 'Dr. Kavita Rao',
        verified: true
      }
    ]
  },
  {
    id: 'a4',
    animal_code: 'PT-2026-0004',
    name: 'Kaveri',
    breed: 'Indian Spitz / Indie',
    estimated_age: '3 Years',
    gender: 'Female',
    colour: 'Snow White',
    identifying_marks: 'Curled plumed tail, pink nose spot',
    location_name: 'Jayanagar 4th Block',
    lat: 12.9299,
    lng: 77.5838,
    registered_date: '2026-04-10',
    updated_at: '2026-11-08',
    rescue_details: 'Abandoned near park gate; fully rehabilitated and socialized.',
    assigned_volunteer: 'Ananya Sharma',
    health_status: 'Healthy',
    vaccination_status: 'Vaccinated',
    behaviour_status: 'Calm',
    adoption_status: 'Available for Adoption',
    sterilized: true,
    dewormed: true,
    photos: [
      'https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&w=900&q=80'
    ],
    medical_history: [
      {
        id: 'm104',
        date: '2026-08-14',
        diagnosis: 'Routine Dental & Cardiac Auscultation',
        symptoms: 'None',
        treatment: 'Dental scaling completed',
        medications: 'None',
        vet_notes: 'Ideal apartment companion. Very calm temperament.',
        disease_flag: 'None',
        veterinarian: 'Dr. Vikram Menon',
        next_checkup: '2027-02-14'
      }
    ],
    vaccinations: [
      {
        id: 'v105',
        vaccine: 'Anti-Rabies + 7-in-1 Booster',
        date: '2026-08-14',
        next_due: '2027-08-14',
        vet: 'Dr. Vikram Menon',
        batch: 'RB-7740M',
        status: 'Verified'
      }
    ],
    behaviour_logs: [
      {
        id: 'b104',
        date: '2026-10-02',
        label: 'Calm',
        notes: 'Enjoys quiet naps and gentle brushing. Great with seniors.',
        precautions: 'None required.',
        observer: 'Ananya Sharma',
        verified: true
      }
    ]
  },
  {
    id: 'a5',
    animal_code: 'PT-2026-0005',
    name: 'Shera',
    breed: 'Rajapalayam / Indie Mix',
    estimated_age: '4 Years',
    gender: 'Male',
    colour: 'Dark Brindle & Black',
    identifying_marks: 'Scar above right eyebrow, muscular build',
    location_name: 'Whitefield Main Road',
    lat: 12.9698,
    lng: 77.7499,
    registered_date: '2026-05-19',
    updated_at: '2026-11-11',
    rescue_details: 'Community guardian dog near rural farm edge; monitored for territorial behaviour.',
    assigned_volunteer: 'Rohan Deshmukh',
    health_status: 'Healthy',
    vaccination_status: 'Vaccinated',
    behaviour_status: 'Aggressive',
    adoption_status: 'Not Available',
    sterilized: true,
    dewormed: true,
    photos: [
      'https://images.unsplash.com/photo-1518717758536-85ae29035b6d?auto=format&fit=crop&w=900&q=80'
    ],
    medical_history: [
      {
        id: 'm105',
        date: '2026-07-01',
        diagnosis: 'ABC Sterilization & Rabies Immunization',
        symptoms: 'None',
        treatment: 'Post-op recovery completed successfully',
        medications: 'None',
        vet_notes: 'Returned to home territory under TNR (Trap-Neuter-Return) protocol.',
        disease_flag: 'None',
        veterinarian: 'Dr. Kavita Rao',
        next_checkup: '2027-07-01'
      }
    ],
    vaccinations: [
      {
        id: 'v106',
        vaccine: 'Anti-Rabies Annual',
        date: '2026-07-01',
        next_due: '2027-07-01',
        vet: 'Dr. Kavita Rao',
        batch: 'RB-5519P',
        status: 'Verified'
      }
    ],
    behaviour_logs: [
      {
        id: 'b105',
        date: '2026-11-01',
        label: 'Aggressive',
        notes: 'Territorial toward unfamiliar motorcycles at night; calm with regular feeder.',
        precautions: 'Do not corner. Only designated handler should approach.',
        observer: 'Rohan Deshmukh',
        verified: true
      }
    ]
  },
  {
    id: 'a6',
    animal_code: 'PT-2026-0006',
    name: 'Moti',
    breed: 'Indian Pariah Puppy',
    estimated_age: '6 Months',
    gender: 'Male',
    colour: 'Tan & Black Saddle',
    identifying_marks: 'Black tail tip, bright alert ears',
    location_name: 'Malleshwaram 8th Cross',
    lat: 13.0035,
    lng: 77.571,
    registered_date: '2026-08-03',
    updated_at: '2026-11-09',
    rescue_details: 'Rescued during monsoon flooding; thriving in community shelter.',
    assigned_volunteer: 'Meera Nair',
    health_status: 'Healthy',
    vaccination_status: 'Vaccinated',
    behaviour_status: 'Friendly',
    adoption_status: 'Available for Adoption',
    sterilized: false,
    dewormed: true,
    photos: [
      'https://images.unsplash.com/photo-1561037404-61cd46aa615b?auto=format&fit=crop&w=900&q=80'
    ],
    medical_history: [
      {
        id: 'm106',
        date: '2026-10-15',
        diagnosis: 'Pre-Adoption Health Clearance',
        symptoms: 'None',
        treatment: 'Deworming + full puppy vaccination series completed',
        medications: 'Drontal Plus',
        vet_notes: 'Playful, energetic, zero parasites. Ready for loving family.',
        disease_flag: 'None',
        veterinarian: 'Dr. Vikram Menon',
        next_checkup: '2027-01-15'
      }
    ],
    vaccinations: [
      {
        id: 'v107',
        vaccine: 'Anti-Rabies + DHPPi Booster',
        date: '2026-10-15',
        next_due: '2027-10-15',
        vet: 'Dr. Vikram Menon',
        batch: 'RB-9022Z',
        status: 'Verified'
      }
    ],
    behaviour_logs: [
      {
        id: 'b106',
        date: '2026-11-04',
        label: 'Friendly',
        notes: 'Loves fetch games and greets every visitor with tail wags.',
        precautions: 'Puppy-proof home environment recommended.',
        observer: 'Meera Nair',
        verified: true
      }
    ]
  }
];
