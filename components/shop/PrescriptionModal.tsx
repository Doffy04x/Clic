'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { LensOption, Prescription, EyePrescription } from '@/lib/types';
import { formatPrice } from '@/lib/utils';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (lens: LensOption, prescription: Prescription) => void;
  lensOptions: LensOption[];
  productName: string;
  needsPrescription: boolean; // false for sunglasses
}

// ── Prescription value ranges ──────────────────────────────────────────────

const SPH_VALUES: string[] = [];
for (let v = -20; v <= 12; v += 0.25) {
  SPH_VALUES.push((v >= 0 ? '+' : '') + v.toFixed(2));
}

const CYL_VALUES: string[] = [];
for (let v = 0; v >= -6; v -= 0.25) {
  CYL_VALUES.push(v.toFixed(2));
}

const AXIS_VALUES: string[] = Array.from({ length: 180 }, (_, i) => String(i + 1));

const emptyEye = (): EyePrescription => ({ sph: '0.00', cyl: '0.00', axis: '' });

// ── Sub-component: eye fields ──────────────────────────────────────────────

function EyeFields({
  label, value, onChange,
}: {
  label: string;
  value: EyePrescription;
  onChange: (v: EyePrescription) => void;
}) {
  const needsAxis = value.cyl !== '0.00';
  return (
    <div>
      <p className="font-semibold text-sm mb-3">{label}</p>
      <div className="grid grid-cols-3 gap-3">
        <div>
          <label className="text-xs text-gray-500 mb-1 block">SPH</label>
          <select
            value={value.sph}
            onChange={e => onChange({ ...value, sph: e.target.value })}
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-black"
          >
            {SPH_VALUES.map(v => <option key={v} value={v}>{v}</option>)}
          </select>
        </div>
        <div>
          <label className="text-xs text-gray-500 mb-1 block">CYL</label>
          <select
            value={value.cyl}
            onChange={e => onChange({ ...value, cyl: e.target.value, axis: e.target.value === '0.00' ? '' : value.axis })}
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-black"
          >
            {CYL_VALUES.map(v => <option key={v} value={v}>{v}</option>)}
          </select>
        </div>
        <div>
          <label className="text-xs text-gray-500 mb-1 block">AXIS</label>
          <select
            value={value.axis}
            onChange={e => onChange({ ...value, axis: e.target.value })}
            disabled={!needsAxis}
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-black disabled:bg-gray-50 disabled:text-gray-300"
          >
            <option value="">—</option>
            {AXIS_VALUES.map(v => <option key={v} value={v}>{v}</option>)}
          </select>
        </div>
      </div>
    </div>
  );
}

// ── Main Modal ─────────────────────────────────────────────────────────────

export default function PrescriptionModal({
  isOpen, onClose, onConfirm, lensOptions, productName, needsPrescription,
}: Props) {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [selectedLens, setSelectedLens] = useState<LensOption | null>(lensOptions[0] ?? null);
  const [method, setMethod] = useState<'manual' | 'upload' | 'email-later' | null>(null);
  const [OD, setOD] = useState<EyePrescription>(emptyEye());
  const [OS, setOS] = useState<EyePrescription>(emptyEye());
  const [uploading, setUploading] = useState(false);
  const [uploadedUrl, setUploadedUrl] = useState<string>('');

  const reset = () => {
    setStep(1);
    setSelectedLens(lensOptions[0] ?? null);
    setMethod(null);
    setOD(emptyEye());
    setOS(emptyEye());
    setUploadedUrl('');
  };

  const handleClose = () => { reset(); onClose(); };

  const handleConfirm = () => {
    if (!selectedLens) return;
    const prescription: Prescription = {
      method: method ?? 'email-later',
      OD: method === 'manual' ? OD : undefined,
      OS: method === 'manual' ? OS : undefined,
      fileUrl: uploadedUrl || undefined,
    };
    onConfirm(selectedLens, prescription);
    reset();
  };

  const handleFileUpload = async (file: File) => {
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append('file', file);
      const res = await fetch('/api/upload', { method: 'POST', body: fd });
      const data = await res.json();
      if (data.success) setUploadedUrl(data.url);
    } catch { /* ignore */ }
    finally { setUploading(false); }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 z-50 flex items-end sm:items-center justify-center p-4"
          onClick={e => { if (e.target === e.currentTarget) handleClose(); }}
        >
          <motion.div
            initial={{ y: 60, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 60, opacity: 0 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="bg-white w-full max-w-md rounded-2xl overflow-hidden shadow-2xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <div className="flex items-center gap-3">
                {step > 1 && (
                  <button onClick={() => setStep(s => (s - 1) as 1 | 2 | 3)} className="text-gray-400 hover:text-black transition-colors">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>
                )}
                <div className="flex gap-1.5">
                  {[1, 2, 3].map(s => (
                    <div key={s} className={`h-1 rounded-full transition-all ${s === step ? 'w-6 bg-black' : s < step ? 'w-3 bg-gray-400' : 'w-3 bg-gray-200'}`} />
                  ))}
                </div>
              </div>
              <button onClick={handleClose} className="text-gray-400 hover:text-black transition-colors">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="px-6 py-6 max-h-[80vh] overflow-y-auto">

              {/* ── STEP 1: Choose lens type ────────────────────────── */}
              {step === 1 && (
                <div>
                  <h2 className="font-bold text-xl mb-1">Choisissez vos verres</h2>
                  <p className="text-gray-500 text-sm mb-5">{productName}</p>
                  <div className="space-y-2">
                    {lensOptions.map(lens => {
                      const active = selectedLens?.id === lens.id;
                      return (
                        <button
                          key={lens.id}
                          onClick={() => setSelectedLens(lens)}
                          className={`w-full text-left p-4 rounded-xl border-2 transition-all ${active ? 'border-black bg-gray-50' : 'border-gray-100 hover:border-gray-300'}`}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${active ? 'border-black' : 'border-gray-300'}`}>
                                {active && <div className="w-2 h-2 bg-black rounded-full" />}
                              </div>
                              <div>
                                <p className="font-semibold text-sm">{lens.name}</p>
                                <p className="text-xs text-gray-500">{lens.description}</p>
                              </div>
                            </div>
                            <span className="text-sm font-bold ml-3 shrink-0">
                              {lens.price === 0 ? 'Inclus' : `+${formatPrice(lens.price)}`}
                            </span>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                  <button
                    onClick={() => setStep(needsPrescription ? 2 : 3)}
                    disabled={!selectedLens}
                    className="btn-primary w-full mt-6 py-3"
                  >
                    Continuer →
                  </button>
                </div>
              )}

              {/* ── STEP 2: Prescription method ─────────────────────── */}
              {step === 2 && (
                <div>
                  <h2 className="font-bold text-xl mb-1">Ajoutez votre ordonnance</h2>
                  <p className="text-gray-500 text-sm mb-5">Vous en aurez besoin pour la fabrication de vos verres.</p>
                  <div className="space-y-3">
                    {[
                      { id: 'manual' as const, icon: '✏️', title: 'Saisir manuellement', desc: 'Entrez SPH, CYL et AXIS de votre ordonnance' },
                      { id: 'upload' as const, icon: '📄', title: 'Télécharger un fichier', desc: 'Photo ou scan de votre ordonnance' },
                      { id: 'email-later' as const, icon: '✉️', title: 'Envoyer par e-mail plus tard', desc: 'Nous vous contacterons après la commande' },
                    ].map(opt => (
                      <button
                        key={opt.id}
                        onClick={() => { setMethod(opt.id); setStep(3); }}
                        className="w-full flex items-center gap-4 p-4 rounded-xl border border-gray-200 hover:border-black hover:bg-gray-50 transition-all text-left"
                      >
                        <span className="text-2xl">{opt.icon}</span>
                        <div>
                          <p className="font-semibold text-sm">{opt.title}</p>
                          <p className="text-xs text-gray-500">{opt.desc}</p>
                        </div>
                        <svg className="w-4 h-4 text-gray-400 ml-auto shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* ── STEP 3: Collect prescription ────────────────────── */}
              {step === 3 && (
                <div>
                  {method === 'manual' && (
                    <>
                      <h2 className="font-bold text-xl mb-1">Saisir l&apos;ordonnance</h2>
                      <p className="text-gray-500 text-sm mb-5">Référez-vous à votre ordonnance optique.</p>
                      <div className="space-y-5">
                        <EyeFields label="OD — Œil droit" value={OD} onChange={setOD} />
                        <div className="border-t border-gray-100" />
                        <EyeFields label="OS — Œil gauche" value={OS} onChange={setOS} />
                      </div>
                      <div className="mt-5">
                        <p className="text-xs text-gray-500 mb-2">Joindre votre ordonnance (optionnel)</p>
                        <label className="flex items-center gap-3 p-3 border border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-black transition-colors text-sm text-gray-500">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M18.375 12.739l-7.693 7.693a4.5 4.5 0 01-6.364-6.364l10.94-10.94A3 3 0 1119.5 7.372L8.552 18.32m.009-.01-.01.01m5.699-9.941-7.81 7.81a1.5 1.5 0 002.112 2.13" />
                          </svg>
                          {uploadedUrl ? '✅ Fichier uploadé' : uploading ? 'Upload en cours...' : 'Choisir un fichier'}
                          <input type="file" accept="image/*,.pdf" className="hidden" onChange={e => { const f = e.target.files?.[0]; if (f) handleFileUpload(f); }} />
                        </label>
                      </div>
                    </>
                  )}

                  {method === 'upload' && (
                    <>
                      <h2 className="font-bold text-xl mb-1">Télécharger votre ordonnance</h2>
                      <p className="text-gray-500 text-sm mb-5">Photo nette ou scan PDF de votre ordonnance.</p>
                      <label className={`flex flex-col items-center gap-3 p-8 border-2 border-dashed rounded-xl cursor-pointer transition-colors ${uploadedUrl ? 'border-green-400 bg-green-50' : 'border-gray-300 hover:border-black'}`}>
                        {uploadedUrl ? (
                          <>
                            <img src={uploadedUrl} alt="Ordonnance" className="w-32 h-24 object-cover rounded" />
                            <p className="text-sm text-green-600 font-medium">✅ Ordonnance uploadée</p>
                          </>
                        ) : uploading ? (
                          <div className="w-8 h-8 border-2 border-black border-t-transparent rounded-full animate-spin" />
                        ) : (
                          <>
                            <svg className="w-10 h-10 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 16.5V9.75m0 0 3 3m-3-3-3 3M6.75 19.5a4.5 4.5 0 0 1-1.41-8.775 5.25 5.25 0 0 1 10.338-2.32 5.75 5.75 0 0 1 6.332 7.095" />
                            </svg>
                            <p className="text-sm text-gray-500">Cliquez pour choisir un fichier</p>
                            <p className="text-xs text-gray-400">JPG, PNG ou PDF</p>
                          </>
                        )}
                        <input type="file" accept="image/*,.pdf" className="hidden" onChange={e => { const f = e.target.files?.[0]; if (f) handleFileUpload(f); }} />
                      </label>
                    </>
                  )}

                  {method === 'email-later' && (
                    <>
                      <h2 className="font-bold text-xl mb-1">Envoyer plus tard</h2>
                      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mt-4">
                        <p className="text-sm text-amber-800 font-medium mb-1">📧 Comment ça marche ?</p>
                        <p className="text-sm text-amber-700">Après votre commande, vous recevrez un e-mail avec les instructions pour nous envoyer votre ordonnance. Votre commande sera traitée dès réception.</p>
                      </div>
                    </>
                  )}

                  {(!needsPrescription || !method) && method === null && (
                    <div className="text-center py-4 text-gray-500 text-sm">Aucune ordonnance requise pour ce produit.</div>
                  )}

                  <button
                    onClick={handleConfirm}
                    disabled={method === 'upload' && !uploadedUrl && !uploading}
                    className="btn-primary w-full mt-6 py-3 disabled:opacity-50"
                  >
                    Ajouter au panier
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
