import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

dotenv.config();

const sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASSWORD,
    {
        host: process.env.DB_HOST,
        port: process.env.DB_PORT || 3306,
        dialect: 'mysql',
        logging: process.env.NODE_ENV === 'development' ? console.log : false,
        pool: {
            max: 5,
            min: 0,
            acquire: 30000,
            idle: 10000
        },
        define: {
            timestamps: true,
            underscored: false,
            freezeTableName: true
        }
    }
);

const connectDB = async () => {
    try {
        await sequelize.authenticate();
        console.log('✅ MySQL Database Connected Successfully!');
        console.log(`📊 Database: ${process.env.DB_NAME}`);
        console.log(`🖥️  Host: ${process.env.DB_HOST}:${process.env.DB_PORT}`);
        
        // Sync all models with database
        await sequelize.sync({ alter: false }); // Set to true to auto-update tables
        console.log('✅ All models synchronized with database');
    } catch (error) {
        console.error('❌ MySQL Connection Error:', error.message);
        console.error('\n⚠️  Connection Failed! Check the following:');
        console.error('   1. Ensure MySQL server is running');
        console.error('   2. Verify database credentials in .env file');
        console.error('   3. Check if database exists (run: CREATE DATABASE dayplan_db;)');
        console.error('   4. Verify MySQL port (default: 3306)');
        process.exit(1);
    }
};

export { sequelize, connectDB };
export default sequelize;
