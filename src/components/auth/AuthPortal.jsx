// PAW TRACK — Role selection & sign-in portal

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Shield, Heart, Search, CheckCircle2, Users, Eye, EyeOff } from 'lucide-react';
import { PawTrackLogo } from '../common/PawTrackLogo.jsx';

export function AuthPortal({
  selectedRole,
  setSelectedRole,
  authMode,
  setAuthMode,
  showPassword,
  setShowPassword,
  onBack,
  onSuccessLogin,
  onEmailAuth,
  supabaseEnabled,
  notify
}) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [authError, setAuthError] = useState('');

  const roleCards = [
    {
      id: 'admin',
      title: 'ADMIN & VETERINARY LOGIN',
      subtitle: 'For Veterinarians, NGO Heads & Authorized Administrators',
      badge: 'Full Clinical & Registry Access',
      icon: Shield,
      accent: '#174D37',
      features: [
        'Certify medical diagnoses & vaccination records',
        'Approve volunteer submissions & adoptions',
        'Access disease surveillance & analytics'
      ]
    },
    {
      id: 'volunteer',
      title: 'VOLUNTEER LOGIN',
      subtitle: 'For Pet Guardians, Farmers, Rescuers & Community Volunteers',
      badge: 'Field Reporting & Observation',
      icon: Heart,
      accent: '#226B4D',
      features: [
        'Register newly discovered stray animals',
        'Report injuries & submit behaviour notes',
        'Track assigned animals & approval status'
      ]
    },
    {
      id: 'user',
      title: 'PUBLIC USER LOGIN',
      subtitle: 'For General Public Users & Prospective Adopters',
      badge: 'Browse & Adopt',
      icon: Users,
      accent: '#E8A64A',
      features: [
        'Search verified animal profiles by ID or area',
        'Submit adoption interest applications',
        'Report injured or abandoned animals'
      ]
    }
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setAuthError('');
    setSubmitting(true);
    try {
      const result = await onEmailAuth({
        mode: authMode,
        role: selectedRole,
        email,
        password,
        fullName
      });
      if (!result?.ok) {
        setAuthError(result?.error || 'Authentication failed. Please try again.');
        return;
      }
      if (result.message) {
        notify(authMode === 'forgot' ? 'Recovery Link Sent' : 'Check Your Email', result.message);
        if (authMode === 'forgot') setAuthMode('login');
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-between py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto w-full">
        <div className="flex items-center justify-between mb-10">
          <PawTrackLogo />
          <button
            onClick={onBack}
            className="px-4 py-2 rounded-xl text-sm font-bold text-[#174D37] bg-white border border-[#A5B99A]/40 hover:bg-[#E8EFE5] transition-all"
          >
            ← Back to Home
          </button>
        </div>

        {!selectedRole ? (
          <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }}>
            <div className="text-center max-w-2xl mx-auto mb-12">
              <span className="text-xs font-bold uppercase tracking-widest text-[#174D37] bg-[#E8EFE5] px-3.5 py-1.5 rounded-full">
                Role-Governed Access Control
              </span>
              <h1 className="text-3xl sm:text-4xl font-extrabold text-[#26332B] mt-3">
                Select Your PAW TRACK Portal
              </h1>
              <p className="text-[#5C6B62] mt-2">
                Permissions are strictly enforced at both application and database policy layers.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-7">
              {roleCards.map((card) => (
                <motion.div
                  key={card.id}
                  whileHover={{ y: -5 }}
                  className="bg-white rounded-3xl p-7 border border-[#A5B99A]/50 shadow-sm hover:shadow-xl transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-5">
                      <div
                        className="w-12 h-12 rounded-2xl flex items-center justify-center text-white"
                        style={{ backgroundColor: card.accent }}
                      >
                        <card.icon className="w-6 h-6" />
                      </div>
                      <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-[#FAF8F1] border border-[#A5B99A]/40 text-[#26332B]">
                        {card.badge}
                      </span>
                    </div>
                    <h2 className="text-lg font-extrabold text-[#26332B]">{card.title}</h2>
                    <p className="text-xs text-[#5C6B62] mt-1">{card.subtitle}</p>

                    <ul className="mt-5 space-y-2.5 border-t border-stone-100 pt-4">
                      {card.features.map((f, i) => (
                        <li key={i} className="text-xs text-[#26332B] flex items-start gap-2">
                          <CheckCircle2 className="w-4 h-4 text-[#174D37] shrink-0 mt-0.5" />
                          <span>{f}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="mt-7 space-y-2">
                    <button
                      onClick={() => setSelectedRole(card.id)}
                      className="w-full py-3 rounded-xl text-sm font-bold text-white bg-[#174D37] hover:bg-[#226B4D] transition-all"
                    >
                      Continue to Sign In
                    </button>
                    <button
                      onClick={() => onSuccessLogin(card.id)}
                      className="w-full py-2.5 rounded-xl text-xs font-bold text-[#174D37] bg-[#FAF8F1] hover:bg-[#E8EFE5] border border-[#A5B99A]/40 transition-all"
                    >
                      One-Click Demo Access →
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            className="max-w-md mx-auto bg-white rounded-3xl p-8 border border-[#A5B99A]/50 shadow-xl"
          >
            <button
              onClick={() => setSelectedRole(null)}
              className="text-xs font-bold text-[#5C6B62] hover:text-[#174D37] mb-4 inline-block"
            >
              ← Switch Role Portal
            </button>

            <div className="mb-6">
              <span className="text-[11px] font-extrabold uppercase tracking-wider px-2.5 py-1 rounded-full bg-[#174D37]/10 text-[#174D37]">
                {selectedRole.toUpperCase()} PORTAL
              </span>
              <h2 className="text-2xl font-extrabold text-[#26332B] mt-2">
                {authMode === 'login'
                  ? 'Sign In to Your Account'
                  : authMode === 'register'
                  ? 'Create Verified Account'
                  : 'Reset Password'}
              </h2>
            </div>

            {!supabaseEnabled && (
              <div className="mb-4 px-3.5 py-2.5 rounded-xl bg-[#E8A64A]/15 border border-[#E8A64A]/40 text-[11px] font-semibold text-[#8A5408]">
                Demo mode — no Supabase keys found in .env, so signing in with credentials
                grants one-click demo access.
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {authMode === 'register' && (
                <div>
                  <label className="block text-xs font-bold text-[#26332B] mb-1">Full Name</label>
                  <input
                    required
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Enter your full name"
                    className="w-full px-4 py-2.5 rounded-xl bg-[#FAF8F1] border border-[#A5B99A]/50 text-sm focus:outline-none focus:border-[#174D37]"
                  />
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-[#26332B] mb-1">Email Address</label>
                <input
                  required
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@domain.com"
                  className="w-full px-4 py-2.5 rounded-xl bg-[#FAF8F1] border border-[#A5B99A]/50 text-sm focus:outline-none focus:border-[#174D37]"
                />
              </div>

              {authMode !== 'forgot' && (
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-xs font-bold text-[#26332B]">Password</label>
                    {authMode === 'login' && (
                      <button
                        type="button"
                        onClick={() => setAuthMode('forgot')}
                        className="text-xs font-semibold text-[#174D37] hover:underline"
                      >
                        Forgot password?
                      </button>
                    )}
                  </div>
                  <div className="relative">
                    <input
                      required
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full px-4 py-2.5 rounded-xl bg-[#FAF8F1] border border-[#A5B99A]/50 text-sm focus:outline-none focus:border-[#174D37]"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-2.5 text-[#5C6B62]"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
              )}

              {authError && (
                <div className="px-3.5 py-2.5 rounded-xl bg-red-50 border border-red-200 text-xs font-semibold text-red-700">
                  {authError}
                </div>
              )}

              <button
                type="submit"
                disabled={submitting}
                className="w-full py-3 rounded-xl bg-[#174D37] hover:bg-[#226B4D] text-white font-bold text-sm shadow-md transition-all disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {submitting
                  ? 'Please wait…'
                  : authMode === 'login'
                  ? 'Sign In'
                  : authMode === 'register'
                  ? 'Register Account'
                  : 'Send Recovery Link'}
              </button>
            </form>

            <div className="mt-5 pt-4 border-t border-stone-100 flex flex-col gap-2 text-center">
              <button
                type="button"
                onClick={() => onSuccessLogin(selectedRole)}
                className="w-full py-2.5 rounded-xl bg-[#E8A64A]/20 text-[#8A5408] font-bold text-xs hover:bg-[#E8A64A]/30 transition-all"
              >
                Instant One-Click Demo Login ({selectedRole.toUpperCase()})
              </button>

              {authMode === 'login' ? (
                <p className="text-xs text-[#5C6B62] mt-1">
                  New to PAW TRACK?{' '}
                  <button
                    onClick={() => setAuthMode('register')}
                    className="font-bold text-[#174D37] hover:underline"
                  >
                    Create an account
                  </button>
                </p>
              ) : (
                <button
                  onClick={() => setAuthMode('login')}
                  className="text-xs font-bold text-[#174D37] hover:underline mt-1"
                >
                  Back to Sign In
                </button>
              )}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}

// 3. ROLE-BASED WORKSPACE SHELL (ADMIN, VOLUNTEER, PUBLIC USER)
