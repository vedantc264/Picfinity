import z from "zod";

const saltRounds = 10;
const userEmailObject = z.object({
    email : z.string().email()
});
const userPasswordObject = z.object({
    password : z.string().min(8)
});
const userNameObject = z.object({
    name : z.string().max(25)
});
export default async function initUserLogin(req , res , next){
        const user_details = req.body;
        if(!user_details.email)
        {
            return res.json({Api_Response : 306 , message : "Email not provided "})
        }
        if(!user_details.password)
        {
            return res.json({Api_Response : 307 , message : "Password not provided"}); 
        }
        let object = { email : user_details.email }
        try {
            const result = await userEmailObject.parse(object);
        } catch (error) {
            return res.json({Api_Response : 300 , message : "Improper email"});
        }
        let object2 = { password : user_details.password};
        try {
            const result = await userPasswordObject.parse(object2);
        } catch (error) {
            return res.json({Api_Response : 301 , message : "Password less than 8 charachter or incorrect"});
        }   
        console.log("zod verified");
        next();
}
export async function initUserSignup(req , res , next){
    const user_details = req.body;
    console.log(user_details.password);
    if(!user_details.email)
        {
            return res.json({Api_Response : 306 , message : "Email not provided "})
        }
        if(!user_details.password)
        {
            return res.json({Api_Response : 307 , message : "Password not provided"}); 
        }
        if(!user_details.name)
        {
            return res.json({Api_Response : 308 , message : "Name not provided"})
        }
    let object = { email : user_details.email }
    try {
        const result = await userEmailObject.parse(object);
    } catch (error) {
        return res.json({Api_Response : 300 , message : "Improper email"});
    }
    let object2 = { password : user_details.password};
    try {
        const result = await userPasswordObject.parse(object2);
    } catch (error) {
        return res.json({Api_Response : 301 , message : "Password less than 8 charachter or incorrect"});
    }   
    let object3 = { name : user_details.name}
    try {
        const result = await userNameObject.parse(object3);
    } catch (error) {
        return res.json({Api_Response : 309 , message : "Password less than 8 charachter or incorrect"});
    }   
    console.log("zod verified");
    next();
}
