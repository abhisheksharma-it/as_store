# A&S STUDIO — Luxury E-Commerce Platform

> A production-grade, H&M-inspired full-stack e-commerce web application featuring high-concurrency database locking, cryptographically secure Razorpay payments, automated returns/refunds lifecycle, and an AI-powered RAG styling concierge.

---

## 🛠️ Tech Stack & Architecture

* **Frontend:** React (Vite), Tailwind CSS v4, Zustand (State Management), Lucide Icons, Axios (with JWT Auto-Refresh Interceptor).
* **Backend:** Python, Django, Django REST Framework (DRF), SimpleJWT Authentication.
* **Database & Concurrency:** PostgreSQL (with atomic row-level locking `select_for_update`).
* **Payment Gateway:** Razorpay API (HMAC-SHA256 Signature Verification).
* **Artificial Intelligence:** Google Gemini 2.5 Flash API (Database-Grounded RAG Shopping Concierge).

---

## 🚀 Core Engineering Highlights

1. **FinTech-Grade Security & Tamper-Proof Checkout:**
   * Eliminates client-side price manipulation by enforcing strict server-side product price validation from the PostgreSQL database.
   * Cryptographically verifies Razorpay payment signatures to prevent fake webhook/payload injections.
2. **ACID Transactions & Race Condition Handling:**
   * Utilizes Django's `transaction.atomic()` alongside `select_for_update()` to prevent inventory overselling during simultaneous checkouts or return restocks.
3. **End-to-End Post-Purchase Lifecycle:**
   * Complete order workflow: `Paid` / `COD` $\rightarrow$ `Return Requested` (with automatic inventory restocking) $\rightarrow$ `Refund Initiated` with transaction tracking.
4. **RAG-Grounded AI Personal Stylist:**
   * Custom-built shopping assistant that reads live in-stock catalog records and provides context-aware outfit recommendations with direct clickable product cards.
5. **Optimized Performance:**
   * Eliminated N+1 query bottlenecks using Django's `select_related` and `prefetch_related` join optimizations.

---

## ⚙️ Quick Start & Local Development

### 1. Clone Repository
```bash
git clone [https://github.com/abhisheksharma-it/your-repo-name.git](https://github.com/abhisheksharma-it/your-repo-name.git)
cd E-commerce-project