const MongoClient =require('mongodb').MongoClient

const state={
    db:null
}

module.exports.connect=function(done){
    const url = 'mongodb://localhost:27017';
    const dbname = 'myproject';
    MongoClient.connect(url,(err,data)=>{
        if (err){
            return done(error)
        }else{
            console.log("Connection success");
            state.db=data.db(dbname)
        }
        done()
    })
    
}
module.exports.get=function(){
    return state.db
}