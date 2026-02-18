import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: resolve(__dirname, '../.env') });

const createDatabase = async () => {
    let connection;
    
    try {
        console.log('🔄 Connecting to MySQL server...');
        
        // Connect to MySQL server (without database)
        connection = await mysql.createConnection({
            host: process.env.DB_HOST || 'localhost',
            user: process.env.DB_USER || 'root',
            password: process.env.DB_PASSWORD || '',
            port: process.env.DB_PORT || 3306
        });

        console.log('✅ Connected to MySQL server');

        // Create database if it doesn't exist
        const dbName = process.env.DB_NAME || 'dayplan_db';
        await connection.query(`CREATE DATABASE IF NOT EXISTS \`${dbName}\``);
        console.log(`✅ Database '${dbName}' created or already exists`);

        // Use the database
        await connection.query(`USE \`${dbName}\``);
        console.log(`✅ Using database '${dbName}'`);

        console.log('\n✨ Database setup completed successfully!');
        console.log('📝 You can now start your application with: npm start');

    } catch (error) {
        console.error('❌ Database creation error:', error.message);
        console.error('\nTroubleshooting:');
        console.error('  1. Make sure MySQL server is running');
        console.error('  2. Check your credentials in .env file');
        console.error('  3. Verify MySQL is running on the correct port');
        console.error('  4. Ensure your user has CREATE DATABASE permission');
        process.exit(1);
    } finally {
        if (connection) {
            await connection.end();
            console.log('🔌 MySQL connection closed');
        }
    }
};

// Run the script
createDatabase();
