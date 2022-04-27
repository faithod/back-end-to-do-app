//docs on: "How to test Express.js with Jest and Supertest" (https://www.albertgao.xyz/2017/05/24/how-to-test-expressjs-with-jest-and-supertest/) - stated that you need to seperate your app & server
//The reason behind this is that it won’t listen to the port after testing.

import app from "./server";

//Start the server on the given port
const port = process.env.PORT;
if (!port) {
  throw "Missing PORT environment variable.  Set it in .env file.";
}
app.listen(port, () => {
  console.log(`Server is up and running on port ${port}`);
});
