var PhoneNumber = require( 'awesome-phonenumber' );
var tblotp=require('./model/tblOtp')
var express=require('express')
var app=express()
var mongoose=require('mongoose')
var key=require('./config/db')
const http=require('http')
const bodyp=require('body-parser')

app.use(bodyp.urlencoded({extended:true}))
app.use(bodyp.json())

mongoose.connect(key.url, (err)=>{
    if(!err){
      console.log('connected to server !!!')
    }
  })

function send_sms(mobile, text) {
    var options = {
        'method': 'GET',
        'hostname': //your host name,
        'path': //your path with user name and key,
        'headers': {
        },
        'maxRedirects': 20
      };
      
      var req = http.request(options, function (res) {
        var chunks = [];
      
        res.on("data", function (chunk) {
          chunks.push(chunk);
        });
      
        res.on("end", function (chunk) {
          var body = Buffer.concat(chunks);
          console.log(body.toString());
        });
      
        res.on("error", function (error) {
          console.error(error);
          res.send({error: error })
        });
      });
      
      req.end();
}


app.post('/sendotp', (req, res)=>{
    try{
        
        var pn=PhoneNumber(req.body.Phone)
        if(req.body.Phone){
                tblotp.findOne({SendedPhoneNo:req.body.Phone})
                .exec()
                .then(docphone=>{
                    if(!docphone){
                        r=Math.floor(1000 + Math.random() *1000)
                        const otp=new tblotp({
                            OTP:r,
                            SendedPhoneNo:req.body.Phone,
                            ReceivedBy:'client',
                            SendBy:"admin",
                        })
                        otp.save()
                        .then(otpdata=>{
                            var msgsend=`Dear Client your otp is ${r}`
                            var msg=r
    
                            send_sms(req.body.Phone, msgsend)
                            res.send({success: true, data: msg, message: "OTP sent successfully" });
                        })
                    }else{
                        r=Math.floor(1000 + Math.random() *1000)
                        u_data = {
                            OTP: r, 
                            SendedPhoneNo: req.body.Phone,
                        }
                        tblotp.update({_id:docphone._id},u_data)
                        .exec()
                        .then(otpupdate=>{
                            
                            var msgsend=`Dear Client your otp is ${r}`
                            var msg=r
    
                            send_sms(req.body.Phone, msgsend)
                            res.send({success: true, data: msg, message: "OTP sent successfully" });
                        })
                    }
                })
                .catch(err => {
                    res.send({success: false, message: err.message || "Some error occurred while fetching data." });
                });
            // }else{
            //     res.send({success: false, message: 'Phone Number is Invalid' });
    
            // }
        }else{
            res.send({success: false, message: 'Phone Number is empty' });
        }
    }catch(err){
        res.send({success: false, message: err });
    }
})


app.listen(3000)