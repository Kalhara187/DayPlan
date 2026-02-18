# Quick Reference: Mongoose to Sequelize Query Updates

## Search and Replace Patterns for Controllers

### 1. authController.js Updates

#### Find One User
```javascript
// FIND: User.findOne({ email })
// REPLACE WITH:
User.findOne({ where: { email } })
```

#### Find User with Password
```javascript
// FIND: User.findOne({ email }).select('+password')
// REPLACE WITH:
User.findOne({ 
    where: { email },
    attributes: { include: ['password'] }
})
```

#### Find By ID
```javascript
// FIND: User.findById(req.user.id).select('+password')
// REPLACE WITH:
User.findByPk(req.user.id, {
    attributes: { include: ['password'] }
})
```

#### User ID Reference
```javascript
// FIND: user._id
// REPLACE WITH: user.id

// FIND: { id: user._id }
// REPLACE WITH: { id: user.id }
```

### 2. taskController.js Updates

#### Find All Tasks
```javascript
// FIND: Task.find({ user: userId })
// REPLACE WITH:
Task.findAll({ where: { userId: userId } })

// With populate:
// FIND: Task.find({ user: userId }).populate('user')
// REPLACE WITH:
Task.findAll({ 
    where: { userId: userId },
    include: [{ model: User, as: 'user' }]
})
```

#### Find By ID with Relations
```javascript
// FIND: Task.findById(id)
// REPLACE WITH:
Task.findByPk(id, {
    include: [
        { model: Subtask, as: 'subtasks' },
        { model: Attachment, as: 'attachments' }
    ]
})
```

#### Find with Multiple Conditions
```javascript
// FIND: Task.find({ user: userId, date: dateString })
// REPLACE WITH:
Task.findAll({ 
    where: { 
        userId: userId, 
        date: dateString 
    }
})
```

#### Find and Delete
```javascript
// FIND: Task.findByIdAndDelete(id)
// REPLACE WITH:
await Task.destroy({ where: { id: id } })

// OR with more control:
const task = await Task.findByPk(id);
if (task) {
    await task.destroy();
}
```

#### Task ID Reference
```javascript
// FIND: task._id
// REPLACE WITH: task.id
```

### 3. userController.js Updates

#### Find By ID
```javascript
// FIND: User.findById(req.user.id)
// REPLACE WITH:
User.findByPk(req.user.id)
```

#### Update User
```javascript
// Mongoose (stays similar):
const user = await User.findById(req.user.id);
user.field = newValue;
await user.save();

// Sequelize (similar):
const user = await User.findByPk(req.user.id);
user.field = newValue;
await user.save();
```

### 4. middleware/authMiddleware.js Updates

#### Find User By ID
```javascript
// FIND: req.user = await User.findById(decoded.id).select('-password');
// REPLACE WITH:
req.user = await User.findByPk(decoded.id, {
    attributes: { exclude: ['password'] }
});
```

### 5. taskScheduler.js Updates

#### Complex Query
```javascript
// FIND: Task.find({ date: today, user: userId })
// REPLACE WITH:
Task.findAll({ 
    where: { 
        date: today, 
        userId: userId 
    },
    include: [{ model: User, as: 'user' }]
})
```

## Common Patterns

### ID Field
```javascript
// Always replace _id with id
user._id → user.id
task._id → task.id
```

### Where Clause
```javascript
// Always wrap conditions in where
Model.findOne({ field: value })
→ Model.findOne({ where: { field: value } })
```

### FindAll vs Find
```javascript
// find → findAll
Model.find({ conditions })
→ Model.findAll({ where: { conditions } })
```

### Populate vs Include
```javascript
// populate → include
.populate('user')
→ include: [{ model: User, as: 'user' }]
```

### Select/Exclude Fields
```javascript
// Include password
.select('+password')
→ attributes: { include: ['password'] }

// Exclude password
.select('-password')
→ attributes: { exclude: ['password'] }
```

##Automated Checks

Run these searches in your IDE to find patterns that need updating:

1. Search: `User.findOne({(?!where)` - Find findOne without where clause
2. Search: `Task.find({(?!where)` - Find find without where clause
3. Search: `\._id\b` - Find all ._id references
4. Search: `\.populate\(` - Find all populate calls
5. Search: `\.select\(` - Find all select calls
6. Search: `findById\(` - Find all findById calls
7. Search: `findByIdAndDelete` - Find delete operations
8. Search: `findByIdAndUpdate` - Find update operations

## Testing Checklist

After updating, test these endpoints:

- [ ] POST /api/auth/signup
- [ ] POST /api/auth/signin
- [ ] POST /api/auth/forgot-password
- [ ] POST /api/auth/reset-password
- [ ] GET /api/user/profile
- [ ] PUT /api/user/profile
- [ ] PUT /api/user/settings
- [ ] POST /api/tasks
- [ ] GET /api/tasks
- [ ] GET /api/tasks/:id
- [ ] PUT /api/tasks/:id
- [ ] DELETE /api/tasks/:id
- [ ] GET /api/tasks/date/:date
- [ ] POST /api/tasks/:id/subtasks
- [ ] PUT /api/tasks/:id/complete
