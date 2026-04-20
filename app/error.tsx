'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-screen bg-cream flex items-center justify-center px-4">
      <div className="text-center max-w-lg">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="mb-8 text-5xl">⚠️</div>

          <p className="font-mono text-xs tracking-[0.3em] text-red-500 uppercase mb-2">Une erreur est survenue</p>
          <h1 className="font-display font-black text-4xl sm:text-5xl text-black mb-4">
            Oups, un problème
          </h1>
          <p className="text-gray-500 mb-8">
            Nos lentilles ont besoin d&apos;un petit nettoyage. Une erreur inattendue s&apos;est produite — veuillez réessayer ou retourner à l&apos;accueil.
          </p>

          {error?.message && (
            <div className="mb-6 p-3 bg-red-50 border border-red-100 text-xs text-red-600 font-mono text-left rounded">
              {error.message}
            </div>
          )}

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <button onClick={reset} className="btn-primary px-8 py-3 text-sm">
              Réessayer
            </button>
            <Link href="/" className="btn-outline px-8 py-3 text-sm">
              Retour à l&apos;accueil
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
