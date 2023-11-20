import express from "express";
import bodyParser from 'body-parser';
import fs from 'fs';
import readline from 'readline';

const app = express();

app.use(bodyParser.json());
// support parsing of application/json type post data
app.use(express.static("public"));
app.use(express.static("public"));
app.get('/search', async (req, res, next) => {
  console.log('serving search')
  const topLines = [];
  let count = 10
  const fileStream = fs.createReadStream('mylog.log');

  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity
  });

  for await (const line of rl) {
    // Each line in input.txt will be successively available here as `line`.
    console.log(`Line from file: ${line}`);
    if (count < 0) break;
    count --;
    topLines.push(JSON.parse(line));
  }

  res.json({success: true, result: topLines});
});

// if (import.meta.env.PROD)
app.listen(3000, () => {
  console.log("App listening on http://localhost:3000");
});

console.log('app loaded');
// export const viteNodeApp = app;
