# StayCation Frontend - Project Context

**Last Updated:** April 23, 2026  
**Project Type:** React Booking Application  
**Status:** Development

---

## 📋 Project Overview

StayCation Frontend is a React-based hotel/property booking application that allows users to:
- Browse and search for properties
- View property details
- Make reservations
- Register and login with authentication
- View featured properties and lists

**Backend API:** https://staycation-server-v1-1.onrender.com/api

---

## 🏗️ Project Structure

```
Staycation_frontend_v1/
├── package.json
├── README.md
├── public/
│   └── index.html
├── src/
│   ├── App.js (Main app with routing)
│   ├── index.js
│   ├── components/
│   │   ├── featured/ (Featured properties display)
│   │   ├── featuredProperties/ (Featured properties list)
│   │   ├── footer/
│   │   ├── header/
│   │   ├── mailList/ (Newsletter signup)
│   │   ├── navbar/
│   │   ├── propertyList/ (Property type listing)
│   │   ├── reserve/ (Reservation modal)
│   │   └── searchItem/ (Search result item)
│   ├── context/
│   │   ├── AuthContext.js (User auth state management)
│   │   └── SearchContext.js (Search filters state)
│   ├── hooks/
│   │   └── useFetch.js (Custom API fetch hook)
│   └── pages/
│       ├── home/ (Home page)
│       ├── hotel/ (Hotel details page)
│       ├── list/ (Search results page)
│       ├── login/ (Login page)
│       └── register/ (Registration page)
```

---

## 🔐 Authentication System

### User Schema (Backend)
```javascript
{
  username: String (required, unique),
  email: String (required, unique),
  password: String (required, hashed with bcrypt),
  phone: String (required),
  country: String (required),
  city: String (required),
  img: String (optional, user avatar URL),
  isAdmin: Boolean (default: false),
  timestamps: true
}
```

### AuthContext (Frontend)
- **State:** `user`, `loading`, `error`
- **Actions:** `LOGIN_START`, `LOGIN_SUCCESS`, `LOGIN_FAILURE`, `LOGOUT`
- **Storage:** Session-based (cleared on logout, no localStorage persistence)

### API Endpoints
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/logout` - Logout user

---

## 🔧 Core Dependencies

| Package | Version | Purpose |
|---------|---------|---------|
| react | 18.0.0 | UI framework |
| react-router-dom | 6.3.0 | Client-side routing |
| axios | 1.4.0 | HTTP requests |
| react-date-range | 1.4.0 | Date picker component |
| date-fns | 2.28.0 | Date utilities |
| @fortawesome/react-fontawesome | 0.1.18 | Icon library |

---

## 📄 Pages & Components

### Pages
- **Home** (`/`) - Landing page with featured properties
- **List** (`/hotels`) - Search results with filters
- **Hotel** (`/hotels/:id`) - Hotel details page
- **Login** (`/login`) - User login
- **Register** (`/register`) - User registration

### Key Components
- **Navbar** - Navigation bar with search functionality
- **Header** - Page header with search widget
- **SearchItem** - Individual search result card
- **Reserve** - Booking modal/form
- **Featured** - Featured properties showcase
- **FeaturedProperties** - Property type list
- **PropertyList** - List of property categories
- **MailList** - Newsletter signup component
- **Footer** - Footer section

---

## 🔄 Pages Details

### Register Page
**File:** `src/pages/register/Register.jsx`

**Status:** ✅ UPDATED (April 23, 2026)

**State:**
```javascript
credentials = {
  username: "",
  email: "",
  password: "",
  phone: "",
  country: "",
  city: "",
  img: ""
}
```

**Form Fields:**
1. Username (text) - Required
2. Email (email) - Required
3. Password (password) - Required
4. Phone (text) - Required
5. Country (text) - Required
6. City (text) - Required
7. Image URL (text) - Optional

**API Call:**
- Endpoint: `POST /api/auth/register`
- Payload: `credentials` object
- Success Action: Navigate to `/login`
- Error Handling: Display error message from context

**Features:**
- Real-time input validation via `handleChange`
- Loading state management
- Error display
- Redirect to login on success

---

## 📝 Changes Made

### April 23, 2026 (Update 2) - Logout Functionality & Auth Context Cleanup
- ✅ Removed LocalStorage persistence from AuthContext
- ✅ Added logout button in Navbar (displays after login)
- ✅ Display username in Navbar when user is logged in
- ✅ Clear user data on logout dispatch
- ✅ Redirect to home page after logout
- ✅ Added `.navUser` CSS styling for username display

**Files Modified:**
- `src/context/AuthContext.js` - Removed localStorage
- `src/components/navbar/Navbar.jsx` - Added logout button and username display
- `src/components/navbar/navbar.css` - Added navUser styling

### April 23, 2026 (Update 1) - Register Page Implementation
- ✅ Updated state to match backend User schema
- ✅ Replaced `name` field with `username`
- ✅ Added missing fields: `country`, `phone`, `img`
- ✅ Implemented register API endpoint call
- ✅ Added proper error handling
- ✅ Added success navigation to login page
- ✅ Updated form inputs to collect all required fields

---

### Navbar Component
**File:** `src/components/navbar/Navbar.jsx`

**Status:** ✅ UPDATED (April 23, 2026)

**When Logged Out:**
- Display "Register" button
- Display "Login" button

**When Logged In:**
- Display username from AuthContext
- Display "Logout" button
- Logout functionality clears user state and redirects to home

**Features:**
- Real-time user state detection
- Navigation to login/register pages
- Logout action dispatch
- Username display styling

---

## 🛠️ Current Tasks

- [x] Add logout button in Navbar
- [x] Remove LocalStorage persistence
- [ ] Verify Register page styling (CSS)
- [ ] Test register API integration
- [ ] Implement Login page with API
- [ ] Add form validation
- [ ] Add password strength indicator
- [ ] Add CSRF protection
- [ ] Implement email verification (optional)
- [ ] Add image upload functionality
- [ ] Create error boundary components

---

## 🐛 Known Issues

- None reported yet

---

## 📚 Notes

- Backend uses bcrypt for password hashing (salt rounds: 10)
- User data is session-based (cleared on logout)
- All API requests should include proper error handling
- Timestamps are automatically managed by MongoDB
- Logout button clears all user state and redirects to home

---

## 🔮 Future Improvements

1. Add form validation library (e.g., Formik, React Hook Form)
2. Implement password complexity requirements
3. Add email confirmation
4. Add reCAPTCHA for registration
5. Implement refresh token rotation
6. Add two-factor authentication
7. Enhance error messages for better UX
8. Add registration success confirmation page

---

**Maintained By:** Development Team  
**Last Review:** April 23, 2026
