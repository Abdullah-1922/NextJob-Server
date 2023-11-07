 const express = require('express');
 const cors = require('cors');
 const app = express();
 const port =process.env.PORT || 5000;
 const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
 require('dotenv').config()
 app.use(cors());
 app.use(express.json());



 const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.kdy82ie.mongodb.net/?retryWrites=true&w=majority`;
 
 const client = new MongoClient(uri, {
   serverApi: {
     version: ServerApiVersion.v1,
     strict: true,
     deprecationErrors: true,
   }
 });
const jobCollection =client.db("nextJob").collection("allJobs")

 async function run() {
   try {
     
     await client.connect();
     
     await client.db("admin").command({ ping: 1 });
     console.log("Pinged your deployment. You successfully connected to MongoDB!");
   } finally {
     
    //  await client.close();
   }
 }
 run().catch(console.dir);

app.post('/alljobs',async(req,res)=>{
  const job = req.body;
  try{
    const result =await jobCollection.insertOne(job);
    res.send(result);
    

  }catch(err){
    return {message:err.message ,err:true}
  }
  
})

app.get('/myJobs', async(req,res)=>{

  const query = {email: req.query.email}
   
  try{
    const result =await jobCollection.find(query).toArray();
    res.send(result);
  }catch(err){
    return {message:err.message ,err:true}
  }
  
})
app.delete('/alljobs/:id',async(req,res)=>{
  const id =req.params.id;
   const query = {_id:new ObjectId(id)}
   try{
    const result =await jobCollection.deleteOne(query);
    res.send(result);
   }catch(err){
    return {message:err.message ,err:true}
   }
})
app.get('/updatejob/:id',async(req,res)=>{
const id =req.params.id;
const query = {_id:new ObjectId(id)}
try{
  const result =await jobCollection.findOne(query);
  res.send(result);
}catch(err){
  return {message:err.message ,err:true}
}

})
app.put('/updatejob/:id',async(req,res)=>{
  const id =req.params.id;
  const job = req.body;
  const filter = {_id:new ObjectId(id)}
  const options={upsert:true}
  const updatedJob ={
    $set:job
  }
  try{
    const result =await jobCollection.updateOne(filter,updatedJob,options);
    res.send(result);
   
  }catch(err){
    return {message:err.message ,err:true}
  }
})
// app.get('/alljob',async(req,res)=>{
// const filter= {category:req.query.category };

// console.log(filter);

//   const result =await jobCollection.find(filter).toArray();
//   console.log(result);
//   res.send(result);

// })
app.get('/alljob', async(req,res)=>{

  const query = {category: req.query.category}
   
  try{
    const result =await jobCollection.find(query).toArray();
  await  console.log(result);
    res.send(result);
  }catch(err){
    return {message:err.message ,err:true}
  }
  
})
 app.get('/',(req,res)=>{
    res.send('server is running')
 })
 app.listen(port,()=>{
    console.log('server is running');
 })