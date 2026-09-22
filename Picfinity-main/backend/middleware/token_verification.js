import jwt from "jsonwebtoken";

import env from "dotenv";
env.config();
const SECRET = process.env.SECRETS;

export default async function tokenVerify(req, res,next){
    const token = req.headers.token

    try {
        const result = jwt.verify(token , SECRET);
        req.user_id = result;
        console.log(result);
        next();
    } catch (error) {
        return res.json({message : "incorrect token"})
    }
}