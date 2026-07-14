<div align="center">
  <img src="gramsetu_frontend/public/logo.png" width="120" alt="GramSetu Logo" onerror="this.src='https://github.com/user-attachments/assets/6afcbe9d-f421-4d37-8ffc-132cf05d21e1'"/>
</div>

<h1 align="center">GramSetu</h1>

<p align="center">
  <a href="https://www.oracle.com/java/technologies/downloads/#java21"><img alt="Java" src="https://img.shields.io/badge/Java-21-ED8B00?logo=openjdk&logoColor=white"/></a>
  <a href="https://spring.io/projects/spring-boot"><img alt="Spring Boot" src="https://img.shields.io/badge/Spring%20Boot-3.x-6DB33F?logo=springboot&logoColor=white"/></a>
  <a href="https://react.dev"><img alt="React" src="https://img.shields.io/badge/React-18-61DAFB?logo=react&logoColor=black"/></a>
  <a href="https://vite.dev"><img alt="Vite" src="https://img.shields.io/badge/Vite-5-646CFF?logo=vite&logoColor=white"/></a>
  <a href="https://tailwindcss.com"><img alt="Tailwind CSS" src="https://img.shields.io/badge/Tailwind%20CSS-3-06B6D4?logo=tailwindcss&logoColor=white"/></a>
  <a href="https://postgresql.org"><img alt="PostgreSQL" src="https://img.shields.io/badge/PostgreSQL-16-4169E1?logo=postgresql&logoColor=white"/></a>
</p>

<p align="center">
  <b>GramSetu</b> is a full-stack digital governance platform designed to revolutionize rural administration in India by bridging the gap between Gram Panchayat authorities and rural citizens.
</p>

> [!NOTE]
> **Empowering Rural India:** GramSetu digitizes manual, paper-bound village administrative tasks — such as tax payments, complaint resolution, certificate requests, and public notifications — into a single, secure, and accessible portal.

---

## ✨ What is GramSetu?

GramSetu (translated as *"Village Bridge"*) is a unified digital ecosystem engineered specifically for the administrative structure of Indian Gram Panchayats.

Unlike generic management systems, GramSetu splits features elegantly across three key village roles:

* **Citizens** — Request official documents, pay property/water taxes securely, and submit civic issues directly.
* **Admins (Panchayat Officials)** — Approve registrations, manage civic services, issue official certificates as PDFs, and communicate notices.
* **Watermen (Utility Staff)** — Push hyper-localized water alerts to specific zones or wards regarding supply timings, pipe bursts, or quality notices.

---

## 🚀 Core Features

### 🔐 Auth & Verification
* **OTP-Based Mobile Login** — Simplifies accessibility for rural users with mobile number verification.
* **Approval Queue** — Newly registered users must be reviewed and approved by the Gram Panchayat Admin before accessing services.
* **JWT Security** — Secured REST endpoints with stateless JSON Web Token authorization.

### 👥 Citizen Portal
* **Unified Dashboard** — Visual summary of outstanding taxes, complaint status, certificate requests, and notices.
* **Tax Wallet** — View detailed itemization of pending water and property taxes.
* **Razorpay Gateway** — Securely settle bills online using UPI, cards, or net banking.
* **Interactive Certificates** — Apply for legal documents (Income, Birth, Caste certificates) with document uploads.
* **Grievance Lodge** — Submit geo-tagged or category-based complaints directly to the Panchayat.

### 🏛️ Admin Control Panel
* **Citizen Moderation** — Verify uploaded documents and approve/deny pending citizen registrations.
* **Tax Manifests** — Generate and assign annual taxes to village properties.
* **Certificate Engine** — Review requests and automatically generate signed official PDFs containing dynamic user details.
* **Broadcast Terminal** — Send village-wide emergency announcements via SMTP Email and SMS gateway APIs.

### 💧 Waterman Dashboard
* **Water Alert Broadcast** — Instantly broadcast localized water supply timetables or emergency alerts to specific village wards.

---

## 🏗️ Architecture Style

GramSetu follows a **decoupled, API-first architecture** designed for fast response times even on low-bandwidth rural networks:

```
┌─────────────────────┐        REST / JSON        ┌──────────────────────┐
│   React Frontend     │ ─────────────────────────▶ │   Spring Boot API    │
│  (Vite + Tailwind)   │ ◀───────────────────────── │   (Java 21, JWT)     │
└─────────────────────┘                             └──────────┬───────────┘
                                                                 │
                                          ┌──────────────────────┼───────────────────────┐
                                          ▼                      ▼                        ▼
                                  ┌───────────────┐   ┌───────────────────┐   ┌────────────────────┐
                                  │  PostgreSQL DB │   │  Razorpay Gateway  │   │  SMTP / SMS APIs   │
                                  └───────────────┘   └───────────────────┘   └────────────────────┘
```

* **Stateless auth** via JWT keeps the backend horizontally scalable.
* **Role-based access** (Citizen / Admin / Waterman) is enforced at the API layer.
* **PDF generation** for certificates happens server-side using iText/OpenPDF, keeping the client lightweight.

---

## 🛠️ Tech Stack

### Backend
* **Runtime:** Java 21 (LTS)
* **Framework:** Spring Boot 3.x (Spring Web, Spring Security)
* **Persistence:** Spring Data JPA + Hibernate
* **Database:** PostgreSQL
* **Authentication:** JWT (JSON Web Tokens)
* **Integrations:** Razorpay Java SDK, JavaMail (SMTP support)
* **Reporting:** Thymeleaf + OpenPDF / iText (for PDF certificate generation)

### Frontend
* **Framework:** React 18 (built with Vite)
* **Routing:** React Router DOM v6
* **Styling:** Tailwind CSS (utility-first)
* **Icons:** Lucide Icons
* **HTTP Client:** Axios (interceptors configured for JWT attachment)
* **Notifications:** React Hot Toast

---

## ⚙️ Setup & Installation

### Prerequisite Checklist
* [Java Development Kit (JDK) 21](https://www.oracle.com/java/technologies/downloads/#java21)
* [Node.js](https://nodejs.org/) (v18 or higher)
* [PostgreSQL Database Server](https://www.postgresql.org/download/)
* Maven (installed, or use the `./mvnw` wrapper)

### 1. Database Setup
Create a PostgreSQL database named `gramsetu`:

```sql
CREATE DATABASE gramsetu;
```

### 2. Backend Configuration
Navigate to `gramsetu_backend/src/main/resources/application.properties` and update the database and credentials parameters:

```properties
spring.datasource.url=jdbc:postgresql://localhost:5432/gramsetu
spring.datasource.username=your_postgres_username
spring.datasource.password=your_postgres_password

# JWT Properties
jwt.secret=your_super_secret_jwt_key_of_minimum_256_bits_length
jwt.expiration=86400000

# Razorpay API Credentials
razorpay.key.id=your_razorpay_key_id
razorpay.key.secret=your_razorpay_key_secret

# SMTP Mail Properties (Optional for notifications)
spring.mail.host=smtp.gmail.com
spring.mail.port=587
spring.mail.username=your_email@gmail.com
spring.mail.password=your_app_password
```

Run the backend:

```bash
cd gramsetu_backend

# Run using the Maven wrapper
./mvnw spring-boot:run
```

### 3. Frontend Configuration
Navigate to the frontend directory and install dependencies:

```bash
cd gramsetu_frontend
npm install
```


Run the frontend:

```bash
npm run dev
```

Open your browser to the local address output by Vite (usually `http://localhost:5173`).

---

## 🤝 Contribution Guidelines

We welcome contributions to make rural governance more efficient! To contribute:

1. **Fork** this repository.
2. **Create your Feature Branch:**
   ```bash
   git checkout -b feature/AmazingFeature
   ```
3. **Commit your Changes:**
   ```bash
   git commit -m 'Add some AmazingFeature'
   ```
4. **Push to the Branch:**
   ```bash
   git push origin feature/AmazingFeature
   ```
5. **Open a Pull Request.**

---

<p align="center">Made with ❤️ for rural India</p>
