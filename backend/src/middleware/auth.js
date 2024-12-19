const jwt = require('jsonwebtoken')
const User = require('../schemas/user');
const auth = async (req, res, next) =>{
    // console.log(req.header('Authorization'));
    try {
        const token = req.header('Authorization').replace('Bearer ','')
        // const decoded = jwt.verify(token, 'thisismynewcourse')
        if (!token) {
            return res.status(401).json({
                error: 'Authorization token is missing'
            });
        };
        // console.log(token);
        const decoded =  jwt.verify(token, process.env.JWT_SECRET);
        // console.log(decoded);
        // Check if the token has expired
        const user = await User.findOne({ 
            where: {
                id: decoded.id            
            }
        });
        if (!user) {
            throw new Error();
        }
        req.token = token;
        req.user = user;
        req.user.permissions = decoded.permissions;
        next();
    } catch (e) {
        res.status(401).send({error: 'Please authenticate.' })
    }
}

module.exports = auth