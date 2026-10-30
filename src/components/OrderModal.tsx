import React, { useState } from 'react';
import { X, CheckCircle, Package, Truck, ShieldCheck, CreditCard, Sparkles } from 'lucide-react';
import { Colorway } from '../utils/productMath.ts';

interface OrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedColorway: Colorway;
  customEngraving: string;
}

export const OrderModal: React.FC<OrderModalProps> = ({
  isOpen,
  onClose,
  selectedColorway,
  customEngraving,
}) => {
  const [cableOption, setCableOption] = useState<'balanced' | 'braided' | 'wireless'>('balanced');
  const [cushionType, setCushionType] = useState<'lambskin' | 'mesh'>('lambskin');
  const [isOrdered, setIsOrdered] = useState(false);
  const [orderNumber, setOrderNumber] = useState('');

  // Shipping form state
  const [customerName, setCustomerName] = useState('Alex Mercer');
  const [email, setEmail] = useState('alex.mercer@spatial-audio.io');
  const [address, setAddress] = useState('440 Grand Ave, Suite 300, San Francisco, CA');

  if (!isOpen) return null;

  const handleCompleteOrder = (e: React.FormEvent) => {
    e.preventDefault();
    const fakeOrderNum = 'AF-' + Math.floor(100000 + Math.random() * 900000);
    setOrderNumber(fakeOrderNum);
    setIsOrdered(true);
  };

  const handleReset = () => {
    setIsOrdered(false);
    onClose();
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80"
    >
      <div className="relative w-full max-w-2xl bg-[#0f1118] border border-zinc-800 rounded-3xl p-6 sm:p-8 shadow-2xl text-white max-h-[90vh] overflow-y-auto">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          aria-label="Close configuration modal"
          className="absolute top-5 right-5 p-2 rounded-full bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {!isOrdered ? (
          <div>
            <div className="flex items-center gap-2 text-sky-400 text-xs font-bold uppercase tracking-wider mb-2">
              <Sparkles className="w-4 h-4" />
              <span>Founder Edition Reservation</span>
            </div>

            <h2 id="modal-title" className="text-2xl sm:text-3xl font-black tracking-tight">
              AURA FLOW 01 Configuration
            </h2>

            {/* Spec summary badge */}
            <div className="mt-4 p-4 rounded-2xl bg-[#141722] border border-zinc-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div
                  className="w-10 h-10 rounded-full border border-white/20 shadow-inner flex items-center justify-center shrink-0"
                  style={{ backgroundColor: selectedColorway.bodyColor }}
                >
                  <div
                    className="w-4 h-4 rounded-full border border-white/30"
                    style={{ backgroundColor: selectedColorway.metalColor }}
                  />
                </div>
                <div>
                  <div className="font-bold text-white text-sm">{selectedColorway.name}</div>
                  <div className="text-xs text-zinc-400">{selectedColorway.accentName}</div>
                </div>
              </div>

              <div className="sm:text-right">
                <div className="text-[11px] mono-spec text-zinc-400 uppercase">Custom Engraving</div>
                <div className="text-xs font-semibold text-sky-300 mono-spec">
                  "{customEngraving || 'AURA FLOW // SPATIAL-01'}"
                </div>
              </div>
            </div>

            <form onSubmit={handleCompleteOrder} className="mt-6 space-y-5">
              {/* Cable selection */}
              <div>
                <label className="block text-xs font-bold text-zinc-300 uppercase tracking-wider mb-2">
                  Select Acoustic Cable / Interface
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  <button
                    type="button"
                    onClick={() => setCableOption('balanced')}
                    className={`p-3 rounded-xl border text-left transition-all ${
                      cableOption === 'balanced'
                        ? 'border-sky-400 bg-sky-500/10 text-white'
                        : 'border-zinc-800 bg-zinc-900/60 text-zinc-400 hover:bg-zinc-800/80'
                    }`}
                  >
                    <div className="text-xs font-bold">4.4mm Pentaconn</div>
                    <div className="text-[10px] text-zinc-400">Oxygen-Free Silver</div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setCableOption('braided')}
                    className={`p-3 rounded-xl border text-left transition-all ${
                      cableOption === 'braided'
                        ? 'border-sky-400 bg-sky-500/10 text-white'
                        : 'border-zinc-800 bg-zinc-900/60 text-zinc-400 hover:bg-zinc-800/80'
                    }`}
                  >
                    <div className="text-xs font-bold">3.5mm Audiophile</div>
                    <div className="text-[10px] text-zinc-400">Gold-Plated Mini-Jack</div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setCableOption('wireless')}
                    className={`p-3 rounded-xl border text-left transition-all ${
                      cableOption === 'wireless'
                        ? 'border-sky-400 bg-sky-500/10 text-white'
                        : 'border-zinc-800 bg-zinc-900/60 text-zinc-400 hover:bg-zinc-800/80'
                    }`}
                  >
                    <div className="text-xs font-bold">Ultra-Low-Latency Dongle</div>
                    <div className="text-[10px] text-zinc-400">2.4GHz Lossless USB-C</div>
                  </button>
                </div>
              </div>

              {/* Cushion selection */}
              <div>
                <label className="block text-xs font-bold text-zinc-300 uppercase tracking-wider mb-2">
                  Ear Cushion Architecture
                </label>
                <div className="grid grid-cols-2 gap-2.5">
                  <button
                    type="button"
                    onClick={() => setCushionType('lambskin')}
                    className={`p-3 rounded-xl border text-left transition-all ${
                      cushionType === 'lambskin'
                        ? 'border-sky-400 bg-sky-500/10 text-white'
                        : 'border-zinc-800 bg-zinc-900/60 text-zinc-400 hover:bg-zinc-800/80'
                    }`}
                  >
                    <div className="text-xs font-bold">Perforated Italian Leather</div>
                    <div className="text-[10px] text-zinc-400">Maximum acoustic isolation</div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setCushionType('mesh')}
                    className={`p-3 rounded-xl border text-left transition-all ${
                      cushionType === 'mesh'
                        ? 'border-sky-400 bg-sky-500/10 text-white'
                        : 'border-zinc-800 bg-zinc-900/60 text-zinc-400 hover:bg-zinc-800/80'
                    }`}
                  >
                    <div className="text-xs font-bold">Magnetic Air-Weave Mesh</div>
                    <div className="text-[10px] text-zinc-400">Maximum breathability</div>
                  </button>
                </div>
              </div>

              {/* Delivery Details */}
              <div className="space-y-3 pt-2">
                <label className="block text-xs font-bold text-zinc-300 uppercase tracking-wider">
                  Delivery Details
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10px] mono-spec text-zinc-400 mb-1">Full Name</label>
                    <input
                      type="text"
                      required
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-sky-400"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] mono-spec text-zinc-400 mb-1">Email Address</label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-sky-400"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-[10px] mono-spec text-zinc-400 mb-1">Shipping Address</label>
                  <input
                    type="text"
                    required
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-sky-400"
                  />
                </div>
              </div>

              {/* Guarantee badges */}
              <div className="flex flex-wrap items-center gap-4 py-2 text-xs text-zinc-400 mono-spec">
                <span className="flex items-center gap-1.5">
                  <Truck className="w-3.5 h-3.5 text-sky-400" /> Free Global Express
                </span>
                <span className="flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> 3-Year Titanium Warranty
                </span>
                <span className="flex items-center gap-1.5">
                  <CreditCard className="w-3.5 h-3.5 text-indigo-400" /> 30-Day Audition Trial
                </span>
              </div>

              {/* Price & Submit */}
              <div className="pt-4 border-t border-zinc-800 flex items-center justify-between">
                <div>
                  <div className="text-[11px] mono-spec uppercase text-zinc-400">Total Due Today</div>
                  <div className="text-2xl font-black text-white">$699.00 <span className="text-xs text-emerald-400 font-medium">Free Shipping</span></div>
                </div>

                <button
                  type="submit"
                  className="px-6 py-3 rounded-xl bg-sky-500 hover:bg-sky-400 text-zinc-950 font-bold text-sm tracking-tight flex items-center gap-2 shadow-xl shadow-sky-500/25 transition-all hover:scale-105 active:scale-95"
                >
                  <Package className="w-4 h-4" />
                  <span>Confirm Reservation</span>
                </button>
              </div>
            </form>
          </div>
        ) : (
          /* Confirmation State */
          <div className="py-8 text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center mx-auto">
              <CheckCircle className="w-8 h-8" />
            </div>

            <h3 className="text-2xl font-black text-white">Reservation Confirmed!</h3>
            
            <p className="text-sm text-zinc-300 max-w-md mx-auto">
              Thank you, <span className="text-white font-bold">{customerName}</span>. Your bespoke{' '}
              <span className="text-sky-300 font-bold">{selectedColorway.name}</span> AURA FLOW 01 has been scheduled for precision Swiss milling.
            </p>

            <div className="p-4 rounded-xl bg-zinc-900/90 border border-zinc-800 max-w-sm mx-auto text-left space-y-1.5 text-xs mono-spec">
              <div className="flex justify-between">
                <span className="text-zinc-400">Order Reference:</span>
                <span className="text-white font-bold">{orderNumber}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-400">Finish:</span>
                <span className="text-sky-300">{selectedColorway.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-400">Laser Badge:</span>
                <span className="text-zinc-200">{customEngraving || 'AURA FLOW // SPATIAL-01'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-400">Tracking sent to:</span>
                <span className="text-zinc-200">{email}</span>
              </div>
            </div>

            <div className="pt-4">
              <button
                onClick={handleReset}
                className="px-6 py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-white font-bold text-xs transition-colors"
              >
                Back to Interactive Experience
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
