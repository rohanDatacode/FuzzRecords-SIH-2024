# 🛡️ FuzzRecords — Police Intelligence System

> A bilingual (Hindi/English) criminal records management system with advanced fuzzy search, voice input, and case management capabilities.

---

## 📑 Table of Contents

- [Project Overview](#-project-overview)
- [Core Features](#-core-features)
- [System Architecture](#-system-architecture)
- [User Journey Flowchart](#-user-journey-flowchart)
- [Fuzzy Search Pipeline](#-fuzzy-search-pipeline)
- [Data Model](#-data-model)
- [Technology Stack](#-technology-stack)
- [Module Breakdown](#-module-breakdown)
- [API Endpoints](#-api-endpoints)
- [Setup on a New System](#-setup-on-a-new-system)
- [Environment Variables](#-environment-variables)

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

## 🏗️ System Architecture

```mermaid
graph TB
    subgraph CLIENT["🌐 Client Browser"]
        UI["EJS Templates\n(Tailwind CSS)"]
        JS["Vanilla JavaScript\n+ Web Speech API"]
        CHARTS["Chart.js\nAnalytics"]
    end

    subgraph SERVER["⚙️ Express.js Server (Node.js)"]
        MW["Middleware Layer\n(Helmet · CORS · Compression · Session)"]

        subgraph ROUTES["Routes"]
            R1["/search"]
            R2["/record"]
            R3["/cases"]
            R4["/analytics"]
            R5["/api/*"]
        end

        subgraph CONTROLLERS["Controllers"]
            SC["searchController.js\nFuzzy Search Logic"]
            RC["recordController.js\nProfile CRUD"]
            CC["caseController.js\nCase Management"]
            AC["analyticsController.js"]
        end

        subgraph UTILS["Utilities"]
            LV["levenshtein.js\nEdit Distance"]
            SX["soundex.js\nPhonetic Hash"]
            TR["translator.js\nHindi ↔ English"]
            CL["cloudinary.js\nImage Upload"]
        end
    end

    subgraph STORAGE["☁️ Cloud Services"]
        DB[("MongoDB Atlas\nProfiles · Cases")]
        CDN["Cloudinary\nImages · Documents"]
    end

    UI --> JS
    JS -->|"HTTP Requests"| MW
    MW --> ROUTES
    R1 --> SC
    R2 --> RC
    R3 --> CC
    R4 --> AC
    R5 --> SC & RC
    SC --> LV & SX & TR
    RC --> CL
    CL -->|"Upload"| CDN
    SC & RC & CC & AC -->|"Mongoose ODM"| DB
    DB -->|"Results"| CONTROLLERS
    CONTROLLERS -->|"Rendered HTML"| UI
```

---

## 🗺️ User Journey Flowchart

```mermaid
flowchart TD
    START([👮 Officer Opens FuzzRecords]) --> DASH[Dashboard\nView stats & quick actions]

    DASH --> A{What does\nthe officer want?}

    A -->|Search for person| SEARCH["/search page"]
    A -->|Add new profile| NEW["/record/new"]
    A -->|Manage cases| CASES["/cases"]
    A -->|View analytics| ANALYTICS["/analytics"]

    %% Search Flow
    SEARCH --> SINPUT["Enter name / mobile / Aadhar\nOR use 🎤 Voice Search"]
    SINPUT --> SSUBMIT["Submit Search"]
    SSUBMIT --> FUZZY["Fuzzy Search Engine\nRuns 4 algorithms"]
    FUZZY --> SRESULTS["Results ranked by % Match\nwith Matched-on tags"]
    SRESULTS --> SVIEW{Officer action?}
    SVIEW -->|Click View| PROFILE
    SVIEW -->|Click Edit| EDIT

    %% Profile Flow
    PROFILE["/record/:id\nFull Profile View"] --> PACTION{Action on profile?}
    PACTION -->|Edit| EDIT["/record/:id/edit\nEdit Form"]
    PACTION -->|Link Case| LINKCASE["Link Case Modal\nSearch & attach case"]
    PACTION -->|Delete| CONFIRM["Confirm Delete\nPermanent removal"]
    EDIT --> SUBMIT["Submit PUT Request"]
    SUBMIT -->|Success| PROFILE
    LINKCASE -->|Save| PROFILE

    %% New Profile Flow
    NEW --> FORM["Fill profile form\nName · DOB · Address · Appearance\nAadhar · Mobile · Photo upload"]
    FORM --> PREVIEW["/preview\nReview before save"]
    PREVIEW -->|Confirm| SAVE["Save to MongoDB\nUpload images to Cloudinary"]
    SAVE --> PROFILE

    %% Case Flow
    CASES --> CLIST["List of all cases\nwith status"]
    CLIST --> CDETAIL["Case detail\nLinked profiles"]

    %% Analytics Flow
    ANALYTICS --> CHARTS["Charts: Gender split\nCity distribution\nProfile growth\nCase status"]

    style FUZZY fill:#1e3a5f,color:#93c5fd,stroke:#3b82f6
    style SEARCH fill:#0f172a,color:#60a5fa,stroke:#3b82f6
    style PROFILE fill:#0f172a,color:#60a5fa,stroke:#3b82f6
```

---

## 🧠 Fuzzy Search Pipeline

```mermaid
flowchart LR
    INPUT(["🔍 User Input\ne.g. Rahool Sharma"]) --> STEP1

    subgraph STEP1["Step 1 — Transliteration"]
        T1["Convert English → Hindi\nRahool → राहुल"]
        T2["Convert Hindi → English\nराहुल → Rahul"]
    end

    subgraph STEP2["Step 2 — Soundex Encoding"]
        S1["Encode query\nRahool → R400"]
        S2["Encode each DB name\nRahul → R400\nMohammed → M530"]
    end

    subgraph STEP3["Step 3 — Levenshtein Distance"]
        L1["Calculate edit distance\nRahool vs Rahul = 1\nRahool vs Ravi = 4"]
        L2["Score = 1 - dist / maxLen\n= 1 - 1/6 = 83%"]
    end

    subgraph STEP4["Step 4 — Substring Match"]
        P1["Does query appear\nwithin full name?"]
        P2["Partial name bonus\nif contained"]
    end

    subgraph STEP5["Step 5 — Score Aggregation"]
        AG["Combine all field scores\nFirst + Middle + Last + City\nWeighted average"]
    end

    STEP1 --> STEP2
    STEP2 --> STEP3
    STEP3 --> STEP4
    STEP4 --> STEP5

    STEP5 --> FILTER{"Score ≥\nthreshold?"}
    FILTER -->|Yes| RANK["Rank results\nhighest score first"]
    FILTER -->|No| DROP["❌ Discard"]
    RANK --> OUTPUT(["📋 Results with\n% Match badge"])

    style STEP1 fill:#1e3a5f,stroke:#3b82f6,color:#93c5fd
    style STEP2 fill:#1e3a5f,stroke:#3b82f6,color:#93c5fd
    style STEP3 fill:#1e3a5f,stroke:#3b82f6,color:#93c5fd
    style STEP4 fill:#1e3a5f,stroke:#3b82f6,color:#93c5fd
    style STEP5 fill:#312e81,stroke:#6366f1,color:#c7d2fe
    style OUTPUT fill:#14532d,stroke:#22c55e,color:#86efac
    style DROP fill:#7f1d1d,stroke:#ef4444,color:#fca5a5
```

### Match Percentage Formula

```
matchPercentage = ((maxLength − levenshteinDistance) / maxLength) × 100
```

**Example:**
- Query: `Rahool` (6 chars)
- DB record: `Rahul` (5 chars)
- Levenshtein distance: `1`
- maxLength: `6`
- Score: `(6 − 1) / 6 × 100 = 83.3%`

---

## 🗃️ Data Model

```mermaid
erDiagram
    PROFILE {
        number id PK
        string firstNameEnglish
        string firstNameHindi
        string middleNameEnglish
        string lastNameEnglish
        string lastNameHindi
        string gender
        date   dob
        string occupationEnglish
        string occupationHindi
        string mNumber
        string aadharNumber
        string firstNameSoundex
        string lastNameSoundex
    }

    ADDRESS {
        string locationEnglish
        string locationHindi
        string cityEnglish
        string cityHindi
        string districtEnglish
        string stateEnglish
        string stateHindi
    }

    APPEARANCE {
        number height
        number weight
        string complexion
        string build
    }

    IMAGE {
        string url
        string publicId
        string type
    }

    FAMILY_MEMBER {
        string nameEnglish
        string relation
        string contact
    }

    CASE {
        number id PK
        string caseNumber
        string title
        string description
        string status
        date   filedDate
        string officerName
    }

    PROFILE ||--|| ADDRESS : "has"
    PROFILE ||--|| APPEARANCE : "has"
    PROFILE ||--o{ IMAGE : "has"
    PROFILE ||--o{ FAMILY_MEMBER : "has"
    PROFILE }o--o{ CASE : "linked to"
```

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

### Search Algorithms
| Algorithm | File | Purpose |
|-----------|------|---------|
| **Levenshtein Distance** | `utils/levenshtein.js` | Edit distance — handles typos |
| **Soundex** | `utils/soundex.js` | Phonetic matching — handles pronunciation variants |
| **Transliteration** | `utils/translator.js` | Hindi ↔ English script conversion |
| **Substring Match** | `searchController.js` | Partial name matching |

### Database & Storage
| Service | Purpose |
|---------|---------|
| **MongoDB Atlas** | Cloud database for all profiles and cases |
| **Cloudinary** | Profile photo & document image hosting |

### Frontend
| Technology | Role |
|------------|------|
| **Tailwind CSS** (CDN) | Utility-first styling |
| **Vanilla JavaScript** | Search, voice input, dynamic UI |
| **Web Speech API** | Browser-native voice recognition |
| **Chart.js** | Analytics dashboard charts |

---

## 📦 Module Breakdown

### `utils/levenshtein.js`
Custom Unicode-aware Levenshtein Distance calculator. Uses dynamic programming with proper multi-byte character handling so Hindi characters (2–3 byte Unicode) are treated as single units, not broken bytes.

### `utils/soundex.js`
Custom Soundex encoder adapted for Indian names. Groups phonetically similar consonants into codes so *Mohammad*, *Mohammed*, *Muhammed* all produce `M530`.

### `utils/translator.js`
Bidirectional transliteration between Devanagari and Roman scripts. Allows searching Hindi names in English and vice versa.

### `controllers/searchController.js`
The core of FuzzRecords. For each query it: transliterates → generates Soundex → scores all profiles across all fields → filters by threshold → sorts by score → returns results with match metadata.

---

## 🔌 API Endpoints

### Profile Routes
| Method | URL | Description |
|--------|-----|-------------|
| `GET` | `/record/new` | New profile form |
| `POST` | `/record` | Create profile |
| `GET` | `/record/:id` | View profile |
| `GET` | `/record/:id/edit` | Edit form |
| `PUT` | `/record/:id` | Update profile |
| `DELETE` | `/record/:id` | Delete profile |

### Search & Case Routes
| Method | URL | Description |
|--------|-----|-------------|
| `GET/POST` | `/search` | Fuzzy search |
| `GET` | `/cases` | All cases |
| `POST` | `/record/:id/link-case` | Link case to profile |

### REST API
| Method | URL | Description |
|--------|-----|-------------|
| `GET` | `/api/profiles` | JSON profiles list |
| `GET` | `/api/cases` | JSON cases list |
| `GET` | `/api/suggestions?q=` | Typeahead suggestions |

---

## 💻 Setup on a New System

> See [`SETUP.md`](./SETUP.md) for the complete step-by-step guide.

```bash
git clone <repo-url>
cd FuzzRecords_Main
npm install
# Create .env with MONGO_URL and CLOUDINARY keys
node app.js
# Open http://localhost:3000
```

---

## 🔐 Environment Variables

| Variable | Description |
|----------|-------------|
| `MONGO_URL` | MongoDB Atlas connection string |
| `CLOUDINARY_CLOUD_NAME` | Cloudinary cloud name |
| `CLOUDINARY_KEY` | Cloudinary API key |
| `CLOUDINARY_SECRET` | Cloudinary API secret |
| `PORT` | Server port (default: 3000) |

---

*Built for Smart India Hackathon — Police Record Management Track*


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
