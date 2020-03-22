const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const { ApolloServer } = require("apollo-server-express");
const { importSchema } = require("graphql-import");
const mongoose = require("mongoose");

const Token = require("./helpers/token");
const dotenv = require("dotenv");
dotenv.config();

const { MongoClient, Logger } = require("mongodb");
async function connectMongoDB() {
  const client = await MongoClient.connect("mongodb://localhost:27017/reactdb");
  const db = client.db("reactdb");

  let logCount = 0;
  Logger.setCurrentLogger((msg, state) => {
    console.log(`MONGO DB REQUEST ${++logCount}: ${msg}`);
  });
  Logger.setLevel("debug");
  Logger.filter("class", ["Cursor"]);

  return db;
}

const DataLoader = require("dataloader");
const _ = require("lodash");

// const { Client } = require("pg");
// var connectionString = "postgres://postgres:postgres@localhost:5432/reactdb";
// const client = new Client({
//   connectionString: connectionString
// });

const resolvers = require("./graphql/resolvers");

async function main() {
  const db = await connectMongoDB();

  const loader = new DataLoader(async ids => {
    const results = await db
      .collection("posts")
      .find({ user: { $in: ids } })
      .toArray();
    return results;
  });

  const typeDefs = await importSchema("./graphql/schema.graphql");
  const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: async ({ req }) => {
      // let user = null;
      // const token = req.headers.authorization || "";
      // if (token && token !== "null") {
      //   try {
      //     user = await Token.verify(token);
      //     if (!user)
      //       throw new AuthenticationError(
      //         "you must be logged in to query this schema"
      //       );
      //   } catch (e) {
      //     throw new AuthenticationError(
      //       "you must be logged in to query this schema"
      //     );
      //   }
      // }

      return {
        db,
        loader,
        // User,
        // Post,
        activeUser: req ? req.activeUser : null
      };
    }
  });

  const app = express();
  app.use(cors());
  app.use(bodyParser.json({ limit: "50mb" }));
  app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));
  //Public Dir
  app.use(express.static("public"));
  //Auth Middleware
  // app.use(async (req, res, next) => {
  //   const token = req.headers["authorization"];
  //   if (token && token !== "null") {
  //     try {
  //       req.activeUser = await Token.verify(token);
  //     } catch (e) {
  //       throw new Error(e);
  //     }
  //   }
  //   next();
  // });

  server.applyMiddleware({ app });
  app.listen({ port: process.env.PORT }, () =>
    console.log(
      `🚀 Server ready at http://localhost:${process.env.PORT}${server.graphqlPath}`
    )
  );
}

main().catch(err => console.error(err));
