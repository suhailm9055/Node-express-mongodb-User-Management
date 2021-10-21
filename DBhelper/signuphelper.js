
var db=require('../config/connection')
const { response } = require('express')

module.exports={

    signUp:(users,callback)=>{
        db.get().collection('users').insertOne(users).then((data)=>{
           
            callback(data.ops[0].UserName)
        })

    },

    doLogin:(usersdata)=>{
        return new Promise(async(resolve,reject)=>{
            let loginstatus=false
            let response={}
            let pw=[]
            let user=await db.get().collection('users').findOne({UserName:usersdata.UserName})
            if(user){
                console.log("Username success"+user.pw);
                if(usersdata.pw==user.pw){
                console.log("Username and pw success"+user.pw);
                loginstatus=true
                response.user=user
                response.status=true
               
                resolve(response)
                }else{
                    console.log('login failed pw error');
                    
                    
                        resolve({status:false})
                        
                }
            }else{
                console.log("username error");
                
                resolve({status:false})
            }
            return loginstatus
        
       
    
})
    },
    doAdminLogin:(usersdata)=>{
        return new Promise(async(resolve,reject)=>{
            let loginstatus=false
            let response={}
         
            let admin=await db.get().collection('admin').findOne({adminName:usersdata.adminName})
            if(admin){
                console.log("Username success"+admin.adminPw);
                if(usersdata.adminPw==admin.adminPw){
                console.log("Username and pw success"+admin.adminPw);
                loginstatus=true
                response.admin=admin
                response.status=true
               
                resolve(response)
                }else{
                    console.log('login failed pw error');
                    
                    
                        resolve({status:false})
                        
                }
            }else{
                console.log("username error");
                
                resolve({status:false})
            }
            return loginstatus
        
       
    
})
    },
    getAllUsers:()=>{
        return new Promise(async(resolve,reject)=>{
            let users=await db.get().collection("users").find().toArray()
            resolve(users)
        })
    },
    adduser:(userData)=>{
        return new Promise(async(resolve,reject)=>{
            let userExist=await db.get().collection('users').findOne({UserName:userData.UserName})
            if(!userExist){
                
                db.get().collection("users").insertOne(userData).then((data)=>{
                resolve(data)
            })
            }else{
                reject()
            }
            console.log(userData);
        })
    },
    


}
