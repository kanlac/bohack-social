'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import OnboardingForm from '@/components/OnboardingForm'
import AIChat from '@/components/AIChat'
import LoadingTransition from '@/components/LoadingTransition'
import ProfilePreview from '@/components/ProfilePreview'

type Step = 'form' | 'chat' | 'loading' | 'preview'

interface FormData {
  moods: string[]
  interests: string[]
  project: string
  wechat: string
}

interface Answer {
  question: string
  selectedOptions: string[]
  customInput: string
}

export default function Home() {
  const [step, setStep] = useState<Step>('form')
  const [formData, setFormData] = useState<FormData>({
    moods: [],
    interests: [],
    project: '',
    wechat: '',
  })
  const [answers, setAnswers] = useState<Answer[]>([])

  const handleFormComplete = (data: FormData) => {
    setFormData(data)
    setStep('chat')
  }

  const handleChatComplete = (chatAnswers: Answer[]) => {
    setAnswers(chatAnswers)
    setStep('loading')
    // Simulate AI processing
    setTimeout(() => {
      setStep('preview')
    }, 3000)
  }

  const handleSkipChat = () => {
    setAnswers([])
    setStep('loading')
    setTimeout(() => {
      setStep('preview')
    }, 3000)
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 sm:p-6 lg:p-8">
      <AnimatePresence mode="wait">
        {step === 'form' && (
          <motion.div
            key="form"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
            className="w-full max-w-2xl"
          >
            <OnboardingForm onComplete={handleFormComplete} />
          </motion.div>
        )}

        {step === 'chat' && (
          <motion.div
            key="chat"
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
            transition={{ duration: 0.5 }}
            className="w-full max-w-2xl"
          >
            <AIChat
              formData={formData}
              onComplete={handleChatComplete}
              onSkip={handleSkipChat}
            />
          </motion.div>
        )}

        {step === 'loading' && (
          <motion.div
            key="loading"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.2 }}
            transition={{ duration: 0.5 }}
          >
            <LoadingTransition />
          </motion.div>
        )}

        {step === 'preview' && (
          <motion.div
            key="preview"
            initial={{ opacity: 0, rotateY: 90 }}
            animate={{ opacity: 1, rotateY: 0 }}
            transition={{ duration: 0.8, type: 'spring' }}
            className="w-full max-w-md"
          >
            <ProfilePreview formData={formData} answers={answers} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
