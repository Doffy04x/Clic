'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { QUIZ_STEPS, type QuizAnswers } from '@/components/quiz/QuizData'

// ─── Progress Bar ─────────────────────────────────────────────────────────────
function ProgressBar({ current, total }: { current: number; total: number }) {
  const pct = Math.round(((current) / total) * 100)
  return (
    <div className="w-full mb-8">
      <div className="flex justify-between text-xs text-gray-400 mb-2">
        <span>Question {current} sur {total}</span>
        <span>{pct}%</span>
      </div>
      <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
        <motion.div
          className="h-full bg-gold-500 rounded-full"
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
        />
      </div>
    </div>
  )
}

// ─── Option Card ──────────────────────────────────────────────────────────────
function OptionCard({
  option,
  selected,
  onClick,
  multiSelect,
}: {
  option: { value: string; label: string; sublabel?: string; emoji?: string }
  selected: boolean
  onClick: () => void
  multiSelect?: boolean
}) {
  return (
    <motion.button
      onClick={onClick}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={`w-full text-left rounded-2xl border-2 p-5 transition-all duration-200 flex items-center gap-4
        ${selected
          ? 'border-gold-500 bg-gold-50 shadow-md'
          : 'border-gray-100 bg-white hover:border-gold-300 hover:shadow-sm'
        }`}
    >
      {/* Checkbox / Radio indicator */}
      <div className={`flex-shrink-0 w-6 h-6 rounded-${multiSelect ? 'md' : 'full'} border-2 flex items-center justify-center transition-all
        ${selected ? 'bg-gold-500 border-gold-500' : 'border-gray-300'}`}>
        {selected && (
          <motion.svg
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="w-3.5 h-3.5 text-white"
            fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </motion.svg>
        )}
      </div>

      {/* Emoji */}
      {option.emoji && (
        <span className="text-2xl flex-shrink-0">{option.emoji}</span>
      )}

      {/* Text */}
      <div className="flex-1">
        <p className={`font-semibold text-base ${selected ? 'text-dark' : 'text-gray-800'}`}>
          {option.label}
        </p>
        {option.sublabel && (
          <p className="text-sm text-gray-500 mt-0.5">{option.sublabel}</p>
        )}
      </div>
    </motion.button>
  )
}

// ─── Intro Screen ─────────────────────────────────────────────────────────────
function IntroScreen({ onStart }: { onStart: () => void }) {
  return (
    <motion.div
      key="intro"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -30 }}
      className="text-center max-w-lg mx-auto"
    >
      <div className="text-6xl mb-6">👓</div>
      <h1 className="text-3xl md:text-4xl font-bold text-dark mb-4">
        Trouvez vos lunettes<br />
        <span className="text-gold-500">idéales</span> en 2 minutes
      </h1>
      <p className="text-gray-500 text-lg mb-8 leading-relaxed">
        5 questions simples et on vous recommande les montures parfaites
        pour votre visage, votre style et votre budget.
      </p>

      <div className="flex flex-col items-center gap-4">
        <motion.button
          onClick={onStart}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          className="btn-primary px-10 py-4 text-lg rounded-full shadow-lg"
        >
          Commencer le quiz →
        </motion.button>
        <Link href="/products" className="text-sm text-gray-400 hover:text-gray-600 underline">
          Parcourir tous les produits
        </Link>
      </div>

      {/* Stats de confiance */}
      <div className="grid grid-cols-3 gap-4 mt-12 pt-8 border-t border-gray-100">
        {[
          { value: '+500', label: 'montures' },
          { value: '98%', label: 'clients satisfaits' },
          { value: '2 min', label: 'pour trouver' },
        ].map(s => (
          <div key={s.label}>
            <p className="text-2xl font-bold text-gold-500">{s.value}</p>
            <p className="text-xs text-gray-400 mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>
    </motion.div>
  )
}

// ─── Result Screen ────────────────────────────────────────────────────────────
function ResultScreen({ answers }: { answers: QuizAnswers }) {
  const router = useRouter()

  const buildUrl = () => {
    const params = new URLSearchParams()
    if (answers.gender && answers.gender !== 'UNISEX') params.set('gender', answers.gender)
    if (answers.usage === 'sun') params.set('category', 'SUNGLASSES')
    else if (answers.usage === 'vision') params.set('category', 'EYEGLASSES')
    if (answers.budget) {
      const budgetMap: Record<string, [number, number]> = {
        low:    [0, 500],
        mid:    [500, 1000],
        high:   [1000, 2000],
        luxury: [2000, 99999],
      }
      const range = budgetMap[answers.budget]
      if (range) {
        params.set('minPrice', range[0].toString())
        params.set('maxPrice', range[1].toString())
      }
    }
    return `/products?${params.toString()}&quiz=true`
  }

  const faceLabels: Record<string, string> = {
    OVAL: 'ovale', ROUND: 'ronde', SQUARE: 'carrée',
    HEART: 'en cœur', RECTANGLE: 'rectangulaire', DIAMOND: 'en diamant',
  }
  const styleLabels: Record<string, string> = {
    classic: 'Classique', modern: 'Moderne', bold: 'Audacieux',
    sporty: 'Sportif', vintage: 'Vintage',
  }

  return (
    <motion.div
      key="result"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="text-center max-w-lg mx-auto"
    >
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', delay: 0.2 }}
        className="text-5xl mb-4"
      >
        🎉
      </motion.div>
      <h2 className="text-3xl font-bold text-dark mb-3">
        Votre profil est prêt !
      </h2>
      <p className="text-gray-500 mb-6">
        On a trouvé les meilleures montures pour vous
      </p>

      {/* Récap des réponses */}
      <div className="bg-cream rounded-2xl p-5 text-left mb-8 space-y-3">
        {answers.faceShape && (
          <div className="flex items-center gap-3">
            <span className="text-lg">👤</span>
            <span className="text-sm text-gray-600">
              Visage <strong>{faceLabels[answers.faceShape]}</strong>
            </span>
          </div>
        )}
        {answers.gender && (
          <div className="flex items-center gap-3">
            <span className="text-lg">
              {answers.gender === 'MEN' ? '👨' : answers.gender === 'WOMEN' ? '👩' : answers.gender === 'KIDS' ? '👦' : '🤝'}
            </span>
            <span className="text-sm text-gray-600">
              Collection <strong>{
                { MEN: 'Homme', WOMEN: 'Femme', UNISEX: 'Mixte', KIDS: 'Enfant' }[answers.gender]
              }</strong>
            </span>
          </div>
        )}
        {answers.style && answers.style.length > 0 && (
          <div className="flex items-center gap-3">
            <span className="text-lg">🎨</span>
            <span className="text-sm text-gray-600">
              Style <strong>{answers.style.map(s => styleLabels[s] || s).join(', ')}</strong>
            </span>
          </div>
        )}
        {answers.budget && (
          <div className="flex items-center gap-3">
            <span className="text-lg">💰</span>
            <span className="text-sm text-gray-600">
              Budget <strong>{
                { low: '< 500 DH', mid: '500–1 000 DH', high: '1 000–2 000 DH', luxury: '2 000+ DH' }[answers.budget]
              }</strong>
            </span>
          </div>
        )}
      </div>

      <motion.button
        onClick={() => router.push(buildUrl())}
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.97 }}
        className="btn-primary w-full py-4 text-lg rounded-full shadow-lg mb-4"
      >
        Voir mes recommandations →
      </motion.button>
      <p className="text-xs text-gray-400">
        Résultats filtrés selon votre profil — modifiables à tout moment
      </p>
    </motion.div>
  )
}

// ─── Main Quiz Page ───────────────────────────────────────────────────────────
export default function QuizPage() {
  const [phase, setPhase] = useState<'intro' | 'quiz' | 'result'>('intro')
  const [stepIndex, setStepIndex] = useState(0)
  const [answers, setAnswers] = useState<QuizAnswers>({})
  const [selected, setSelected] = useState<string | string[] | null>(null)

  const step = QUIZ_STEPS[stepIndex]
  const isMulti = step?.multiSelect === true

  // Reset selection on step change
  useEffect(() => {
    if (phase === 'quiz') {
      const existing = answers[step?.id as keyof QuizAnswers]
      setSelected(existing ?? (isMulti ? [] : null))
    }
  }, [stepIndex, phase])

  const handleSelect = (value: string) => {
    if (!isMulti) {
      setSelected(value)
    } else {
      setSelected(prev => {
        const arr = Array.isArray(prev) ? prev : []
        return arr.includes(value) ? arr.filter(v => v !== value) : [...arr, value]
      })
    }
  }

  const isSelected = (value: string) => {
    if (Array.isArray(selected)) return selected.includes(value)
    return selected === value
  }

  const canContinue = isMulti
    ? Array.isArray(selected) && selected.length > 0
    : selected !== null

  const handleNext = () => {
    if (!canContinue) return
    const newAnswers = { ...answers, [step.id]: selected }
    setAnswers(newAnswers)

    if (stepIndex < QUIZ_STEPS.length - 1) {
      setStepIndex(i => i + 1)
    } else {
      setPhase('result')
    }
  }

  const handleBack = () => {
    if (stepIndex === 0) setPhase('intro')
    else setStepIndex(i => i - 1)
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-cream to-white">
      {/* Header bar */}
      <div className="sticky top-0 z-10 bg-white/80 backdrop-blur-md border-b border-gray-100">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <Link href="/" className="text-lg font-bold text-dark">
            Clic <span className="text-gold-500">Optique</span>
          </Link>
          <Link href="/products" className="text-sm text-gray-500 hover:text-dark">
            Passer le quiz
          </Link>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12 max-w-xl">
        <AnimatePresence mode="wait">

          {/* ── INTRO ── */}
          {phase === 'intro' && (
            <IntroScreen key="intro" onStart={() => setPhase('quiz')} />
          )}

          {/* ── QUIZ ── */}
          {phase === 'quiz' && step && (
            <motion.div
              key={`step-${stepIndex}`}
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -40 }}
              transition={{ duration: 0.3 }}
            >
              <ProgressBar current={stepIndex + 1} total={QUIZ_STEPS.length} />

              {/* Question */}
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-dark mb-1">
                  {step.question}
                </h2>
                {step.subtitle && (
                  <p className="text-gray-500 text-sm">{step.subtitle}</p>
                )}
              </div>

              {/* Options */}
              <div className="space-y-3 mb-8">
                {step.options.map(opt => (
                  <OptionCard
                    key={opt.value}
                    option={opt}
                    selected={isSelected(opt.value)}
                    onClick={() => handleSelect(opt.value)}
                    multiSelect={isMulti}
                  />
                ))}
              </div>

              {/* Nav buttons */}
              <div className="flex items-center gap-3">
                <button
                  onClick={handleBack}
                  className="flex-shrink-0 px-5 py-3 rounded-full border border-gray-200
                    text-gray-500 hover:border-gray-400 transition-colors text-sm"
                >
                  ← Retour
                </button>
                <motion.button
                  onClick={handleNext}
                  disabled={!canContinue}
                  whileHover={canContinue ? { scale: 1.02 } : {}}
                  whileTap={canContinue ? { scale: 0.98 } : {}}
                  className={`flex-1 py-3 rounded-full font-semibold text-base transition-all
                    ${canContinue
                      ? 'bg-gold-500 text-white shadow-md hover:bg-gold-600'
                      : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    }`}
                >
                  {stepIndex === QUIZ_STEPS.length - 1 ? 'Voir mes résultats ✨' : 'Continuer →'}
                </motion.button>
              </div>
            </motion.div>
          )}

          {/* ── RESULT ── */}
          {phase === 'result' && (
            <ResultScreen key="result" answers={answers} />
          )}

        </AnimatePresence>
      </div>
    </div>
  )
}
