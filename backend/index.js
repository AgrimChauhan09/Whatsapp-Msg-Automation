import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import twilio from 'twilio'

const app = express()
const PORT = process.env.PORT || 3001

app.use(cors())
app.use(express.json())

function validatePhone(phone) {
  return /^\+[1-9]\d{7,14}$/.test(phone)
}

async function sendWhatsAppMessage(to, body) {
  const accountSid = process.env.TWILIO_ACCOUNT_SID
  const authToken = process.env.TWILIO_AUTH_TOKEN
  const from = process.env.TWILIO_WHATSAPP_NUMBER

  if (!accountSid || !authToken || !from) {
    throw new Error('Twilio credentials are not configured. Set TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, and TWILIO_WHATSAPP_NUMBER.')
  }

  const client = twilio(accountSid, authToken)
  const fromNumber = from.startsWith('whatsapp:') ? from : `whatsapp:${from}`

  return client.messages.create({
    from: fromNumber,
    body,
    to: `whatsapp:${to}`,
  })
}

app.get('/api/healthz', (req, res) => {
  res.json({ status: 'ok' })
})

app.post('/api/send-whatsapp', async (req, res) => {
  const { to, message, scheduleTime } = req.body

  if (!to || !message) {
    return res.status(400).json({
      success: false,
      message: 'Phone number and message are required.',
    })
  }

  if (!validatePhone(to)) {
    return res.status(400).json({
      success: false,
      message: 'Invalid phone number. Use international format like +91XXXXXXXXXX.',
    })
  }

  if (scheduleTime) {
    const scheduledDate = new Date(scheduleTime.replace(' ', 'T'))

    if (isNaN(scheduledDate.getTime())) {
      return res.status(400).json({
        success: false,
        message: 'Invalid schedule time. Use format: YYYY-MM-DD HH:MM.',
      })
    }

    const delayMs = scheduledDate.getTime() - Date.now()

    if (delayMs <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Scheduled time must be in the future.',
      })
    }

    res.json({
      success: true,
      message: `Message scheduled for ${scheduledDate.toLocaleString()}. It will be sent automatically.`,
      scheduled: true,
    })

    setTimeout(async () => {
      try {
        await sendWhatsAppMessage(to, message)
        console.log(`Scheduled message sent to ${to}`)
      } catch (err) {
        console.error(`Failed to send scheduled message to ${to}:`, err.message)
      }
    }, delayMs)

    return
  }

  try {
    const result = await sendWhatsAppMessage(to, message)
    res.json({
      success: true,
      message: 'Message sent successfully!',
      sid: result.sid,
      scheduled: false,
    })
  } catch (err) {
    console.error('Twilio error:', err.message)
    res.status(500).json({
      success: false,
      message: 'Failed to send message.',
      error: err.message,
    })
  }
})

app.listen(PORT, () => {
  console.log(`Backend server running on http://localhost:${PORT}`)
})
