import { pool, initializeDatabase, countUsers } from '../lib/db';
import { hashPassword } from '../lib/auth';

async function main() {
  try {
    console.log('[v0] =========================================');
    console.log('[v0] Initializing OpsDash Database');
    console.log('[v0] =========================================');
    
    // Create tables
    await initializeDatabase();
    console.log('[v0] ✓ Tables created successfully');
    
    // Check if any users exist
    const userCount = await countUsers();
    console.log(`[v0] Current user count: ${userCount}`);
    
    if (userCount === 0) {
      console.log('[v0] ');
      console.log('[v0] No users found. Creating default admin user...');
      
      const adminEmail = 'admin@opsdash.local';
      const adminPassword = 'Admin@123456';
      const adminPasswordHash = await hashPassword(adminPassword);
      
      // Create admin user directly
      const id = crypto.randomUUID();
      await pool.query(
        `INSERT INTO users (id, email, password_hash, role, status, created_at, updated_at) 
         VALUES ($1, $2, $3, 'admin', 'approved', NOW(), NOW())`,
        [id, adminEmail, adminPasswordHash]
      );
      
      console.log('[v0] ✓ Default admin user created');
      console.log('[v0] ');
      console.log('[v0] LOGIN CREDENTIALS:');
      console.log('[v0] =========================================');
      console.log(`[v0] Email:    ${adminEmail}`);
      console.log(`[v0] Password: ${adminPassword}`);
      console.log('[v0] =========================================');
      console.log('[v0] ⚠️  IMPORTANT: Change this password after first login!');
      console.log('[v0] ');
    } else {
      console.log(`[v0] ✓ Database already initialized with ${userCount} user(s)`);
    }
    
    console.log('[v0] ✓ Database initialization complete!');
    process.exit(0);
  } catch (error) {
    console.error('[v0] ✗ Database initialization failed:', error);
    process.exit(1);
  }
}

main();
