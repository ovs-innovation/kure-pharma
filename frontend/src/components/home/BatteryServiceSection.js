import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FiBattery, FiTool, FiCheckCircle, FiZap,
  FiPhone, FiX, FiChevronDown,
} from 'react-icons/fi';
import { toast } from 'react-toastify';
import BatteryServiceServices from '@services/BatteryServiceServices';

/* ─── Data ─────────────────────────────────── */
const FEATURES = [
  { icon: FiBattery, title: 'All Battery Types',  desc: 'Lead Acid, Lithium Ion, Tubular, AGM, Gel & more.',           color: 'from-blue-500 to-blue-700' },
  { icon: FiTool,    title: 'Expert Repair',        desc: 'Cell replacement, reconditioning, leakage fix & charging.',    color: 'from-[#ED1C24] to-[#c1151b]' },
  { icon: FiZap,     title: 'Fast Turnaround',      desc: 'Quick diagnostics and same-day service available.',            color: 'from-amber-500 to-amber-700' },
  { icon: FiCheckCircle, title: 'Warranty Backed',  desc: 'All repairs come with a service guarantee for peace of mind.', color: 'from-green-500 to-green-700' },
];

const BATTERY_TYPES  = ['Lead Acid','Lithium Ion','Lithium Polymer','AGM','Gel','Tubular','VRLA','Other'];
const SERVICE_TYPES  = ['Battery Repair','Battery Reconditioning','Battery Testing','Battery Replacement','Battery Maintenance','Electrolyte Refilling','Cell Replacement','Charging Issue','Leakage Fix','Other'];
const SERVICE_TAGS   = ['Repair','Reconditioning','Testing','Cell Replace','Leakage Fix'];

/* ─── Light-theme helpers ───────────────────── */
const inp = 'w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:border-[#0b1d3d] focus:ring-1 focus:ring-[#0b1d3d] transition-all bg-white';
const sel = `${inp} appearance-none cursor-pointer`;

const FL = ({ label, required, children }) => (
  <div className="flex flex-col gap-1">
    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none">
      {label}{required && <span className="text-red-500 ml-0.5">*</span>}
    </label>
    {children}
  </div>
);

/* ─── Modal ─────────────────────────────────── */
const BatteryModal = ({ onClose }) => {
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    name: '', email: '', phoneCountry: '+91', phone: '', city: '', state: '', pincode: '',
    batteryBrand: '', batteryType: '', serviceType: '', problemDescription: '', preferredDate: '',
  });

  const set = k => e => setForm(p => ({ ...p, [k]: e.target.value }));

  const handleSubmit = async e => {
    e.preventDefault();
    if (!form.name || !form.email || !form.phone || !form.batteryType || !form.serviceType || !form.problemDescription) {
      toast.error('Please fill all required fields.');
      return;
    }
    setSubmitting(true);
    try {
      const fullPhone = `${form.phoneCountry} ${form.phone}`;
      const submissionData = { ...form, phone: fullPhone };
      await BatteryServiceServices.submitRequest(submissionData);
      toast.success('🔋 Request submitted! We will contact you shortly.');
      onClose();
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Failed to submit. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        key="overlay"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[999] flex items-center justify-center px-4"
        style={{ background: 'rgba(0,0,0,0.55)' }}
        onClick={e => e.target === e.currentTarget && onClose()}
      >
        <motion.div
          key="modal"
          initial={{ scale: 0.93, opacity: 0, y: 18 }}
          animate={{ scale: 1,    opacity: 1, y: 0  }}
          exit={{    scale: 0.93, opacity: 0, y: 18 }}
          transition={{ type: 'spring', stiffness: 280, damping: 26 }}
          className="w-full bg-white rounded-2xl shadow-2xl overflow-hidden flex"
          style={{ maxWidth: 900 }}
        >
          {/* ══════ LEFT PANEL ══════ */}
          <div
            className="hidden md:flex flex-col justify-between w-[240px] flex-shrink-0 p-6"
            style={{ background: 'linear-gradient(155deg,#f5f7fa 0%,#e9ecf3 100%)', borderRight: '1px solid #e2e6ef' }}
          >
            <div>
              {/* icon */}
              <div className="w-[72px] h-[72px] rounded-xl bg-gradient-to-br from-[#0b1d3d] to-[#1e3a6e] flex items-center justify-center shadow-md mb-4">
                <FiBattery className="w-9 h-9 text-white" />
              </div>

              <p className="text-[9px] font-black uppercase tracking-[0.22em] text-gray-400 mb-0.5">Service Profile</p>
              <h3 className="text-[17px] font-black text-gray-900 leading-snug mb-4">
                Battery Repair<br />& Service
              </h3>

              {/* stat rows */}
              {[
                { label: 'Battery Types', value: 'All Types'   },
                { label: 'Service Time',  value: 'Same Day'    },
                { label: 'Warranty',      value: 'Guaranteed', red: true },
              ].map(row => (
                <div key={row.label} className="flex justify-between items-center py-2 border-b border-gray-200 last:border-0">
                  <span className="text-[9px] font-black uppercase tracking-wider text-gray-400">{row.label}</span>
                  <span className={`text-[11px] font-black ${row.red ? 'text-[#ED1C24]' : 'text-gray-800'}`}>{row.value}</span>
                </div>
              ))}

              <p className="text-[11px] text-gray-500 leading-relaxed mt-4">
                Certified technicians for Lead Acid, Lithium Ion, Tubular &amp; all battery types. Affordable pricing with service guarantee.
              </p>
            </div>

            {/* tags */}
            <div className="flex flex-wrap gap-1.5 pt-4">
              {SERVICE_TAGS.map(t => (
                <span key={t} className="text-[9px] font-bold uppercase tracking-wide bg-white border border-gray-200 text-gray-500 px-2 py-0.5 rounded-full">
                  {t}
                </span>
              ))}
            </div>
          </div>

          {/* ══════ RIGHT PANEL ══════ */}
          <div className="flex-1 flex flex-col min-w-0">

            {/* header */}
            <div className="flex items-center justify-between px-6 pt-5 pb-3.5 border-b border-gray-100">
              <div>
                <h2 className="text-[17px] font-black text-gray-900 flex items-center gap-2">
                  <FiZap className="w-4 h-4 text-[#ED1C24] flex-shrink-0" />
                  Battery Service Request
                </h2>
                <p className="text-[9px] font-black uppercase tracking-[0.2em] text-gray-400 mt-0.5">
                  Fill in your details &amp; battery information
                </p>
              </div>
              <button
                onClick={onClose}
                className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center text-gray-400 hover:text-gray-800 hover:border-gray-400 transition-all ml-3 flex-shrink-0"
              >
                <FiX className="w-4 h-4" />
              </button>
            </div>

            {/* form body */}
            <form onSubmit={handleSubmit} className="px-6 py-4 flex flex-col gap-3">

              {/* Row 1 */}
              <div className="grid grid-cols-2 gap-4">
                <FL label="Full Name" required>
                  <input className={inp} placeholder="Enter your name" value={form.name} onChange={set('name')} />
                </FL>
                <FL label="Work Email" required>
                  <input className={inp} type="email" placeholder="Email address" value={form.email} onChange={set('email')} />
                </FL>
              </div>

              {/* Row 2 */}
              <div className="grid grid-cols-2 gap-4">
                <FL label="Phone Number" required>
                  <div className="flex gap-1.5">
                    <select
                      className="w-16 border border-gray-200 rounded-lg text-xs bg-gray-50 font-black px-1 focus:outline-none"
                      value={form.phoneCountry}
                      onChange={set("phoneCountry")}
                    >
                      <option value="+91">🇮🇳 +91</option>
                      <option value="+1">🇺🇸 +1</option>
                      <option value="+44">🇬🇧 +44</option>
                      <option value="+971">🇦🇪 +971</option>
                      <option value="+61">🇦🇺 +61</option>
                    </select>
                    <input
                      className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:border-[#0b1d3d] focus:ring-1 focus:ring-[#0b1d3d] transition-all bg-white"
                      placeholder="Enter number"
                      value={form.phone} onChange={set('phone')}
                    />
                  </div>
                </FL>
                <FL label="Area Pincode">
                  <input className={inp} placeholder="Zip code" value={form.pincode} onChange={set('pincode')} />
                </FL>
              </div>

              {/* Row 3 */}
              <div className="grid grid-cols-2 gap-4">
                <FL label="State">
                  <input className={inp} placeholder="Select State" value={form.state} onChange={set('state')} />
                </FL>
                <FL label="District / City">
                  <input className={inp} placeholder="Select District" value={form.city} onChange={set('city')} />
                </FL>
              </div>

              {/* Row 4 */}
              <div className="grid grid-cols-2 gap-4">
                <FL label="Battery Type" required>
                  <div className="relative">
                    <select className={sel} value={form.batteryType} onChange={set('batteryType')}>
                      <option value="">Select Battery Type</option>
                      {BATTERY_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                    </select>
                    <FiChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400 pointer-events-none" />
                  </div>
                </FL>
                <FL label="Service Required" required>
                  <div className="relative">
                    <select className={sel} value={form.serviceType} onChange={set('serviceType')}>
                      <option value="">Select Service Type</option>
                      {SERVICE_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                    </select>
                    <FiChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400 pointer-events-none" />
                  </div>
                </FL>
              </div>

              {/* Row 5 */}
              <div className="grid grid-cols-2 gap-4">
                <FL label="Battery Brand / Model">
                  <input className={inp} placeholder="e.g. Exide FT0-150" value={form.batteryBrand} onChange={set('batteryBrand')} />
                </FL>
                <FL label="Preferred Service Date">
                  <input className={inp} type="date" value={form.preferredDate} onChange={set('preferredDate')}
                    min={new Date().toISOString().split('T')[0]} />
                </FL>
              </div>

              {/* Row 6 – full width */}
              <FL label="Problem Description — what's wrong with the battery?" required>
                <textarea
                  className={`${inp} resize-none`} rows={2}
                  placeholder="e.g. not holding charge, leaking, won't start, swollen cells..."
                  value={form.problemDescription} onChange={set('problemDescription')}
                />
              </FL>

              {/* Submit */}
              <button
                type="submit"
                disabled={submitting}
                className="w-full py-3 rounded-lg bg-[#0b1d3d] hover:bg-[#162542] text-white font-black text-[11px] uppercase tracking-[0.25em] transition-all duration-300 disabled:opacity-60 flex items-center justify-center gap-2 mt-1"
              >
                {submitting
                  ? <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Submitting...</>
                  : 'Submit Battery Service Request'
                }
              </button>

            </form>
          </div>
          {/* end right panel */}

        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

/* ─── Homepage Section ──────────────────────── */
const BatteryServiceSection = () => {
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <>
      {modalOpen && <BatteryModal onClose={() => setModalOpen(false)} />}

      <section
        className="relative py-16 overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #051124 0%, #0b1d3d 60%, #051124 100%)' }}
      >
        {/* BG blobs */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[1px] bg-gradient-to-r from-transparent via-[#ED1C24]/30 to-transparent" />
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[700px] h-[1px] bg-gradient-to-r from-transparent via-white/5 to-transparent" />
          <div className="absolute -left-32 top-1/2 -translate-y-1/2 w-80 h-80 bg-[#ED1C24] rounded-full blur-[140px] opacity-5" />
          <div className="absolute -right-32 top-1/2 -translate-y-1/2 w-80 h-80 bg-blue-600 rounded-full blur-[140px] opacity-5" />
        </div>

        <div className="relative z-10 max-w-screen-2xl mx-auto px-4 lg:px-12">

          {/* Badge */}
          <motion.div initial={{ opacity: 0, y: -10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="flex justify-center mb-4">
            <span className="inline-flex items-center gap-2 bg-[#ED1C24]/10 border border-[#ED1C24]/20 text-[#ED1C24] text-[10px] font-black uppercase tracking-[0.25em] px-4 py-1.5 rounded-full">
              <FiBattery className="w-3.5 h-3.5" /> New Service
            </span>
          </motion.div>

          {/* Heading */}
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="text-center mb-12">
            <h2 className="text-xl md:text-5xl font-black text-white leading-tight mb-4">
              Professional{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#ED1C24] to-orange-400">Battery Repair</span>
              {' '}& Service
            </h2>
            <p className="text-gray-400 text-base font-medium  md:text-lg max-w-2xl mx-auto leading-relaxed">
              Is your battery not holding charge, leaking, or failing to start? Our certified technicians specialise in repairing and reconditioning all types of batteries — getting your power back faster than you think.
            </p>
          </motion.div>

          {/* Feature cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-12">
            {FEATURES.map((f, i) => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="group relative p-6 rounded-2xl border border-white/5 hover:border-white/20 transition-all duration-300 overflow-hidden cursor-default"
                style={{ background: 'rgba(255,255,255,0.03)' }}
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${f.color} opacity-0 group-hover:opacity-5 transition-opacity duration-500`} />
                <div className={`w-12 h-12 mb-4 rounded-xl bg-gradient-to-br ${f.color} flex items-center justify-center text-white shadow-lg group-hover:-translate-y-1 transition-transform duration-300`}>
                  <f.icon className="w-6 h-6" />
                </div>
                <h3 className="text-sm font-black text-white mb-1">{f.title}</h3>
                <p className="text-xs text-gray-500 leading-relaxed">{f.desc}</p>
              </motion.div>
            ))}
          </div>

          {/* CTA */}
          <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: 0.4 }} className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              id="battery-service-cta"
              onClick={() => setModalOpen(true)}
              className="group inline-flex items-center gap-3 px-8 py-4 rounded-xl bg-slate-900 border border-white/10 shadow-lg shadow-white/10 text-white font-black text-sm uppercase tracking-widest  transition-all duration-300 hover:-translate-y-0.5"
            >
              <FiBattery className="w-5 h-5 group-hover:rotate-12 transition-transform duration-300" />
              Customize Battery Product
            </button>
            <a
              href="tel:+919717372217"
              className="inline-flex items-center gap-2 px-6 py-4 rounded-xl border border-white/10 text-white text-sm font-bold hover:border-[#ED1C24]/50 hover:bg-white/5 transition-all duration-300"
            >
              <FiPhone className="w-4 h-4" />
              Call: +91 9717372217
            </a>
          </motion.div>

          

        </div>
      </section>
    </>
  );
};

export default BatteryServiceSection;
