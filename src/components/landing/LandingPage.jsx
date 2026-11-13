// PAW TRACK — Public marketing landing page

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Shield, Heart, MapPin, Syringe, Search, CheckCircle2, AlertTriangle, Clock, Users, ChevronRight, ChevronDown, QrCode, Stethoscope, PawPrint, Sparkles, Phone, Mail, ArrowRight, Check, ShieldAlert } from 'lucide-react';
import { AnimatedCounter } from '../common/AnimatedCounter.jsx';
import { PawTrackLogo } from '../common/PawTrackLogo.jsx';
import { StatusBadge } from '../common/StatusBadge.jsx';

export function LandingPage({
  animals,
  onNavigateAuth,
  onQuickDemoLogin,
  onViewAnimal,
  onOpenAdopt,
  onOpenQuickReport
}) {
  const [openFaq, setOpenFaq] = useState(0);
  const [contactSubmitted, setContactSubmitted] = useState(false);

  const adoptableAnimals = animals.filter((a) => a.adoption_status === 'Available for Adoption');

  const faqs = [
    {
      q: 'How does PAW TRACK assign a unique digital identity to stray animals?',
      a: 'Every registered animal receives a permanent, sequential ID (e.g., PT-2026-0001) paired with high-resolution photographs, physical identifying marks, GPS zone coordinates, and a scannable vector QR code for collar tags or municipal records.'
    },
    {
      q: 'Can anyone edit an animal’s medical or vaccination records?',
      a: 'No. Strict Role-Based Access Control (RBAC) and database policies ensure only verified veterinarians and authorized NGO administrators can certify medical diagnoses or vaccination certificates. Volunteers can submit field observations that remain pending until verified.'
    },
    {
      q: 'How does PAW TRACK support Rabies and Parvovirus prevention?',
      a: 'Our surveillance engine tracks anti-rabies and DHPPi/Parvovirus due dates automatically, alerts teams 14 days prior to expiration, and provides immediate veterinary isolation escalation workflows for suspected infectious cases.'
    },
    {
      q: 'Does PAW TRACK claim real-time GPS tracking without hardware?',
      a: 'Never. PAW TRACK transparently records verified last-seen locations with timestamped volunteer check-ins and optional GPS capture, clearly distinguishing community sightings from active hardware collars.'
    }
  ];

  return (
    <div className="relative overflow-x-hidden">
      {/* SUBTLE FLOATING PAW BACKGROUND MOTIFS */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden opacity-[0.035] z-0">
        <PawPrint className="w-40 h-40 text-[#174D37] absolute top-24 left-8 -rotate-12" />
        <PawPrint className="w-56 h-56 text-[#174D37] absolute top-[45%] right-12 rotate-12" />
        <PawPrint className="w-36 h-36 text-[#174D37] absolute bottom-20 left-1/3 -rotate-6" />
      </div>

      {/* TOP NAVIGATION BAR */}
      <header className="sticky top-0 z-40 backdrop-blur-md bg-[#FAF8F1]/90 border-b border-[#A5B99A]/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <PawTrackLogo />

          <nav className="hidden lg:flex items-center gap-7 text-sm font-semibold text-[#26332B]/80">
            <a href="#mission" className="hover:text-[#174D37] transition-colors">Our Mission</a>
            <a href="#how-it-works" className="hover:text-[#174D37] transition-colors">How It Works</a>
            <a href="#health-safety" className="hover:text-[#174D37] transition-colors">Health & Surveillance</a>
            <a href="#adoption" className="hover:text-[#174D37] transition-colors">Adopt</a>
            <a href="#faq" className="hover:text-[#174D37] transition-colors">FAQ</a>
          </nav>

          <div className="flex items-center gap-2.5 sm:gap-3">
            <button
              onClick={onOpenQuickReport}
              className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold text-red-700 bg-red-50 hover:bg-red-100 border border-red-200 transition-all"
            >
              <AlertTriangle className="w-3.5 h-3.5" />
              Report Injured Animal
            </button>
            <button
              onClick={() => onNavigateAuth(null)}
              className="px-4 py-2.5 rounded-xl text-sm font-bold text-[#174D37] border border-[#174D37]/25 hover:bg-[#174D37]/5 transition-all"
            >
              Login
            </button>
            <button
              onClick={() => onNavigateAuth('admin')}
              className="px-4 sm:px-5 py-2.5 rounded-xl text-sm font-bold text-white bg-[#174D37] hover:bg-[#226B4D] shadow-md shadow-[#174D37]/20 transition-all flex items-center gap-1.5"
            >
              <span>Launch Platform</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* HERO SECTION */}
      <section className="relative z-10 pt-10 pb-20 lg:pt-16 lg:pb-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-12 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="lg:col-span-7 space-y-6"
            >
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#174D37]/10 border border-[#174D37]/20 text-[#174D37] text-xs font-bold tracking-wide">
                <Sparkles className="w-3.5 h-3.5 text-[#E8A64A]" />
                NATIONAL ANIMAL WELFARE & VETERINARY SURVEILLANCE GRID
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-[#26332B] leading-[1.1]">
                Every Paw Has a Story.{' '}
                <span className="text-[#174D37]">Every Life Deserves Care.</span>
              </h1>

              <p className="text-lg sm:text-xl text-[#5C6B62] max-w-2xl leading-relaxed">
                One centralized digital platform to protect community animals, assign unique QR
                identities, monitor vaccinations, prevent disease risks, and connect rehabilitated
                animals with loving homes.
              </p>

              {/* PRIMARY HERO CTA BUTTONS */}
              <div className="flex flex-wrap items-center gap-3.5 pt-2">
                <a
                  href="#adoption"
                  className="px-6 py-3.5 rounded-2xl text-sm font-bold text-white bg-[#174D37] hover:bg-[#226B4D] shadow-lg shadow-[#174D37]/20 transition-all flex items-center gap-2"
                >
                  <Search className="w-4 h-4" />
                  Explore Animals
                </a>
                <button
                  onClick={() => onNavigateAuth(null)}
                  className="px-6 py-3.5 rounded-2xl text-sm font-bold text-[#26332B] bg-[#E8A64A] hover:bg-[#df9a38] shadow-md transition-all flex items-center gap-2"
                >
                  Get Started
                  <ChevronRight className="w-4 h-4" />
                </button>
                <button
                  onClick={() => onNavigateAuth('volunteer')}
                  className="px-6 py-3.5 rounded-2xl text-sm font-bold text-[#174D37] bg-white hover:bg-[#E8EFE5] border border-[#A5B99A]/60 transition-all flex items-center gap-2"
                >
                  <Heart className="w-4 h-4 text-[#174D37]" />
                  Join as Volunteer
                </button>
              </div>

              {/* INSTANT ONE-CLICK DEMO SANDBOX BAR */}
              <div className="pt-4">
                <div className="p-3.5 rounded-2xl bg-white/90 border border-[#A5B99A]/40 shadow-sm inline-flex flex-wrap items-center gap-2.5">
                  <span className="text-xs font-bold uppercase tracking-wider text-[#5C6B62] px-1">
                    Instant Role Preview:
                  </span>
                  <button
                    onClick={() => onQuickDemoLogin('admin')}
                    className="px-3 py-1.5 rounded-xl text-xs font-bold bg-[#174D37] text-white hover:bg-[#226B4D] transition-all"
                  >
                    Vet / Admin Dashboard
                  </button>
                  <button
                    onClick={() => onQuickDemoLogin('volunteer')}
                    className="px-3 py-1.5 rounded-xl text-xs font-bold bg-[#E8EFE5] text-[#174D37] hover:bg-[#d7e5d2] transition-all"
                  >
                    Volunteer Portal
                  </button>
                  <button
                    onClick={() => onQuickDemoLogin('user')}
                    className="px-3 py-1.5 rounded-xl text-xs font-bold bg-[#FDF4E7] text-[#8A5408] hover:bg-[#fae7cc] transition-all"
                  >
                    Public / Adopter View
                  </button>
                </div>
              </div>
            </motion.div>

            {/* HERO VISUAL CARD WITH FLOATING STATUS WIDGETS */}
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7, delay: 0.1 }}
              className="lg:col-span-5 relative"
            >
              <div className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-white aspect-[4/4.5]">
                <img
                  src="https://images.unsplash.com/photo-1587300003388-59208cc962cb?auto=format&fit=crop&w=1000&q=85"
                  alt="Healthy happy community dog in natural greenery"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#174D37]/80 via-transparent to-transparent" />

                {/* Bottom Overlay Animal ID Tag */}
                <div className="absolute bottom-5 left-5 right-5 bg-white/95 backdrop-blur-md rounded-2xl p-4 shadow-lg border border-[#A5B99A]/40 flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-extrabold px-2 py-0.5 rounded bg-[#174D37] text-white">
                        PT-2026-0001
                      </span>
                      <span className="text-xs font-bold text-emerald-700 flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Rabies & DHPPi Verified
                      </span>
                    </div>
                    <p className="font-bold text-[#26332B] mt-1">Bholu · Indian Pariah</p>
                    <p className="text-xs text-[#5C6B62] flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-[#E8A64A]" /> Indiranagar Sector 4
                    </p>
                  </div>
                  <button
                    onClick={() => onViewAnimal('a1')}
                    className="p-2.5 rounded-xl bg-[#FAF8F1] hover:bg-[#E8EFE5] text-[#174D37] border border-[#A5B99A]/40 transition-colors"
                    title="Inspect Digital ID & QR"
                  >
                    <QrCode className="w-6 h-6" />
                  </button>
                </div>
              </div>

              {/* Floating Top-Right Live Alert Pill */}
              <motion.div
                animate={{ y: [0, -6, 0] }}
                transition={{ repeat: Infinity, duration: 4, ease: 'easeInOut' }}
                className="hidden sm:flex items-center gap-3 bg-white rounded-2xl p-3.5 shadow-xl border border-[#A5B99A]/40 absolute -top-5 -right-5"
              >
                <div className="w-10 h-10 rounded-xl bg-emerald-100 text-[#174D37] flex items-center justify-center">
                  <Shield className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs font-bold text-[#26332B]">94.2% Herd Immunity</p>
                  <p className="text-[11px] text-[#5C6B62]">Active Rabies Surveillance</p>
                </div>
              </motion.div>
            </motion.div>
          </div>

          {/* ANIMATED IMPACT STATISTICS STRIP */}
          <div className="mt-16 grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {[
              { label: 'Total Animals Registered', value: 1482, suffix: '+', icon: PawPrint, color: '#174D37' },
              { label: 'Animals Vaccinated', value: 1349, suffix: '', icon: Syringe, color: '#226B4D' },
              { label: 'Animals Adopted', value: 418, suffix: '+', icon: Heart, color: '#E8A64A' },
              { label: 'Active Volunteers', value: 264, suffix: '', icon: Users, color: '#174D37' }
            ].map((stat, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="bg-white rounded-3xl p-6 border border-[#A5B99A]/35 shadow-sm hover:shadow-md transition-all"
              >
                <div className="flex items-center justify-between mb-3">
                  <div
                    className="w-11 h-11 rounded-2xl flex items-center justify-center"
                    style={{ backgroundColor: `${stat.color}15`, color: stat.color }}
                  >
                    <stat.icon className="w-5 h-5" />
                  </div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full">
                    Verified
                  </span>
                </div>
                <p className="text-3xl sm:text-4xl font-extrabold text-[#26332B]">
                  <AnimatedCounter target={stat.value} suffix={stat.suffix} />
                </p>
                <p className="text-sm font-medium text-[#5C6B62] mt-1">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* OUR MISSION & WHY PAW TRACK */}
      <section id="mission" className="py-20 bg-white border-y border-[#A5B99A]/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center mb-14">
            <span className="text-xs font-bold uppercase tracking-widest text-[#174D37] bg-[#E8EFE5] px-3.5 py-1.5 rounded-full">
              Our Mission & Ecosystem
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#26332B] mt-4">
              Bridging Compassion with Clinical Precision
            </h2>
            <p className="text-[#5C6B62] mt-3 text-base sm:text-lg">
              Community animals often suffer from fragmented care, lost vaccination histories, and
              uncoordinated rescue efforts. PAW TRACK unites every stakeholder on one trusted ledger.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: QrCode,
                title: 'Unique Digital Identity',
                desc: 'Every stray or rescued animal receives a permanent ID (PT-2026-XXXX) and QR code linking to their verified health, sterilization, and temperament history.'
              },
              {
                icon: Stethoscope,
                title: 'Veterinary Disease Surveillance',
                desc: 'Structured immunization timelines for Rabies and Parvovirus with automated overdue alerts and biosecurity isolation protocols.'
              },
              {
                icon: Users,
                title: 'Connected Field Ecosystem',
                desc: 'Empowers veterinarians, NGO heads, farmers, volunteers, and citizens with role-governed tools to report, treat, and rehome animals safely.'
              }
            ].map((item, i) => (
              <div
                key={i}
                className="rounded-3xl p-8 bg-[#FAF8F1] border border-[#A5B99A]/40 hover:border-[#174D37]/40 transition-all"
              >
                <div className="w-12 h-12 rounded-2xl bg-[#174D37] text-white flex items-center justify-center mb-5 shadow-md">
                  <item.icon className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-[#26332B] mb-2">{item.title}</h3>
                <p className="text-sm text-[#5C6B62] leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="how-it-works" className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-xs font-bold uppercase tracking-widest text-[#174D37]">
              End-to-End Workflow
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#26332B] mt-2">
              How PAW TRACK Works
            </h2>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                step: '01',
                title: 'Discover & Register',
                desc: 'Volunteers or admins log a community animal with photos, GPS zone, and physical marks to mint a unique ID.'
              },
              {
                step: '02',
                title: 'Vet Exam & Vaccinate',
                desc: 'Certified veterinarians administer Rabies & Parvo vaccines, log ABC sterilization, and set booster reminders.'
              },
              {
                step: '03',
                title: 'Monitor Health & Behaviour',
                desc: 'Ongoing field check-ins track temperament badges (Friendly, Shy, Territorial) and trigger early medical alerts.'
              },
              {
                step: '04',
                title: 'Match with Loving Homes',
                desc: 'Medically cleared, friendly animals are listed for public adoption with structured adopter screening.'
              }
            ].map((s, idx) => (
              <div
                key={idx}
                className="bg-white rounded-3xl p-6 border border-[#A5B99A]/35 shadow-sm relative"
              >
                <span className="text-4xl font-black text-[#174D37]/15 block mb-3">{s.step}</span>
                <h3 className="text-lg font-bold text-[#26332B] mb-2">{s.title}</h3>
                <p className="text-sm text-[#5C6B62] leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ANIMAL HEALTH, SAFETY & SMART VACCINATION MONITORING */}
      <section id="health-safety" className="py-20 bg-[#174D37] text-[#FAF8F1]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-6 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-[#E8A64A] text-xs font-bold">
                <ShieldAlert className="w-4 h-4" />
                PUBLIC HEALTH & ZOONOTIC SAFETY
              </div>
              <h2 className="text-3xl sm:text-4xl font-extrabold leading-tight">
                Smart Vaccination & Infectious Disease Surveillance
              </h2>
              <p className="text-[#FAF8F1]/80 text-base leading-relaxed">
                PAW TRACK protects both community dogs and neighborhoods by maintaining verifiable
                immunization coverage and structured clinical referral workflows.
              </p>

              <div className="space-y-4 pt-2">
                {[
                  {
                    title: 'Zero-Gap Rabies & Parvovirus Tracking',
                    desc: 'Automated countdowns flag upcoming and overdue boosters before community immunity drops.'
                  },
                  {
                    title: 'Qualified Veterinary Escalation',
                    desc: 'Suspected infectious cases are never auto-diagnosed; critical flags immediately alert licensed veterinarians for safe isolation.'
                  },
                  {
                    title: 'Colour-Coded Behaviour Safety',
                    desc: 'Clear temperament badges help volunteers, municipal workers, and families interact safely with community dogs.'
                  }
                ].map((feat, idx) => (
                  <div key={idx} className="flex items-start gap-3.5">
                    <div className="w-6 h-6 rounded-full bg-[#E8A64A] text-[#174D37] flex items-center justify-center shrink-0 mt-0.5">
                      <Check className="w-4 h-4 stroke-[3]" />
                    </div>
                    <div>
                      <h4 className="font-bold text-white">{feat.title}</h4>
                      <p className="text-sm text-[#FAF8F1]/75">{feat.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Live Surveillance Preview Card */}
            <div className="lg:col-span-6">
              <div className="bg-white text-[#26332B] rounded-3xl p-6 sm:p-8 shadow-2xl space-y-5">
                <div className="flex items-center justify-between border-b border-stone-100 pb-4">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-wider text-[#5C6B62]">
                      Live Surveillance Feed
                    </p>
                    <h3 className="text-lg font-extrabold text-[#174D37]">
                      Veterinary Immunization & Alert Monitor
                    </h3>
                  </div>
                  <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold">
                    Real-Time Ledger
                  </span>
                </div>

                <div className="space-y-3">
                  <div className="p-4 rounded-2xl bg-red-50 border border-red-200 flex items-start gap-3">
                    <AlertTriangle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-bold text-red-900">
                        Isolation Protocol: Simba (PT-2026-0003)
                      </p>
                      <p className="text-xs text-red-700 mt-0.5">
                        Suspected Parvovirus referred to Dr. Kavita Rao. Biosecurity active in HSR
                        Sector 2.
                      </p>
                    </div>
                  </div>

                  <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 flex items-start gap-3">
                    <Clock className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-bold text-amber-900">
                        Booster Reminder: Tara (PT-2026-0002)
                      </p>
                      <p className="text-xs text-amber-800 mt-0.5">
                        Annual Anti-Rabies booster queued immediately following soft-tissue recovery.
                      </p>
                    </div>
                  </div>

                  <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-bold text-emerald-900">
                        Cleared & Certified: Bholu (PT-2026-0001)
                      </p>
                      <p className="text-xs text-emerald-800 mt-0.5">
                        Rabies + DHPPi valid through Sep 2027. ABC sterilized & friendly temperament.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FIND ANIMALS FOR ADOPTION */}
      <section id="adoption" className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12 gap-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-[#174D37] bg-[#E8EFE5] px-3 py-1 rounded-full">
                Verified Adoption Directory
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-[#26332B] mt-3">
                Meet Animals Ready for a Loving Home
              </h2>
              <p className="text-[#5C6B62] mt-1">
                Every adoptable companion is health-screened, vaccinated, and behaviour-assessed.
              </p>
            </div>
            <button
              onClick={() => onQuickDemoLogin('user')}
              className="inline-flex items-center gap-2 text-sm font-bold text-[#174D37] hover:underline"
            >
              Browse Full Registry <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {adoptableAnimals.map((animal) => (
              <motion.div
                key={animal.id}
                whileHover={{ y: -4 }}
                className="bg-white rounded-3xl overflow-hidden border border-[#A5B99A]/40 shadow-sm hover:shadow-xl transition-all flex flex-col"
              >
                <div className="relative h-64 overflow-hidden">
                  <img
                    src={animal.photos[0]}
                    alt={animal.name}
                    className="w-full h-full object-cover"
                  />
                  <span className="absolute top-3.5 left-3.5 font-mono text-xs font-bold px-2.5 py-1 rounded-lg bg-[#174D37]/90 text-white backdrop-blur-sm">
                    {animal.animal_code}
                  </span>
                  <div className="absolute top-3.5 right-3.5">
                    <StatusBadge value={animal.behaviour_status} />
                  </div>
                </div>

                <div className="p-6 flex-1 flex flex-col justify-between space-y-5">
                  <div>
                    <div className="flex items-center justify-between">
                      <h3 className="text-xl font-extrabold text-[#26332B]">{animal.name}</h3>
                      <span className="text-xs font-semibold text-[#5C6B62]">
                        {animal.gender} · {animal.estimated_age}
                      </span>
                    </div>
                    <p className="text-sm text-[#5C6B62] mt-0.5">{animal.breed}</p>
                    <p className="text-xs text-[#5C6B62] flex items-center gap-1 mt-2">
                      <MapPin className="w-3.5 h-3.5 text-[#E8A64A]" />
                      {animal.location_name}
                    </p>

                    <div className="flex flex-wrap gap-1.5 mt-4">
                      <StatusBadge value={animal.health_status} />
                      <StatusBadge value={animal.vaccination_status} />
                    </div>
                  </div>

                  <div className="pt-4 border-t border-stone-100 flex items-center gap-2.5">
                    <button
                      onClick={() => onViewAnimal(animal.id)}
                      className="flex-1 py-2.5 px-3 rounded-xl text-xs font-bold text-[#174D37] bg-[#FAF8F1] hover:bg-[#E8EFE5] border border-[#A5B99A]/40 transition-colors"
                    >
                      View Profile & QR
                    </button>
                    <button
                      onClick={() => onOpenAdopt(animal)}
                      className="flex-1 py-2.5 px-3 rounded-xl text-xs font-bold text-white bg-[#174D37] hover:bg-[#226B4D] transition-colors"
                    >
                      Adopt {animal.name}
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* COMMUNITY TESTIMONIALS & BECOME A VOLUNTEER */}
      <section className="py-20 bg-white border-t border-[#A5B99A]/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-3xl font-extrabold text-[#26332B]">
              Trusted by Veterinarians, Rescuers & Families
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6 mb-16">
            {[
              {
                quote:
                  'Having instant QR access to a stray dog’s Rabies and ABC sterilization history saves critical minutes during emergency field treatments.',
                author: 'Dr. Kavita Rao, MVSc',
                role: 'Chief Veterinary Officer'
              },
              {
                quote:
                  'As a neighborhood feeder, I used to track 25 dogs in notebooks. PAW TRACK lets me log sightings and flag injuries directly to vets.',
                author: 'Ananya Sharma',
                role: 'Lead Community Volunteer'
              },
              {
                quote:
                  'Adopting Kaveri was transparent and reassuring. We received her complete vaccination timeline and temperament notes right away.',
                author: 'Priya & Arjun Nair',
                role: 'Adoptive Pet Parents'
              }
            ].map((t, idx) => (
              <div
                key={idx}
                className="p-7 rounded-3xl bg-[#FAF8F1] border border-[#A5B99A]/40 flex flex-col justify-between"
              >
                <p className="text-sm text-[#26332B] italic leading-relaxed">“{t.quote}”</p>
                <div className="mt-5 pt-4 border-t border-[#A5B99A]/30">
                  <p className="font-bold text-sm text-[#174D37]">{t.author}</p>
                  <p className="text-xs text-[#5C6B62]">{t.role}</p>
                </div>
              </div>
            ))}
          </div>

          {/* BECOME A VOLUNTEER BANNER */}
          <div className="rounded-3xl bg-[#E8EFE5] border border-[#A5B99A]/60 p-8 sm:p-12 flex flex-col lg:flex-row items-center justify-between gap-8">
            <div className="max-w-2xl space-y-3">
              <span className="text-xs font-extrabold uppercase tracking-wider text-[#174D37]">
                Join the Ground Network
              </span>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-[#26332B]">
                Become a Certified PAW TRACK Volunteer
              </h3>
              <p className="text-sm sm:text-base text-[#5C6B62]">
                Whether you are a feeder, farmer, student, or rescuer—help document neighborhood
                animals, report injuries early, and keep vaccination records up to date.
              </p>
            </div>
            <button
              onClick={() => onNavigateAuth('volunteer')}
              className="px-7 py-4 rounded-2xl text-sm font-bold text-white bg-[#174D37] hover:bg-[#226B4D] shadow-lg shrink-0 transition-all"
            >
              Register as Volunteer
            </button>
          </div>
        </div>
      </section>

      {/* FAQ & CONTACT SECTION */}
      <section id="faq" className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid lg:grid-cols-12 gap-12">
          {/* FAQ Accordion */}
          <div className="lg:col-span-7 space-y-4">
            <h2 className="text-3xl font-extrabold text-[#26332B] mb-6">
              Frequently Asked Questions
            </h2>
            {faqs.map((item, idx) => (
              <div
                key={idx}
                className="bg-white rounded-2xl border border-[#A5B99A]/40 overflow-hidden"
              >
                <button
                  onClick={() => setOpenFaq(openFaq === idx ? -1 : idx)}
                  className="w-full p-5 text-left flex items-center justify-between font-bold text-[#26332B] text-sm sm:text-base"
                >
                  <span>{item.q}</span>
                  <ChevronDown
                    className={`w-5 h-5 text-[#174D37] transition-transform ${
                      openFaq === idx ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                {openFaq === idx && (
                  <div className="px-5 pb-5 text-sm text-[#5C6B62] leading-relaxed border-t border-stone-100 pt-3">
                    {item.a}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Contact Us Card */}
          <div className="lg:col-span-5">
            <div className="bg-white rounded-3xl p-7 sm:p-8 border border-[#A5B99A]/40 shadow-sm">
              <h3 className="text-2xl font-extrabold text-[#26332B]">Contact Helpline & NGO Desk</h3>
              <p className="text-sm text-[#5C6B62] mt-1">
                Need municipal onboarding, shelter integration, or urgent guidance?
              </p>

              {contactSubmitted ? (
                <div className="mt-6 p-6 rounded-2xl bg-emerald-50 border border-emerald-200 text-center space-y-2">
                  <CheckCircle2 className="w-8 h-8 text-emerald-700 mx-auto" />
                  <p className="font-bold text-emerald-900">Message Received</p>
                  <p className="text-xs text-emerald-800">
                    Our animal welfare coordination team will respond within 4 hours.
                  </p>
                </div>
              ) : (
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    setContactSubmitted(true);
                  }}
                  className="mt-5 space-y-4"
                >
                  <div>
                    <label className="block text-xs font-bold text-[#26332B] mb-1">Full Name</label>
                    <input
                      required
                      type="text"
                      placeholder="Dr. / Mr. / Ms."
                      className="w-full px-4 py-2.5 rounded-xl bg-[#FAF8F1] border border-[#A5B99A]/50 text-sm focus:outline-none focus:border-[#174D37]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-[#26332B] mb-1">Email Address</label>
                    <input
                      required
                      type="email"
                      placeholder="you@organization.org"
                      className="w-full px-4 py-2.5 rounded-xl bg-[#FAF8F1] border border-[#A5B99A]/50 text-sm focus:outline-none focus:border-[#174D37]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-[#26332B] mb-1">Message</label>
                    <textarea
                      required
                      rows={3}
                      placeholder="How can we collaborate?"
                      className="w-full px-4 py-2.5 rounded-xl bg-[#FAF8F1] border border-[#A5B99A]/50 text-sm focus:outline-none focus:border-[#174D37]"
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full py-3 rounded-xl bg-[#174D37] hover:bg-[#226B4D] text-white font-bold text-sm transition-all"
                  >
                    Send Inquiry
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* PROFESSIONAL FOOTER */}
      <footer className="bg-[#26332B] text-[#FAF8F1] py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8 pb-10 border-b border-white/10">
            <div className="space-y-4">
              <PawTrackLogo light />
              <p className="text-xs text-[#A5B99A] leading-relaxed">
                Centralized animal identification, veterinary health surveillance, and ethical
                adoption platform built for compassionate communities.
              </p>
            </div>
            <div>
              <h4 className="font-bold text-sm mb-3 text-white">Platform Modules</h4>
              <ul className="space-y-2 text-xs text-[#A5B99A]">
                <li>Unique Digital ID & QR Registry</li>
                <li>Rabies & Parvo Surveillance</li>
                <li>Behavioural Safety Monitoring</li>
                <li>Adoption & Foster Matching</li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-sm mb-3 text-white">Role Portals</h4>
              <ul className="space-y-2 text-xs text-[#A5B99A]">
                <li>
                  <button onClick={() => onQuickDemoLogin('admin')} className="hover:text-white">
                    Veterinarian & Admin Portal
                  </button>
                </li>
                <li>
                  <button onClick={() => onQuickDemoLogin('volunteer')} className="hover:text-white">
                    Community Volunteer Portal
                  </button>
                </li>
                <li>
                  <button onClick={() => onQuickDemoLogin('user')} className="hover:text-white">
                    Public Adopter Directory
                  </button>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-sm mb-3 text-white">Emergency Helpline</h4>
              <p className="text-xs text-[#A5B99A] flex items-center gap-2 mb-2">
                <Phone className="w-3.5 h-3.5 text-[#E8A64A]" /> +91 800-PAW-CARE (24x7)
              </p>
              <p className="text-xs text-[#A5B99A] flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-[#E8A64A]" /> care@pawtrack.org
              </p>
            </div>
          </div>
          <div className="pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-[#A5B99A]">
            <p>© 2026 PAW TRACK Animal Welfare Grid. All rights reserved.</p>
            <p className="mt-2 sm:mt-0">Designed for Humane Community Health & Animal Protection.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

// 2. AUTHENTICATION & THREE ROLE-SELECTION CARDS
