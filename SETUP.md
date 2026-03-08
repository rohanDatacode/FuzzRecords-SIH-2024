# 🚀 FuzzRecords — Setup Guide (New System)

Complete step-by-step guide to get FuzzRecords running on any new machine.

---

## ✅ Prerequisites

Make sure you have the following installed before starting:

| Tool | Version | Download |
|------|---------|----------|
| **Node.js** | 18.x or higher | https://nodejs.org |
| **npm** | Comes with Node.js | — |
| **Git** | Latest | https://git-scm.com |
| A modern browser | Chrome / Edge recommended | — |

> **Check if Node.js is installed:**  
> Open terminal and run: `node --version`  
> You should see something like `v18.17.0`

---

## 📦 External Services Required

You need accounts on two cloud services:

### 1. MongoDB Atlas (Free)
- Go to [https://www.mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
- Create a **free account**
- Create a new **cluster** (M0 Free tier)
- Create a **database user** (username + password)
- Go to **Network Access → Add IP Address → Allow Access from Anywhere** (`0.0.0.0/0`)
- Go to **Database → Connect → Drivers** → Copy the **connection string**

### 2. Cloudinary (Free)
- Go to [https://cloudinary.com](https://cloudinary.com)
- Create a **free account**
- From the **Dashboard**, note down:
  - `Cloud Name`
  - `API Key`
  - `API Secret`

---

## 🔧 Step-by-Step Installation

### Step 1 — Clone the Repository

```bash
git clone <your-repo-url>
cd FuzzRecords-main/FuzzRecords_Main
```

Or if you have the ZIP file, extract it and navigate into the `FuzzRecords_Main` folder.

---

### Step 2 — Install Dependencies

```bash
npm install
```

This installs all required packages listed in `package.json`. It may take 1–3 minutes.

---

### Step 3 — Create the `.env` File

Create a file named **`.env`** in the root of the project (`FuzzRecords_Main/`) with the following content:

```env
# MongoDB Atlas connection string
MONGO_URL=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/<dbname>?retryWrites=true&w=majority

# Cloudinary credentials
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_KEY=your_api_key
CLOUDINARY_SECRET=your_api_secret

# Server port (optional, defaults to 3000)
PORT=3000
```

**Replace the placeholders:**
- `<username>` — your MongoDB Atlas username
- `<password>` — your MongoDB Atlas password (URL-encode special characters, e.g. `@` → `%40`)
- `<cluster>` — your cluster address (e.g. `cluster0.abcde.mongodb.net`)
- `<dbname>` — name for your database (e.g. `fuzzrecords`)
- Fill in Cloudinary values from your dashboard

> ⚠️ **Important:** Never commit `.env` to Git. It's already in `.gitignore`.

---

### Step 4 — Verify MongoDB Connection

You can test the connection before starting:

```bash
node test_db.js
```

If successful, you'll see: `MongoDB connected successfully`  
If it fails, double-check your `MONGO_URL` and make sure your IP is whitelisted on Atlas.

---

### Step 5 — Seed Test Data (Optional but Recommended)

To populate the database with sample profiles for testing:

1. Start the server first (Step 6 below)
2. Open your browser and go to:

```
http://localhost:3000/dev/seed
```

This will insert ~27 diverse Indian profiles into the database automatically.

> 🗒️ **Note:** After seeding, this route can be used multiple times safely — it inserts new records each time. Remove it from `app.js` before production deployment.

---

### Step 6 — Start the Server

```bash
node app.js
```

You should see:
```
Server is running on port 3000
MongoDB connected ✅
```

Then open your browser and go to:

```
http://localhost:3000
```

---

## 🗂️ Project Folder Structure

```
FuzzRecords_Main/
├── .env                 ← YOU CREATE THIS (Step 3)
├── app.js               ← Server entry point
├── package.json         ← Dependencies list
├── seedData.js          ← Standalone seed script (alternative)
├── controllers/         ← Business logic
├── models/              ← Database schemas
├── routes/              ← URL routing
├── utils/               ← Algorithms (fuzzy search, soundex, etc.)
├── views/               ← EJS HTML templates
└── public/              ← Static files (CSS, JS, images)
```

---

## 🌐 Available Pages

Once running, visit these URLs:

| URL | Page |
|-----|------|
| `http://localhost:3000` | Dashboard |
| `http://localhost:3000/search` | Fuzzy Search |
| `http://localhost:3000/record/new` | Create New Profile |
| `http://localhost:3000/cases` | Case Management |
| `http://localhost:3000/analytics` | Analytics Dashboard |

---

## 🔍 Testing the Search

1. Go to `http://localhost:3000/search`
2. Try searching for:
   - `Rahul` — returns profiles with name variations (Rahool, Raahul)
   - `Mohammed` — returns Mohammad, Muhammed (phonetic match)
   - `Singh` — returns all profiles with Singh surname
   - Try a partial Hindi name like `राहुल`
3. Each result shows a **% Match** badge indicating relevance

### Voice Search
1. Click the **microphone icon** next to any search field
2. Allow microphone permission in the browser
3. Speak a name clearly
4. The text will auto-fill

---

## ❗ Common Issues & Fixes

| Issue | Fix |
|-------|-----|
| `MongoServerError: bad auth` | Wrong username/password in `MONGO_URL` |
| `MongoNetworkError: connection refused` | IP not whitelisted on Atlas / cluster paused |
| Images not uploading | Check `CLOUDINARY_*` values in `.env` |
| Port already in use | Change `PORT=3001` in `.env` |
| `node: command not found` | Node.js not installed — see Prerequisites |
| Page shows but no data | Run the seed route: `http://localhost:3000/dev/seed` |
| `Cannot find module` | Run `npm install` again |

---

## 🔒 Before Deploying to Production

- [ ] Remove the `/dev/seed` route from `app.js`
- [ ] Set `NODE_ENV=PRODUCTION` in environment
- [ ] Set a strong `session secret` in `app.js`
- [ ] Restrict MongoDB Atlas IP whitelist to your server IP
- [ ] Enable HTTPS

---

## 📞 Tech Support

If you face issues setting up:
1. Check the console output of `node app.js` for error messages
2. Verify `.env` file has no extra spaces or quotes around values
3. Make sure MongoDB Atlas cluster is **not paused** (free tier pauses after inactivity)

---

*FuzzRecords — Built for Smart India Hackathon*
