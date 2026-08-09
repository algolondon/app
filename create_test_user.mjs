import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  tier: { type: String, default: "tier1" },
  tradingviewUsername: { type: String, default: "" },
  active: { type: Boolean, default: true },
  status: { type: String, default: "active" }, // e.g., 'pending_payment', 'active'
  stripeCustomerId: { type: String, default: null },
  paypalSubscriptionId: { type: String, default: null },
  completedModules: { type: [String], default: [] },
  abandonedEmailSent: { type: Boolean, default: false },
  role: { type: String, default: "user" },
}, { timestamps: true });

const User = mongoose.models.User || mongoose.model("User", UserSchema);

async function createTestUser() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.error("No MONGODB_URI found.");
    process.exit(1);
  }

  await mongoose.connect(uri);
  console.log("Connected to MongoDB.");

  const email = "testuser@16londonalgo.com";
  const passwordStr = "TestPassword123!";

  try {
    const existing = await User.findOne({ email });
    if (existing) {
      console.log("Test user already exists! Deleting old user...");
      await User.deleteOne({ email });
    }

    const hashedPassword = await bcrypt.hash(passwordStr, 10);
    
    const newUser = new User({
      name: "Test User",
      email,
      password: hashedPassword,
      status: "active",
      tier: "tier3", // Giving tier3 to see full dashboard features
      tradingviewUsername: "TestTradingView123", // Provided so it doesn't prompt
      active: true,
      role: "user"
    });

    await newUser.save();
    console.log("-----------------------------------------");
    console.log("✅ Test user created successfully!");
    console.log(`Email: ${email}`);
    console.log(`Password: ${passwordStr}`);
    console.log("-----------------------------------------");
  } catch (error) {
    console.error("Error creating test user:", error);
  } finally {
    await mongoose.disconnect();
    console.log("Disconnected.");
  }
}

createTestUser();
