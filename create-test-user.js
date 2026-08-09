const mongoose = require('mongoose');
require('dotenv').config({ path: '.env.local' });
const bcrypt = require('bcryptjs');

async function createTestUser() {
  await mongoose.connect(process.env.MONGODB_URI);
  console.log('Connected to DB');

  const userSchema = new mongoose.Schema({
    name: String,
    email: String,
    password: String,
    role: { type: String, default: "user" },
    active: { type: Boolean, default: false },
    tier: { type: String, default: "tier1" }
  }, { strict: false });
  
  const User = mongoose.models.User || mongoose.model('User', userSchema);
  
  const email = 'test@example.com';
  const existing = await User.findOne({ email });
  if (existing) {
    console.log('User already exists');
  } else {
    const hashedPassword = await bcrypt.hash('password123', 10);
    await User.create({
      name: 'Test User',
      email: email,
      password: hashedPassword,
      role: 'user',
      active: true,
      tier: 'tier1'
    });
    console.log('Test user created: test@example.com / password123');
  }
  
  await mongoose.disconnect();
}
createTestUser().catch(console.error);
