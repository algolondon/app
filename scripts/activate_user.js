const mongoose = require('mongoose');

const uri = 'mongodb://support_db_user:DWXP6GduC9fDTNYv@ac-dulupvj-shard-00-00.mwdjbol.mongodb.net:27017,ac-dulupvj-shard-00-01.mwdjbol.mongodb.net:27017,ac-dulupvj-shard-00-02.mwdjbol.mongodb.net:27017/londonalgo?authSource=admin&replicaSet=atlas-b9po1e-shard-0&ssl=true&retryWrites=true&w=majority&appName=16london';

async function main() {
  await mongoose.connect(uri);
  
  // 1. Activate Brian Hayes
  const res1 = await mongoose.connection.collection('users').updateOne(
    { email: 'bmanlive79@gmail.com' },
    { $set: { active: true, status: 'active', tier: 'tier1' } }
  );
  console.log('Brian Hayes status updated:', res1);

  // 2. Grant admin to Kazi's personal email too
  const res2 = await mongoose.connection.collection('users').updateOne(
    { email: 'kaziyelisrael@gmail.com' },
    { $set: { role: 'admin', active: true, status: 'active' } }
  );
  console.log('Kazi personal email granted admin:', res2);

  process.exit(0);
}

main().catch(e => {
  console.error(e);
  process.exit(1);
});
