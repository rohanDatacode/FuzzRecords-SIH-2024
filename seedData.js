/**
 * FuzzRecords - Test Data Seed Script
 * Run: node seedData.js
 * Inserts 30 realistic Indian profiles for testing fuzzy search.
 */

require('dotenv').config();
const mongoose = require('mongoose');
const Profile = require('./models/profileSchema');
const { getSoundex } = require('./utils/soundex');

const MONGO_URL = process.env.MONGO_URL;

// ─── Helper ──────────────────────────────────────────────────────────────────
function soundex(name) {
    return getSoundex(name, false, false);
}

function randomFrom(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
}

function randomAadhar() {
    return String(Math.floor(100000000000 + Math.random() * 899999999999));
}

function randomPhone() {
    const prefixes = ['98', '97', '96', '95', '94', '93', '92', '91', '90', '89', '88', '87', '86', '85', '84', '83', '82', '81', '80', '70'];
    return randomFrom(prefixes) + String(Math.floor(10000000 + Math.random() * 89999999));
}

function randomDob(minAge, maxAge) {
    const year = new Date().getFullYear() - Math.floor(Math.random() * (maxAge - minAge) + minAge);
    const month = Math.floor(Math.random() * 12) + 1;
    const day = Math.floor(Math.random() * 28) + 1;
    return new Date(`${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`);
}

// ─── Data ─────────────────────────────────────────────────────────────────────
const profiles = [
    // Group 1: Similar sounding "Rahul" variants – tests soundex + fuzzy
    {
        firstNameEnglish: 'Rahul', firstNameHindi: 'राहुल',
        middleNameEnglish: 'Kumar', middleNameHindi: 'कुमार',
        lastNameEnglish: 'Sharma', lastNameHindi: 'शर्मा',
        gender: 'male', dob: randomDob(25, 35),
        occupationEnglish: 'Teacher', occupationHindi: 'शिक्षक',
        mNumber: randomPhone(), aadharNumber: randomAadhar(),
        address: { cityEnglish: 'Delhi', districtEnglish: 'New Delhi', stateEnglish: 'Delhi', locationEnglish: 'Karol Bagh' },
        appearance: { height: 172, weight: 68, complexion: 'medium', build: 'average' }
    },
    {
        firstNameEnglish: 'Rahool', firstNameHindi: 'राहुल',
        middleNameEnglish: 'Singh', middleNameHindi: 'सिंह',
        lastNameEnglish: 'Verma', lastNameHindi: 'वर्मा',
        gender: 'male', dob: randomDob(20, 30),
        occupationEnglish: 'Engineer', occupationHindi: 'इंजीनियर',
        mNumber: randomPhone(), aadharNumber: randomAadhar(),
        address: { cityEnglish: 'Lucknow', districtEnglish: 'Lucknow', stateEnglish: 'Uttar Pradesh', locationEnglish: 'Hazratganj' },
        appearance: { height: 175, weight: 72, complexion: 'dark', build: 'slim' }
    },
    {
        firstNameEnglish: 'Raahul', firstNameHindi: 'राहुल',
        lastNameEnglish: 'Yadav', lastNameHindi: 'यादव',
        gender: 'male', dob: randomDob(28, 40),
        occupationEnglish: 'Driver', occupationHindi: 'चालक',
        mNumber: randomPhone(), aadharNumber: randomAadhar(),
        address: { cityEnglish: 'Kanpur', districtEnglish: 'Kanpur', stateEnglish: 'Uttar Pradesh', locationEnglish: 'Kidwai Nagar' },
        appearance: { height: 168, weight: 75, complexion: 'dark', build: 'heavy' }
    },

    // Group 2: Similar sounding "Priya" variants
    {
        firstNameEnglish: 'Priya', firstNameHindi: 'प्रिया',
        lastNameEnglish: 'Patel', lastNameHindi: 'पटेल',
        gender: 'female', dob: randomDob(20, 32),
        occupationEnglish: 'Nurse', occupationHindi: 'नर्स',
        mNumber: randomPhone(), aadharNumber: randomAadhar(),
        address: { cityEnglish: 'Surat', districtEnglish: 'Surat', stateEnglish: 'Gujarat', locationEnglish: 'Athwa' },
        appearance: { height: 158, weight: 55, complexion: 'fair', build: 'slim' }
    },
    {
        firstNameEnglish: 'Priyaa', firstNameHindi: 'प्रिया',
        lastNameEnglish: 'Shah', lastNameHindi: 'शाह',
        gender: 'female', dob: randomDob(18, 28),
        occupationEnglish: 'Student', occupationHindi: 'छात्रा',
        mNumber: randomPhone(), aadharNumber: randomAadhar(),
        address: { cityEnglish: 'Ahmedabad', districtEnglish: 'Ahmedabad', stateEnglish: 'Gujarat', locationEnglish: 'Navrangpura' },
        appearance: { height: 162, weight: 52, complexion: 'fair', build: 'slim' }
    },

    // Group 3: "Mohammed" variants – common name with spelling differences
    {
        firstNameEnglish: 'Mohammed', firstNameHindi: 'मोहम्मद',
        middleNameEnglish: 'Ali', middleNameHindi: 'अली',
        lastNameEnglish: 'Khan', lastNameHindi: 'खान',
        gender: 'male', dob: randomDob(30, 50),
        occupationEnglish: 'Businessman', occupationHindi: 'व्यापारी',
        mNumber: randomPhone(), aadharNumber: randomAadhar(),
        address: { cityEnglish: 'Hyderabad', districtEnglish: 'Hyderabad', stateEnglish: 'Telangana', locationEnglish: 'Charminar' },
        appearance: { height: 170, weight: 80, complexion: 'medium', build: 'heavy' }
    },
    {
        firstNameEnglish: 'Mohammad', firstNameHindi: 'मोहम्मद',
        lastNameEnglish: 'Hussain', lastNameHindi: 'हुसैन',
        gender: 'male', dob: randomDob(22, 35),
        occupationEnglish: 'Mechanic', occupationHindi: 'मैकेनिक',
        mNumber: randomPhone(), aadharNumber: randomAadhar(),
        address: { cityEnglish: 'Pune', districtEnglish: 'Pune', stateEnglish: 'Maharashtra', locationEnglish: 'Kondhwa' },
        appearance: { height: 166, weight: 70, complexion: 'dark', build: 'average' }
    },
    {
        firstNameEnglish: 'Muhammed', firstNameHindi: 'मोहम्मद',
        lastNameEnglish: 'Sheikh', lastNameHindi: 'शेख',
        gender: 'male', dob: randomDob(35, 55),
        occupationEnglish: 'Tailor', occupationHindi: 'दर्जी',
        mNumber: randomPhone(), aadharNumber: randomAadhar(),
        address: { cityEnglish: 'Mumbai', districtEnglish: 'Mumbai', stateEnglish: 'Maharashtra', locationEnglish: 'Dharavi' },
        appearance: { height: 163, weight: 65, complexion: 'dark', build: 'slim' }
    },

    // Group 4: Common surname "Singh" across different first names
    {
        firstNameEnglish: 'Gurpreet', firstNameHindi: 'गुरप्रीत',
        lastNameEnglish: 'Singh', lastNameHindi: 'सिंह',
        gender: 'male', dob: randomDob(25, 45),
        occupationEnglish: 'Police Officer', occupationHindi: 'पुलिस अधिकारी',
        mNumber: randomPhone(), aadharNumber: randomAadhar(),
        address: { cityEnglish: 'Amritsar', districtEnglish: 'Amritsar', stateEnglish: 'Punjab', locationEnglish: 'Lawrence Road' },
        appearance: { height: 180, weight: 85, complexion: 'medium', build: 'athletic' }
    },
    {
        firstNameEnglish: 'Harpreet', firstNameHindi: 'हरप्रीत',
        lastNameEnglish: 'Singh', lastNameHindi: 'सिंह',
        gender: 'female', dob: randomDob(20, 35),
        occupationEnglish: 'Shopkeeper', occupationHindi: 'दुकानदार',
        mNumber: randomPhone(), aadharNumber: randomAadhar(),
        address: { cityEnglish: 'Ludhiana', districtEnglish: 'Ludhiana', stateEnglish: 'Punjab', locationEnglish: 'Model Town' },
        appearance: { height: 163, weight: 60, complexion: 'fair', build: 'average' }
    },
    {
        firstNameEnglish: 'Manpreet', firstNameHindi: 'मनप्रीत',
        lastNameEnglish: 'Singh', lastNameHindi: 'सिंह',
        gender: 'male', dob: randomDob(30, 48),
        occupationEnglish: 'Farmer', occupationHindi: 'किसान',
        mNumber: randomPhone(), aadharNumber: randomAadhar(),
        address: { cityEnglish: 'Jalandhar', districtEnglish: 'Jalandhar', stateEnglish: 'Punjab', locationEnglish: 'Phagwara Road' },
        appearance: { height: 176, weight: 78, complexion: 'medium', build: 'heavy' }
    },

    // Group 5: South Indian names
    {
        firstNameEnglish: 'Venkatesh', firstNameHindi: 'वेंकटेश',
        lastNameEnglish: 'Reddy', lastNameHindi: 'रेड्डी',
        gender: 'male', dob: randomDob(28, 45),
        occupationEnglish: 'Software Engineer', occupationHindi: 'सॉफ्टवेयर इंजीनियर',
        mNumber: randomPhone(), aadharNumber: randomAadhar(),
        address: { cityEnglish: 'Bengaluru', districtEnglish: 'Bangalore Urban', stateEnglish: 'Karnataka', locationEnglish: 'Whitefield' },
        appearance: { height: 170, weight: 68, complexion: 'dark', build: 'average' }
    },
    {
        firstNameEnglish: 'Lakshmi', firstNameHindi: 'लक्ष्मी',
        lastNameEnglish: 'Nair', lastNameHindi: 'नायर',
        gender: 'female', dob: randomDob(22, 40),
        occupationEnglish: 'Doctor', occupationHindi: 'डॉक्टर',
        mNumber: randomPhone(), aadharNumber: randomAadhar(),
        address: { cityEnglish: 'Kochi', districtEnglish: 'Ernakulam', stateEnglish: 'Kerala', locationEnglish: 'Edapally' },
        appearance: { height: 155, weight: 50, complexion: 'medium', build: 'slim' }
    },
    {
        firstNameEnglish: 'Arjun', firstNameHindi: 'अर्जुन',
        lastNameEnglish: 'Pillai', lastNameHindi: 'पिल्लई',
        gender: 'male', dob: randomDob(19, 30),
        occupationEnglish: 'Student', occupationHindi: 'छात्र',
        mNumber: randomPhone(), aadharNumber: randomAadhar(),
        address: { cityEnglish: 'Chennai', districtEnglish: 'Chennai', stateEnglish: 'Tamil Nadu', locationEnglish: 'Anna Nagar' },
        appearance: { height: 173, weight: 62, complexion: 'dark', build: 'slim' }
    },

    // Group 6: Rajasthani profiles
    {
        firstNameEnglish: 'Ramesh', firstNameHindi: 'रमेश',
        middleNameEnglish: 'Lal', middleNameHindi: 'लाल',
        lastNameEnglish: 'Meena', lastNameHindi: 'मीना',
        gender: 'male', dob: randomDob(35, 55),
        occupationEnglish: 'Labourer', occupationHindi: 'मजदूर',
        mNumber: randomPhone(), aadharNumber: randomAadhar(),
        address: { cityEnglish: 'Jaipur', districtEnglish: 'Jaipur', stateEnglish: 'Rajasthan', locationEnglish: 'Mansarovar' },
        appearance: { height: 165, weight: 70, complexion: 'dark', build: 'average' }
    },
    {
        firstNameEnglish: 'Ramesh', firstNameHindi: 'रमेश',
        lastNameEnglish: 'Gupta', lastNameHindi: 'गुप्ता',
        gender: 'male', dob: randomDob(40, 60),
        occupationEnglish: 'Shopkeeper', occupationHindi: 'दुकानदार',
        mNumber: randomPhone(), aadharNumber: randomAadhar(),
        address: { cityEnglish: 'Jodhpur', districtEnglish: 'Jodhpur', stateEnglish: 'Rajasthan', locationEnglish: 'Shastri Nagar' },
        appearance: { height: 168, weight: 75, complexion: 'medium', build: 'heavy' }
    },
    {
        firstNameEnglish: 'Sunita', firstNameHindi: 'सुनीता',
        lastNameEnglish: 'Joshi', lastNameHindi: 'जोशी',
        gender: 'female', dob: randomDob(28, 45),
        occupationEnglish: 'Housewife', occupationHindi: 'गृहिणी',
        mNumber: randomPhone(), aadharNumber: randomAadhar(),
        address: { cityEnglish: 'Udaipur', districtEnglish: 'Udaipur', stateEnglish: 'Rajasthan', locationEnglish: 'Hiran Magri' },
        appearance: { height: 157, weight: 58, complexion: 'fair', build: 'average' }
    },

    // Group 7: Bihar / Jharkhand profiles
    {
        firstNameEnglish: 'Ranjit', firstNameHindi: 'रंजीत',
        lastNameEnglish: 'Kumar', lastNameHindi: 'कुमार',
        gender: 'male', dob: randomDob(22, 38),
        occupationEnglish: 'Electrician', occupationHindi: 'बिजली मिस्त्री',
        mNumber: randomPhone(), aadharNumber: randomAadhar(),
        address: { cityEnglish: 'Patna', districtEnglish: 'Patna', stateEnglish: 'Bihar', locationEnglish: 'Rajendra Nagar' },
        appearance: { height: 169, weight: 63, complexion: 'dark', build: 'slim' }
    },
    {
        firstNameEnglish: 'Sanjay', firstNameHindi: 'संजय',
        lastNameEnglish: 'Prasad', lastNameHindi: 'प्रसाद',
        gender: 'male', dob: randomDob(30, 50),
        occupationEnglish: 'Auto Driver', occupationHindi: 'ऑटो चालक',
        mNumber: randomPhone(), aadharNumber: randomAadhar(),
        address: { cityEnglish: 'Ranchi', districtEnglish: 'Ranchi', stateEnglish: 'Jharkhand', locationEnglish: 'Doranda' },
        appearance: { height: 166, weight: 72, complexion: 'dark', build: 'average' }
    },
    {
        firstNameEnglish: 'Anjali', firstNameHindi: 'अंजलि',
        lastNameEnglish: 'Kumari', lastNameHindi: 'कुमारी',
        gender: 'female', dob: randomDob(18, 28),
        occupationEnglish: 'Student', occupationHindi: 'छात्रा',
        mNumber: randomPhone(), aadharNumber: randomAadhar(),
        address: { cityEnglish: 'Dhanbad', districtEnglish: 'Dhanbad', stateEnglish: 'Jharkhand', locationEnglish: 'Hirapur' },
        appearance: { height: 160, weight: 50, complexion: 'medium', build: 'slim' }
    },

    // Group 8: West Bengal profiles
    {
        firstNameEnglish: 'Sourav', firstNameHindi: 'सौरव',
        lastNameEnglish: 'Banerjee', lastNameHindi: 'बनर्जी',
        gender: 'male', dob: randomDob(25, 40),
        occupationEnglish: 'Accountant', occupationHindi: 'लेखाकार',
        mNumber: randomPhone(), aadharNumber: randomAadhar(),
        address: { cityEnglish: 'Kolkata', districtEnglish: 'Kolkata', stateEnglish: 'West Bengal', locationEnglish: 'Salt Lake' },
        appearance: { height: 174, weight: 70, complexion: 'fair', build: 'average' }
    },
    {
        firstNameEnglish: 'Moumita', firstNameHindi: 'मौमिता',
        lastNameEnglish: 'Ghosh', lastNameHindi: 'घोष',
        gender: 'female', dob: randomDob(22, 38),
        occupationEnglish: 'Teacher', occupationHindi: 'शिक्षिका',
        mNumber: randomPhone(), aadharNumber: randomAadhar(),
        address: { cityEnglish: 'Howrah', districtEnglish: 'Howrah', stateEnglish: 'West Bengal', locationEnglish: 'Salkia' },
        appearance: { height: 156, weight: 52, complexion: 'fair', build: 'slim' }
    },

    // Group 9: Edge cases for testing
    {
        firstNameEnglish: 'Suresh', firstNameHindi: 'सुरेश',
        lastNameEnglish: 'Sharma', lastNameHindi: 'शर्मा',
        gender: 'male', dob: randomDob(45, 65),
        occupationEnglish: 'Retired', occupationHindi: 'सेवानिवृत्त',
        mNumber: randomPhone(), aadharNumber: randomAadhar(),
        address: { cityEnglish: 'Agra', districtEnglish: 'Agra', stateEnglish: 'Uttar Pradesh', locationEnglish: 'Taj Nagari' },
        appearance: { height: 167, weight: 80, complexion: 'medium', build: 'heavy' }
    },
    {
        firstNameEnglish: 'Suresh', firstNameHindi: 'सुरेश',
        lastNameEnglish: 'Yadav', lastNameHindi: 'यादव',
        gender: 'male', dob: randomDob(28, 45),
        occupationEnglish: 'Contractor', occupationHindi: 'ठेकेदार',
        mNumber: randomPhone(), aadharNumber: randomAadhar(),
        address: { cityEnglish: 'Varanasi', districtEnglish: 'Varanasi', stateEnglish: 'Uttar Pradesh', locationEnglish: 'Lanka' },
        appearance: { height: 170, weight: 77, complexion: 'dark', build: 'heavy' }
    },
    {
        firstNameEnglish: 'Nisha', firstNameHindi: 'निशा',
        lastNameEnglish: 'Singh', lastNameHindi: 'सिंह',
        gender: 'female', dob: randomDob(20, 35),
        occupationEnglish: 'Beautician', occupationHindi: 'ब्यूटीशियन',
        mNumber: randomPhone(), aadharNumber: randomAadhar(),
        address: { cityEnglish: 'Bhopal', districtEnglish: 'Bhopal', stateEnglish: 'Madhya Pradesh', locationEnglish: 'Arera Colony' },
        appearance: { height: 161, weight: 54, complexion: 'fair', build: 'slim' }
    },
    {
        firstNameEnglish: 'Vikram', firstNameHindi: 'विक्रम',
        lastNameEnglish: 'Chauhan', lastNameHindi: 'चौहान',
        gender: 'male', dob: randomDob(30, 48),
        occupationEnglish: 'Security Guard', occupationHindi: 'सुरक्षा गार्ड',
        mNumber: randomPhone(), aadharNumber: randomAadhar(),
        address: { cityEnglish: 'Indore', districtEnglish: 'Indore', stateEnglish: 'Madhya Pradesh', locationEnglish: 'Vijay Nagar' },
        appearance: { height: 178, weight: 82, complexion: 'medium', build: 'athletic' }
    },
    {
        firstNameEnglish: 'Deepak', firstNameHindi: 'दीपक',
        lastNameEnglish: 'Tiwari', lastNameHindi: 'तिवारी',
        gender: 'male', dob: randomDob(25, 42),
        occupationEnglish: 'Journalist', occupationHindi: 'पत्रकार',
        mNumber: randomPhone(), aadharNumber: randomAadhar(),
        address: { cityEnglish: 'Allahabad', districtEnglish: 'Prayagraj', stateEnglish: 'Uttar Pradesh', locationEnglish: 'Civil Lines' },
        appearance: { height: 171, weight: 65, complexion: 'fair', build: 'slim' }
    },
    {
        firstNameEnglish: 'Kavita', firstNameHindi: 'कविता',
        lastNameEnglish: 'Dubey', lastNameHindi: 'दुबे',
        gender: 'female', dob: randomDob(30, 50),
        occupationEnglish: 'Nurse', occupationHindi: 'नर्स',
        mNumber: randomPhone(), aadharNumber: randomAadhar(),
        address: { cityEnglish: 'Nagpur', districtEnglish: 'Nagpur', stateEnglish: 'Maharashtra', locationEnglish: 'Dharampeth' },
        appearance: { height: 159, weight: 57, complexion: 'medium', build: 'average' }
    }
];

// ─── Seed ─────────────────────────────────────────────────────────────────────
async function seed() {
    try {
        await mongoose.connect(MONGO_URL, {
            serverSelectionTimeoutMS: 30000,
            socketTimeoutMS: 45000,
        });
        console.log('✅ Connected to MongoDB');

        let inserted = 0;
        let skipped = 0;

        for (const p of profiles) {
            // Add soundex codes
            p.soundexCode = {
                firstName: soundex(p.firstNameEnglish),
                middleName: p.middleNameEnglish ? soundex(p.middleNameEnglish) : undefined,
                lastName: p.lastNameEnglish ? soundex(p.lastNameEnglish) : undefined,
            };

            // Add a default note
            p.notes = [{
                content: { english: 'Profile added via seed script for testing purposes.' },
                addedBy: 'Seed Script',
            }];

            try {
                await Profile.create(p);
                console.log(`✅ Inserted: ${p.firstNameEnglish} ${p.lastNameEnglish}`);
                inserted++;
            } catch (err) {
                if (err.code === 11000) {
                    console.log(`⚠️  Skipped (duplicate Aadhar): ${p.firstNameEnglish} ${p.lastNameEnglish}`);
                    skipped++;
                } else {
                    console.error(`❌ Error inserting ${p.firstNameEnglish}:`, err.message);
                    skipped++;
                }
            }
        }

        console.log(`\n🎉 Done! Inserted: ${inserted}, Skipped: ${skipped} out of ${profiles.length} profiles.`);
        await mongoose.disconnect();
        process.exit(0);
    } catch (err) {
        console.error('❌ Connection failed:', err.message);
        process.exit(1);
    }
}

seed();
