// PAW TRACK — Role-based app shell (sidebar + header + router)

import { useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, MapPin, Activity, Plus, AlertTriangle, FileText, Bell, Settings, LogOut, Menu, X, Stethoscope, PawPrint, Navigation, LayoutDashboard, Database, UserCheck, ClipboardList, ScanLine, Utensils } from 'lucide-react';
import { AdoptionManagementModule } from '../adoption/AdoptionManagementModule.jsx';
import { AnimalManagementView } from '../animals/AnimalManagementView.jsx';
import { RegisterAnimalForm } from '../animals/RegisterAnimalForm.jsx';
import { BehaviourMonitoringModule } from '../behaviour/BehaviourMonitoringModule.jsx';
import { FeedingGroupsModule } from '../feeding/FeedingGroupsModule.jsx';
import { PawTrackLogo } from '../common/PawTrackLogo.jsx';
import { DashboardOverview } from '../dashboard/DashboardOverview.jsx';
import { MapLocationsModule } from '../map/MapLocationsModule.jsx';
import { MedicalSurveillanceModule } from '../medical/MedicalSurveillanceModule.jsx';
import { NotificationsCenter } from '../notifications/NotificationsCenter.jsx';
import { ReportsAnalyticsModule } from '../reports/ReportsAnalyticsModule.jsx';
import { DatabaseSchemaSettings } from '../settings/DatabaseSchemaSettings.jsx';
import { VolunteerReportsModule } from '../volunteers/VolunteerReportsModule.jsx';
import { VolunteerManagementModule } from '../volunteers/VolunteerManagementModule.jsx';

export function WorkspaceShell({
  currentUser,
  onLogout,
  onGoHome,
  onOpenQuickReport,
  onOpenScanner,
  activeTab,
  setActiveTab,
  sidebarOpen,
  setSidebarOpen,
  mobileMenuOpen,
  setMobileMenuOpen,
  animals,
  filteredAnimals,
  stats,
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
  nextAnimalCode,
  onRegisterAnimal,
  onSelectAnimal,
  onAddMedical,
  onAddVaccination,
  onAddBehaviour,
  groups,
  onCreateGroup,
  onUpdateGroup,
  onDeleteGroup,
  onMarkGroupFed,
  adoptions,
  onAdoptionDecision,
  onOpenAdoptModal,
  volunteerReports,
  volunteers,
  onRemoveVolunteer,
  ratingSummary,
  onRateAnimal,
  onVolunteerReportDecision,
  onSubmitVolunteerReport,
  notifications,
  onMarkAllRead,
  onMarkRead,
  onDismiss,
  activityLogs,
  onExportCSV,
  notify
}) {
  const role = currentUser.role;

  // Dynamic Sidebar Navigation Items Based on Role Permissions
  const navItems = useMemo(() => {
    if (role === 'admin') {
      return [
        { id: 'overview', label: 'Dashboard Overview', icon: LayoutDashboard },
        { id: 'animals', label: 'Animal Management', icon: PawPrint },
        { id: 'feedingGroups', label: 'Feeding Groups', icon: Utensils },
        { id: 'register', label: 'Register New Animal', icon: Plus },
        { id: 'medical', label: 'Medical & Vaccination', icon: Stethoscope, badge: 'Priority' },
        { id: 'behaviour', label: 'Behaviour Monitoring', icon: Activity },
        { id: 'adoption', label: 'Adoption Management', icon: Heart },
        { id: 'volunteers', label: 'Volunteers & Approvals', icon: UserCheck },
        { id: 'map', label: 'Map & Locations', icon: MapPin },
        { id: 'notifications', label: 'Notifications', icon: Bell, count: stats.unreadNotifications },
        { id: 'reports', label: 'Reports & Analytics', icon: FileText },
        { id: 'settings', label: 'Database & Settings', icon: Database }
      ];
    }
    if (role === 'volunteer') {
      return [
        { id: 'overview', label: 'Volunteer Dashboard', icon: LayoutDashboard },
        { id: 'animals', label: 'Community Animals', icon: PawPrint },
        { id: 'feedingGroups', label: 'Feeding Groups', icon: Utensils },
        { id: 'register', label: 'Submit New Animal', icon: Plus },
        { id: 'behaviour', label: 'Submit Observation', icon: Activity },
        { id: 'volunteers', label: 'My Field Reports', icon: ClipboardList },
        { id: 'map', label: 'Map & Locations', icon: MapPin },
        { id: 'notifications', label: 'Notifications', icon: Bell, count: stats.unreadNotifications }
      ];
    }
    return [
      { id: 'overview', label: 'Public Discovery', icon: LayoutDashboard },
      { id: 'animals', label: 'Browse All Animals', icon: PawPrint },
      { id: 'adoption', label: 'Adoptable Pets', icon: Heart },
      { id: 'map', label: 'Neighborhood Map', icon: MapPin },
      { id: 'volunteers', label: 'Report an Animal', icon: AlertTriangle }
    ];
  }, [role, stats.unreadNotifications]);

  return (
    <div className="h-screen flex overflow-hidden bg-[#FAF8F1]">
      {/* DESKTOP COLLAPSIBLE SIDEBAR */}
      <aside
        className={`hidden lg:flex flex-col bg-white border-r border-[#A5B99A]/40 transition-all duration-300 shrink-0 ${
          sidebarOpen ? 'w-72' : 'w-20'
        }`}
      >
        <div className="h-20 px-5 flex items-center justify-between border-b border-[#A5B99A]/30">
          {sidebarOpen ? (
            <button onClick={onGoHome} className="text-left">
              <PawTrackLogo size={34} />
            </button>
          ) : (
            <button
              onClick={onGoHome}
              className="w-10 h-10 rounded-xl bg-[#174D37] text-white flex items-center justify-center mx-auto"
            >
              <PawPrint className="w-5 h-5" />
            </button>
          )}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-1.5 rounded-lg text-[#5C6B62] hover:bg-[#FAF8F1]"
            title="Toggle Sidebar"
          >
            <Menu className="w-5 h-5" />
          </button>
        </div>

        <nav className="flex-1 p-3.5 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const active = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center justify-between px-3.5 py-3 rounded-2xl text-sm font-semibold transition-all ${
                  active
                    ? 'bg-[#174D37] text-white shadow-md shadow-[#174D37]/15'
                    : 'text-[#26332B]/80 hover:bg-[#FAF8F1] hover:text-[#174D37]'
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <item.icon className="w-5 h-5 shrink-0" />
                  {sidebarOpen && <span className="truncate">{item.label}</span>}
                </div>
                {sidebarOpen && item.badge && (
                  <span
                    className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full ${
                      active ? 'bg-[#E8A64A] text-[#26332B]' : 'bg-[#E8A64A]/20 text-[#8A5408]'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
                {sidebarOpen && item.count > 0 && (
                  <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-red-500 text-white">
                    {item.count}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* USER PROFILE FOOTER IN SIDEBAR */}
        <div className="p-4 border-t border-[#A5B99A]/30">
          {sidebarOpen && (
            <div className="p-3 rounded-2xl bg-[#FAF8F1] border border-[#A5B99A]/40 mb-3">
              <span className="text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded bg-[#174D37] text-white">
                {role}
              </span>
              <p className="text-xs font-bold text-[#26332B] mt-1.5 truncate">{currentUser.name}</p>
              <p className="text-[11px] text-[#5C6B62] truncate">{currentUser.org}</p>
            </div>
          )}
          <button
            onClick={onLogout}
            className="w-full flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl text-xs font-bold text-red-700 bg-red-50 hover:bg-red-100 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            {sidebarOpen && <span>Secure Logout</span>}
          </button>
        </div>
      </aside>

      {/* MOBILE DRAWER OVERLAY */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/40 lg:hidden"
            onClick={() => setMobileMenuOpen(false)}
          >
            <motion.div
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              onClick={(e) => e.stopPropagation()}
              className="w-72 h-full bg-white p-5 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between pb-4 border-b border-stone-100">
                  <PawTrackLogo size={32} />
                  <button onClick={() => setMobileMenuOpen(false)}>
                    <X className="w-5 h-5 text-[#5C6B62]" />
                  </button>
                </div>
                <nav className="mt-4 space-y-1">
                  {navItems.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => {
                        setActiveTab(item.id);
                        setMobileMenuOpen(false);
                      }}
                      className={`w-full flex items-center gap-3 px-3.5 py-3 rounded-xl text-sm font-semibold ${
                        activeTab === item.id
                          ? 'bg-[#174D37] text-white'
                          : 'text-[#26332B] hover:bg-[#FAF8F1]'
                      }`}
                    >
                      <item.icon className="w-4 h-4" />
                      <span>{item.label}</span>
                    </button>
                  ))}
                </nav>
              </div>
              <button
                onClick={onLogout}
                className="w-full py-3 rounded-xl text-xs font-bold text-red-700 bg-red-50"
              >
                Secure Logout
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* MAIN CONTENT AREA */}
      <div className="flex-1 flex flex-col min-w-0 h-full overflow-y-auto">
        {/* TOP WORKSPACE HEADER */}
        <header className="h-20 shrink-0 bg-white/90 backdrop-blur-md border-b border-[#A5B99A]/30 px-4 sm:px-8 flex items-center justify-between sticky top-0 z-30">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="lg:hidden p-2 rounded-xl bg-[#FAF8F1] text-[#174D37]"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-lg sm:text-xl font-extrabold text-[#26332B] capitalize">
                {navItems.find((n) => n.id === activeTab)?.label || 'Dashboard'}
              </h1>
              <p className="text-xs text-[#5C6B62] hidden sm:block">
                Logged in as <span className="font-bold text-[#174D37]">{currentUser.name}</span> ·{' '}
                Role: <span className="uppercase font-bold">{role}</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onOpenScanner}
              className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl text-xs font-bold text-[#174D37] bg-[#E8EFE5] hover:bg-[#D9E6D4] border border-[#A5B99A]/50 transition-all"
              title="Scan an animal QR tag"
            >
              <ScanLine className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Scan QR</span>
            </button>
            <button
              onClick={onOpenQuickReport}
              className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl text-xs font-bold text-red-700 bg-red-50 hover:bg-red-100 border border-red-200 transition-all"
            >
              <AlertTriangle className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Report Injured Animal</span>
            </button>
            {role !== 'user' && (
              <button
                onClick={() => setActiveTab('register')}
                className="px-3.5 sm:px-4 py-2.5 rounded-xl text-xs font-bold text-white bg-[#174D37] hover:bg-[#226B4D] shadow-sm flex items-center gap-1.5"
              >
                <Plus className="w-4 h-4" />
                <span className="hidden sm:inline">Register Animal</span>
              </button>
            )}
            <button
              onClick={() => setActiveTab('notifications')}
              className="relative p-2.5 rounded-xl bg-[#FAF8F1] hover:bg-[#E8EFE5] text-[#174D37] border border-[#A5B99A]/40"
            >
              <Bell className="w-5 h-5" />
              {stats.unreadNotifications > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-red-600 text-white text-[10px] font-bold flex items-center justify-center">
                  {stats.unreadNotifications}
                </span>
              )}
            </button>
          </div>
        </header>

        {/* TAB CONTENT ROUTER */}
        <main className="flex-1 p-4 sm:p-8 max-w-7xl w-full mx-auto space-y-8">
          {activeTab === 'overview' && (
            <DashboardOverview
              role={role}
              stats={stats}
              animals={animals}
              adoptions={adoptions}
              volunteerReports={volunteerReports}
              activityLogs={activityLogs}
              onSelectAnimal={onSelectAnimal}
              onNavigateTab={setActiveTab}
              onOpenAdoptModal={onOpenAdoptModal}
            />
          )}

          {activeTab === 'animals' && (
            <AnimalManagementView
              role={role}
              animals={filteredAnimals}
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
              onSelectAnimal={onSelectAnimal}
              onOpenAdoptModal={onOpenAdoptModal}
              ratingSummary={ratingSummary}
              onRateAnimal={onRateAnimal}
              onAddNew={() => setActiveTab('register')}
            />
          )}

          {activeTab === 'feedingGroups' && (
            <FeedingGroupsModule
              role={role}
              groups={groups}
              animals={animals}
              onSelectAnimal={onSelectAnimal}
              onCreateGroup={onCreateGroup}
              onUpdateGroup={onUpdateGroup}
              onDeleteGroup={onDeleteGroup}
              onMarkFed={onMarkGroupFed}
            />
          )}

          {activeTab === 'register' && (
            <RegisterAnimalForm
              role={role}
              nextAnimalCode={nextAnimalCode}
              currentUser={currentUser}
              onSubmit={onRegisterAnimal}
              onCancel={() => setActiveTab('animals')}
            />
          )}

          {activeTab === 'medical' && (
            <MedicalSurveillanceModule
              role={role}
              animals={animals}
              onSelectAnimal={onSelectAnimal}
              onAddMedical={onAddMedical}
              onAddVaccination={onAddVaccination}
            />
          )}

          {activeTab === 'behaviour' && (
            <BehaviourMonitoringModule
              role={role}
              animals={animals}
              onSelectAnimal={onSelectAnimal}
              onAddBehaviour={onAddBehaviour}
            />
          )}

          {activeTab === 'adoption' && (
            <AdoptionManagementModule
              role={role}
              animals={animals}
              adoptions={adoptions}
              onDecision={onAdoptionDecision}
              onOpenAdoptModal={onOpenAdoptModal}
              onSelectAnimal={onSelectAnimal}
            />
          )}

          {activeTab === 'volunteers' && (
            <div className="space-y-8">
              {role === 'admin' && (
                <VolunteerManagementModule
                  volunteers={volunteers}
                  onRemoveVolunteer={onRemoveVolunteer}
                />
              )}
              <VolunteerReportsModule
                role={role}
                reports={volunteerReports}
                onDecision={onVolunteerReportDecision}
                onSubmitReport={onSubmitVolunteerReport}
              />
            </div>
          )}

          {activeTab === 'map' && (
            <MapLocationsModule
              animals={animals}
              onSelectAnimal={onSelectAnimal}
              notify={notify}
            />
          )}

          {activeTab === 'notifications' && (
            <NotificationsCenter
              notifications={notifications}
              onMarkAllRead={onMarkAllRead}
              onMarkRead={onMarkRead}
              onDismiss={onDismiss}
              onSelectAnimal={onSelectAnimal}
            />
          )}

          {activeTab === 'reports' && (
            <ReportsAnalyticsModule
              animals={animals}
              stats={stats}
              onExportCSV={onExportCSV}
            />
          )}

          {activeTab === 'settings' && (
            <DatabaseSchemaSettings
              currentUser={currentUser}
              notify={notify}
            />
          )}
        </main>
      </div>
    </div>
  );
}

// DASHBOARD OVERVIEW (ADAPTS TO ADMIN, VOLUNTEER, OR PUBLIC USER)
