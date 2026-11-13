// PAW TRACK — Application root: state, handlers & view router

import { useState, useMemo, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Filter, CheckCircle2, Users, Navigation } from 'lucide-react';
import { AdoptionModal } from './components/adoption/AdoptionModal.jsx';
import { AnimalProfileModal } from './components/animals/AnimalProfileModal.jsx';
import { AuthPortal } from './components/auth/AuthPortal.jsx';
import { LandingPage } from './components/landing/LandingPage.jsx';
import { WorkspaceShell } from './components/layout/WorkspaceShell.jsx';
import { QuickIncidentModal } from './components/volunteers/QuickIncidentModal.jsx';
import { COLORS } from './constants/theme.js';
import { INITIAL_ADOPTIONS } from './data/adoptions.js';
import { INITIAL_ANIMALS } from './data/animals.js';
import { INITIAL_NOTIFICATIONS } from './data/notifications.js';
import { INITIAL_VOLUNTEER_REPORTS } from './data/volunteerReports.js';

export default function App() {
  // Core Navigation & Auth State
  const [view, setView] = useState('landing'); // 'landing' | 'auth' | 'app'
  const [currentUser, setCurrentUser] = useState(null); // { name, email, role: 'admin'|'volunteer'|'user', org }
  const [authRoleCard, setAuthRoleCard] = useState(null); // null | 'admin' | 'volunteer' | 'user'
  const [authMode, setAuthMode] = useState('login'); // 'login' | 'register' | 'forgot'
  const [showPassword, setShowPassword] = useState(false);

  // App Workspace Navigation
  const [activeTab, setActiveTab] = useState('overview');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Domain Data State (Live Interactive CRUD)
  const [animals, setAnimals] = useState(INITIAL_ANIMALS);
  const [adoptions, setAdoptions] = useState(INITIAL_ADOPTIONS);
  const [volunteerReports, setVolunteerReports] = useState(INITIAL_VOLUNTEER_REPORTS);
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

  // --- Browser history integration -----------------------------------
  // Mirrors in-app navigation into history entries so the browser
  // back/forward buttons move between views, sidebar tabs and modals.
  const navStateRef = useRef({
    view: 'landing',
    tab: 'overview',
    animalId: null,
    adoptAnimal: null,
    reportOpen: false
  });
  const userRef = useRef(null);

  useEffect(() => {
    userRef.current = currentUser;
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
      activeVolunteers: 64,
      unreadNotifications: notifications.filter((n) => n.unread).length
    };
  }, [animals, notifications]);

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

  const handleLogout = () => {
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
          adoptions={adoptions}
          onAdoptionDecision={handleAdoptionDecision}
          onOpenAdoptModal={(animal) => {
            setAdoptModalAnimal(animal);
            commitNav({ adoptAnimal: animal });
          }}
          volunteerReports={volunteerReports}
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
