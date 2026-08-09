require('dotenv').config({ path: '.env.local' });
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const MONGO_URI = process.env.MONGODB_URI || 'mongodb+srv://londonalgo:londonalgo@16londonalgo.7y8b4.mongodb.net/16londonalgo?retryWrites=true&w=majority&appName=16londonalgo';

async function createAdmin() {
  try {
    await mongoose.connect(MONGO_URI);
    
    const User = mongoose.models.User || mongoose.model('User', new mongoose.Schema({
      name: { type: String, required: true },
      email: { type: String, required: true, unique: true },
      password: { type: String, required: true },
      tier: { type: String, default: "tier1" },
      tradingviewUsername: { type: String, default: "" },
      active: { type: Boolean, default: true },
      status: { type: String, default: "active" }, 
      role: { type: String, default: "user" },
    }, { collection: 'users' }));

    let user = await User.findOne({ email: 'admin@example.com' });
    if (user) {
        console.log('Admin user already exists. Setting role to admin.');
        user.role = 'admin';
        user.active = true;
        await user.save();
        process.exit(0);
    }

    const hashedPassword = await bcrypt.hash('password123', 10);
    
    const newUser = new User({
      name: 'Admin Test',
      email: 'admin@example.com',
      password: hashedPassword,
      active: true,
      role: 'admin'
    });
    
    await newUser.save();
    console.log('Admin user created successfully');
    process.exit(0);
  } catch (error) {
    console.error('Error creating admin user:', error);
    process.exit(1);
  }
}

createAdmin();
