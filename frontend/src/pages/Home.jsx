import { useState } from 'react'
import Navbar from '../components/Navbar.jsx'
import {
  Send,
  Clock,
  Phone,
  MessageSquare,
  Info,
  Loader2,
  CheckCircle2,
  AlertCircle,
  BookOpen,
  X,
  ArrowRight,
  Smartphone,
  MessageCircle,
  QrCode,
} from 'lucide-react'

const SANDBOX_STEPS = [
  {
    Icon: BookOpen,
    title: 'Go to Twilio Console',
    description: 'Log in to your Twilio account and navigate to Messaging → Try it out → Send a WhatsApp message.',
    tip: 'Direct link: console.twilio.com/us1/develop/sms/try-it-out/whatsapp-learn',
  },
  {
    Icon: Smartphone,
    title: 'Get Your Sandbox Number & Code',
    description: "On the WhatsApp Sandbox page, you'll see a Twilio number (e.g. +1 415 523 8886) and a unique join code like 'join bright-horse'.",
    tip: "Keep this page open — you'll need the number and code.",
  },
  {
    Icon: MessageCircle,
    title: 'Send the Join Message',
    description: 'Open WhatsApp on your phone, add the Twilio sandbox number as a contact, then send exactly:',
    code: 'join <your-sandbox-code>',
    tip: 'Replace <your-sandbox-code> with the actual code shown in your Twilio Console.',
  },
  {
    Icon: QrCode,
    title: 'Scan the QR Code (Alternative)',
    description: 'Alternatively, scan the QR code shown in the Twilio Console directly with WhatsApp camera to auto-send the join message.',
    tip: 'This is the fastest method — no typing needed.',
  },
  {
    Icon: CheckCircle2,
    title: "You're Connected!",
    description: 'Once you receive a confirmation reply from Twilio, the sandbox is active. You can now send and receive WhatsApp messages using this app.',
    tip: 'Sandbox sessions last 72 hours. Re-send the join message to refresh.',
  },
]

function GuideModal({ onClose }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-green-50">
          <div className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-green-600" />
            <h2 className="text-lg font-bold text-gray-900">How to Join the WhatsApp Sandbox</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Steps */}
        <div className="px-6 py-5 max-h-[65vh] overflow-y-auto">
          {SANDBOX_STEPS.map((step, i) => {
            const { Icon } = step
            return (
              <div key={i} className="flex gap-4 mb-1">
                <div className="flex flex-col items-center">
                  <div className="w-9 h-9 rounded-full bg-green-100 border border-green-200 flex items-center justify-center shrink-0">
                    <span className="text-sm font-bold text-green-700">{i + 1}</span>
                  </div>
                  {i < SANDBOX_STEPS.length - 1 && (
                    <div className="w-px flex-1 bg-gray-200 my-2 min-h-[1.5rem]" />
                  )}
                </div>
                <div className="pb-5 flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <Icon className="w-4 h-4 text-green-600 shrink-0" />
                    <h3 className="font-semibold text-gray-900 text-sm">{step.title}</h3>
                  </div>
                  <p className="text-sm text-gray-600 leading-relaxed">{step.description}</p>
                  {step.code && (
                    <code className="mt-2 inline-block text-sm bg-green-50 text-green-800 border border-green-200 px-3 py-1.5 rounded-lg font-mono">
                      {step.code}
                    </code>
                  )}
                  <p className="mt-2 text-xs text-gray-400 italic border-l-2 border-green-200 pl-2">
                    {step.tip}
                  </p>
                </div>
              </div>
            )
          })}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-100 bg-gray-50 flex items-center justify-between">
          <a
            href="https://console.twilio.com/us1/develop/sms/try-it-out/whatsapp-learn"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-green-700 font-medium hover:underline flex items-center gap-1"
          >
            Open Twilio Console
            <ArrowRight className="w-3.5 h-3.5" />
          </a>
          <button
            onClick={onClose}
            className="bg-green-600 hover:bg-green-700 text-white font-semibold px-5 py-2 rounded-xl transition-colors text-sm"
          >
            Got it!
          </button>
        </div>
      </div>
    </div>
  )
}

export default function Home() {
  const [form, setForm] = useState({ to: '', message: '', scheduleTime: '' })
  const [isScheduling, setIsScheduling] = useState(false)
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState({})
  const [toast, setToast] = useState(null)
  const [showGuide, setShowGuide] = useState(false)

  const showToast = (type, message) => {
    setToast({ type, message })
    setTimeout(() => setToast(null), 5000)
  }

  const validate = () => {
    const errs = {}
    if (!/^\+[1-9]\d{7,14}$/.test(form.to)) {
      errs.to = 'Enter a valid international number starting with + (e.g. +91XXXXXXXXXX)'
    }
    if (!form.message.trim()) {
      errs.message = 'Message cannot be empty'
    }
    if (isScheduling && !form.scheduleTime) {
      errs.scheduleTime = 'Please select a date and time'
    }
    return errs
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length > 0) {
      setErrors(errs)
      return
    }
    setErrors({})
    setLoading(true)

    try {
      const body = { to: form.to, message: form.message }
      if (isScheduling && form.scheduleTime) {
        body.scheduleTime = form.scheduleTime.replace('T', ' ')
      }

      const res = await fetch('/api/send-whatsapp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })

      const data = await res.json()

      if (data.success) {
        showToast('success', data.message)
        setForm({ to: '', message: '', scheduleTime: '' })
        setIsScheduling(false)
      } else {
        showToast('error', data.message || 'Failed to send message.')
      }
    } catch {
      showToast('error', 'Network error. Is the backend running?')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50 flex flex-col">
      <Navbar />

      {/* Toast */}
      {toast && (
        <div
          className={`fixed top-5 right-5 z-50 flex items-start gap-3 px-4 py-3 rounded-xl shadow-xl text-white max-w-sm transition-all ${
            toast.type === 'success' ? 'bg-green-600' : 'bg-red-500'
          }`}
        >
          {toast.type === 'success' ? (
            <CheckCircle2 className="w-5 h-5 shrink-0 mt-0.5" />
          ) : (
            <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
          )}
          <p className="text-sm font-medium leading-snug">{toast.message}</p>
          <button onClick={() => setToast(null)} className="ml-auto shrink-0 opacity-80 hover:opacity-100">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      <main className="flex-1 flex items-center justify-center py-12 px-4">
        <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">

          {/* Left: Hero */}
          <div className="lg:col-span-5 flex flex-col gap-6">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-green-100 text-green-800 w-fit border border-green-200 text-xs font-semibold uppercase tracking-wider">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-500 opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-green-600" />
              </span>
              Twilio Sandbox Active
            </div>

            <h1 className="text-5xl lg:text-6xl font-extrabold text-gray-900 leading-tight">
              Automate your{' '}
              <span className="text-green-600">WhatsApp</span>{' '}
              workflow.
            </h1>

            <p className="text-lg text-gray-500 leading-relaxed">
              Send or schedule WhatsApp messages instantly through the Twilio API. Built for developers who need reliable communication.
            </p>

            {/* Sandbox Notice */}
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
              <div className="flex gap-3">
                <Info className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-blue-800 text-sm mb-1">Sandbox Required</p>
                  <p className="text-sm text-blue-700 leading-relaxed">
                    First-time users must send{' '}
                    <code className="bg-blue-100 text-blue-900 font-mono px-1.5 py-0.5 rounded text-xs font-bold">
                      join &lt;sandbox-code&gt;
                    </code>{' '}
                    to the Twilio WhatsApp sandbox number before receiving messages.
                  </p>
                  <button
                    onClick={() => setShowGuide(true)}
                    className="mt-3 flex items-center gap-1.5 text-sm font-semibold text-blue-700 hover:text-blue-900 transition-colors group"
                  >
                    <BookOpen className="w-4 h-4" />
                    How to join the sandbox
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                  </button>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-6 text-sm font-medium text-gray-400">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-green-500" /> Instant Delivery
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-green-500" /> Future Scheduling
              </span>
            </div>
          </div>

          {/* Right: Form */}
          <div className="lg:col-span-7">
            <div className="bg-white border border-gray-100 rounded-3xl p-6 sm:p-8 shadow-xl shadow-gray-200/60">
              <div className="mb-7">
                <h2 className="text-2xl font-bold text-gray-900">Compose Message</h2>
                <p className="text-gray-500 text-sm mt-1">Fill out the details below to send your message.</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Phone */}
                <div>
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-1.5">
                    <Phone className="w-4 h-4 text-gray-400" />
                    Recipient Number
                  </label>
                  <input
                    name="to"
                    type="tel"
                    value={form.to}
                    onChange={handleChange}
                    placeholder="+91XXXXXXXXXX"
                    className={`w-full px-4 py-3 rounded-xl border-2 bg-gray-50 text-gray-900 placeholder-gray-400 outline-none transition-all focus:bg-white focus:border-green-500 focus:ring-4 focus:ring-green-100 ${
                      errors.to ? 'border-red-400 bg-red-50 focus:border-red-500 focus:ring-red-100' : 'border-gray-200'
                    }`}
                  />
                  {errors.to && (
                    <p className="mt-1.5 text-sm text-red-500 flex items-center gap-1">
                      <AlertCircle className="w-3.5 h-3.5" /> {errors.to}
                    </p>
                  )}
                </div>

                {/* Message */}
                <div>
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-1.5">
                    <MessageSquare className="w-4 h-4 text-gray-400" />
                    Message Body
                  </label>
                  <textarea
                    name="message"
                    value={form.message}
                    onChange={handleChange}
                    placeholder="Hello! This is a test message from WhatSend..."
                    rows={4}
                    className={`w-full px-4 py-3 rounded-xl border-2 bg-gray-50 text-gray-900 placeholder-gray-400 outline-none transition-all resize-none focus:bg-white focus:border-green-500 focus:ring-4 focus:ring-green-100 ${
                      errors.message ? 'border-red-400 bg-red-50 focus:border-red-500 focus:ring-red-100' : 'border-gray-200'
                    }`}
                  />
                  {errors.message && (
                    <p className="mt-1.5 text-sm text-red-500 flex items-center gap-1">
                      <AlertCircle className="w-3.5 h-3.5" /> {errors.message}
                    </p>
                  )}
                </div>

                {/* Schedule Toggle */}
                <div className="pt-2 border-t border-gray-100">
                  <div className="flex items-center justify-between">
                    <label className="flex items-center gap-2 text-sm font-medium text-gray-700 cursor-pointer">
                      <Clock className={`w-4 h-4 transition-colors ${isScheduling ? 'text-green-600' : 'text-gray-400'}`} />
                      Schedule for later
                    </label>
                    <button
                      type="button"
                      onClick={() => {
                        setIsScheduling(!isScheduling)
                        if (isScheduling) setForm((p) => ({ ...p, scheduleTime: '' }))
                      }}
                      className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 focus:outline-none ${
                        isScheduling ? 'bg-green-600' : 'bg-gray-200'
                      }`}
                    >
                      <span
                        className={`inline-block h-5 w-5 rounded-full bg-white shadow transform transition-transform duration-200 ${
                          isScheduling ? 'translate-x-5' : 'translate-x-0'
                        }`}
                      />
                    </button>
                  </div>

                  {isScheduling && (
                    <div className="mt-3">
                      <input
                        type="datetime-local"
                        name="scheduleTime"
                        value={form.scheduleTime}
                        onChange={handleChange}
                        className={`w-full px-4 py-3 rounded-xl border-2 bg-gray-50 text-gray-900 outline-none transition-all focus:bg-white focus:border-green-500 focus:ring-4 focus:ring-green-100 font-mono text-sm ${
                          errors.scheduleTime ? 'border-red-400' : 'border-gray-200'
                        }`}
                      />
                      <p className="mt-1 text-xs text-gray-400">Message will be dispatched at this exact time.</p>
                      {errors.scheduleTime && (
                        <p className="mt-1 text-sm text-red-500 flex items-center gap-1">
                          <AlertCircle className="w-3.5 h-3.5" /> {errors.scheduleTime}
                        </p>
                      )}
                    </div>
                  )}
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex items-center justify-center gap-2 py-4 px-6 bg-green-600 hover:bg-green-700 disabled:opacity-60 disabled:cursor-not-allowed text-white font-semibold rounded-xl transition-all shadow-lg shadow-green-200 hover:shadow-green-300 hover:-translate-y-0.5 active:translate-y-0 text-base"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <Send className="w-5 h-5" />
                      {isScheduling ? 'Schedule Message' : 'Send Now'}
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      </main>

      {showGuide && <GuideModal onClose={() => setShowGuide(false)} />}
    </div>
  )
}
