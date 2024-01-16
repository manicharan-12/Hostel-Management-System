const express= require("express");
const path = require("path");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const cors = require('cors');
const {open} = require("sqlite");
const sqlite3 = require("sqlite3");
const app = express();

const dbPath = path.join(__dirname,"hostel.db");
let db=null;
app.use(cors())
app.use(express.json());

const intializeDbndServer = async()=>{
    try{
        db=await open({
            filename:dbPath,
            driver:sqlite3.Database,
        });
        app.listen(8000,()=>{
            console.log("Server running at http://localhost:8000");
        })
        const password="admin1";
        const hashedPassword = await bcrypt.hash(password,10);
        const updateQuery = `update main_admin set password='${hashedPassword}' where email="admin1@anurag.edu.in"`;
        await db.run(updateQuery);


    }
    catch (e){
        console.log(`DataBase Error ${e.message}`);
        process.exit(1);
    }
}

intializeDbndServer();


const authenticateToken = (request,response,next)=>{
    let jwt_token;
    const authHeader = request.headers["authorization"];
    if(authHeader !== undefined){
        jwt_token=authHeader.split(" ")[1];
    }
    if(jwt_token===undefined){
        response.status(401);
        response.send("Invalid JWT Token");
    }
    else{
        jwt.verify(jwt_token, "21eg112b31",async(error,payload)=>{
            if(error){
                response.status(401);
                response.send("Invalid JWT Token");
            }
            else{
                next();
            }
        });
    }
}


app.post("/login/main-admin/" , async(request,response)=>{
    const {email,password}=request.body;
    const checkUser = `select * from main_admin where email='${email}';`;
    const dbUserExist = await db.get(checkUser);
    if (dbUserExist!== undefined){
        const checkPassword = await bcrypt.compare(password,dbUserExist.password);
        if(checkPassword === true){
            const payload = {email:email};
            const jwt_token = jwt.sign(payload,"21eg112b31");
            response.send({jwt_token});
        }
        else{
            response.status(400);
            response.send({"error_msg":"Wrong Password"});
        }
    }
    else{
        response.status(401);
        response.send({"error_msg":"Invalid Email Id"});
    }
});

//app.get("/main-admin/",authenticateToken, async(request,response)=>{})

