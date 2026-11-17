# PAW TRACK Initial Domain Data Seed Script
from app.database import db_upsert_doc, db_insert_rating, db_grant_admin_email

INITIAL_ANIMALS = [
    {
        "id": "a1",
        "animal_code": "PT-2026-0001",
        "name": "Bholu",
        "breed": "Indian Pariah (Indie)",
        "estimated_age": "2.5 Years",
        "gender": "Male",
        "colour": "Golden Fawn & White",
        "identifying_marks": "White diamond patch on chest, notched left ear (ABC sterilized)",
        "location_name": "Indiranagar Sector 4, Bengaluru",
        "lat": 12.9784,
        "lng": 77.6408,
        "registered_date": "2026-01-14",
        "updated_at": "2026-11-10",
        "rescue_details": "Found near community park; friendly neighborhood dog cared for by local feeders.",
        "assigned_volunteer": "Ananya Sharma",
        "health_status": "Healthy",
        "vaccination_status": "Vaccinated",
        "behaviour_status": "Friendly",
        "adoption_status": "Available for Adoption",
        "sterilized": True,
        "dewormed": True,
        "photos": [
            "https://images.unsplash.com/photo-1587300003388-59208cc962cb?auto=format&fit=crop&w=900&q=80",
            "https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&w=900&q=80"
        ],
        "medical_history": [
            {
                "id": "m101",
                "date": "2026-09-18",
                "diagnosis": "Annual Wellness & Tick Prophylaxis",
                "symptoms": "None — routine preventive exam",
                "treatment": "Administered Bravecto oral chew and multivitamin supplement",
                "medications": "Fluralaner 250mg",
                "vet_notes": "Excellent coat condition, healthy weight (18.4 kg). Cleared for adoption.",
                "disease_flag": "None",
                "veterinarian": "Dr. Kavita Rao (BVSc, MVSc)",
                "next_checkup": "2027-03-18"
            }
        ],
        "vaccinations": [
            {
                "id": "v101",
                "vaccine": "Anti-Rabies (Nobivac Rabies)",
                "date": "2026-09-18",
                "next_due": "2027-09-18",
                "vet": "Dr. Kavita Rao",
                "batch": "RB-8841A",
                "status": "Verified"
            },
            {
                "id": "v102",
                "vaccine": "DHPPi + L (Parvovirus / Distemper)",
                "date": "2026-09-18",
                "next_due": "2027-09-18",
                "vet": "Dr. Kavita Rao",
                "batch": "DH-3309C",
                "status": "Verified"
            }
        ],
        "behaviour_logs": [
            {
                "id": "b101",
                "date": "2026-10-25",
                "label": "Friendly",
                "notes": "Gentle with children and other dogs. Walks calmly on a leash.",
                "precautions": "Standard leash handling.",
                "observer": "Ananya Sharma",
                "verified": True
            }
        ],
        "feeding_logs": []
    },
    {
        "id": "a2",
        "animal_code": "PT-2026-0002",
        "name": "Tara",
        "breed": "Indie / Hound Mix",
        "estimated_age": "1.5 Years",
        "gender": "Female",
        "colour": "Brindle Brown",
        "identifying_marks": "Dark muzzle, white front paws",
        "location_name": "Koramangala 6th Block",
        "lat": 12.9352,
        "lng": 77.6245,
        "registered_date": "2026-02-22",
        "updated_at": "2026-11-12",
        "rescue_details": "Rescued from highway service road after minor hind-limb sprain.",
        "assigned_volunteer": "Rohan Deshmukh",
        "health_status": "Under Treatment",
        "vaccination_status": "Overdue",
        "behaviour_status": "Shy",
        "adoption_status": "Under Medical Treatment",
        "sterilized": True,
        "dewormed": True,
        "photos": [
            "https://images.unsplash.com/photo-1517849845537-4d257902454a?auto=format&fit=crop&w=900&q=80",
            "https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?auto=format&fit=crop&w=900&q=80"
        ],
        "medical_history": [
            {
                "id": "m102",
                "date": "2026-11-05",
                "diagnosis": "Soft Tissue Contusion & Mild Dermatitis",
                "symptoms": "Slight limp on left hind leg, localized dry skin patch",
                "treatment": "Anti-inflammatory therapy + medicated chlorhexidine wash",
                "medications": "Meloxicam 1.5mg/ml (5 days), Omega-3 fatty acids",
                "vet_notes": "Responding well to rest. Booster vaccination scheduled once off anti-inflammatories.",
                "disease_flag": "None",
                "veterinarian": "Dr. Vikram Menon",
                "next_checkup": "2026-11-20"
            }
        ],
        "vaccinations": [
            {
                "id": "v103",
                "vaccine": "Anti-Rabies Primary",
                "date": "2025-10-10",
                "next_due": "2026-10-10",
                "vet": "Dr. Vikram Menon",
                "batch": "RB-4102K",
                "status": "Verified"
            }
        ],
        "behaviour_logs": [
            {
                "id": "b102",
                "date": "2026-11-06",
                "label": "Shy",
                "notes": "Initially retreats from sudden loud noises, warms up quickly with soft voice and treats.",
                "precautions": "Approach slowly from the side; avoid sudden overhead movements.",
                "observer": "Rohan Deshmukh",
                "verified": True
            }
        ],
        "feeding_logs": []
    },
    {
        "id": "a3",
        "animal_code": "PT-2026-0003",
        "name": "Simba",
        "breed": "Labrador / Indie Cross",
        "estimated_age": "4 Months",
        "gender": "Male",
        "colour": "Cream & Biscuit",
        "identifying_marks": "Floppy ears, amber eyes",
        "location_name": "HSR Layout Sector 2",
        "lat": 12.9121,
        "lng": 77.6446,
        "registered_date": "2026-10-28",
        "updated_at": "2026-11-13",
        "rescue_details": "Found orphaned near construction perimeter; placed in foster care.",
        "assigned_volunteer": "Meera Nair",
        "health_status": "Critical Attention",
        "vaccination_status": "Partially Vaccinated",
        "behaviour_status": "Fearful",
        "adoption_status": "Under Medical Treatment",
        "sterilized": False,
        "dewormed": True,
        "photos": [
            "https://images.unsplash.com/photo-1537151625747-768eb6cf92b2?auto=format&fit=crop&w=900&q=80"
        ],
        "medical_history": [
            {
                "id": "m103",
                "date": "2026-11-12",
                "diagnosis": "Suspected Canine Parvovirus — Isolation Protocol Active",
                "symptoms": "Lethargy, acute vomiting, loss of appetite",
                "treatment": "Immediate isolation ward admission, IV Ringer Lactate fluid therapy, antiemetics",
                "medications": "Ondansetron IV, Ceftriaxone prophylactic, Probiotic paste",
                "vet_notes": "CRITICAL: Referred to senior veterinary officer. Strict biosecurity & sanitation enforced in HSR Sector 2.",
                "disease_flag": "Suspected Parvovirus - Isolate",
                "veterinarian": "Dr. Kavita Rao (BVSc, MVSc)",
                "next_checkup": "2026-11-14"
            }
        ],
        "vaccinations": [
            {
                "id": "v104",
                "vaccine": "Puppy DP (First Dose)",
                "date": "2026-10-30",
                "next_due": "2026-11-20",
                "vet": "Dr. Kavita Rao",
                "batch": "DP-9921X",
                "status": "Verified"
            }
        ],
        "behaviour_logs": [
            {
                "id": "b103",
                "date": "2026-11-12",
                "label": "Fearful",
                "notes": "Submissive and weak due to illness. Needs quiet isolation environment.",
                "precautions": "Use PPE gloves and shoe covers before entering quarantine kennel.",
                "observer": "Dr. Kavita Rao",
                "verified": True
            }
        ],
        "feeding_logs": []
    },
    {
        "id": "a4",
        "animal_code": "PT-2026-0004",
        "name": "Kaveri",
        "breed": "Indian Spitz / Indie",
        "estimated_age": "3 Years",
        "gender": "Female",
        "colour": "Snow White",
        "identifying_marks": "Curled plumed tail, pink nose spot",
        "location_name": "Jayanagar 4th Block",
        "lat": 12.9299,
        "lng": 77.5838,
        "registered_date": "2026-04-10",
        "updated_at": "2026-11-08",
        "rescue_details": "Abandoned near park gate; fully rehabilitated and socialized.",
        "assigned_volunteer": "Ananya Sharma",
        "health_status": "Healthy",
        "vaccination_status": "Vaccinated",
        "behaviour_status": "Calm",
        "adoption_status": "Available for Adoption",
        "sterilized": True,
        "dewormed": True,
        "photos": [
            "https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&w=900&q=80"
        ],
        "medical_history": [],
        "vaccinations": [],
        "behaviour_logs": [],
        "feeding_logs": []
    },
    {
        "id": "a5",
        "animal_code": "PT-2026-0005",
        "name": "Shera",
        "breed": "Rajapalayam / Indie Mix",
        "estimated_age": "4 Years",
        "gender": "Male",
        "colour": "Dark Brindle & Black",
        "identifying_marks": "Scar above right eyebrow, muscular build",
        "location_name": "Whitefield Main Road",
        "lat": 12.9698,
        "lng": 77.7499,
        "registered_date": "2026-05-19",
        "updated_at": "2026-11-11",
        "rescue_details": "Community guardian dog near rural farm edge; monitored for territorial behaviour.",
        "assigned_volunteer": "Rohan Deshmukh",
        "health_status": "Healthy",
        "vaccination_status": "Vaccinated",
        "behaviour_status": "Aggressive",
        "adoption_status": "Not Available",
        "sterilized": True,
        "dewormed": True,
        "photos": [
            "https://images.unsplash.com/photo-1518717758536-85ae29035b6d?auto=format&fit=crop&w=900&q=80"
        ],
        "medical_history": [],
        "vaccinations": [],
        "behaviour_logs": [],
        "feeding_logs": []
    },
    {
        "id": "a6",
        "animal_code": "PT-2026-0006",
        "name": "Moti",
        "breed": "Indian Pariah Puppy",
        "estimated_age": "6 Months",
        "gender": "Male",
        "colour": "Tan & Black Saddle",
        "identifying_marks": "Black tail tip, bright alert ears",
        "location_name": "Malleshwaram 8th Cross",
        "lat": 13.0035,
        "lng": 77.5710,
        "registered_date": "2026-08-03",
        "updated_at": "2026-11-09",
        "rescue_details": "Rescued during monsoon flooding; thriving in community shelter.",
        "assigned_volunteer": "Meera Nair",
        "health_status": "Healthy",
        "vaccination_status": "Vaccinated",
        "behaviour_status": "Friendly",
        "adoption_status": "Available for Adoption",
        "sterilized": False,
        "dewormed": True,
        "photos": [
            "https://images.unsplash.com/photo-1561037404-61cd46aa615b?auto=format&fit=crop&w=900&q=80"
        ],
        "medical_history": [],
        "vaccinations": [],
        "behaviour_logs": [],
        "feeding_logs": []
    }
]

INITIAL_ADOPTIONS = [
    {
        "id": "ad1",
        "animal_id": "a1",
        "animal_code": "PT-2026-0001",
        "animal_name": "Bholu",
        "applicant_name": "Siddharth Kulkarni",
        "applicant_email": "siddharth.k@example.com",
        "applicant_phone": "+91 98450 11234",
        "address": "402 Greenview Residency, Indiranagar, Bengaluru",
        "home_type": "3BHK Apartment with enclosed balcony & nearby park",
        "experience": "Previously raised an Indie dog for 11 years. Work-from-home schedule.",
        "status": "Pending Review",
        "submitted_at": "2026-11-11"
    },
    {
        "id": "ad2",
        "animal_id": "a4",
        "animal_code": "PT-2026-0004",
        "animal_name": "Kaveri",
        "applicant_name": "Priya & Arjun Nair",
        "applicant_email": "priya.nair@example.com",
        "applicant_phone": "+91 99001 44589",
        "address": "18 Banyan Lane, Jayanagar 4th Block, Bengaluru",
        "home_type": "Independent house with fenced courtyard",
        "experience": "First-time adopters, completed pet parenting workshop.",
        "status": "Approved",
        "submitted_at": "2026-11-02"
    }
]

INITIAL_VOLUNTEERS = [
    {"id": "vol1", "name": "Ananya Sharma", "email": "ananya.volunteer@pawtrack.org", "phone": "+91 98450 11223", "zone": "Indiranagar", "joined": "2026-03-14", "status": "Active", "submissions": 12},
    {"id": "vol2", "name": "Rohan Deshmukh", "email": "rohan.d@pawtrack.org", "phone": "+91 98860 44571", "zone": "Koramangala", "joined": "2026-05-02", "status": "Active", "submissions": 8},
    {"id": "vol3", "name": "Rahul Nair", "email": "rahul.nair@pawtrack.org", "phone": "+91 99001 77820", "zone": "HSR Layout", "joined": "2026-01-21", "status": "Active", "submissions": 21},
    {"id": "vol4", "name": "Meera Iyer", "email": "meera.iyer@pawtrack.org", "phone": "+91 97400 33459", "zone": "Jayanagar", "joined": "2026-07-09", "status": "Active", "submissions": 5},
    {"id": "vol5", "name": "Imran Qureshi", "email": "imran.q@pawtrack.org", "phone": "+91 96320 88114", "zone": "Whitefield", "joined": "2026-08-30", "status": "Inactive", "submissions": 2},
    {"id": "vol6", "name": "Priya Menon", "email": "priya.menon@pawtrack.org", "phone": "+91 90360 55247", "zone": "BTM Layout", "joined": "2026-09-18", "status": "Active", "submissions": 7}
]

INITIAL_GROUPS = [
    {
        "id": "g1",
        "name": "Indiranagar Evening Route",
        "description": "Community dogs fed together near the park every evening.",
        "animal_ids": ["a1"],
        "created_by": "Ananya Sharma",
        "created_at": "2026-10-02",
        "last_fed_at": None,
        "last_fed_by": None,
        "feed_count": 0
    },
    {
        "id": "g2",
        "name": "South Bengaluru Cluster",
        "description": "Koramangala, HSR and Jayanagar dogs on one shared feeding run.",
        "animal_ids": ["a2", "a3", "a4"],
        "created_by": "Rahul Nair",
        "created_at": "2026-10-11",
        "last_fed_at": "2026-11-12",
        "last_fed_by": "Rahul Nair",
        "feed_count": 7
    }
]

INITIAL_NOTIFICATIONS = [
    {
        "id": "n1",
        "animal_id": "a3",
        "title": "Critical Infectious Disease Alert",
        "message": "Simba (PT-2026-0003) flagged for Suspected Parvovirus in HSR Sector 2. Isolation protocol active.",
        "type": "critical",
        "time": "18 mins ago",
        "unread": True
    },
    {
        "id": "n2",
        "animal_id": "a2",
        "title": "Overdue Rabies Booster",
        "message": "Tara (PT-2026-0002) anti-rabies booster is overdue. Schedule post-recovery immunization.",
        "type": "warning",
        "time": "2 hours ago",
        "unread": True
    },
    {
        "id": "n3",
        "animal_id": "a1",
        "title": "New Adoption Application",
        "message": "Siddharth Kulkarni submitted an adoption application for Bholu (PT-2026-0001).",
        "type": "info",
        "time": "5 hours ago",
        "unread": True
    },
    {
        "id": "n4",
        "animal_id": None,
        "title": "Volunteer Submission Awaiting Review",
        "message": "Ananya Sharma submitted a new stray registration for 'Chutki' in Indiranagar.",
        "type": "info",
        "time": "1 day ago",
        "unread": False
    }
]

INITIAL_VOLUNTEER_REPORTS = [
    {
        "id": "vr1",
        "type": "New Animal Discovery",
        "submitted_by": "Ananya Sharma (Volunteer)",
        "animal_name": "Chutki",
        "breed": "Indian Pariah Puppy",
        "location": "Indiranagar 12th Main",
        "urgency": "Normal",
        "notes": "3-month-old female pup near metro pillar 42. Appears healthy, needs primary vaccination & ID.",
        "photo": "https://images.unsplash.com/photo-1548199973-03cce0bbc87b?auto=format&fit=crop&w=600&q=80",
        "status": "Pending Approval",
        "date": "2026-11-13"
    },
    {
        "id": "vr2",
        "type": "Medical Alert / Injury",
        "submitted_by": "Rohan Deshmukh (Volunteer)",
        "animal_name": "PT-2026-0002 (Tara)",
        "breed": "Indie / Hound Mix",
        "location": "Koramangala 6th Block",
        "urgency": "High",
        "notes": "Follow-up observation: limp has reduced by 70%, appetite back to normal. Requesting booster clearance.",
        "photo": "https://images.unsplash.com/photo-1517849845537-4d257902454a?auto=format&fit=crop&w=600&q=80",
        "status": "Pending Approval",
        "date": "2026-11-12"
    }
]

INITIAL_RATINGS = [
    ("a1", 5, "user1@example.com"),
    ("a1", 4, "user2@example.com"),
    ("a1", 5, "user3@example.com"),
    ("a1", 5, "user4@example.com"),
    ("a2", 4, "user1@example.com"),
    ("a2", 5, "user2@example.com"),
    ("a3", 4, "user1@example.com"),
    ("a3", 3, "user2@example.com"),
    ("a3", 4, "user3@example.com"),
    ("a4", 5, "user1@example.com"),
    ("a4", 5, "user2@example.com"),
    ("a4", 4, "user3@example.com"),
    ("a5", 3, "user1@example.com"),
    ("a5", 4, "user2@example.com"),
]


async def seed_database():
    """Seeds the database collections if empty."""
    print("Checking database seeding...")
    # Seed animals
    for a in INITIAL_ANIMALS:
        await db_upsert_doc("animals", a)

    # Seed adoptions
    for ad in INITIAL_ADOPTIONS:
        await db_upsert_doc("adoptions", ad)

    # Seed volunteers
    for v in INITIAL_VOLUNTEERS:
        await db_upsert_doc("volunteers", v)

    # Seed groups
    for g in INITIAL_GROUPS:
        await db_upsert_doc("feeding_groups", g)

    # Seed notifications
    for n in INITIAL_NOTIFICATIONS:
        await db_upsert_doc("notifications", n)

    # Seed volunteer reports
    for vr in INITIAL_VOLUNTEER_REPORTS:
        await db_upsert_doc("volunteer_reports", vr)

    # Seed ratings
    for aid, score, user in INITIAL_RATINGS:
        await db_insert_rating(aid, score, user)

    # Seed owner admin email
    await db_grant_admin_email("akashhabib577@gmail.com")
    print("Database seeding completed.")
