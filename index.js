const express = require("express");

const { MongoClient } = require("mongodb");

const ObjectId = require("mongodb").ObjectId;

require("dotenv").config();

const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

const port = process.env.PORT || 3001;

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.tyr9s.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

async function run() {
  try {
    await client.connect();
    const database = client.db("lenshowdb");
    const productCollection = database.collection("products");
    const orderCollection = database.collection("orders");
    const reviewCollection = database.collection("review");
    const userCollection = database.collection("user");

    // find all the team members from db
    app.get("/reviews", async (req, res) => {
      const cursor = reviewCollection.find({});

      const result = await cursor.toArray();
      res.json(result);
    });

    // insert a review in db
    app.post("/add-review", async (req, res) => {
      const review = req.body;
      const result = await reviewCollection.insertOne(review);
      res.json(result);
    });

    // insert a product in db
    app.post("/add-a-product", async (req, res) => {
      const review = req.body;
      const result = await productCollection.insertOne(review);
      res.json(result);
    });

    // insert a user in db
    app.post("/user-add", async (req, res) => {
      const product = req.body;
      const result = await userCollection.insertOne(product);
      res.json(result);
    });

    // find all the products from db
    app.get("/products", async (req, res) => {
      const cursor = productCollection.find({});
      const result = await cursor.toArray();

      res.json(result);
    });

    // get a single product from db
    app.get("/products/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await productCollection.findOne(query);

      res.json(result);
    });

    // find all the orders from db
    app.get("/users", async (req, res) => {
      const cursor = userCollection.find({});
      const result = await cursor.toArray();

      res.json(result);
    });
    // find all the orders from db
    app.get("/orders", async (req, res) => {
      const cursor = orderCollection.find({});
      const result = await cursor.toArray();

      res.json(result);
    });

    // insert an order in db
    app.post("/place-order", async (req, res) => {
      const product = req.body;
      const result = await orderCollection.insertOne(product);
      res.json(result);
    });

    // find orders by id
    app.get("/orders/:email", async (req, res) => {
      const email = req.params.email;
      const query = { email: email };
      const cursor = orderCollection.find(query);
      const result = await cursor.toArray();

      res.json(result);
    });

    // delete an order
    app.delete("/orders/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await orderCollection.deleteOne(query);

      res.json(result);
    });

    // delete a product
    app.delete("/products/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await productCollection.deleteOne(query);

      res.json(result);
    });

    // make a user admin
    app.put("/users/:email", async (req, res) => {
      const email = req.params.email;
      const filter = { email: email };
      const options = { upsert: true };
      const updateDoc = {
        $set: {
          role: "admin",
        },
      };
      const result = await userCollection.updateOne(filter, updateDoc, options);

      res.json(result);
    });

    // update state of the order
    app.put("/orders/:id", async (req, res) => {
      const id = req.params.id;
      const updatedOrder = req.body;
      const filter = { _id: ObjectId(id) };
      const updateDoc = {
        $set: {
          status: updatedOrder.status,
        },
      };
      const result = await orderCollection.updateOne(filter, updateDoc);

      res.json(result);
    });
  } finally {
    // await client.close()
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  console.log("server started");
  res.send("hello from server");
});

app.listen(port, () => {
  console.log("listening to port", port);
});
