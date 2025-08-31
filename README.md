# 📧 Mass-Mail-Dispatcher  
# Web-Based Bulk Email Sender  

# 💌 Mass-Mail Dispatcher: Smart Email Validation & Bulk Sending 🚀  

A lightweight and user-friendly web application to **send emails in bulk**.  
Upload a CSV file 📂, validate email addresses ✅, and send messages only to **valid recipients** — all in just a few clicks!  

---

## 🌟 Features
- 📂 **CSV Upload** – Import recipient lists directly from CSV files.  
- ✅ **Email Validation** – Automatically detect valid & invalid emails using Regex.  
- 🖊️ **Message Composer** – Write your subject & message in-app.  
- 🚀 **Bulk Send** – Deliver messages to all valid recipients instantly.  
- 🎨 **Clean UI** – Minimal, easy-to-use design with HTML & CSS.  

---

## 📸 Project Overview
![Mass Mail Demo](https://media.giphy.com/media/l0MYt5jPR6QX5pnqM/giphy.gif)  

---

## 🛠️ Tech Stack
- **Frontend**: ![HTML](https://img.shields.io/badge/HTML5-E34F26?style=flat&logo=html5&logoColor=white) ![CSS](https://img.shields.io/badge/CSS3-1572B6?style=flat&logo=css3&logoColor=white)  
- **Logic**: ![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=flat&logo=javascript&logoColor=black) (FileReader API + Regex)  
- **Mail Handling**: SMTP (backend ready for integration)  
- **Optional Backend**: Flask / Node.js for real mailing functionality  

---

## 🎉 How It Works
1. **Upload CSV File** – The user uploads a recipient list.  
2. **Validation** – JavaScript checks email format using Regex.  
3. **Separation** – Invalid emails ❌ are flagged, valid emails ✅ are listed.  
4. **Compose & Send** – User writes a message and sends to valid recipients.  

---

## 🚀 Quick Start

### Clone the Repository
```bash
git clone https://github.com/your-username/mass-mail-dispatcher.git
cd mass-mail-dispatcher
