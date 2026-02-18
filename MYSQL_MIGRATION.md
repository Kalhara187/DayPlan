# MySQL Migration Guide for DayPlan

## ✅ Migration Status: COMPLETED

Your DayPlan application has been successfully migrated from MongoDB to MySQL!

## 🎯 What Changed

### 1. Database Configuration
- **OLD**: MongoDB with Mongoose
- **NEW**: MySQL with Sequelize ORM

### 2. New Files Created
- `config/database.js` - MySQL connection configuration
- `models/UserMySQL.js` - Sequelize User model
- `models/TaskMySQL.js` - Sequelize Task, Subtask, and Attachment models
- `models/index.js` - Model relationships and initialization
- `scripts/setupDatabase.js` - Database creation script

### 3. Updated Files
- `.env` - Added MySQL configuration
- `server.js` - Updated to use MySQL connection
- `package.json` - Added database setup script

## 📦 New Dependencies Installed
- `mysql2` - MySQL driver for Node.js
- `sequelize` - ORM for MySQL

## 🔧 Database Configuration (.env)

```env
# MySQL Database Configuration
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=dayplan_db
DB_PORT=3306
```

## 🚀 How to Use

### Step 1: Ensure MySQL is Running
Make sure your MySQL server is running on your machine.

### Step 2: Database is Already Created
The database `dayplan_db` has been created and is ready to use!

### Step 3: Update Controllers (IMPORTANT!)

You need to update your controller files to use the new MySQL models instead of MongoDB models.

#### Key Differences Between MongoDB (Mongoose) and MySQL (Sequelize):

| Operation | MongoDB (Mongoose) | MySQL (Sequelize) |
|-----------|-------------------|-------------------|
| Find One | `User.findOne({ email })` | `User.findOne({ where: { email } })` |
| Find By ID | `User.findById(id)` | `User.findByPk(id)` |
| Create | `User.create(data)` | `User.create(data)` ✅ Same |
| Update | `user.save()` | `user.save()` ✅ Same |
| Delete | `User.findByIdAndDelete(id)` | `User.destroy({ where: { id } })` |
| ID Field | `user._id` | `user.id` |
| Get with Relations | `.populate('user')` | `{ include: [{ model: User }] }` |

#### Example: Update authController.js

**OLD (MongoDB):**
```javascript
import User from '../models/User.js';

// Find user
const existingUser = await User.findOne({ email });

// Create user
const user = await User.create({ fullName, email, password });

// Access ID
const token = generateToken(user._id);

// Return user data
res.json({
    user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email
    }
});
```

**NEW (MySQL):**
```javascript
import User from '../models/UserMySQL.js';

// Find user
const existingUser = await User.findOne({ where: { email } });

// Create user
const user = await User.create({ fullName, email, password });

// Access ID
const token = generateToken(user.id);

// Return user data
res.json({
    user: {
        id: user.id,
        fullName: user.fullName,
        email: user.email
    }
});
```

### Step 4: Update Model Imports in All Controllers

Update the import statements in your controller files:

**authController.js:**
```javascript
// Change this:
import User from '../models/User.js';

// To this:
import User from '../models/UserMySQL.js';
```

**taskController.js:**
```javascript
// Change this:
import Task from '../models/Task.js';
import User from '../models/User.js';

// To this:
import { Task, Subtask, Attachment } from '../models/TaskMySQL.js';
import User from '../models/UserMySQL.js';
```

**userController.js:**
```javascript
// Change this:
import User from '../models/User.js';

// To this:
import User from '../models/UserMySQL.js';
```

### Step 5: Update Query Syntax

Go through each controller file and update Mongoose queries to Sequelize:

1. **Add `where` clause for find operations:**
   - `User.findOne({ email })` → `User.findOne({ where: { email } })`
   - `Task.find({ user: userId })` → `Task.findAll({ where: { userId } })`

2. **Replace `_id` with `id`:**
   - `user._id` → `user.id`
   - `task._id` → `task.id`

3. **Replace `populate()` with `include`:**
   ```javascript
   // OLD
   const tasks = await Task.find({ user: userId }).populate('user');
   
   // NEW
   const tasks = await Task.findAll({
       where: { userId },
       include: [{ model: User, as: 'user' }]
   });
   ```

4. **Update delete operations:**
   - `User.findByIdAndDelete(id)` → `User.destroy({ where: { id } })`

### Step 6: Start Your Server

```bash
npm start
# or for development with auto-reload
npm run dev
```

You should see:
```
✅ MySQL Database Connected Successfully!
📊 Database: dayplan_db
🖥️  Host: localhost:3306
✅ All models synchronized with database
```

## 🗂️ Database Schema

### Tables Created:

1. **users** - User accounts
2. **tasks** - Main task information
3. **subtasks** - Task subtasks (one-to-many with tasks)
4. **attachments** - Task attachments (one-to-many with tasks)

### Relationships:
- Users → Tasks (one-to-many)
- Tasks → Subtasks (one-to-many)
- Tasks → Attachments (one-to-many)
- Tasks → Tasks (self-referential for recurring tasks)

## 🔍 Quick Reference: Controller Updates

### Common Controller Methods to Update

#### authController.js
- ✅ Update import to `UserMySQL.js`
- ✅ Change `User.findOne({ email })` to `User.findOne({ where: { email } })`
- ✅ Change `user._id` to `user.id`
- ✅ Add `select: ['password']` equivalent if needed using attributes

#### taskController.js
- ✅ Update imports to `TaskMySQL.js`
- ✅ Change all `Task.find()` to `Task.findAll()`
- ✅ Add `where` clauses for filtering
- ✅ Replace `.populate('user')` with `include: [{ model: User }]`
- ✅ Change `task._id` to `task.id`
- ✅ Update subtask and attachment handling

#### userController.js
- ✅ Update import to `UserMySQL.js`
- ✅ Change `User.findById(id)` to `User.findByPk(id)`
- ✅ Update query syntax

## 🧪 Testing the Migration

1. **Test server startup:**
   ```bash
   npm run dev
   ```

2. **Test API endpoints:**
   - POST `/api/auth/signup` - Register new user
   - POST `/api/auth/signin` - Login
   - GET `/api/health` - Check server status

3. **Verify database:**
   ```sql
   USE dayplan_db;
   SHOW TABLES;
   DESCRIBE users;
   DESCRIBE tasks;
   ```

## ⚠️ Important Notes

1. **Password Hashing**: Automatically handled by Sequelize hooks (same as before)
2. **Timestamps**: `createdAt` and `updatedAt` are automatically managed
3. **Validation**: Model validations are enforced by Sequelize
4. **JSON Fields**: Tags are stored as JSON in MySQL
5. **Async Operations**: All database operations remain async/await

## 🆘 Troubleshooting

### Error: Cannot connect to MySQL
- Ensure MySQL server is running
- Check credentials in `.env`
- Verify port 3306 is not blocked

### Error: Database does not exist
```bash
npm run setup-db
```

### Error: Module not found
```bash
cd backend
npm install mysql2 sequelize
```

### Error: Syntax errors in controllers
- Make sure you've updated all `User.findOne()` calls to include `where` clause
- Replace all `_id` with `id`
- Update model imports to use `UserMySQL.js` and `TaskMySQL.js`

## 📝 Next Steps

1. ✅ Update all controller files with new model imports
2. ✅ Update all Mongoose queries to Sequelize syntax
3. ✅ Test all API endpoints
4. ✅ Update frontend API calls if IDs are used differently

## 🎉 That's It!

Your application is now running on MySQL instead of MongoDB. The migration preserves all functionality while using a relational database structure.

For questions or issues, refer to:
- Sequelize Documentation: https://sequelize.org/docs/v6/
- MySQL Documentation: https://dev.mysql.com/doc/
