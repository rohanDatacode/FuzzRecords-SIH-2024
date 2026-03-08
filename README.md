# 🛡️ FuzzRecords — Police Intelligence System

> A bilingual (Hindi/English) criminal records management system with advanced fuzzy search, voice input, and case management capabilities.

---

## 📑 Table of Contents

- [Project Overview](#-project-overview)
- [Core Features](#-core-features)
- [Technology Stack](#-technology-stack)
- [How the Fuzzy Search Works](#-how-the-fuzzy-search-works)
- [System Architecture](#-system-architecture)
- [Module Breakdown](#-module-breakdown)
- [API Endpoints](#-api-endpoints)
- [Setup on a New System](#-setup-on-a-new-system)
- [Environment Variables](#-environment-variables)
- [Screenshots](#-screenshots)

---

## 🎯 Project Overview

**FuzzRecords** is a full-stack web application designed for law enforcement agencies to manage criminal and suspect profiles. The key innovation is its **highly accurate fuzzy search** — it finds records even when names are misspelled, entered in different scripts (Hindi/English), or phonetically similar.

### The Problem It Solves

Traditional police databases require **exact name matches** to find records. This fails when:
- Names are transliterated differently (e.g., *Mohammed* vs *Mohammad* vs *Muhammed*)
- Officers are unsure of spelling
- Records were entered in Hindi, but searched in English
- Regional pronunciation differences cause spelling variation

FuzzRecords solves this with a **multi-algorithm search pipeline** that combines Levenshtein Distance, Soundex phonetics, and bilingual transliteration.

---

## 🚀 Core Features

| Feature | Description |
|---------|-------------|
| **Fuzzy Name Search** | Finds profiles despite typos, alternate spellings, or transliteration differences |
| **Bilingual Support** | Search and store data in both English and Hindi (Devanagari) |
| **Voice Search** | Speak a name using the browser's Web Speech API — works in Hindi too |
| **Match Percentage** | Every result shows a `% Match` score so officers can judge relevance |
| **Profile Management** | Create, view, edit, and delete complete suspect/criminal profiles |
| **Case Linking** | Link multiple investigation cases to a single profile |
| **Physical Description** | Record height, weight, complexion, and build for identification |
| **Photo & ID Upload** | Upload profile photos and identity documents (stored on Cloudinary) |
| **Analytics Dashboard** | Visual overview of database statistics — profiles, cases, demographics |
| **Search Suggestions API** | Typeahead suggestions as you type |

---

## 🛠️ Technology Stack

### Backend
| Technology | Version | Role |
|------------|---------|------|
| **Node.js** | 18+ | Runtime environment |
| **Express.js** | 4.21 | Web framework |
| **Mongoose** | 6.x | MongoDB ODM |
| **EJS + ejs-mate** | 4.x | Server-side templating with layouts |
| **Multer** | 1.4.5 | File upload handling |
| **Helmet** | 8.x | HTTP security headers |
| **Compression** | 1.7 | Gzip response compression |
| **method-override** | 3.x | PUT/DELETE via HTML forms |
| **connect-flash** | 0.1 | Flash messages |

### Search Algorithms
| Algorithm | Library/Custom | Purpose |
|-----------|---------------|---------|
| **Levenshtein Distance** | Custom (`utils/levenshtein.js`) | Edit distance between strings |
| **Soundex** | Custom (`utils/soundex.js`) | Phonetic matching |
| **Transliteration** | `transliteration` + `@indic-transliteration` | Hindi ↔ English conversion |
| **Natural NLP** | `natural` | Additional text processing |

### Database & Storage
| Service | Purpose |
|---------|---------|
| **MongoDB Atlas** | Cloud database for all profiles and cases |
| **Cloudinary** | Profile photo & document image hosting |

### Frontend
| Technology | Role |
|------------|------|
| **Tailwind CSS** (CDN) | Utility-first styling |
| **Vanilla JavaScript** | Search, voice input, dynamic family members |
| **Web Speech API** | Browser-native voice recognition |
| **Chart.js** | Analytics dashboard charts |

---

## 🧠 How the Fuzzy Search Works

The search pipeline runs **4 parallel algorithms** and combines the scores:

```
User Input (e.g., "Rahool Sharma")
         │
         ▼
┌─────────────────────────────────────────┐
│  1. TRANSLITERATION                    │
│     "Rahool" → "राहुल" (Hindi)         │
│     Searches both English & Hindi names │
└──────────────┬──────────────────────────┘
               │
               ▼
┌─────────────────────────────────────────┐
│  2. LEVENSHTEIN DISTANCE               │
│     "Rahool" vs "Rahul" → distance: 1  │
│     Match Score = (1 - dist/maxLen)×100│
│     → 83% match                        │
└──────────────┬──────────────────────────┘
               │
               ▼
┌─────────────────────────────────────────┐
│  3. SOUNDEX PHONETIC MATCHING          │
│     "Rahool" → R400                    │
│     "Rahul"  → R400  ✅ Same code!     │
│     Phonetic bonus added to score       │
└──────────────┬──────────────────────────┘
               │
               ▼
┌─────────────────────────────────────────┐
│  4. SUBSTRING / PARTIAL MATCH          │
│     Checks if query appears within     │
│     any part of the full name          │
└──────────────┬──────────────────────────┘
               │
               ▼
         Combined Score
    Sorted by relevance (highest first)
         Displayed with % badge
```

### Match Percentage Formula
```
matchPercentage = ((maxLength - levenshteinDistance) / maxLength) × 100
```

### Searchable Fields
- First Name (English + Hindi)
- Middle Name (English + Hindi)
- Last Name (English + Hindi)
- Mobile Number (exact)
- Aadhar Number (exact)
- City / State / District

---

## 🏗️ System Architecture

```
FuzzRecords/
├── app.js                  # Express server entry point
├── models/
│   ├── profileSchema.js    # Mongoose schema for suspect profiles
│   └── caseSchema.js       # Mongoose schema for cases
├── controllers/
│   ├── searchController.js # Core fuzzy search logic
│   ├── recordController.js # Profile CRUD operations
│   ├── caseController.js   # Case management
│   └── analyticsController.js
├── routes/
│   ├── searchRecord.js     # Search routes
│   ├── recordRoutes.js     # Profile routes
│   ├── cases.js            # Case routes
│   ├── analytics.js        # Analytics routes
│   └── api/                # REST API routes
├── utils/
│   ├── levenshtein.js      # Edit distance algorithm
│   ├── soundex.js          # Phonetic hashing
│   ├── translator.js       # Hindi-English transliteration
│   └── cloudinary.js       # Image upload config
├── views/
│   ├── layout/             # Page layout template
│   └── records/            # EJS templates (search, view, edit, new)
└── public/
    ├── js/                 # Client-side scripts
    └── css/                # Stylesheets
```

---

## 📦 Module Breakdown

### `utils/levenshtein.js`
Custom Unicode-aware Levenshtein Distance calculator. Uses dynamic programming with proper multi-byte character handling so Hindi characters (2-3 byte Unicode) are treated as single units.

### `utils/soundex.js`
Custom Soundex encoder adapted for Indian names. Groups phonetically similar consonants into codes (e.g., *Mohammad*, *Mohammed*, *Muhammed* all produce `M530`).

### `utils/translator.js`
Bidirectional transliteration between Devanagari (Hindi) and Roman (English) scripts using `@indic-transliteration/sanscript`. Allows searching Hindi names with English input and vice versa.

### `controllers/searchController.js`
The beating heart of FuzzRecords. For each search query it:
1. Transliterates the query to both Hindi and English forms
2. Generates Soundex code for the query
3. Retrieves all profiles from MongoDB
4. Runs match scoring against each profile across all fields
5. Filters results above a minimum threshold
6. Sorts by combined score descending
7. Returns paginated results with match metadata

---

## 🔌 API Endpoints

### Profile Routes
| Method | URL | Description |
|--------|-----|-------------|
| `GET` | `/record/new` | New profile form |
| `POST` | `/record` | Create profile |
| `GET` | `/record/:id` | View profile |
| `GET` | `/record/:id/edit` | Edit profile form |
| `PUT` | `/record/:id` | Update profile |
| `DELETE` | `/record/:id` | Delete profile |

### Search Routes
| Method | URL | Description |
|--------|-----|-------------|
| `GET` | `/search` | Search page |
| `POST` | `/search` | Execute fuzzy search |

### Case Routes
| Method | URL | Description |
|--------|-----|-------------|
| `GET` | `/cases` | All cases |
| `POST` | `/record/:id/link-case` | Link a case to profile |

### REST API
| Method | URL | Description |
|--------|-----|-------------|
| `GET` | `/api/profiles` | JSON list of all profiles |
| `GET` | `/api/cases` | JSON list of all cases |
| `GET` | `/api/suggestions?q=` | Search suggestions for typeahead |

---

## 💻 Setup on a New System

> See [`SETUP.md`](./SETUP.md) for detailed step-by-step installation instructions.

### Quick Start
```bash
git clone <repo-url>
cd FuzzRecords_Main
npm install
# Configure .env (see SETUP.md)
node app.js
# Open http://localhost:3000
```

---

## 🔐 Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `MONGO_URL` | MongoDB Atlas connection string | `mongodb+srv://user:pass@cluster.mongodb.net/dbname` |
| `CLOUDINARY_CLOUD_NAME` | Cloudinary cloud name | `my-cloud` |
| `CLOUDINARY_KEY` | Cloudinary API key | `123456789012345` |
| `CLOUDINARY_SECRET` | Cloudinary API secret | `abc123...` |
| `PORT` | Server port (optional) | `3000` |

---

## 📸 Screenshots

| Page | Description |
|------|-------------|
| Dashboard | System overview with stats, quick actions |
| Search | Fuzzy search with match percentages and bilingual results |
| Profile View | Full profile with all sections and linked cases |
| Edit Profile | Dark-themed form for updating records |
| Analytics | Charts showing database trends |

---

*Built for Smart India Hackathon — Police Record Management Track*
