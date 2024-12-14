const jwt = require("jsonwebtoken");
const JWT_token='hariaibkasdnf';
const fetchuser= (req, res, next) => {
    const token= req.header("auth-token");
    if(!token){
        res.status(401).send({error:"please authenticate with a valid user id"});
    }
    try {
        const data = jwt.verify(token,JWT_token);
        req.user=data.user;
        next();
    } catch (error) {
        res.status(401).send({error:"please authenticate with a valid user id"});
    }
}
module.exports = fetchuser;