'use client';

import { useState } from 'react';
import toast from 'react-hot-toast';

const APPOINTMENT_TYPES = [
  { value: 'eye-exam', label: 'Examen de vue', duration: '45 min' },
  { value: 'frame-fitting', label: 'Essayage de montures', duration: '30 min' },
  { value: 'lens-consultation', label: 'Consultation verres', duration: '30 min' },
  { value: 'repair', label: 'Réparation / Ajustement', duration: '15 min' },
];

const TIME_SLOTS = [
  '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
  '14:00', '14:30', '15:00', '15:30', '16:00', '16:30', '17:00', '17:30', '18:00',
];

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', subject: '', message: '' });
  const [appt, setAppt] = useState({ type: '', date: '', time: '', firstName: '', lastName: '', email: '', phone: '', notes: '' });
  const [sending, setSending] = useState(false);
  const [bookingAppt, setBookingAppt] = useState(false);

  const handleContact = async (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);
    await new Promise(r => setTimeout(r, 1000));
    toast.success('Message envoyé ! Nous vous répondrons sous 24h.');
    setForm({ name: '', email: '', phone: '', subject: '', message: '' });
    setSending(false);
  };

  const handleAppointment = async (e: React.FormEvent) => {
    e.preventDefault();
    setBookingAppt(true);
    await new Promise(r => setTimeout(r, 1000));
    toast.success('Rendez-vous confirmé ! Vous recevrez un email de confirmation.');
    setAppt({ type: '', date: '', time: '', firstName: '', lastName: '', email: '', phone: '', notes: '' });
    setBookingAppt(false);
  };

  return (
    <div className="pt-20 min-h-screen">
      {/* Hero */}
      <div className="bg-black text-white py-16">
        <div className="container-default text-center">
          <span className="text-xs font-semibold tracking-widest uppercase text-gold-400 mb-3 block">Contact</span>
          <h1 className="font-display font-black text-4xl md:text-5xl">Nous Contacter</h1>
          <p className="text-gray-400 mt-4 max-w-lg mx-auto">
            Notre équipe est disponible du lundi au samedi pour répondre à toutes vos questions.
          </p>
        </div>
      </div>

      <div className="container-default py-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">

          {/* Info */}
          <div className="space-y-8">
            <div>
              <h2 className="font-display font-bold text-xl mb-5">Informations</h2>
              <div className="space-y-4">
                {[
                  { icon: '📍', title: 'Adresse', lines: ['123 Bd Mohammed V', '20000 Casablanca, Maroc'] },
                  { icon: '📞', title: 'Téléphone', lines: ['+212 5 22 48 97 00'] },
                  { icon: '✉️', title: 'Email', lines: ['contact@clicoptique.ma'] },
                  { icon: '🕒', title: 'Horaires', lines: ['Lun-Ven: 9h00 – 19h00', 'Sam: 10h00 – 18h00', 'Dim: Fermé'] },
                ].map((item) => (
                  <div key={item.title} className="flex gap-4">
                    <span className="text-xl mt-0.5">{item.icon}</span>
                    <div>
                      <p className="font-semibold text-sm mb-1">{item.title}</p>
                      {item.lines.map(l => <p key={l} className="text-sm text-gray-500">{l}</p>)}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-cream p-6">
              <h3 className="font-display font-semibold mb-3">Accès</h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                Tram: Ligne T1 — Arrêt Mohammed V<br />
                Bus: Lignes 2, 5, 7, 15<br />
                Parking: Parking Marché Central
              </p>
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-8">

            {/* Message Form */}
            <div>
              <h2 className="font-display font-bold text-xl mb-5">Envoyer un Message</h2>
              <form onSubmit={handleContact} className="space-y-4">
                {[
                  { name: 'name', label: 'Nom complet', type: 'text', placeholder: 'Yassine Moussaoui' },
                  { name: 'email', label: 'Email', type: 'email', placeholder: 'yassine@exemple.ma' },
                  { name: 'phone', label: 'Téléphone', type: 'tel', placeholder: '+212 6 00 00 00 00' },
                  { name: 'subject', label: 'Sujet', type: 'text', placeholder: 'Question sur une monture' },
                ].map((field) => (
                  <div key={field.name}>
                    <label className="label-field">{field.label}</label>
                    <input
                      type={field.type}
                      value={form[field.name as keyof typeof form]}
                      onChange={(e) => setForm({ ...form, [field.name]: e.target.value })}
                      placeholder={field.placeholder}
                      required={field.name !== 'phone'}
                      className="input-field"
                    />
                  </div>
                ))}
                <div>
                  <label className="label-field">Message</label>
                  <textarea
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    required
                    rows={4}
                    placeholder="Votre message..."
                    className="input-field resize-none"
                  />
                </div>
                <button type="submit" disabled={sending} className="btn-primary w-full">
                  {sending ? 'Envoi en cours...' : 'Envoyer le Message'}
                </button>
              </form>
            </div>

            {/* Appointment Form */}
            <div id="appointment">
              <h2 className="font-display font-bold text-xl mb-5">Prendre Rendez-vous</h2>
              <form onSubmit={handleAppointment} className="space-y-4">
                <div>
                  <label className="label-field">Type de rendez-vous</label>
                  <select
                    value={appt.type}
                    onChange={(e) => setAppt({ ...appt, type: e.target.value })}
                    required
                    className="input-field"
                  >
                    <option value="">Choisir...</option>
                    {APPOINTMENT_TYPES.map((t) => (
                      <option key={t.value} value={t.value}>
                        {t.label} ({t.duration})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  {[
                    { name: 'firstName', label: 'Prénom', type: 'text', placeholder: 'Yassine' },
                    { name: 'lastName', label: 'Nom', type: 'text', placeholder: 'Moussaoui' },
                  ].map((f) => (
                    <div key={f.name}>
                      <label className="label-field">{f.label}</label>
                      <input
                        type={f.type}
                        value={appt[f.name as keyof typeof appt]}
                        onChange={(e) => setAppt({ ...appt, [f.name]: e.target.value })}
                        placeholder={f.placeholder}
                        required
                        className="input-field"
                      />
                    </div>
                  ))}
                </div>

                <div>
                  <label className="label-field">Email</label>
                  <input
                    type="email"
                    value={appt.email}
                    onChange={(e) => setAppt({ ...appt, email: e.target.value })}
                    placeholder="yassine@exemple.ma"
                    required
                    className="input-field"
                  />
                </div>

                <div>
                  <label className="label-field">Date</label>
                  <input
                    type="date"
                    value={appt.date}
                    onChange={(e) => setAppt({ ...appt, date: e.target.value })}
                    min={new Date().toISOString().split('T')[0]}
                    required
                    className="input-field"
                  />
                </div>

                <div>
                  <label className="label-field">Heure</label>
                  <div className="grid grid-cols-4 gap-1.5">
                    {TIME_SLOTS.slice(0, 8).map((slot) => (
                      <button
                        key={slot}
                        type="button"
                        onClick={() => setAppt({ ...appt, time: slot })}
                        className={`py-1.5 text-xs font-medium border transition-colors ${
                          appt.time === slot
                            ? 'bg-black text-white border-black'
                            : 'border-gray-200 hover:border-black'
                        }`}
                      >
                        {slot}
                      </button>
                    ))}
                  </div>
                </div>

                <button type="submit" disabled={bookingAppt} className="btn-gold w-full">
                  {bookingAppt ? 'Réservation...' : 'Confirmer le Rendez-vous'}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
