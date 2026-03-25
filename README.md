# WhatsApp Message Automation using Python and Twilio

## 📌 Introduction
This project is a simple yet powerful Python script that allows you to **automate sending WhatsApp messages**.  
You can write a message, specify a recipient, and schedule it to be sent at any future date and time.  

✅ Perfect for sending birthday wishes, reminders, or other time-sensitive messages without manual effort.  
✅ Powered by the **Twilio API**, a cloud communications platform that lets developers send/receive messages, calls, and more programmatically.  

---

## ⚙️ How It Works
1. **Twilio Client Initialization**  
   The script starts by initializing the Twilio client with your **Account SID** and **Auth Token**, which authenticate requests to the Twilio API.

2. **User Input**  
   The script asks you to enter:
   - Recipient’s Name  
   - Recipient’s WhatsApp Number (with country code, e.g., `+91XXXXXXXXXX`)  
   - Message Content  
   - Date (`YYYY-MM-DD`) and Time (`HH:MM` in 24-hour format)  

3. **Message Scheduling**  
   The script waits in the background until the scheduled time, then sends your message automatically.

---

## 📚 Required Libraries
Make sure you have these installed:

- **Python 3.x**  
- **twilio**  

---

## 🚀 Steps to Set Up and Run the Project

### 1️⃣ Twilio Account Setup
1. **Create a Twilio Account** → [Sign up here](https://www.twilio.com/)  
2. **Get Your Credentials** → From your [Twilio Console](https://www.twilio.com/console), copy your **Account SID** and **Auth Token**.  
3. **Activate WhatsApp Sandbox**  
   - Go to **Messaging > Try it out > Send a WhatsApp message**.  
   - You’ll see a Sandbox Number (e.g., `+14155238886`).  
   - Send the given code (e.g., `join wide-liberty`) to this number from WhatsApp.  
   - Any recipient must also send the code to the Twilio number before you can message them.

---

### 2️⃣ Configure the Script
Clone or download this repo and open the script. Replace placeholders with your credentials:

```python
# Twilio credentials
account_sid = 'ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxx'  # Your Account SID
auth_token = 'your_auth_token_xxxxxxxxxxxxxx'   # Your Auth Token

client = Client(account_sid, auth_token)

# In the send_whatsapp_message function
from_='whatsapp:+14155238886'  # Replace with your Twilio Sandbox number



## 3️⃣ Install Dependencies
Run the following command in your terminal:

pip install twilio


Enter the recipient name = John Doe
Enter the recipient WhatsApp number with country code (e.g., +91XXXXXXXXXX) = +919876543210
Enter the message you want to send to John Doe: Happy Birthday, John!
Enter the date to send the message (yyyy-mm-dd): 2025-09-05
Enter the time to send the message (HH:MM in 24 hr format): 00:00

