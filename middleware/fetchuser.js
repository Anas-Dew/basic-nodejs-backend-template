const jwt = require('jsonwebtoken');

const fetchuser = (req, res, next) =>{
    const token = req.header('authToken');
    if(!token){
        res.status(401).json({error: "Invalid token"})
    }
    try {
        const data = jwt.verify(token, "s39d3EwetUdRl7ech$C7");
        req.user = data.user;
        next();
    } catch (error) {
        res.status(401).json({error: "invalid token"})
    }
}

module.exports = fetchuser;