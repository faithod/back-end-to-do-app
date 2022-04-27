import supertest from "supertest";
import app from "./server";

test("GET /todolist responds with a result message and data", async () => {
  const response = await supertest(app).get("/todolist");

  //   expect(typeof response.body.result).toBe("string");
  expect(response.body.result).toMatch(/success/); //checks that this appears somewhere in the string
  expect(Object.keys(response.body.data).length).toEqual(5);
  expect(response.body).toBeDefined();
});

//example of data:
//[ {
//     "id": 2,
//     "content": "start a new project",
//     "due": "2022-04-10T23:00:00.000Z",
//     "complete": true,
//     "created_at": "2022-04-13T12:16:28.852Z"
// }...]
