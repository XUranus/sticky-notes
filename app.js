import express from 'express'
import cors from 'cors'
import { MongoClient, ObjectId } from 'mongodb'
import 'dotenv/config'

const app = express()
const port = process.env['STICKY_NOTES_SERVER_PORT']
const uri = process.env['STICKY_NOTES_MONGO_URI']
const mongoClient = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

console.log(`ServerPort = ${port}, MongoURI = ${uri}`)

app.use(express.json())
app.use(cors())
app.use(express.static('static'))

const notesCollection = ()=>mongoClient.db("sticky_notes").collection("notes")

const initAppRouter = ()=>{
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

  console.log(`visit http://localhost:${port}`)
}

mongoClient
.connect()
.then(()=>initAppRouter())
.catch((err)=>{
  console.log('connect to mongo failed: ', err)
  process.exit(1)
})

// Error handler
app.use((err, req, res, next) => {res.status(500).send(err)})

app.listen(port)