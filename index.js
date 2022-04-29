// Notes Taker server
const express = require("express");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
require("dotenv").config();
const app = express();
const cors = require("cors");
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());

// connect DB
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ssbcp.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});
// console.log(client);
async function run() {
  try {
    await client.connect();
    const notesCollection = client.db("notesTracker").collection("notes");

    // GET : get API to read all notes
    // http://localhost:5000/notes
    // https://gentle-badlands-20791.herokuapp.com/notes
    app.get("/notes", async (req, res) => {
      /* const query = req.query;
            console.log(query) */
      const cursor = notesCollection.find({});
      const result = await cursor.toArray();
      res.send(result);
    });

    // POST : Create Notes
    // http://localhost:5000/note
    // https://gentle-badlands-20791.herokuapp.com/note
    /*****************************
         * Data Format
         * body {
                "userName": "Shubrato Kumar",
                "textData": "Note Tracker"}
         * 
        */
    app.post("/note", async (req, res) => {
      const data = req.body;
    //   console.log(data);
      const result = await notesCollection.insertOne(data);
      res.send(result);
    });

    // Update Notes
    // https://gentle-badlands-20791.herokuapp.com/note/${id}
    app.put("/note/:id", async(req,res)=>{
        const id = req.params.id;
        const data = req.body;
        // console.log("data from put", data)
        const filter = {_id : ObjectId(id)};
        const options = { upsert: true };
        const updateDoc = {
            $set: {
                ...data
                // res.body     or 
                /* userName: data.userName, 
                textData: data.textData  */
            },
          };
        const result = await notesCollection.updateOne(filter, updateDoc, options);
        // console.log(result);
        res.send(result);
    })

    // Delete Notes
    // https://gentle-badlands-20791.herokuapp.com/note/${id}
    app.delete('/note/:id', async(req,res)=>{
        const id = req.params.id;
        const query = {_id: ObjectId(id)};
        const result = await notesCollection.deleteOne(query);
        console.log(result)
        res.send(result);
    })

  } finally {
    //   await client.close();
  }
}
run().catch(console.dir);

// server test
app.get("/", (req, res) => {
  res.send("Notes Tracker Server Running ...");
});
app.listen(port, () => {
  console.log(`Linstening the port from the port :${port}`);
});
