'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    firstName: '', lastName: '', email: '', password: '', confirm: '', newsletter: true,
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (form.password !== form.confirm) {
      toast.error('Les mots de passe ne correspondent pas');
      return;
    }
    if (form.password.length < 8) {
      toast.error('Le mot de passe doit contenir au moins 8 caractères');
      return;
    }
    setLoading(true);
    // In production: call POST /api/auth/register
    await new Promise(r => setTimeout(r, 1000));
    setLoading(false);
    toast.success('Compte créé ! Vérifiez votre email pour confirmer.');
    router.push('/auth/login');
  };

  return (
    <div className="pt-20 min-h-screen flex items-center justify-center bg-gray-50">
      <div className="w-full max-w-md px-6 py-12">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 mb-6">
            <div className="w-10 h-10 bg-black flex items-center justify-center">
              <span className="text-gold-500 font-display font-black">CO</span>
            </div>
            <span className="font-display font-bold text-xl">Clic Optique</span>
          </Link>
          <h1 className="font-display font-bold text-2xl">Créer un compte</h1>
          <p className="text-gray-500 text-sm mt-1">Rejoignez Clic Optique gratuitement</p>
        </div>

        <div className="bg-white border border-gray-200 p-8">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              {[
                { name: 'firstName', label: 'Prénom', placeholder: 'Yassine' },
                { name: 'lastName', label: 'Nom', placeholder: 'Moussaoui' },
              ].map(f => (
                <div key={f.name}>
                  <label className="label-field">{f.label}</label>
                  <input
                    type="text"
                    value={form[f.name as keyof typeof form] as string}
                    onChange={(e) => setForm({ ...form, [f.name]: e.target.value })}
                    required
                    placeholder={f.placeholder}
                    className="input-field"
                  />
                </div>
              ))}
            </div>

            <div>
              <label className="label-field">Email</label>
              <input
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                required
                className="input-field"
                placeholder="yassine@exemple.ma"
              />
            </div>

            {[
              { name: 'password', label: 'Mot de passe', placeholder: 'Min. 8 caractères' },
              { name: 'confirm', label: 'Confirmer le mot de passe', placeholder: 'Répéter le mot de passe' },
            ].map(f => (
              <div key={f.name}>
                <label className="label-field">{f.label}</label>
                <input
                  type="password"
                  value={form[f.name as keyof typeof form] as string}
                  onChange={(e) => setForm({ ...form, [f.name]: e.target.value })}
                  required
                  placeholder={f.placeholder}
                  className="input-field"
                />
              </div>
            ))}

            {/* Newsletter opt-in */}
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={form.newsletter}
                onChange={(e) => setForm({ ...form, newsletter: e.target.checked })}
                className="mt-0.5 w-4 h-4 border-gray-300"
              />
              <span className="text-sm text-gray-600">
                Recevez nos actualités, promotions et nouveautés. Profitez d&apos;une{' '}
                <span className="font-semibold text-black">remise de bienvenue de 10%</span>.
              </span>
            </label>

            <button type="submit" disabled={loading} className="btn-primary w-full py-4">
              {loading ? 'Création en cours…' : 'Créer mon compte'}
            </button>

            <p className="text-xs text-center text-gray-400">
              En créant un compte, vous acceptez nos{' '}
              <Link href="/terms" className="underline">CGV</Link> et notre{' '}
              <Link href="/privacy" className="underline">Politique de confidentialité</Link>.
            </p>
          </form>
        </div>

        <p className="text-center text-sm text-gray-500 mt-6">
          Vous avez déjà un compte ?{' '}
          <Link href="/auth/login" className="text-black font-semibold hover:text-gold-600 transition-colors">
            Se connecter
          </Link>
        </p>
      </div>
    </div>
  );
}
