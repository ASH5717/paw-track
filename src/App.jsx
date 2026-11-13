// PAW TRACK — Application root: state, handlers & view router

import { useState, useMemo, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Filter, CheckCircle2, Users, Navigation } from 'lucide-react';
import { AdoptionModal } from './components/adoption/AdoptionModal.jsx';
import { AnimalProfileModal } from './components/animals/AnimalProfileModal.jsx';
import { AuthPortal } from './components/auth/AuthPortal.jsx';
import { QRScannerModal } from './components/common/QRScannerModal.jsx';
import { LandingPage } from './components/landing/LandingPage.jsx';
import { WorkspaceShell } from './components/layout/WorkspaceShell.jsx';
import { QuickIncidentModal } from './components/volunteers/QuickIncidentModal.jsx';
import { COLORS } from './constants/theme.js';
import { INITIAL_ADOPTIONS } from './data/adoptions.js';
import { INITIAL_ANIMALS, INITIAL_RATINGS, averageRating } from './data/animals.js';
import { INITIAL_GROUPS } from './data/groups.js';
import { INITIAL_NOTIFICATIONS } from './data/notifications.js';
import { INITIAL_VOLUNTEER_REPORTS } from './data/volunteerReports.js';
import { INITIAL_VOLUNTEERS } from './data/volunteers.js';
import { supabase, isSupabaseConfigured } from './lib/supabase.js';
import { isAdminEmail, OWNER_EMAIL } from './lib/adminAccess.js';

// Demo mode has no backend session, so the signed-in user is remembered in
// localStorage and restored on refresh — the user stays logged in until they
// sign out. With Supabase configured the SDK restores its own session instead.
const SESSION_KEY = 'pawtrack.session.user';

const readStoredUser = () => {
  try {
    const parsed = JSON.parse(localStorage.getItem(SESSION_KEY) || 'null');
    return parsed && parsed.email && parsed.role ? parsed : null;
  } catch {
    return null;
  }
};

// Map a Supabase auth user onto the app's internal user shape. The role comes
// from the server-side admin allow-list, so a grant made by the owner takes
// effect on that person's next request.
const buildUserFromSession = async (user) => {
  if (!user) return null;
  const meta = user.user_metadata || {};
  const requested = ['admin', 'volunteer', 'user'].includes(meta.role) ? meta.role : 'user';
  return {
    name: meta.full_name || user.email?.split('@')[0] || 'PAW TRACK User',
    email: user.email,
    role: (await isAdminEmail(user.email)) ? 'admin' : requested,
    org: meta.org || 'Community Member'
  };
};

export default function App() {
  // Remembered session from the last visit (demo mode only). Restored
  // synchronously so a refresh keeps the user signed in without a flash.
  const restoredUser = useMemo(() => (supabase ? null : readStoredUser()), []);

  // Core Navigation & Auth State
  const [view, setView] = useState(restoredUser ? 'app' : 'landing'); // 'landing' | 'auth' | 'app'
  const [currentUser, setCurrentUser] = useState(restoredUser); // { name, email, role: 'admin'|'volunteer'|'user', org }
  const [authRoleCard, setAuthRoleCard] = useState(null); // null | 'admin' | 'volunteer' | 'user'
  const [authMode, setAuthMode] = useState('login'); // 'login' | 'register' | 'forgot'
  const [showPassword, setShowPassword] = useState(false);

  // App Workspace Navigation
  const [activeTab, setActiveTab] = useState('overview');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Domain Data State (Live Interactive CRUD)
  const [animals, setAnimals] = useState(INITIAL_ANIMALS);
  const [ratings, setRatings] = useState(INITIAL_RATINGS);
  const [adoptions, setAdoptions] = useState(INITIAL_ADOPTIONS);
  const [volunteerReports, setVolunteerReports] = useState(INITIAL_VOLUNTEER_REPORTS);
  const [volunteers, setVolunteers] = useState(INITIAL_VOLUNTEERS);
  const [groups, setGroups] = useState(INITIAL_GROUPS);
  const [notifications, setNotifications] = useState(INITIAL_NOTIFICATIONS);
  const [activityLogs, setActivityLogs] = useState([
    { id: 'l1', time: 'Today, 16:45', actor: 'Dr. Kavita Rao', action: 'Flagged PT-2026-0003 (Simba) for Parvovirus isolation protocol' },
    { id: 'l2', time: 'Today, 14:20', actor: 'Ananya Sharma', action: 'Submitted new stray discovery report in Indiranagar' },
    { id: 'l3', time: 'Yesterday', actor: 'Dr. Vikram Menon', action: 'Verified annual Rabies vaccination for PT-2026-0006 (Moti)' }
  ]);

  // Selected Animal Profile Modal / Drawer
  const [selectedAnimalId, setSelectedAnimalId] = useState(null);
  const [profileTab, setProfileTab] = useState('Overview');

  // Adoption Modal State
  const [adoptModalAnimal, setAdoptModalAnimal] = useState(null);

  // Quick Report Modal (For Public Users & Volunteers)
  const [reportModalOpen, setReportModalOpen] = useState(false);

  // QR Scanner Modal (available to every signed-in role)
  const [scannerOpen, setScannerOpen] = useState(false);

  // --- Browser history integration -----------------------------------
  // Mirrors in-app navigation into history entries so the browser
  // back/forward buttons move between views, sidebar tabs and modals.
  const navStateRef = useRef({
    view: restoredUser ? 'app' : 'landing',
    tab: 'overview',
    animalId: null,
    adoptAnimal: null,
    reportOpen: false
  });
  const userRef = useRef(null);

  useEffect(() => {
    userRef.current = currentUser;
  }, [currentUser]);

  // Persist the demo-mode session so a refresh restores the signed-in user.
  // Signing out clears it.
  useEffect(() => {
    if (supabase) return;
    try {
      if (currentUser) localStorage.setItem(SESSION_KEY, JSON.stringify(currentUser));
      else localStorage.removeItem(SESSION_KEY);
    } catch {
      /* storage blocked — the session simply won't survive a refresh */
    }
  }, [currentUser]);

  // Record a navigation step. 'push' adds an entry, 'replace' overwrites
  // the current one (used when a modal is closed/submitted).
  const commitNav = (patch, mode = 'push') => {
    const next = { ...navStateRef.current, ...patch };
    const changed = Object.keys(next).some((key) => next[key] !== navStateRef.current[key]);
    navStateRef.current = next;
    if (!changed) return;
    if (mode === 'replace') window.history.replaceState(next, '');
    else window.history.pushState(next, '');
  };

  useEffect(() => {
    window.history.replaceState(navStateRef.current, '');

    const handlePopState = (event) => {
      const state = event.state;
      if (!state) return;
      // Never restore the workspace without an authenticated user
      if (state.view === 'app' && !userRef.current) {
        navStateRef.current = { ...state, view: 'landing', tab: 'overview', animalId: null };
        setView('landing');
        setActiveTab('overview');
        setSelectedAnimalId(null);
        return;
      }
      navStateRef.current = state;
      setView(state.view);
      setActiveTab(state.tab);
      setSelectedAnimalId(state.animalId ?? null);
      setAdoptModalAnimal(state.adoptAnimal ?? null);
      setReportModalOpen(!!state.reportOpen);
      setProfileTab('Overview');
      setMobileMenuOpen(false);
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // --- Supabase session restore (skipped entirely in demo mode) --------
  useEffect(() => {
    if (!supabase) return undefined;

    let active = true;
    supabase.auth.getSession().then(async ({ data }) => {
      const user = await buildUserFromSession(data.session?.user);
      if (!active || !user) return;
      setCurrentUser(user);
      setView('app');
      setActiveTab('overview');
    });

    // Only sign-out is handled here. Signing in is handled explicitly so the
    // admin allow-list can be checked once the session exists.
    const { data: listener } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'SIGNED_OUT') setCurrentUser(null);
    });

    return () => {
      active = false;
      listener.subscription.unsubscribe();
    };
  }, []);

  // Toast Feedback System
  const [toasts, setToasts] = useState([]);
  const notify = (title, message, type = 'success') => {
    const id = Date.now() + Math.random();
    setToasts((prev) => [...prev, { id, title, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4200);
  };

  // Search & Filter States for Animal Management
  const [searchQuery, setSearchQuery] = useState('');
  const [filterLocation, setFilterLocation] = useState('All');
  const [filterHealth, setFilterHealth] = useState('All');
  const [filterVaccination, setFilterVaccination] = useState('All');
  const [filterBehaviour, setFilterBehaviour] = useState('All');
  const [filterAdoption, setFilterAdoption] = useState('All');
  const [displayMode, setDisplayMode] = useState('grid'); // 'grid' | 'table'

  // Derived Selected Animal
  const selectedAnimal = useMemo(
    () => animals.find((a) => a.id === selectedAnimalId) || null,
    [animals, selectedAnimalId]
  );

  // Derived Filtered Animals
  const filteredAnimals = useMemo(() => {
    return animals.filter((a) => {
      const matchesSearch =
        a.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        a.animal_code.toLowerCase().includes(searchQuery.toLowerCase()) ||
        a.breed.toLowerCase().includes(searchQuery.toLowerCase()) ||
        a.location_name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesLoc = filterLocation === 'All' || a.location_name.includes(filterLocation);
      const matchesHealth = filterHealth === 'All' || a.health_status === filterHealth;
      const matchesVax = filterVaccination === 'All' || a.vaccination_status === filterVaccination;
      const matchesBeh = filterBehaviour === 'All' || a.behaviour_status === filterBehaviour;
      const matchesAdopt = filterAdoption === 'All' || a.adoption_status === filterAdoption;
      return matchesSearch && matchesLoc && matchesHealth && matchesVax && matchesBeh && matchesAdopt;
    });
  }, [animals, searchQuery, filterLocation, filterHealth, filterVaccination, filterBehaviour, filterAdoption]);

  // Dashboard Metrics
  const stats = useMemo(() => {
    return {
      total: animals.length,
      vaccinated: animals.filter((a) => a.vaccination_status === 'Vaccinated').length,
      unvaccinatedOrOverdue: animals.filter((a) =>
        ['Not Vaccinated', 'Overdue', 'Partially Vaccinated'].includes(a.vaccination_status)
      ).length,
      medicalAttention: animals.filter((a) =>
        ['Critical Attention', 'Under Treatment'].includes(a.health_status)
      ).length,
      availableAdoption: animals.filter((a) => a.adoption_status === 'Available for Adoption').length,
      adopted: animals.filter((a) => a.adoption_status === 'Adopted').length + 47,
      activeVolunteers: volunteers.filter((v) => v.status === 'Active').length,
      unreadNotifications: notifications.filter((n) => n.unread).length
    };
  }, [animals, notifications, volunteers]);

  // Instant Role Login Handler
  const handleQuickRoleLogin = (role, customName, customEmail) => {
    const presets = {
      admin: {
        name: customName || 'Dr. Kavita Rao (Chief Vet & Admin)',
        email: customEmail || 'dr.kavita@pawtrack.org',
        role: 'admin',
        org: 'PAW TRACK Veterinary & Welfare Board'
      },
      volunteer: {
        name: customName || 'Ananya Sharma',
        email: customEmail || 'ananya.volunteer@pawtrack.org',
        role: 'volunteer',
        org: 'Indiranagar Community Rescuers'
      },
      user: {
        name: customName || 'Siddharth Kulkarni',
        email: customEmail || 'siddharth.k@example.com',
        role: 'user',
        org: 'Community Member & Adopter'
      }
    };
    setCurrentUser(presets[role]);
    setView('app');
    setActiveTab('overview');
    commitNav({ view: 'app', tab: 'overview', animalId: null, adoptAnimal: null, reportOpen: false });
    notify(
      `Welcome, ${presets[role].name.split(' ')[0]}!`,
      `Signed in with ${role.toUpperCase()} privileges.`
    );
  };

  // Credential auth. Uses Supabase when configured, otherwise falls back
  // to the one-click demo login so the app stays fully usable.
  const handleEmailAuth = async ({ mode, role, email, password, fullName }) => {
    const declined = () => ({
      ok: false,
      error: `Admin access is restricted to ${OWNER_EMAIL}. Sign in there to grant admin rights to ${email}.`
    });

    // Demo mode — no backend, so the allow-list is read from local storage
    if (!supabase) {
      if (mode === 'forgot') {
        return { ok: true, message: `Password recovery instructions sent to ${email}.` };
      }
      const grantedRole = (await isAdminEmail(email)) ? 'admin' : role === 'admin' ? null : role;
      if (!grantedRole) return declined();
      handleQuickRoleLogin(grantedRole, fullName || undefined, email || undefined);
      return { ok: true, demo: true };
    }

    try {
      if (mode === 'forgot') {
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
          redirectTo: window.location.origin
        });
        if (error) throw error;
        return { ok: true, message: `Password recovery link sent to ${email}.` };
      }

      if (mode === 'register') {
        // Admin rights are never self-declared — the owner grants them later
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: { data: { full_name: fullName || '', role: role === 'admin' ? 'user' : role } }
        });
        if (error) throw error;
        if (!data.session) {
          return {
            ok: true,
            message: `Confirmation link sent to ${email}. Verify your email, then sign in.`
          };
        }
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
      }

      // Authorize only once the session exists, so the allow-list is read
      // through RLS instead of being trusted from the client.
      const {
        data: { user: authUser }
      } = await supabase.auth.getUser();
      const grantedRole = (await isAdminEmail(authUser?.email))
        ? 'admin'
        : role === 'admin'
        ? null
        : role;
      if (!grantedRole) {
        await supabase.auth.signOut();
        return declined();
      }

      const user = await buildUserFromSession(authUser);
      setCurrentUser(user);
      setView('app');
      setActiveTab('overview');
      commitNav({ view: 'app', tab: 'overview', animalId: null, adoptAnimal: null, reportOpen: false });
      notify(
        `Welcome, ${user.name.split(' ')[0]}!`,
        `Signed in with ${user.role.toUpperCase()} privileges.`
      );
      return { ok: true };
    } catch (err) {
      return { ok: false, error: err?.message || 'Authentication failed. Please try again.' };
    }
  };

  const handleLogout = () => {
    if (supabase) supabase.auth.signOut().catch(() => {});
    setCurrentUser(null);
    setView('landing');
    setAuthRoleCard(null);
    commitNav({ view: 'landing', tab: 'overview', animalId: null, adoptAnimal: null, reportOpen: false });
    notify('Signed Out', 'Your session has been securely closed.');
  };

  // Generate Next Unique Animal ID (PT-2026-XXXX)
  const nextAnimalCode = useMemo(() => {
    const nextNum = animals.length + 1;
    return `PT-2026-${String(nextNum).padStart(4, '0')}`;
  }, [animals.length]);

  // Register New Animal Handler
  const handleRegisterAnimal = (newAnimalData) => {
    const isVolunteer = currentUser?.role === 'volunteer';
    const created = {
      ...newAnimalData,
      id: 'a' + Date.now(),
      animal_code: nextAnimalCode,
      registered_date: new Date().toISOString().split('T')[0],
      updated_at: new Date().toISOString().split('T')[0],
      vaccination_status: isVolunteer ? 'Verification Required' : newAnimalData.vaccination_status,
      medical_history: [],
      vaccinations: [],
      behaviour_logs: [
        {
          id: 'b' + Date.now(),
          date: new Date().toISOString().split('T')[0],
          label: newAnimalData.behaviour_status,
          notes: 'Initial intake behavioural assessment recorded during registration.',
          precautions: 'Standard observation protocol.',
          observer: currentUser?.name || 'Staff',
          verified: !isVolunteer
        }
      ]
    };

    setAnimals((prev) => [created, ...prev]);
    setActivityLogs((prev) => [
      {
        id: 'l' + Date.now(),
        time: 'Just now',
        actor: currentUser?.name || 'System',
        action: `Registered ${created.name} with Unique ID ${created.animal_code}`
      },
      ...prev
    ]);
    setNotifications((prev) => [
      {
        id: 'n' + Date.now(),
        animal_id: created.id,
        title: 'New Animal Registered',
        message: `${created.name} (${created.animal_code}) registered at ${created.location_name}.`,
        type: 'info',
        time: 'Just now',
        unread: true
      },
      ...prev
    ]);
    notify(
      `Registered ${created.animal_code}`,
      `${created.name} has been assigned a unique QR profile.`
    );
    setSelectedAnimalId(created.id);
    setActiveTab('animals');
    commitNav({ tab: 'animals', animalId: created.id });
  };

  // Add Medical or Vaccination Record (Admin / Vet Only)
  const handleAddMedicalRecord = (animalId, record) => {
    setAnimals((prev) =>
      prev.map((a) => {
        if (a.id !== animalId) return a;
        const updatedHealth =
          record.disease_flag !== 'None' ? 'Critical Attention' : record.new_health_status || a.health_status;
        return {
          ...a,
          health_status: updatedHealth,
          updated_at: new Date().toISOString().split('T')[0],
          medical_history: [
            {
              id: 'm' + Date.now(),
              date: new Date().toISOString().split('T')[0],
              ...record,
              veterinarian: currentUser?.name || 'Dr. Kavita Rao'
            },
            ...a.medical_history
          ]
        };
      })
    );
    if (record.disease_flag !== 'None') {
      setNotifications((prev) => [
        {
          id: 'n' + Date.now(),
          animal_id: animalId,
          title: `ALERT: ${record.disease_flag}`,
          message: `Veterinary escalation triggered for animal ID ${animalId}. Isolation required.`,
          type: 'critical',
          time: 'Just now',
          unread: true
        },
        ...prev
      ]);
    }
    notify('Medical Record Saved', 'Veterinary entry verified and logged.');
  };

  const handleAddVaccination = (animalId, vax) => {
    setAnimals((prev) =>
      prev.map((a) => {
        if (a.id !== animalId) return a;
        return {
          ...a,
          vaccination_status: 'Vaccinated',
          updated_at: new Date().toISOString().split('T')[0],
          vaccinations: [
            {
              id: 'v' + Date.now(),
              ...vax,
              vet: currentUser?.name || 'Dr. Kavita Rao',
              status: 'Verified'
            },
            ...a.vaccinations
          ]
        };
      })
    );
    notify('Vaccination Certified', `${vax.vaccine} certificate issued.`);
  };

  // Behaviour Log Submission
  const handleAddBehaviourLog = (animalId, log) => {
    const isAdmin = currentUser?.role === 'admin';
    setAnimals((prev) =>
      prev.map((a) => {
        if (a.id !== animalId) return a;
        return {
          ...a,
          behaviour_status: isAdmin ? log.label : a.behaviour_status,
          updated_at: new Date().toISOString().split('T')[0],
          behaviour_logs: [
            {
              id: 'b' + Date.now(),
              date: new Date().toISOString().split('T')[0],
              ...log,
              observer: currentUser?.name || 'Volunteer',
              verified: isAdmin
            },
            ...a.behaviour_logs
          ]
        };
      })
    );
    notify(
      isAdmin ? 'Behaviour Status Updated' : 'Observation Submitted',
      isAdmin
        ? 'Animal temperament badge updated.'
        : 'Observation queued for veterinary/admin verification.'
    );
  };

  // Update registry details & status fields (Admin / Volunteer)
  const handleUpdateAnimal = (animalId, patch) => {
    setAnimals((prev) =>
      prev.map((a) =>
        a.id === animalId ? { ...a, ...patch, updated_at: new Date().toISOString().split('T')[0] } : a
      )
    );
    notify('Registry Updated', 'Animal details and status saved.');
  };

  // Delete a record everywhere: registry, feeding groups & adoption applications
  const handleDeleteAnimal = (animalId) => {
    const animal = animals.find((a) => a.id === animalId);
    setAnimals((prev) => prev.filter((a) => a.id !== animalId));
    setGroups((prev) =>
      prev.map((g) => ({ ...g, animal_ids: g.animal_ids.filter((id) => id !== animalId) }))
    );
    setAdoptions((prev) => prev.filter((ad) => ad.animal_id !== animalId));
    if (selectedAnimalId === animalId) {
      setSelectedAnimalId(null);
      commitNav({ animalId: null });
    }
    notify('Animal Removed', `${animal?.name || 'Record'} was deleted from the registry.`);
  };

  // Community feeding log (any signed-in role)
  const handleAddFeedingLog = (animalId, entry) => {
    setAnimals((prev) =>
      prev.map((a) => {
        if (a.id !== animalId) return a;
        return {
          ...a,
          updated_at: new Date().toISOString().split('T')[0],
          feeding_logs: [
            { id: 'f' + Date.now(), fed_by: currentUser?.name || 'Community Feeder', ...entry },
            ...(a.feeding_logs || [])
          ]
        };
      })
    );
    notify('Feeding Logged', `${entry.food_type || 'Meal'} recorded for ${entry.date}.`);
  };

  // Resolve a scanned QR value (full tag link or a raw Animal ID) to a profile
  const handleScanResult = (raw) => {
    const text = String(raw || '').trim();
    const fromUrl = text.match(/animal\/([A-Za-z0-9-]+)/i);
    const rawCode = text.match(/\b(PT-\d{4}-\d{4})\b/i);
    const code = (fromUrl?.[1] || rawCode?.[1] || text).toUpperCase();
    const animal = animals.find(
      (a) =>
        a.animal_code.toUpperCase() === code ||
        a.name.toUpperCase() === code ||
        a.id.toUpperCase() === code
    );
    if (!animal) {
      notify('No Match', `No animal record found for "${text || 'empty QR'}".`);
      return;
    }
    setScannerOpen(false);
    setSelectedAnimalId(animal.id);
    setProfileTab('Overview');
    commitNav({ animalId: animal.id });
    notify('Animal Found', `${animal.name} (${animal.animal_code}) profile opened.`);
  };

  // Feeding groups (Admin / Volunteer) — batch feed a cluster of dogs
  const handleCreateGroup = ({ name, description, animal_ids }) => {
    const group = {
      id: 'g' + Date.now(),
      name,
      description,
      animal_ids,
      created_by: currentUser?.name || 'Staff',
      created_at: new Date().toISOString().split('T')[0],
      last_fed_at: null,
      last_fed_by: null,
      feed_count: 0
    };
    setGroups((prev) => [group, ...prev]);
    notify('Group Created', `${group.name} groups ${animal_ids.length} animal(s).`);
  };

  const handleDeleteGroup = (groupId) => {
    setGroups((prev) => prev.filter((g) => g.id !== groupId));
    notify('Group Removed', 'Feeding group deleted.');
  };

  const handleUpdateGroup = (groupId, patch) => {
    setGroups((prev) => prev.map((g) => (g.id === groupId ? { ...g, ...patch } : g)));
    notify('Group Updated', 'Group details saved.');
  };

  const handleMarkGroupFed = (groupId, entry) => {
    const group = groups.find((g) => g.id === groupId);
    if (!group) return;
    const date = new Date().toISOString().split('T')[0];
    const fedBy = currentUser?.name || 'Community Feeder';
    setAnimals((prev) =>
      prev.map((a) => {
        if (!group.animal_ids.includes(a.id)) return a;
        return {
          ...a,
          updated_at: date,
          feeding_logs: [
            {
              id: 'f' + Date.now() + a.id,
              fed_by: fedBy,
              group: group.name,
              date,
              ...entry
            },
            ...(a.feeding_logs || [])
          ]
        };
      })
    );
    setGroups((prev) =>
      prev.map((g) =>
        g.id === groupId
          ? { ...g, last_fed_at: date, last_fed_by: fedBy, feed_count: (g.feed_count || 0) + 1 }
          : g
      )
    );
    notify(
      'Group Fed',
      `${group.name} marked as fed for ${group.animal_ids.length} animal(s) by ${fedBy}.`
    );
  };

  // Submit Adoption Application
  const handleAdoptionSubmit = (formData) => {
    const newApp = {
      id: 'ad' + Date.now(),
      ...formData,
      status: 'Pending Review',
      submitted_at: new Date().toISOString().split('T')[0]
    };
    setAdoptions((prev) => [newApp, ...prev]);
    setAnimals((prev) =>
      prev.map((a) => (a.id === formData.animal_id ? { ...a, adoption_status: 'Pending Adoption' } : a))
    );
    setNotifications((prev) => [
      {
        id: 'n' + Date.now(),
        animal_id: formData.animal_id,
        title: 'Adoption Application Received',
        message: `${formData.applicant_name} applied to adopt ${formData.animal_name} (${formData.animal_code}).`,
        type: 'info',
        time: 'Just now',
        unread: true
      },
      ...prev
    ]);
    setAdoptModalAnimal(null);
    commitNav({ adoptAnimal: null }, 'replace');
    notify('Application Submitted!', 'Our adoption team will review your home details within 24 hours.');
  };

  // Approve/Reject Adoption Application (Admin)
  const handleAdoptionDecision = (appId, decision) => {
    const targetApp = adoptions.find((ad) => ad.id === appId);
    setAdoptions((prev) => prev.map((ad) => (ad.id === appId ? { ...ad, status: decision } : ad)));
    if (targetApp) {
      setAnimals((prev) =>
        prev.map((a) =>
          a.id === targetApp.animal_id
            ? {
                ...a,
                adoption_status: decision === 'Approved' ? 'Adopted' : 'Available for Adoption'
              }
            : a
        )
      );
    }
    notify(`Application ${decision}`, `Adoption status updated for ${targetApp?.animal_name}.`);
  };

  // Approve Volunteer Report
  const handleVolunteerReportDecision = (reportId, decision) => {
    setVolunteerReports((prev) =>
      prev.map((r) => (r.id === reportId ? { ...r, status: decision } : r))
    );
    notify(`Report ${decision}`, 'Volunteer submission status updated.');
  };

  // Remove a Volunteer from the directory (Admin)
  const handleRemoveVolunteer = (volunteerId) => {
    const volunteer = volunteers.find((v) => v.id === volunteerId);
    setVolunteers((prev) => prev.filter((v) => v.id !== volunteerId));
    setActivityLogs((prev) => [
      {
        id: 'l' + Date.now(),
        time: 'Just now',
        actor: currentUser?.name || 'System',
        action: `Removed volunteer ${volunteer?.name || volunteerId} from the directory`
      },
      ...prev
    ]);
    notify('Volunteer Removed', `${volunteer?.name || 'Volunteer'} no longer has volunteer access.`);
  };

  // Rate an animal (1-5 stars). The dog's rating is the average of all votes.
  const handleRateAnimal = (animalId, stars) => {
    if (!stars || stars < 1 || stars > 5) return;
    const animal = animals.find((a) => a.id === animalId);
    setRatings((prev) => ({
      ...prev,
      [animalId]: [...(prev[animalId] || []), stars]
    }));
    const next = [...(ratings[animalId] || []), stars];
    notify(
      'Thanks for rating!',
      `You rated ${animal?.name || 'this dog'} ${stars}/5 — new average ${averageRating(next).toFixed(1)}/5.`
    );
  };

  // Average rating lookup for cards / lists: { [animalId]: { avg, count } }
  const ratingSummary = useMemo(() => {
    const summary = {};
    animals.forEach((a) => {
      const stars = ratings[a.id] || [];
      summary[a.id] = { avg: averageRating(stars), count: stars.length };
    });
    return summary;
  }, [animals, ratings]);

  // Export CSV Report
  const handleExportCSV = () => {
    const headers = ['Animal_ID,Name,Breed,Age,Gender,Location,Health,Vaccination,Behaviour,Adoption'];
    const rows = animals.map(
      (a) =>
        `"${a.animal_code}","${a.name}","${a.breed}","${a.estimated_age}","${a.gender}","${a.location_name}","${a.health_status}","${a.vaccination_status}","${a.behaviour_status}","${a.adoption_status}"`
    );
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers, ...rows].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `PAW_TRACK_Registry_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    notify('CSV Report Downloaded', 'Complete animal registry exported successfully.');
  };

  return (
    <div
      className="min-h-screen font-sans antialiased selection:bg-[#174D37] selection:text-[#FAF8F1]"
      style={{ backgroundColor: COLORS.ivory, color: COLORS.charcoal }}
    >
      {/* GLOBAL TOAST NOTIFICATIONS */}
      <div className="fixed bottom-5 right-5 z-[100] flex flex-col gap-2.5 max-w-sm w-full pointer-events-none px-4 sm:px-0">
        <AnimatePresence>
          {toasts.map((t) => (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              className="pointer-events-auto bg-white border border-[#A5B99A]/50 shadow-xl rounded-2xl p-4 flex items-start gap-3"
            >
              <div className="w-8 h-8 rounded-xl bg-[#174D37]/10 text-[#174D37] flex items-center justify-center shrink-0 mt-0.5">
                <CheckCircle2 className="w-4 h-4" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-[#26332B]">{t.title}</p>
                <p className="text-xs text-[#5C6B62] mt-0.5">{t.message}</p>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* VIEW ROUTER */}
      {view === 'landing' && (
        <LandingPage
          animals={animals}
          onNavigateAuth={(presetRole = null) => {
            setAuthRoleCard(presetRole);
            setAuthMode('login');
            setView('auth');
            commitNav({ view: 'auth', animalId: null, adoptAnimal: null, reportOpen: false });
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          onQuickDemoLogin={handleQuickRoleLogin}
          onViewAnimal={(id) => {
            setSelectedAnimalId(id);
            setProfileTab('Overview');
            commitNav({ animalId: id });
          }}
          onOpenAdopt={(animal) => {
            setAdoptModalAnimal(animal);
            commitNav({ adoptAnimal: animal });
          }}
          onOpenQuickReport={() => {
            setReportModalOpen(true);
            commitNav({ reportOpen: true });
          }}
        />
      )}

      {view === 'auth' && (
        <AuthPortal
          selectedRole={authRoleCard}
          setSelectedRole={setAuthRoleCard}
          authMode={authMode}
          setAuthMode={setAuthMode}
          showPassword={showPassword}
          setShowPassword={setShowPassword}
          onBack={() => {
            setView('landing');
            commitNav({ view: 'landing' });
          }}
          onSuccessLogin={handleQuickRoleLogin}
          onEmailAuth={handleEmailAuth}
          supabaseEnabled={isSupabaseConfigured}
          notify={notify}
        />
      )}

      {view === 'app' && currentUser && (
        <WorkspaceShell
          currentUser={currentUser}
          onLogout={handleLogout}
          onGoHome={() => {
            setView('landing');
            commitNav({ view: 'landing' });
          }}
          onOpenQuickReport={() => {
            setReportModalOpen(true);
            commitNav({ reportOpen: true });
          }}
          onOpenScanner={() => setScannerOpen(true)}
          activeTab={activeTab}
          setActiveTab={(tab) => {
            setActiveTab(tab);
            commitNav({ tab });
          }}
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
          mobileMenuOpen={mobileMenuOpen}
          setMobileMenuOpen={setMobileMenuOpen}
          animals={animals}
          filteredAnimals={filteredAnimals}
          stats={stats}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          filterLocation={filterLocation}
          setFilterLocation={setFilterLocation}
          filterHealth={filterHealth}
          setFilterHealth={setFilterHealth}
          filterVaccination={filterVaccination}
          setFilterVaccination={setFilterVaccination}
          filterBehaviour={filterBehaviour}
          setFilterBehaviour={setFilterBehaviour}
          filterAdoption={filterAdoption}
          setFilterAdoption={setFilterAdoption}
          displayMode={displayMode}
          setDisplayMode={setDisplayMode}
          nextAnimalCode={nextAnimalCode}
          onRegisterAnimal={handleRegisterAnimal}
          onSelectAnimal={(id, tab = 'Overview') => {
            setSelectedAnimalId(id);
            setProfileTab(tab);
            commitNav({ animalId: id });
          }}
          onAddMedical={handleAddMedicalRecord}
          onAddVaccination={handleAddVaccination}
          onAddBehaviour={handleAddBehaviourLog}
          groups={groups}
          onCreateGroup={handleCreateGroup}
          onUpdateGroup={handleUpdateGroup}
          onDeleteGroup={handleDeleteGroup}
          onMarkGroupFed={handleMarkGroupFed}
          adoptions={adoptions}
          onAdoptionDecision={handleAdoptionDecision}
          onOpenAdoptModal={(animal) => {
            setAdoptModalAnimal(animal);
            commitNav({ adoptAnimal: animal });
          }}
          volunteerReports={volunteerReports}
          volunteers={volunteers}
          onRemoveVolunteer={handleRemoveVolunteer}
          ratingSummary={ratingSummary}
          onRateAnimal={handleRateAnimal}
          onVolunteerReportDecision={handleVolunteerReportDecision}
          onSubmitVolunteerReport={(rep) => {
            setVolunteerReports((prev) => [
              {
                id: 'vr' + Date.now(),
                ...rep,
                submitted_by: `${currentUser.name} (${currentUser.role})`,
                status: 'Pending Approval',
                date: new Date().toISOString().split('T')[0]
              },
              ...prev
            ]);
            notify('Report Submitted', 'Sent to veterinary administrators for review.');
          }}
          notifications={notifications}
          onMarkAllRead={() =>
            setNotifications((prev) => prev.map((n) => ({ ...n, unread: false })))
          }
          onMarkRead={(id, unread) =>
            setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, unread } : n)))
          }
          onDismiss={(id) => setNotifications((prev) => prev.filter((n) => n.id !== id))}
          activityLogs={activityLogs}
          onExportCSV={handleExportCSV}
          notify={notify}
        />
      )}

      {/* DETAILED ANIMAL PROFILE MODAL (ACCESSIBLE FROM LANDING & DASHBOARDS) */}
      <AnimatePresence>
        {selectedAnimal && (
          <AnimalProfileModal
            animal={selectedAnimal}
            activeTab={profileTab}
            setActiveTab={setProfileTab}
            currentUser={currentUser}
            onClose={() => {
              setSelectedAnimalId(null);
              commitNav({ animalId: null }, 'replace');
            }}
            onOpenAdopt={(animal) => {
              setSelectedAnimalId(null);
              setAdoptModalAnimal(animal);
              commitNav({ animalId: null, adoptAnimal: animal });
            }}
            onAddMedical={handleAddMedicalRecord}
            onAddVaccination={handleAddVaccination}
            onAddBehaviour={handleAddBehaviourLog}
            onUpdateAnimal={handleUpdateAnimal}
            onAddFeeding={handleAddFeedingLog}
            onDeleteAnimal={handleDeleteAnimal}
            ratings={ratings[selectedAnimal.id] || []}
            onRate={(stars) => handleRateAnimal(selectedAnimal.id, stars)}
          />
        )}
      </AnimatePresence>

      {/* QR SCANNER MODAL (ANY SIGNED-IN ROLE) */}
      <AnimatePresence>
        {scannerOpen && (
          <QRScannerModal
            onClose={() => setScannerOpen(false)}
            onScan={handleScanResult}
          />
        )}
      </AnimatePresence>

      {/* ADOPTION APPLICATION MODAL */}
      <AnimatePresence>
        {adoptModalAnimal && (
          <AdoptionModal
            animal={adoptModalAnimal}
            currentUser={currentUser}
            onClose={() => {
              setAdoptModalAnimal(null);
              commitNav({ adoptAnimal: null }, 'replace');
            }}
            onSubmit={handleAdoptionSubmit}
          />
        )}
      </AnimatePresence>

      {/* PUBLIC / VOLUNTEER QUICK INCIDENT REPORT MODAL */}
      <AnimatePresence>
        {reportModalOpen && (
          <QuickIncidentModal
            onClose={() => {
              setReportModalOpen(false);
              commitNav({ reportOpen: false }, 'replace');
            }}
            onSubmit={(data) => {
              setVolunteerReports((prev) => [
                {
                  id: 'vr' + Date.now(),
                  type: data.type,
                  submitted_by: data.reporterName || 'Community Member',
                  animal_name: data.animalDesc,
                  breed: 'Community Stray',
                  location: data.location,
                  urgency: data.urgency,
                  notes: data.notes,
                  photo: 'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?auto=format&fit=crop&w=600&q=80',
                  status: 'Pending Approval',
                  date: new Date().toISOString().split('T')[0]
                },
                ...prev
              ]);
              setNotifications((prev) => [
                {
                  id: 'n' + Date.now(),
                  title: `Community Report: ${data.type}`,
                  message: `Reported at ${data.location} (${data.urgency} priority).`,
                  type: data.urgency === 'High' ? 'critical' : 'warning',
                  time: 'Just now',
                  unread: true
                },
                ...prev
              ]);
              setReportModalOpen(false);
              commitNav({ reportOpen: false }, 'replace');
              notify('Alert Dispatched', 'Nearby volunteers and veterinary staff have been notified.');
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

// 1. LANDING PAGE COMPONENT
