const mongoose = require('mongoose');
mongoose.set('strictQuery',false);
mongoose.connect('mongodb+srv://nishabeatum7:TsanVVpeKxB6rL20@cluster0.cavm5zp.mongodb.net/Vijah?retryWrites=true&w=majority',{
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(()=>{
    console.log('Connection is created');
}).catch((err)=>{
    console.log(err);
    console.log('Connection is not created');
})