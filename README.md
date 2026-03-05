# lostnfound

> Project by Julia Contreras & Samantha Lansoy CMSC 129 Laboratory 1

A community-driven lost and found platform that helps people recover lost items and reunite found ones with their owners. Post what you've lost or found, add photos and location details, and let your community help reconnect what's missing.

---

## Features

- Post lost or found items with title, description, location, and photo
- Image upload with automatic compression
- Soft delete with 30-day recovery window (Recently Deleted)
- Restore or permanently delete posts
- Edit your existing posts
- Firebase Authentication (email/password)
- Responsive layout with drawer navigation
- Toast notifications for all actions

---

## Tech Stack

**Frontend**
- React + TypeScript (Vite)
- Tailwind CSS + DaisyUI
- Firebase Authentication
- Framer Motion
- React Hot Toast
- React Router DOM

**Backend**
- Node.js + Express + TypeScript
- Firebase Admin SDK
- Firestore (database)
- Firebase Storage (images)

---

## Getting Started

### Prerequisites

Make sure you have the following installed:

- [Node.js](https://nodejs.org/) v18 or higher
- [npm](https://www.npmjs.com/) v9 or higher
- A [Firebase](https://firebase.google.com/) project with Firestore and Authentication enabled

---

### Installation

**1. Clone the repository**

```bash
git clone https://github.com/juliaconts/CMSC129-Lab1-ContrerasJL_LansoySL.git
cd CMSC129-Lab1-ContrerasJL_LansoySL
```

**2. Install frontend dependencies**

```bash
cd lostnfound
npm install
npm install browser-image-compression
npm install react-hot-toast
npm install framer-motion
```

**3. Install backend dependencies**

```bash
cd lostnfound/backend
npm install
```

---

### Environment Variables

**Frontend** — create a `.env` file inside the `frontend/` folder:

```env
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

**Backend** — create a `.env` file inside the `backend/` folder:

```env
FIREBASE_PROJECT_ID=your_project_id
FIREBASE_PRIVATE_KEY="your_private_key"
FIREBASE_CLIENT_EMAIL=your_client_email
```

> You can get the backend credentials from your Firebase project under **Project Settings → Service Accounts → Generate new private key**.

---

### Running the App

**Start the backend server:**

```bash
cd backend
npm run dev
```

The server will run on `http://localhost:3000`

**Start the frontend development server:**

```bash
cd frontend
npm run dev
```

The app will run on `http://localhost:5173`

---

## 📖 Usage Guide

### Creating an Account
1. Navigate to `/signup`
2. Enter your email and password
3. You will be redirected to the homepage upon success

### Posting a Lost or Found Item
1. Click the **"What did you lose or find?"** bar at the top of the homepage
2. Fill in the title, description, location, and where to claim/return the item
3. Select the status: **Lost Item** or **Found Item**
4. Optionally upload a photo
5. Click **Post**

### Managing Your Posts
- Go to **Profile** from the sidebar to view all your active posts
- Click **Edit** to update a post's details
- Click **Delete** to soft-delete a post (recoverable within 30 days)

### Restoring Deleted Posts
- Go to **Recently Deleted** from the sidebar
- Each post shows how many days remain before permanent deletion
- Click **Restore** to bring a post back, or **Delete** to permanently remove it
- Posts deleted more than 30 days ago are **automatically purged** when the deleted list is fetched

### Logging Out
- Click **Logout** at the bottom of the sidebar
- Confirm in the modal to sign out

---

## 📡 API Documentation

Base URL: `http://localhost:3000`

### Authentication

Protected endpoints require a valid Firebase ID token in the `Authorization` header:

```
Authorization: Bearer <firebase_id_token>
```

Tokens are obtained from the Firebase client SDK after a user signs in.

---

### Auth Routes

#### `POST /auth/signup`
Create a new user account. Registers the user in Firebase Authentication and stores their profile in Firestore.

- **Auth required:** No
- **Request body:**

```json
{
  "email": "user@example.com",
  "password": "yourpassword"
}
```

- **Success response** `201`:

```json
{
  "message": "User created successfully",
  "uid": "firebase_user_uid"
}
```

- **Error response** `400`:

```json
{
  "error": "Error message from Firebase (e.g. email already in use)"
}
```

---

### Post Routes

#### `GET /posts`
Fetch all active (non-deleted) posts for the public feed, ordered by newest first. Does not require authentication.

- **Auth required:** No

- **Success response** `200`:

```json
[
  {
    "id": "abc123",
    "title": "Lost Black Wallet",
    "description": "Lost near the library after class.",
    "type": 1,
    "location": "Main Library",
    "returnClaimLocation": "Guard desk",
    "image": "data:image/jpeg;base64,...",
    "userId": "firebase_uid",
    "createdAt": { "_seconds": 1700000000, "_nanoseconds": 0 }
  }
]
```

- **Error response** `500`:

```json
{ "error": "Internal server error message" }
```

> **Note:** Posts with a `deletedAt` field are automatically excluded from this response.

---

#### `POST /posts`
Create a new lost or found post. All fields except `image` are required.

- **Auth required:** Yes

- **Request body:**

```json
{
  "title": "Found Keychain",
  "description": "Found a blue keychain near the cafeteria.",
  "type": 2,
  "location": "Cafeteria",
  "returnClaimLocation": "Room 101, Building A",
  "image": "data:image/jpeg;base64,..."
}
```

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `title` | string | ✓ | Title of the post |
| `description` | string | ✓ | Description of the item |
| `type` | number | ✓ | `1` = Lost Item, `2` = Found Item |
| `location` | string | ✓ | Where the item was lost or found |
| `returnClaimLocation` | string | ✓ | Where to return or claim the item |
| `image` | string \| null | X | Base64-encoded image (optional) |

- **Success response** `201`:

```json
{
  "message": "Post created.",
  "id": "newly_created_post_id"
}
```

- **Validation error responses** `400`:

```json
{ "error": "Title is required." }
{ "error": "Description is required." }
{ "error": "Location is required." }
{ "error": "Return/Claim Location is required." }
{ "error": "Type must be 1 (lost) or 2 (found)." }
```

---

#### `GET /posts/my`
Fetch all active posts belonging to the currently authenticated user, ordered by newest first.

- **Auth required:** Yes

- **Success response** `200` — array of the user's active post objects (same shape as `GET /posts`)

> **Note:** Posts with a `deletedAt` value are filtered out and will not appear here.

---

#### `GET /posts/deleted`
Fetch all soft-deleted posts belonging to the authenticated user. As a side effect, any posts deleted more than 30 days ago are automatically and permanently purged from Firestore via a batch delete during this request.

- **Auth required:** Yes

- **Success response** `200`:

```json
[
  {
    "id": "abc123",
    "title": "Lost Black Wallet",
    "type": 1,
    "location": "Main Library",
    "returnClaimLocation": "Guard desk",
    "image": null,
    "userId": "firebase_uid",
    "createdAt": { "_seconds": 1700000000, "_nanoseconds": 0 },
    "deletedAt": { "_seconds": 1700500000, "_nanoseconds": 0 }
  }
]
```

> **Note:** Only posts within the 30-day window are returned. Expired posts are silently purged and excluded from the response.

---

#### `PUT /posts/:id`
Update an existing post. All fields are required in the request body. A server-generated `updatedAt` timestamp is automatically written to the document.

- **Auth required:** Yes
- **URL param:** `id` — Firestore document ID of the post

- **Request body:**

```json
{
  "title": "Updated Title",
  "description": "Updated description",
  "type": 1,
  "location": "Updated location",
  "returnClaimLocation": "Updated claim location",
  "image": "data:image/jpeg;base64,..."
}
```

- **Success response** `200`:

```json
{
  "message": "Post updated.",
  "id": "post_id"
}
```

- **Error responses** `400`:

```json
{ "error": "Post ID is required." }
{ "error": "Type must be 1 (lost) or 2 (found)." }
```

---

#### `DELETE /posts/:id`
Soft-delete a post by stamping it with a `deletedAt` server timestamp. The post is removed from the active feed and moved to Recently Deleted. It remains recoverable for 30 days.

- **Auth required:** Yes
- **URL param:** `id` — Firestore document ID of the post

- **Success response** `200`:

```json
{
  "message": "Post moved to recently deleted.",
  "id": "post_id"
}
```

- **Error response** `400`:

```json
{ "error": "Post ID is required." }
```

---

#### `PUT /posts/:id/restore`
Restore a soft-deleted post by setting its `deletedAt` field back to `null`. The post returns to the active feed immediately.

- **Auth required:** Yes
- **URL param:** `id` — Firestore document ID of the post

- **Success response** `200`:

```json
{
  "message": "Post restored.",
  "id": "post_id"
}
```

- **Error response** `400`:

```json
{ "error": "Post ID is required." }
```

---

#### `DELETE /posts/:id/permanent`
Permanently and irreversibly delete a post from Firestore. This cannot be undone.

- **Auth required:** Yes
- **URL param:** `id` — Firestore document ID of the post

- **Success response** `200`:

```json
{
  "message": "Post permanently deleted.",
  "id": "post_id"
}
```

- **Error response** `400`:

```json
{ "error": "Post ID is required." }
```

---

### Error Responses

All endpoints return errors in this format:

```json
{
  "error": "Description of the error"
}
```

| Status Code | Meaning |
|-------------|---------|
| `400` | Bad request — missing or invalid fields |
| `401` | Unauthorized — missing or invalid Bearer token |
| `500` | Internal server error |

---

### Post Object Reference

| Field | Type | Description |
|-------|------|-------------|
| `id` | string | Firestore document ID |
| `title` | string | Title of the post |
| `description` | string | Item description |
| `type` | `1` \| `2` | `1` = Lost Item, `2` = Found Item |
| `location` | string | Where the item was lost or found |
| `returnClaimLocation` | string | Where to return or claim the item |
| `image` | string \| null | Base64-encoded image string or null |
| `userId` | string | Firebase UID of the post owner |
| `createdAt` | Firestore Timestamp | Auto-set on creation |
| `updatedAt` | Firestore Timestamp | Auto-set on update |
| `deletedAt` | Firestore Timestamp \| null | Set on soft-delete, null when active |

---

## 📁 Project Structure

```
lostnfound/
├── backend/
│   ├── routes/
│   │   ├── posts.ts           # Post route handlers
│   │   └── auth.ts            # Signup route handler
│   ├── firebase.ts            # Firebase Admin SDK setup
│   ├── server.ts              # Express app entry point
│   ├── .env
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── components/        # Reusable components (Navbar, FloatingCircles, etc.)
│   │   ├── pages/             # Page components (Login, Homepage, Profile, etc.)
│   │   ├── firebase.tsx       # Firebase client config
│   │   └── main.tsx           # App entry point
│   │   └── App.tsx
│   │
│   ├── .env
│   └── package.json
│   └── index.html
│   └── tailwind.config.js
│
│   
└── README.md
```
