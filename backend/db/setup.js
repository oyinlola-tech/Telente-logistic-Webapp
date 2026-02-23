const { ensureDatabaseAndSeedAdmin } = require('./init');

ensureDatabaseAndSeedAdmin()
  .then(() => {
    console.log('Database setup complete.');
    process.exit(0);
  })
  .catch((err) => {
    console.error('Error setting up database:', err);
    process.exit(1);
  });
