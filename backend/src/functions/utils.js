const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const authHelpers = {
    // hash password before saving to database
    hashPassword: async (password) => {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        return hashedPassword;
    },

    // Generate JWT token for user
    generateToken: (user, Permissions = []) => {
        const token = jwt.sign(
            {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
                permissions: Permissions
            },
            process.env.JWT_SECRET
        );
        return token;
    }
};

// export default authHelpers; 
module.exports = authHelpers; // create Database Tables