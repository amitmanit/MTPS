// ============================================================
// seed.js — Seed Database with Sample Data
// Run: node seed.js
// Creates sample notices, gallery items, admissions, and admin user
// ============================================================
require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const Admin = require('./models/Admin');
const Notice = require('./models/Notice');
const Gallery = require('./models/Gallery');
const Admission = require('./models/Admission');
const Contact = require('./models/Contact');

const seedDB = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB for seeding');

    // ---- Clear existing data ----
    await Admin.deleteMany({});
    await Notice.deleteMany({});
    await Gallery.deleteMany({});
    await Admission.deleteMany({});
    await Contact.deleteMany({});
    console.log('🗑️  Cleared existing data');

    // ---- Create Admin User ----
    // Username: admin | Password: admin123
    const admin = await Admin.create({
      username: 'admin',
      password: 'admin123'  // Will be hashed by pre-save hook
    });
    console.log('👤 Admin user created (username: admin, password: admin123)');

    // ---- Create Sample Notices ----
    const notices = await Notice.insertMany([
      {
        title: 'Admissions Open for 2025-26 Session',
        content: 'Mother Teresa Public School is now accepting admission applications for the academic session 2025-26. Parents are requested to fill out the online admission form or visit the school office for more information. Early applications are encouraged as seats are limited.',
        important: true,
        date: new Date('2025-03-01')
      },
      {
        title: 'Annual Sports Day - March 15, 2025',
        content: 'The Annual Sports Day will be held on March 15, 2025. All students are requested to participate enthusiastically. Parents are cordially invited to attend the event and cheer for their children. The event will start at 9:00 AM on the school playground.',
        important: true,
        date: new Date('2025-02-28')
      },
      {
        title: 'Parent-Teacher Meeting Notice',
        content: 'A Parent-Teacher Meeting (PTM) has been scheduled for February 20, 2025, from 10:00 AM to 1:00 PM. All parents are requested to attend to discuss their ward\'s progress. Please bring the student diary for reference.',
        important: false,
        date: new Date('2025-02-15')
      },
      {
        title: 'Winter Vacation Homework Reminder',
        content: 'Students are reminded to complete their winter vacation homework before the school reopens on January 15. Incomplete homework will result in remarks in the student diary. Subjects include Mathematics, Science, English, and Hindi.',
        important: false,
        date: new Date('2025-01-10')
      },
      {
        title: 'Republic Day Celebration',
        content: 'Mother Teresa Public School will celebrate Republic Day on January 26, 2025. A flag hoisting ceremony will be held at 8:00 AM followed by cultural performances by students. All students must attend in proper school uniform.',
        important: false,
        date: new Date('2025-01-20')
      },
      {
        title: 'Science Exhibition Results',
        content: 'Congratulations to all participants of the Inter-School Science Exhibition! Our school secured 1st position in the Senior Category and 2nd position in the Junior Category. Special congratulations to Rahul Kumar (Class 9) and Priya Singh (Class 7) for their outstanding projects.',
        important: true,
        date: new Date('2025-02-05')
      }
    ]);
    console.log(`📢 ${notices.length} sample notices created`);

    // ---- Create Sample Gallery Items ----
    // Using placeholder image URLs from picsum.photos
    const gallery = await Gallery.insertMany([
      {
        title: 'School Main Building',
        imageUrl: 'https://picsum.photos/seed/school1/600/400',
        category: 'School',
        description: 'The main building of Mother Teresa Public School'
      },
      {
        title: 'Annual Day Celebration',
        imageUrl: 'https://picsum.photos/seed/event1/600/400',
        category: 'Events',
        description: 'Students performing during the Annual Day function'
      },
      {
        title: 'Science Lab Activities',
        imageUrl: 'https://picsum.photos/seed/activity1/600/400',
        category: 'Activities',
        description: 'Students conducting experiments in the science lab'
      },
      {
        title: 'Sports Day Races',
        imageUrl: 'https://picsum.photos/seed/sports1/600/400',
        category: 'Sports',
        description: 'Exciting relay races during the Annual Sports Day'
      },
      {
        title: 'Independence Day Flag Hoisting',
        imageUrl: 'https://picsum.photos/seed/celebrate1/600/400',
        category: 'Celebrations',
        description: 'Independence Day celebrations at school'
      },
      {
        title: 'Computer Lab Session',
        imageUrl: 'https://picsum.photos/seed/school2/600/400',
        category: 'School',
        description: 'Students learning computer skills in our modern computer lab'
      },
      {
        title: 'Art Competition',
        imageUrl: 'https://picsum.photos/seed/activity2/600/400',
        category: 'Activities',
        description: 'Students showcasing their artistic talents'
      },
      {
        title: 'Cricket Tournament',
        imageUrl: 'https://picsum.photos/seed/sports2/600/400',
        category: 'Sports',
        description: 'Inter-house cricket tournament in progress'
      },
      {
        title: 'Diwali Celebration in School',
        imageUrl: 'https://picsum.photos/seed/celebrate2/600/400',
        category: 'Celebrations',
        description: 'Students and teachers celebrating the festival of lights'
      }
    ]);
    console.log(`🖼️  ${gallery.length} sample gallery items created`);

    // ---- Create Sample Admission Forms ----
    const admissions = await Admission.insertMany([
      {
        studentName: 'Ananya Sharma',
        dateOfBirth: new Date('2016-05-15'),
        gender: 'Female',
        classApplied: 'Class 3',
        fatherName: 'Rajesh Sharma',
        motherName: 'Sunita Sharma',
        phone: '9876543210',
        email: 'rajesh.sharma@email.com',
        address: 'Ward No. 5, Mahnar, Vaishali, Bihar',
        previousSchool: 'Little Stars School, Mahnar',
        status: 'Pending'
      },
      {
        studentName: 'Arjun Kumar',
        dateOfBirth: new Date('2018-08-20'),
        gender: 'Male',
        classApplied: 'LKG',
        fatherName: 'Manoj Kumar',
        motherName: 'Rina Devi',
        phone: '8765432109',
        email: '',
        address: 'Congress Muhalla, Mahnar, Vaishali, Bihar',
        previousSchool: '',
        status: 'Approved'
      },
      {
        studentName: 'Priya Singh',
        dateOfBirth: new Date('2014-12-10'),
        gender: 'Female',
        classApplied: 'Class 6',
        fatherName: 'Vikash Singh',
        motherName: 'Madhuri Singh',
        phone: '7654321098',
        email: 'vikash.singh@email.com',
        address: 'Near Bus Stand, Mahnar, Vaishali, Bihar',
        previousSchool: 'Government Middle School, Mahnar',
        status: 'Pending'
      }
    ]);
    console.log(`🎓 ${admissions.length} sample admission forms created`);

    // ---- Create Sample Contact Messages ----
    const contacts = await Contact.insertMany([
      {
        name: 'Ramesh Prasad',
        email: 'ramesh.prasad@email.com',
        subject: 'Admission Query for Class 5',
        message: 'Dear Sir/Madam, I would like to enquire about the admission process for my son in Class 5. What documents are required and when do the admissions start? Please guide me through the process.',
        read: false
      },
      {
        name: 'Kavita Devi',
        email: 'kavita.devi@email.com',
        subject: 'Transport Facility',
        message: 'I live in a nearby village and would like to know if the school provides transport facility. If yes, please share the routes and fees for the same.',
        read: true
      }
    ]);
    console.log(`📧 ${contacts.length} sample contact messages created`);

    console.log('\n✅ Database seeded successfully!');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('  Admin Login Credentials:');
    console.log('  Username: admin');
    console.log('  Password: admin123');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding Error:', error);
    process.exit(1);
  }
};

seedDB();
