A full‑stack web application to manage badminton court reservations, equipment rentals, and coach bookings, with an admin dashboard for managing courts, equipment, coaches, and dynamic pricing rules.
# User Features
- Select date, time, and court (indoor / outdoor) to create a booking.
- Optionally add equipment (rackets, shoes, etc.) to the booking.
- Optionally assign a coach based on availability.
- View all existing bookings with status and pricing breakdown.

# Admin Features
- Courts Management (CRUD, type, base price, amenities, status).
- Equipment Management (CRUD, total quantity, price/hour, status).
- Coaches Management (CRUD, hourly rate, specializations, availability, status).
- Pricing Rules Management (peak hours, weekend, court type, seasonal, priorities, active/inactive).
## Tech Stack

- **Frontend:** React (Create React App), React Router, Axios, Tailwind CSS (or custom CSS), Lucide Icons  
- **Backend:** Node.js, Express (REST APIs for courts, equipment, coaches, bookings, pricing)
- **Database :** MongDB
- **Deployment Status :
  
  **Note:** Deployment is currently unavailable due to time constraints.
  
  **Demo Available:**
    - Detailed video walkthrough of project structure
    - Full application preview and functionality demo
    - Complete setup and usage instructions provided above

Watch the demo video for live preview of all features in action.

# Getting Started

### Prerequisites
- Node.js (LTS)
- npm or yarn
- Git
# 1. Clone the repository

git clone https://github.com/santosh227/Badminton-Booking.git 
# 2. Install dependencies
## frontend
- cd project/client
- npm install
## backend

- cd project/server
- npm install

# 3. Configure environment variables
**Frontend (`project/client/.env`):**

**Backend (`project/server/.env`):**
- PORT=port_number
- NODE_ENV=development
- MONGO_URI=your_mongo_connection_string

# 4. Run the project locally

## Frontend (new terminal)

- cd project/client
- npm start
  
## Backend(New terminal)
- cd project/server
- npm run dev # or npm start

