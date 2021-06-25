const express = require("express");
const cors = require("cors");
const MongoClient = require("mongodb").MongoClient;
const ObjectId = require("mongodb").ObjectId;
require("dotenv").config();
const app = express();

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.xaixv.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;

app.use(cors());
app.use(express.json());

const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
client.connect((err) => {
  const blogCollection = client.db(process.env.DB_NAME).collection("blogs");
  const userCollection = client.db(process.env.DB_NAME).collection("users");

  // Add User
  app.post("/addUser", (req, res) => {
    const user = req.body;
    userCollection.insertOne(user).then((result) => {
      res.send(result.insertedCount > 0);
    });
  });
  // Add Blog
  app.post("/addBlog", (req, res) => {
    const blog = req.body;
    blogCollection.insertOne(blog).then((result) => {
      res.send(result.insertedCount > 0);
    });
  });
  // Get user
  app.get("/user", (req, res) => {
    const email = req.query.email;
    userCollection.find({ email }).toArray((err, collection) => {
      res.send(collection);
    });
  });
  // Get Blogs
  app.get('/blogs', (req, res) => {
    blogCollection.find({}).toArray((err, collection) => res.send(collection))
  })
  app.get('/blog/:id', (req, res) => {
    blogCollection.find({ _id: ObjectId(req.params.id) }).toArray((err, collection) => res.send(collection))
  })
  // Delete Blog
  app.delete("/deleteBlog/:id", (req, res) => {
    blogCollection
      .deleteOne({ _id: ObjectId(req.params.id) })
      .then((result) => res.send(result.deletedCount > 0));
  });

});

const port = process.env.PORT || 8000;
app.listen(port, () => {
  console.log(`App listening at Port:${port}`);
});
