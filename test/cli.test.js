// // test cli command

// import {test} from "node:test";
// import assert from "node:assert";

// import { exec } from "node:child_process";

// const pExec = (cmd) => {
//   return new Promise((resolve, reject) => {
//     exec(cmd, (error, stdout, stderr) => {
//       if (error) reject(error);
//       resolve(stdout);
//     });
//   });
// }

// test("should return a list of buckets", async () => {
//   const response = await pExec("node dist/cli.js");
//   console.log(response);
// });