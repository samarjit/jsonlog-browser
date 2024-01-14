import express from "express";
import bodyParser from 'body-parser';
import fs from 'fs';
import readline from 'readline';

const app = express();

app.use(bodyParser.json());
// support parsing of application/json type post data
app.use(express.static("public"));
app.use(express.static("public"));

// Search log files which contains json data
app.get('/search', async (req, res, next) => {
  console.log('serving search', req.query)
  // get path params from request
  const queryParams = req.query;

  let topLines = [];
  const backupLines = [];
  let count = 10
  const fileStream = fs.createReadStream('mylog.log');

  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity
  });

  for await (const line of rl) {
    // Each line in input.txt will be successively available here as `line`.
    // console.log(`Line from file: ${line}`);
    const filteredLines = [];
    const parsedLine = JSON.parse(line);
    let found = false;
    if (queryParams) {
      if (queryParams.msgType && queryParams.msgType.includes(parsedLine.msgType)) found = true;
      if (queryParams.msg && parsedLine.msg.includes(queryParams.msg)) found = true;
      if (queryParams.uriTemplate && parsedLine.uriTemplate.includes(queryParams.uriTemplate)) found = true;
      if (queryParams.reqPayload && parsedLine.reqPayload.includes(queryParams.reqPayload)) found = true;
      if (queryParams.resPayload && parsedLine.resPayload.includes(queryParams.resPayload)) found = true;
      if (queryParams.plaintext && line.includes(queryParams.plaintext)){
        found = true;
      }
      if (found) filteredLines.push(line);
    }
    // if (count < 0) break;
    // count --;
    backupLines.push(JSON.parse(line));
    if (filteredLines && filteredLines.length) {
      topLines.push(parsedLine);
      continue;
    }
  }
  if (topLines.length === 0) {
    topLines = backupLines;
  }
  res.json({success: true, result: topLines});
});

// if (import.meta.env.PROD)
app.listen(3000, () => {
  console.log("App listening on http://localhost:3000");
});

console.log('app loaded');
export const viteNodeApp = app;
