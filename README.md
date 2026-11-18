# A&S STUDIO — Luxury E-Commerce Platform

> A production-grade, full-stack e-commerce web application featuring high-concurrency database locking, cryptographically secure Razorpay payments, automated inventory restocking, and an AI-powered RAG styling concierge.

---

## 🛠️ Tech Stack & Architecture

- **Frontend:** React (Vite), Tailwind CSS v4, Zustand (State Management), Lucide Icons, Axios (with JWT Auth & 401 Logout Interceptor).
- **Backend:** Python, Django, Django REST Framework (DRF), SimpleJWT Authentication.
- **Database & Concurrency:** PostgreSQL (with atomic row-level locking `select_for_update`).
- **Payment Gateway:** Razorpay API (HMAC-SHA256 Signature Verification).
- **Artificial Intelligence:** Google Gemini 2.5 Flash API (Database-Grounded RAG Shopping Concierge).

---

## 🚀 Core Engineering Highlights

1. **FinTech-Grade Security & Tamper-Proof Checkout:**
   * Eliminates client-side price manipulation by enforcing strict server-side product price validation directly from the PostgreSQL database.
   * Cryptographically verifies Razorpay payment signatures (frontend-triggered) to prevent fraudulent payload injections.
   
2. **ACID Transactions & Race Condition Handling:**
   * Utilizes Django's `transaction.atomic()` alongside `select_for_update()` to prevent inventory overselling during simultaneous checkouts or return restocks.
   
3. **End-to-End Post-Purchase Lifecycle:**
   * Complete secure order workflow: `Pending` ➔ `Paid` / `COD` ➔ `Return Requested` (with automated database inventory restocking).
   
4. **RAG-Grounded AI Personal Stylist:**
   * Custom-built shopping assistant that reads live in-stock catalog records and provides context-aware outfit recommendations with direct clickable product cards.
   * **API Abuse Prevention:** Secured with DRF rate-limiting (Throttling) to strictly control anonymous and user-level Gemini API quota consumption.

5. **Optimized Performance:**
   * Eliminated N+1 query bottlenecks using Django's `select_related` and `prefetch_related` join optimizations for nested API payloads.

---

## ⚙️ Quick Start & Local Development

### 1. Clone Repository
```bash
git clone [https://github.com/abhisheksharma-it/as_store.git](https://github.com/abhisheksharma-it/as_store.git)
cd as_store