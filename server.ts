import { Client } from "pg";
import { config } from "dotenv";
import express from "express";
import cors from "cors";

config(); //Read .env file lines as though they were env vars.

//Call this script with the environment variable LOCAL set if you want to connect to a local db (i.e. without SSL)
//Do not set the environment variable LOCAL if you want to connect to a heroku DB.

//For the ssl property of the DB connection config, use a value of...
// false - when connecting to a local DB
// { rejectUnauthorized: false } - when connecting to a heroku DB
const herokuSSLSetting = { rejectUnauthorized: false };
const sslSetting = process.env.LOCAL ? false : herokuSSLSetting;
const dbConfig = {
  connectionString: process.env.DATABASE_URL,
  ssl: sslSetting,
};

const app = express();

app.use(express.json()); //add body parser to each following route handler
app.use(cors()); //add CORS support to each following route handler

const client = new Client(dbConfig);
client.connect().then(() => {
  //making sure the connection is successful

  // app.get("/", async (req, res) => {
  // });

  //GET /todolist
  app.get("/todolist", async (req, res) => {
    const dbres = await client.query("select * from to_do_list order by id"); //order by id so that when user edits a to-do item, it stays in the same position
    const toDoList = dbres.rows;
    res.json({
      result: "success",
      data: toDoList,
    });
  });

  //GET /todolist/:id
  app.get<{ id: number }, {}, {}>("/todolist/:id", async (req, res) => {
    const { id } = req.params;

    const dbres = await client.query(
      `select * from to_do_list where id = $1 `,
      [id]
    );
    const toDoListItem = dbres.rows;
    if (toDoListItem.length === 0) {
      //checking if id exists
      res.status(404).json({
        result: "failed",
        data: `ID: ${id} does not exist`,
      });
    } else {
      res.json({
        result: "success",
        data: toDoListItem,
      });
    }
  });

  //POST /todolist
  app.post<{}, {}, { content: string; due: string }>(
    "/todolist",
    async (req, res) => {
      const { content, due } = req.body;
      const dbres = await client.query(
        "insert into to_do_list (content,due) values ($1,$2) returning *",
        [content, due]
      );
      const insertedToDo = dbres.rows;
      res.json({
        result: "success",
        data: insertedToDo,
      });
    }
  );

  //PUT /todolist/:id
  app.put<{ id: number }, {}, { content: string; due: string }>(
    "/todolist/:id",
    async (req, res) => {
      const { content, due } = req.body;
      const { id } = req.params;

      //checking if id exists
      const dbres1 = await client.query(
        `select * from to_do_list where id = $1 `,
        [id]
      );
      if (dbres1.rows.length === 0) {
        res.status(404).json({
          result: "failed",
          data: `ID: ${id} does not exist`,
        });
      }

      const dbres2 = await client.query(
        "update to_do_list set content = $1, due = $2 where id = $3 returning *",
        [content, due, id]
      );
      const updatedToDo = dbres2.rows;
      res.json({
        result: "success",
        data: updatedToDo,
      });
    }
  );

  //DELETE /todolist/:id
  app.delete<{ id: number }, {}, {}>("/todolist/:id", async (req, res) => {
    const { id } = req.params;

    //checking if id exists
    const dbres1 = await client.query(
      `select * from to_do_list where id = $1 `,
      [id]
    );
    if (dbres1.rows.length === 0) {
      res.status(404).json({
        result: "failed",
        data: `ID: ${id} does not exist`,
      });
    }

    const dbres2 = await client.query(
      "delete from to_do_list where id = $1 returning *",
      [id]
    );
    const deletedToDo = dbres2.rows;
    res.json({
      result: "success",
      data: deletedToDo,
    });

    // https://developer.mozilla.org/en-US/docs/Web/HTTP/Methods/DELETE#responses
    // we've gone for '200 response with JSON body' to respond to a DELETE
    //  but 204 with no response body is another alternative:
    //  res.status(204).send() to send with status 204 and no JSON body
  });
});

//Start the server on the given port
const port = process.env.PORT;
if (!port) {
  throw "Missing PORT environment variable.  Set it in .env file.";
}
app.listen(port, () => {
  console.log(`Server is up and running on port ${port}`);
});
