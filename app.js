const express = require('express')
const path = require('path')
const app = express()
const cors = require('cors'); 

/************** Config **************** */
const uri = "Your MongoDB Connection URI";
const port = 9000
/****************************************/

const { MongoClient, ObjectId } = require('mongodb');
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });


const connectMongoDB = async ()=>{await client.connect()}
const notesCollection = ()=> client.db("sticky_notes").collection("notes")

connectMongoDB()

app.use(express.json())
app.use(cors())
app.use(express.static('static'))

// Routers
app.get('/all', async (req, res) => {
  let notes = await notesCollection().find({deleted: false}).toArray()
  res.send({notes})
})

app.get('/delete/:id', async (req, res) => {
  let id = req.params.id
  let result = await notesCollection().updateOne({_id: ObjectId(id)}, {$set: {deleted:true, deleted_at: new Date()}})
  console.log(result)
  res.send({ok: result.acknowledged})
})

app.post('/update', async (req, res) => {
  let {id, content} = req.body
  let updated_at = new Date()
  let newNote = {content, updated_at}
  let result = await notesCollection().updateOne({_id: ObjectId(id)}, {$set: newNote})
  res.send({ok: result.acknowledged})
})

app.post('/new', async (req, res)=> {
  let {content} = req.body
  let note = {
    deleted: false,
    content,
    created_at: new Date(),
    updated_at: new Date()
  }
  let result = await notesCollection().insertOne(note)
  let {insertedId} = result
  res.send({ok: result.acknowledged, insertedId})
})

// Error handler
app.use((err, req, res, next) => {res.status(500).send(err)})

app.listen(port)

module.exports = app
