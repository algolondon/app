
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

mongoose.connect('mongodb://support_db_user:GBFsIgJorwsapq8l@ac-dulupvj-shard-00-00.mwdjbol.mongodb.net:27017,ac-dulupvj-shard-00-01.mwdjbol.mongodb.net:27017,ac-dulupvj-shard-00-02.mwdjbol.mongodb.net:27017/londonalgo?authSource=admin&replicaSet=atlas-b9po1e-shard-0&ssl=true&retryWrites=true&w=majority&appName=16london')
  .then(async () => {
    const hashedPassword = await bcrypt.hash('16London!', 10);
    await mongoose.connection.collection('users').updateOne(
      { email: 'testuser@16londonalgo.com' },
      { $set: { password: hashedPassword } }
    );
    console.log('Password reset to 16London!');
    process.exit(0);
  })
  .catch(console.error);

