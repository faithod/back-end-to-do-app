DROP TABLE IF EXISTS to_do_list;

CREATE TABLE to_do_list (
  id SERIAL PRIMARY KEY,
  content VARCHAR(255),
  due DATE,
  complete BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

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
  app.put<{ id: number }, {}, {}>("/todolist/:id", async (req, res) => {
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