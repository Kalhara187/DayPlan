import { DataTypes, Model } from 'sequelize';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import sequelize from '../config/database.js';

class User extends Model {
    // Method to compare password
    async comparePassword(candidatePassword) {
        try {
            return await bcrypt.compare(candidatePassword, this.password);
        } catch (error) {
            throw new Error(error);
        }
    }

    // Method to get user object without password
    toJSON() {
        const values = { ...this.get() };
        delete values.password;
        delete values.resetPasswordToken;
        delete values.resetPasswordExpire;
        return values;
    }

    // Generate password reset token
    getResetPasswordToken() {
        // Generate token
        const resetToken = Math.random().toString(36).substring(2, 15) + 
                          Math.random().toString(36).substring(2, 15);

        // Hash token and set to resetPasswordToken field
        this.resetPasswordToken = crypto
            .createHash('sha256')
            .update(resetToken)
            .digest('hex');

        // Set expire time (1 hour)
        this.resetPasswordExpire = new Date(Date.now() + 60 * 60 * 1000);

        return resetToken;
    }
}

User.init({
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    fullName: {
        type: DataTypes.STRING(50),
        allowNull: false,
        validate: {
            notEmpty: {
                msg: 'Please provide your full name'
            },
            len: {
                args: [2, 50],
                msg: 'Name must be between 2 and 50 characters'
            }
        }
    },
    email: {
        type: DataTypes.STRING(255),
        allowNull: false,
        unique: true,
        validate: {
            isEmail: {
                msg: 'Please provide a valid email'
            }
        },
        set(value) {
            this.setDataValue('email', value.toLowerCase().trim());
        }
    },
    password: {
        type: DataTypes.STRING(255),
        allowNull: false,
        validate: {
            len: {
                args: [6, 255],
                msg: 'Password must be at least 6 characters long'
            }
        }
    },
    emailNotifications: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
    notificationTime: {
        type: DataTypes.STRING(5),
        defaultValue: '09:00',
        validate: {
            is: {
                args: /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/,
                msg: 'Invalid time format. Use HH:MM'
            }
        }
    },
    notificationEmail: {
        type: DataTypes.STRING(255),
        allowNull: true,
        validate: {
            isEmail: {
                msg: 'Please provide a valid notification email'
            }
        },
        set(value) {
            if (value) {
                this.setDataValue('notificationEmail', value.toLowerCase().trim());
            } else {
                this.setDataValue('notificationEmail', null);
            }
        }
    },
    resetPasswordToken: {
        type: DataTypes.STRING(255),
        allowNull: true
    },
    resetPasswordExpire: {
        type: DataTypes.DATE,
        allowNull: true
    }
}, {
    sequelize,
    modelName: 'User',
    tableName: 'users',
    timestamps: true,
    hooks: {
        beforeCreate: async (user) => {
            if (user.password) {
                const salt = await bcrypt.genSalt(10);
                user.password = await bcrypt.hash(user.password, salt);
            }
        },
        beforeUpdate: async (user) => {
            if (user.changed('password')) {
                const salt = await bcrypt.genSalt(10);
                user.password = await bcrypt.hash(user.password, salt);
            }
        }
    }
});

export default User;
