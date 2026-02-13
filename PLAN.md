# SmartTasker - Phase 1: Brainstorm & Planning

## 1. Backend Choice & Justification
**Selected Technology:** Express.js (Node.js) with TypeScript.

**Justification:**
*   **Agility & Ecosystem:** Express.js provides a minimalist and flexible framework, allowing for rapid development and easy integration of various middlewares (CORS, Helmet, Rate Limiting).
*   **TypeScript Integration:** Using TypeScript ensures type safety, reducing runtime errors and improving developer productivity in a growing codebase.
*   **Performance:** Node.js's non-blocking I/O model is ideal for real-time features like WebSocket notifications (Socket.io) and handling high-concurrency task management.
*   **Scalability:** While minimalist, Express can be easily scaled using microservices or containerization (Docker).

## 2. High-Level Architecture
The system follows a **Separated Service Architecture** (Microservices-lite):
*   **Frontend (Next.js):** A responsive React-based client using App Router for optimized routing and server-side rendering where applicable.
*   **Core Backend (Express.js):** Handles authentication, task CRUD, scheduling, and database persistence (MongoDB).
*   **AI Service (FastAPI):** A dedicated Python service for specialized tasks like priority prediction and NLP-based task generation, communicating via REST API.
*   **Real-time Layer:** Socket.io for live updates and notifications.

## 3. Security Considerations
### Server-Side Security
*   **Authentication:** JWT (JSON Web Tokens) with secure storage and expiration.
*   **Password Safety:** Blowfish-based hashing using `bcryptjs`.
*   **Middleware Protection:** `helmet` for secure HTTP headers and `cors` for cross-origin resource sharing management.
*   **Traffic Control:** `express-rate-limit` to prevent Brute Force and DoS attacks.
*   **Injections:** Mongoose Object Modeling for automatic NoSQL injection prevention.

### Client-Side Security
*   **XSS Prevention:** React's built-in escaping and sanitizing user-generated content.
*   **Cookie Security:** Storing tokens in `HttpOnly` and `Secure` cookies to prevent access via JavaScript.
*   **Validation:** Dual-layer validation (Client-side with Formik/Zod and Server-side).

## 4. Alternative Tech Recommendations
While Express.js is excellent for the current scope:
*   **NestJS:** If the project matures into a large-scale enterprise application, transitioning to NestJS would provide better structure, dependency injection, and standardized modularity.
*   **FastAPI (Expanded):** For more intensive AI workloads, implementing a task queue like Celery with Redis would prevent blocking the AI service during long-running inference.

