const user = require("../models/Users")
const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken');
const nodemailer = require("nodemailer");
const random = require('random-number');

//Register API
module.exports = function (app){
    app.post('/register', async(req,res)=>{
        try{

            const options = { min:  111111, max:  999999, integer: true }
            const saltRounds = 10;
            const salt = bcrypt.genSaltSync(saltRounds);
            const otpVal = random(options)  
            var password = req.body.password.toString()
            const pswd = bcrypt.hashSync(password, saltRounds);

            const newUser = new user ({
                username: req.body.username,
                email: req.body.email,
                email_verified: req.body.email_verified,
                password: pswd,
                phone : req.body.phone,
                birthday : req.body.birthday,
                gender: req.body.gender,
                address: req.body.address,
                otp : otpVal,
                isAdmin  : false,
                status   : 'inactive'
            });
            await newUser.save();
            await main(req.body.email,otpVal);   
            return res.send({status:200, Message: "Email Sucessfully send"});
        }catch(err){
            console.log(err)
            return res.send({status:400, Message: err});
        }
    });

    async function main(email,otp) {
        let transporter = nodemailer.createTransport({
            service: 'gmail',
            host: 'smtp.gmail.com',
            port: 587,
            secure: false, 
            auth: {
              user: 'arunbeatum40@gmail.com',
              pass: 'iltbbczhelfixidw', 
            }
        })
        await transporter.sendMail({
            from: 'arunbeatum40@gmail.com', 
            to: email, 
            subject: "Hello ✔", 
            text: "This is your otp " , 
            html: "<b>your otp is "+otp+"</b>", 
        });
    }

    //Verify User Registeration
    app.get("/email_verify",async (req,res) =>{
        try
        {
            if(!req.body.otp) {return res.send({status:401, Message: "otp is required"})}
            var users = await user.findOne({email:req.body.email});
            var message = ""
            if(users.otp == req.body.otp) {
                users.status = 'verified'
                users.save()
                message = "email is verified"
            }
            else{
                message = "Please enter Correct otp"
            }
            return res.send ({status:200, Message: message })
        }
        catch(err){
            console.log(err)
            return res.send ({status:400, Message: err})
        }
    });

//Here User Login
app.get("/login",async(req, res) =>{
    try{
        if(!req.body.email) {return res.send({status:401, Message: "Email is required"})}
        var userLogin = await user.findOne({email: req.body.email}) 
        if(!userLogin){
            return res.send({status:401, Message: "User not found"})
        }
        var password = req.body.password
        var result = bcrypt.compareSync(password, userLogin.password);
       
        if(result){
            var token = createToken(userLogin._id)
 
            return res.send({status:200, Message: userLogin, token:token})
        }else{
            return res.send({status:401, Message: 'Wrong Password'})
        }
    }catch(err){
        console.log(err)
        return res.send ({status:400, Message:err});
    }
});
 function createToken(userID){
    var token = jwt.sign({_id:userID}, "mynameisnishujfuikknslnsnlj",{
        expiresIn:"10 days"
    });
    return token;
}

//Verify Token

app.get("/jwtverify",async(req,res)=>{
    try{
        const token = req.body.token;
        if(token){
            var tokenVar = verifyToken(token)
            return res.send ({status:200, Message: token, token: tokenVar})
        }else{
            return res.send ({status:401, Message: 'Token is not verify'})
        }
    }catch(err){
        console.log(err)
        return res.send({status:400, Message:err});
    }
});
function verifyToken(token){
    var tokenVer = jwt.verify(token, "mynameisnishujfuikknslnsnlj");
    return tokenVer;
}

//Get Profile
app.get("/get_profile",async(req,res)=>{
    try{
        const users = await user.find()
        return res.send({status:200, Message: "Sucessfully", data:users})
    }
    catch(err){
        console.log(err)
        return res.send({status:400, Message: err})
    }
});

//Update Profile
app.put("/update_profile",async(req,res)=>{
    try{
        const _id = req.body._id;
        const username = req.body.username
        const phone = req.body.phone
        const gender = req.body.gender
        const address = req.body.address

        const upd = await user.updateOne({_id:_id},{$set:{username:username, phone:phone, gender:gender, address:address}});
        if(upd){
            res.send("Product Updated Sucessfully")
        }
        else{
            res.send("Product not Updated Sucessfully")
        }
    }
    catch (err) {
        console.log(err)
        return res.send({status:400, Message: err})
    }
});

//Update Password
app.post("/update_Password",async(req,res)=>{
    try{

    }
    catch{
        console.log(err)
        return res.send({status:400, Message: err})
    }
});

//Reset Password
app.put("/reset_password",async (req, res) =>{
    if (req.body.userId == req.params.id){
     if(req.body.password){
         const salt = await bcrypt.genSalt(10);
         req.body.password = await bcrypt.hash(req.body.password, salt)
     }
     try{
         const updatedUser = await user.findByIdAndUpdate(req.params.id, {
             $set: req.body,
         },
         {new:true}
         );
         return res.send({status:200, Message: updatedUser})
        } catch (err) {
         console.log(err)
         return res.send({status:400, Message: err})
        }
    } else{
     return res.send({status:401, Message: 'you can only update your profile'})
    }
 });

 //Change Image
 app.put("/change_image",async(req, res)=>{
    try{

    }
    catch{
        console.log(err)
        return res.send({status:400, Message: err})
    }
 });

//Logout API
app.get("/log_out",async(req, res) =>{
    try{

        if(!req.body.email) { return res.send({status:401, Message: "email is requied"}) }
        var log_out = await user.findOne({email : req.body.email})
        if(log_out ){
            log_out.delete()
            return res.send({status:200, Message: 'Logout Sucessfully'})
        }else{
            return res.send({status:401, Message: 'Wrong Email'})
        }
    }
    catch (err) {
        console.log(err)
        return res.send({status:400, Message: err})
    }
}); 
}