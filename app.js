require("dotenv").config();
const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const ejsMate = require("ejs-mate");
const methodOverride = require("method-override");
const session = require("express-session");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");

// Models & Middleware
const User = require("./models/userSchema");
const { storeReturnTo, isLoggedIn } = require('./middleware/auth');

// Routes
const dashboardRoute = require("./routes/dashboard");
const recordRoutes = require("./routes/recordRoutes");
const newRecord = require("./routes/newRecord");
const searchRecord = require("./routes/searchRecord");
const faceSearchRoute = require("./routes/faceSearch");

const app = express();

// 1. Database
mongoose.connect(process.env.MONGO_URL)
    .then(() => console.log("✅ Database Linked"))
    .catch(err => console.log("❌ DB Error:", err));

// 2. Settings
app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride("_method"));

// 3. Session (Crucial for staying logged in)
const sessionConfig = {
    name: 'session',
    secret: 'thisshouldbeabettersecret!',
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        expires: Date.now() + 1000 * 60 * 60 * 24, // 1 Day
        maxAge: 1000 * 60 * 60 * 24
    }
};
app.use(session(sessionConfig));
app.use(flash());

// 4. Passport (Must be after session)
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// 5. Cache Control
app.use((req, res, next) => {
    res.set('Cache-Control', 'no-cache, private, no-store, must-revalidate');
    next();
});

// 6. Global Variables
app.use((req, res, next) => {
    res.locals.currentUser = req.user; // If logged in, this has user data
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    next();
});

// 7. Auth Routes
app.get('/login', (req, res) => res.render('users/login'));
app.get('/register', (req, res) => res.render('users/register'));

app.post('/register', async (req, res, next) => {
    try {
        const { email, username, password, role } = req.body;
        const user = new User({ email, username, role });
        const registeredUser = await User.register(user, password);
        req.login(registeredUser, err => {
            if (err) return next(err);
            req.flash('success', 'Account Created Successfully');
            res.redirect('/');
        });
    } catch (e) {
        req.flash('error', e.message);
        res.redirect('register');
    }
});

app.post('/login', storeReturnTo, passport.authenticate('local', { failureFlash: true, failureRedirect: '/login' }), (req, res) => {
    req.flash('success', 'Welcome Back');
    const redirectUrl = res.locals.returnTo || '/';
    res.redirect(redirectUrl);
});

app.get('/logout', (req, res, next) => {
    req.logout(err => {
        if (err) return next(err);
        req.flash('success', 'Logged Out');
        res.redirect('/login');
    });
});

// 8. App Routes
app.use("/", dashboardRoute); 
app.use("/newrecord", isLoggedIn, newRecord);
app.use("/record", isLoggedIn, recordRoutes);
app.use("/search", isLoggedIn, searchRecord);
app.use("/face-search", isLoggedIn, faceSearchRoute);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Server on ${PORT}`));