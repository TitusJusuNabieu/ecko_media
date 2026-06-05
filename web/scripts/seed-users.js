/**
 * Database Seeder for Ecko Media
 * Seeds the database with demo users with properly hashed passwords
 * Run: node scripts/seed-users.js
 */

const bcrypt = require('bcryptjs');
const mysql = require('mysql2/promise');
require('dotenv').config();

// Demo users configuration
const demoUsers = [
  {
    email: 'admin@eckomedia.sl',
    password: 'Admin123!',
    name: 'Super Admin',
    role: 'admin',
    avatar: 'https://ui-avatars.com/api/?name=Super+Admin&background=FFD700&color=1E293B&bold=true',
    protected: true
  },
  {
    email: 'john.admin@eckomedia.sl',
    password: 'Admin123!',
    name: 'John Kamara',
    role: 'admin',
    avatar: 'https://ui-avatars.com/api/?name=John+Kamara&background=3B82F6&color=fff&bold=true'
  },
  {
    email: 'mary.admin@eckomedia.sl',
    password: 'Admin123!',
    name: 'Mary Bangura',
    role: 'admin',
    avatar: 'https://ui-avatars.com/api/?name=Mary+Bangura&background=EC4899&color=fff&bold=true'
  },
  {
    email: 'sarah.editor@eckomedia.sl',
    password: 'Editor123!',
    name: 'Sarah Koroma',
    role: 'editor',
    avatar: 'https://ui-avatars.com/api/?name=Sarah+Koroma&background=8B5CF6&color=fff&bold=true'
  },
  {
    email: 'david.editor@eckomedia.sl',
    password: 'Editor123!',
    name: 'David Sesay',
    role: 'editor',
    avatar: 'https://ui-avatars.com/api/?name=David+Sesay&background=10B981&color=fff&bold=true'
  },
  {
    email: 'grace.editor@eckomedia.sl',
    password: 'Editor123!',
    name: 'Grace Conteh',
    role: 'editor',
    avatar: 'https://ui-avatars.com/api/?name=Grace+Conteh&background=F59E0B&color=fff&bold=true'
  },
  {
    email: 'samuel.writer@eckomedia.sl',
    password: 'Writer123!',
    name: 'Samuel Tucker',
    role: 'writer',
    avatar: 'https://ui-avatars.com/api/?name=Samuel+Tucker&background=06B6D4&color=fff&bold=true'
  },
  {
    email: 'ruth.writer@eckomedia.sl',
    password: 'Writer123!',
    name: 'Ruth Williams',
    role: 'writer',
    avatar: 'https://ui-avatars.com/api/?name=Ruth+Williams&background=EF4444&color=fff&bold=true'
  },
  {
    email: 'james.mod@eckomedia.sl',
    password: 'Mod123!',
    name: 'James Johnson',
    role: 'moderator',
    avatar: 'https://ui-avatars.com/api/?name=James+Johnson&background=6366F1&color=fff&bold=true'
  },
  {
    email: 'rebecca.mod@eckomedia.sl',
    password: 'Mod123!',
    name: 'Rebecca Davies',
    role: 'moderator',
    avatar: 'https://ui-avatars.com/api/?name=Rebecca+Davies&background=14B8A6&color=fff&bold=true'
  },
  {
    email: 'emmanuel.mod@eckomedia.sl',
    password: 'Mod123!',
    name: 'Emmanuel Smith',
    role: 'moderator',
    avatar: 'https://ui-avatars.com/api/?name=Emmanuel+Smith&background=F97316&color=fff&bold=true'
  }
];

const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'ecko_media'
};

async function seedUsers() {
  let connection;
  
  try {
    console.log('🌱 Starting database seeding...\n');
    console.log('📡 Connecting to database...');
    connection = await mysql.createConnection(dbConfig);
    console.log('✅ Connected to database\n');
    
    const [tables] = await connection.query("SHOW TABLES LIKE 'users'");
    
    if (tables.length === 0) {
      console.log('❌ Users table does not exist. Please run schema.sql first.');
      return;
    }
    
    console.log('🔐 Hashing passwords and inserting users...\n');
    
    let insertedCount = 0;
    
    for (const user of demoUsers) {
      try {
        const [existing] = await connection.query(
          'SELECT id FROM users WHERE email = ?',
          [user.email]
        );
        
        if (existing.length > 0) {
          console.log(`⏭️  Skipping ${user.email} (already exists)`);
          continue;
        }
        
        const passwordHash = await bcrypt.hash(user.password, 10);
        
        await connection.query(
          'INSERT INTO users (email, password_hash, name, avatar, role, is_active) VALUES (?, ?, ?, ?, ?, ?)',
          [user.email, passwordHash, user.name, user.avatar, user.role, true]
        );
        
        console.log(`✅ Created: ${user.name} (${user.email}) - Role: ${user.role}`);
        console.log(`   Password: ${user.password}`);
        insertedCount++;
        
      } catch (error) {
        console.error(`❌ Failed to create ${user.email}:`, error.message);
      }
    }
    
    console.log(`\n✨ Successfully created ${insertedCount} demo users!\n`);
    console.log('═══════════════════════════════════════════════════════════');
    console.log('📋 LOGIN CREDENTIALS');
    console.log('═══════════════════════════════════════════════════════════\n');
    
    console.log('👑 ADMIN USERS:');
    demoUsers.filter(u => u.role === 'admin').forEach(u => {
      console.log(`   Email:    ${u.email}`);
      console.log(`   Password: ${u.password}`);
      console.log(`   Name:     ${u.name}`);
      if (u.protected) console.log(`   ⚠️  Protected from deletion`);
      console.log('');
    });
    
    console.log('✏️  EDITOR USERS:');
    demoUsers.filter(u => u.role === 'editor').forEach(u => {
      console.log(`   Email:    ${u.email}`);
      console.log(`   Password: ${u.password}\n`);
    });
    
    console.log('📝 WRITER USERS:');
    demoUsers.filter(u => u.role === 'writer').forEach(u => {
      console.log(`   Email:    ${u.email}`);
      console.log(`   Password: ${u.password}\n`);
    });
    
    console.log('🛡️  MODERATOR USERS:');
    demoUsers.filter(u => u.role === 'moderator').forEach(u => {
      console.log(`   Email:    ${u.email}`);
      console.log(`   Password: ${u.password}\n`);
    });
    
    console.log('═══════════════════════════════════════════════════════════\n');
    
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    throw error;
  } finally {
    if (connection) {
      await connection.end();
      console.log('📡 Database connection closed');
    }
  }
}

if (require.main === module) {
  seedUsers()
    .then(() => {
      console.log('\n🎉 Seeding completed successfully!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('\n💥 Seeding failed:', error);
      process.exit(1);
    });
}

module.exports = { seedUsers };
