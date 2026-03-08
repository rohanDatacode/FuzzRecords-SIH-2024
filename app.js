if (process.env.NODE_ENV != "PRODUCTION") {
    require('dotenv').config();
}

const express = require('express');
const app = express();
const path = require("path");
const mongoose = require('mongoose');
const ejsMate = require("ejs-mate");
const methodOverride = require("method-override");
const session = require('express-session');
const flash = require('connect-flash');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');

// Import routes
const apiProfileRoutes = require('./routes/api/profiles');
const apiCaseRoutes = require('./routes/api/cases');
const newRecord = require('./routes/newRecord');
const searchRecord = require('./routes/searchRecord');
const dashboardRoute = require('./routes/dashboard');
const recordRoutes = require('./routes/recordRoutes');
const suggestionRoutes = require('./routes/suggestionRoutes');
const caseRoutes = require('./routes/cases');
const analyticsRoutes = require('./routes/analytics');
const guidelinesRoutes = require('./routes/guidelines');

// Security middleware
app.use(helmet({
    contentSecurityPolicy: false,
    crossOriginEmbedderPolicy: false
}));

// Enable CORS
app.use(cors());

// Enable compression
app.use(compression());

// View engine setup
app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "public")));

// Session configuration
app.use(session({
    secret: 'your-secret-key',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false } // set to true if using https
}));

// Flash messages
app.use(flash());

// Global middleware
app.use((req, res, next) => {
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    res.locals.currentUser = req.session.user;
    next();
});

// Add this before your routes
app.use((req, res, next) => {
    // Add helper method to send JSON responses
    res.sendJsonResponse = function (data, status = 200) {
        res.setHeader('Content-Type', 'application/json');
        return res.status(status).json(data);
    };
    next();
});

// Add middleware to set path for all routes (Move this BEFORE routes)
app.use((req, res, next) => {
    res.locals.path = req.path;
    next();
});

// API Routes
app.use('/api/cases', apiCaseRoutes);
app.use('/api/profiles', apiProfileRoutes);
app.use('/api/suggestions', suggestionRoutes);

// ── TEMP SEED ROUTE ─────────────────────────────────────────────────────────
app.get('/dev/seed', async (req, res) => {
    const Profile = require('./models/profileSchema');
    const { getSoundex } = require('./utils/soundex');
    const sx = n => n ? getSoundex(n, false, false) : undefined;
    const rp = () => ['98', '97', '96', '95', '94', '90', '88', '87', '86', '85', '70'][Math.floor(Math.random() * 11)] + String(Math.floor(10000000 + Math.random() * 89999999));
    const ra = () => String(Math.floor(100000000000 + Math.random() * 899999999999));
    const rd = (min, max) => { const y = new Date().getFullYear() - Math.floor(Math.random() * (max - min) + min), m = Math.floor(Math.random() * 12) + 1, d = Math.floor(Math.random() * 28) + 1; return new Date(`${y}-${String(m).padStart(2, '0')}-${String(d).padStart(2, '0')}`); };
    const data = [
        { fn: 'Rahul', fnh: 'राहुल', mn: 'Kumar', ln: 'Sharma', lnh: 'शर्मा', g: 'male', dob: rd(25, 35), occ: 'Teacher', ph: rp(), city: 'Delhi', dist: 'New Delhi', state: 'Delhi', h: 172, w: 68, c: 'medium', b: 'average' },
        { fn: 'Rahool', fnh: 'राहुल', ln: 'Verma', lnh: 'वर्मा', g: 'male', dob: rd(20, 30), occ: 'Engineer', ph: rp(), city: 'Lucknow', dist: 'Lucknow', state: 'Uttar Pradesh', h: 175, w: 72, c: 'dark', b: 'slim' },
        { fn: 'Raahul', fnh: 'राहुल', ln: 'Yadav', lnh: 'यादव', g: 'male', dob: rd(28, 40), occ: 'Driver', ph: rp(), city: 'Kanpur', dist: 'Kanpur', state: 'Uttar Pradesh', h: 168, w: 75, c: 'dark', b: 'heavy' },
        { fn: 'Priya', fnh: 'प्रिया', ln: 'Patel', lnh: 'पटेल', g: 'female', dob: rd(20, 32), occ: 'Nurse', ph: rp(), city: 'Surat', dist: 'Surat', state: 'Gujarat', h: 158, w: 55, c: 'fair', b: 'slim' },
        { fn: 'Priyaa', fnh: 'प्रिया', ln: 'Shah', lnh: 'शाह', g: 'female', dob: rd(18, 28), occ: 'Student', ph: rp(), city: 'Ahmedabad', dist: 'Ahmedabad', state: 'Gujarat', h: 162, w: 52, c: 'fair', b: 'slim' },
        { fn: 'Mohammed', fnh: 'मोहम्मद', mn: 'Ali', ln: 'Khan', lnh: 'खान', g: 'male', dob: rd(30, 50), occ: 'Businessman', ph: rp(), city: 'Hyderabad', dist: 'Hyderabad', state: 'Telangana', h: 170, w: 80, c: 'medium', b: 'heavy' },
        { fn: 'Mohammad', fnh: 'मोहम्मद', ln: 'Hussain', lnh: 'हुसैन', g: 'male', dob: rd(22, 35), occ: 'Mechanic', ph: rp(), city: 'Pune', dist: 'Pune', state: 'Maharashtra', h: 166, w: 70, c: 'dark', b: 'average' },
        { fn: 'Muhammed', fnh: 'मोहम्मद', ln: 'Sheikh', lnh: 'शेख', g: 'male', dob: rd(35, 55), occ: 'Tailor', ph: rp(), city: 'Mumbai', dist: 'Mumbai', state: 'Maharashtra', h: 163, w: 65, c: 'dark', b: 'slim' },
        { fn: 'Gurpreet', fnh: 'गुरप्रीत', ln: 'Singh', lnh: 'सिंह', g: 'male', dob: rd(25, 45), occ: 'Police Officer', ph: rp(), city: 'Amritsar', dist: 'Amritsar', state: 'Punjab', h: 180, w: 85, c: 'medium', b: 'athletic' },
        { fn: 'Harpreet', fnh: 'हरप्रीत', ln: 'Singh', lnh: 'सिंह', g: 'female', dob: rd(20, 35), occ: 'Shopkeeper', ph: rp(), city: 'Ludhiana', dist: 'Ludhiana', state: 'Punjab', h: 163, w: 60, c: 'fair', b: 'average' },
        { fn: 'Manpreet', fnh: 'मनप्रीत', ln: 'Singh', lnh: 'सिंह', g: 'male', dob: rd(30, 48), occ: 'Farmer', ph: rp(), city: 'Jalandhar', dist: 'Jalandhar', state: 'Punjab', h: 176, w: 78, c: 'medium', b: 'heavy' },
        { fn: 'Venkatesh', fnh: 'वेंकटेश', ln: 'Reddy', lnh: 'रेड्डी', g: 'male', dob: rd(28, 45), occ: 'Software Engineer', ph: rp(), city: 'Bengaluru', dist: 'Bangalore Urban', state: 'Karnataka', h: 170, w: 68, c: 'dark', b: 'average' },
        { fn: 'Lakshmi', fnh: 'लक्ष्मी', ln: 'Nair', lnh: 'नायर', g: 'female', dob: rd(22, 40), occ: 'Doctor', ph: rp(), city: 'Kochi', dist: 'Ernakulam', state: 'Kerala', h: 155, w: 50, c: 'medium', b: 'slim' },
        { fn: 'Arjun', fnh: 'अर्जुन', ln: 'Pillai', lnh: 'पिल्लई', g: 'male', dob: rd(19, 30), occ: 'Student', ph: rp(), city: 'Chennai', dist: 'Chennai', state: 'Tamil Nadu', h: 173, w: 62, c: 'dark', b: 'slim' },
        { fn: 'Ramesh', fnh: 'रमेश', ln: 'Meena', lnh: 'मीना', g: 'male', dob: rd(35, 55), occ: 'Labourer', ph: rp(), city: 'Jaipur', dist: 'Jaipur', state: 'Rajasthan', h: 165, w: 70, c: 'dark', b: 'average' },
        { fn: 'Ramesh', fnh: 'रमेश', ln: 'Gupta', lnh: 'गुप्ता', g: 'male', dob: rd(40, 60), occ: 'Shopkeeper', ph: rp(), city: 'Jodhpur', dist: 'Jodhpur', state: 'Rajasthan', h: 168, w: 75, c: 'medium', b: 'heavy' },
        { fn: 'Sunita', fnh: 'सुनीता', ln: 'Joshi', lnh: 'जोशी', g: 'female', dob: rd(28, 45), occ: 'Housewife', ph: rp(), city: 'Udaipur', dist: 'Udaipur', state: 'Rajasthan', h: 157, w: 58, c: 'fair', b: 'average' },
        { fn: 'Ranjit', fnh: 'रंजीत', ln: 'Kumar', lnh: 'कुमार', g: 'male', dob: rd(22, 38), occ: 'Electrician', ph: rp(), city: 'Patna', dist: 'Patna', state: 'Bihar', h: 169, w: 63, c: 'dark', b: 'slim' },
        { fn: 'Sanjay', fnh: 'संजय', ln: 'Prasad', lnh: 'प्रसाद', g: 'male', dob: rd(30, 50), occ: 'Auto Driver', ph: rp(), city: 'Ranchi', dist: 'Ranchi', state: 'Jharkhand', h: 166, w: 72, c: 'dark', b: 'average' },
        { fn: 'Anjali', fnh: 'अंजलि', ln: 'Kumari', lnh: 'कुमारी', g: 'female', dob: rd(18, 28), occ: 'Student', ph: rp(), city: 'Dhanbad', dist: 'Dhanbad', state: 'Jharkhand', h: 160, w: 50, c: 'medium', b: 'slim' },
        { fn: 'Sourav', fnh: 'सौरव', ln: 'Banerjee', lnh: 'बनर्जी', g: 'male', dob: rd(25, 40), occ: 'Accountant', ph: rp(), city: 'Kolkata', dist: 'Kolkata', state: 'West Bengal', h: 174, w: 70, c: 'fair', b: 'average' },
        { fn: 'Suresh', fnh: 'सुरेश', ln: 'Sharma', lnh: 'शर्मा', g: 'male', dob: rd(45, 65), occ: 'Retired', ph: rp(), city: 'Agra', dist: 'Agra', state: 'Uttar Pradesh', h: 167, w: 80, c: 'medium', b: 'heavy' },
        { fn: 'Suresh', fnh: 'सुरेश', ln: 'Yadav', lnh: 'यादव', g: 'male', dob: rd(28, 45), occ: 'Contractor', ph: rp(), city: 'Varanasi', dist: 'Varanasi', state: 'Uttar Pradesh', h: 170, w: 77, c: 'dark', b: 'heavy' },
        { fn: 'Nisha', fnh: 'निशा', ln: 'Singh', lnh: 'सिंह', g: 'female', dob: rd(20, 35), occ: 'Beautician', ph: rp(), city: 'Bhopal', dist: 'Bhopal', state: 'Madhya Pradesh', h: 161, w: 54, c: 'fair', b: 'slim' },
        { fn: 'Vikram', fnh: 'विक्रम', ln: 'Chauhan', lnh: 'चौहान', g: 'male', dob: rd(30, 48), occ: 'Security Guard', ph: rp(), city: 'Indore', dist: 'Indore', state: 'Madhya Pradesh', h: 178, w: 82, c: 'medium', b: 'athletic' },
        { fn: 'Deepak', fnh: 'दीपक', ln: 'Tiwari', lnh: 'तिवारी', g: 'male', dob: rd(25, 42), occ: 'Journalist', ph: rp(), city: 'Allahabad', dist: 'Prayagraj', state: 'Uttar Pradesh', h: 171, w: 65, c: 'fair', b: 'slim' },
        { fn: 'Kavita', fnh: 'कविता', ln: 'Dubey', lnh: 'दुबे', g: 'female', dob: rd(30, 50), occ: 'Nurse', ph: rp(), city: 'Nagpur', dist: 'Nagpur', state: 'Maharashtra', h: 159, w: 57, c: 'medium', b: 'average' },
    ];
    let inserted = 0, skipped = 0;
    for (const d of data) {
        try {
            await Profile.create({
                firstNameEnglish: d.fn, firstNameHindi: d.fnh,
                middleNameEnglish: d.mn || undefined,
                lastNameEnglish: d.ln, lastNameHindi: d.lnh,
                gender: d.g, dob: d.dob,
                occupationEnglish: d.occ,
                mNumber: d.ph, aadharNumber: ra(),
                address: { cityEnglish: d.city, districtEnglish: d.dist, stateEnglish: d.state, locationEnglish: 'Test Location' },
                appearance: { height: d.h, weight: d.w, complexion: d.c, build: d.b },
                soundexCode: { firstName: sx(d.fn), middleName: sx(d.mn), lastName: sx(d.ln) }
            });
            inserted++;
        } catch (e) { skipped++; }
    }
    res.json({ message: `Seeded! Inserted: ${inserted}, Skipped: ${skipped}` });
});
// ── END TEMP SEED ROUTE ──────────────────────────────────────────────────────

// Web Routes
app.use("/", dashboardRoute);
app.use("/search", searchRecord);
app.use("/newrecord", newRecord);
app.use("/record", recordRoutes);
app.use('/cases', caseRoutes);
app.use('/analytics', analyticsRoutes);
app.use('/guidelines', guidelinesRoutes);

// 404 handler
app.use((req, res) => {
    res.status(404).render('404');
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Error:', err);

    // Check if request expects JSON
    if (req.xhr || req.headers.accept.includes('application/json')) {
        res.setHeader('Content-Type', 'application/json');
        return res.status(500).json({
            success: false,
            error: err.message || 'Internal server error'
        });
    }

    // For non-JSON requests
    req.flash('error', err.message || 'Something went wrong');
    res.redirect('back');
});

// Database connection
const dbURL = process.env.MONGO_URL;
mongoose.connect(dbURL)
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('MongoDB connection error:', err));

// Server startup
const startServer = (port) => {
    try {
        app.listen(port, () => {
            console.log(`Server running on port:${port}`);
        }).on('error', (err) => {
            if (err.code === 'EADDRINUSE') {
                console.log(`Port ${port} is busy, trying ${port + 1}`);
                startServer(port + 1);
            } else {
                console.error(err);
            }
        });
    } catch (err) {
        console.error('Error starting server:', err);
    }
};

const initialPort = process.env.PORT || 3000;
startServer(initialPort);