const express = require("express");
const graphqlHTTP = require("express-graphql");
const chalk = require("chalk");
const schema = require("./schema/schema");
const mongoose = require("mongoose");
const cors = require("cors");

require("dotenv").config();

const app = express();

//allow cross-orgin access
app.use(cors());

//connections to the database (mlab in this case)
mongoose.connect(`mongodb://${process.env.USER_NAME}:${process.env.USER_PASS}@ds155774.mlab.com:55774/graphql_book_app`);
mongoose.connection.once('open',()=>{
  console.log(chalk.blue("Connected to the database"));
});

app.use("/graphql", graphqlHTTP({
  schema,
  graphiql:true
}));


app.listen(4000,()=>{
  console.log(chalk.blue("Server now running on port 4000"));
});
