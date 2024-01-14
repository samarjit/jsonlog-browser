import express from "express";
import bodyParser from 'body-parser';
import fs from 'fs';
import readline from 'readline';

const app = express();

app.use(bodyParser.json());
// support parsing of application/json type post data
app.use(express.static("public"));
app.use(express.static("public"));

function applyANDcondition(queryParams, foundAr) {
  if (!foundAr || !foundAr.length) return false;
  let allConditionNotMet = true;
  Object.entries(queryParams)
  .reduce((prev, curr) => { if(curr[1] != '')prev.push(curr[0]); return prev; }, [])
  .forEach(qp => {
    if (!foundAr.includes(qp)) {
      allConditionNotMet = false;
    }
  });
  return allConditionNotMet;
}
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
    let parsedLine ; 
    try {
       parsedLine = JSON.parse(line);
    } catch (e) { console.log('invalid json'); continue;}
    let found = [];
    if (queryParams) {
      if (queryParams.msgType && queryParams.msgType.includes(parsedLine.msgType)) found = ['msgType',...found];
      if (queryParams.msg && parsedLine.msg.includes(queryParams.msg)) found = ['msg',...found];
      if (queryParams.traceId && parsedLine.context && parsedLine.context['idp-trace-id'] && parsedLine.context['idp-trace-id'].includes(queryParams.traceId)) found = ['traceId',...found];
      if (queryParams.uriTemplate && parsedLine.uriTemplate.includes(queryParams.uriTemplate)) found = ['uriTemplate',...found];
      if (queryParams.reqPayload && parsedLine.reqPayload.includes(queryParams.reqPayload)) found = ['reqPayload',...found];
      if (queryParams.resPayload && parsedLine.resPayload.includes(queryParams.resPayload)) found = ['resPayload',...found];
      if (queryParams.plaintext && line.includes(queryParams.plaintext)){        found = ['plaintext',...found];      }
      if (applyANDcondition(queryParams, found)) filteredLines.push(line);
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
    console.log('nothing matched filteratin criteria')
    topLines = backupLines;
  } else {
    console.log('returning filtered lines');
  }
  res.json({success: true, result: topLines});
});
console.log('sendig response')
// if (import.meta.env.PROD)
app.listen(3000, () => {
  console.log("App listening on http://localhost:3000");
});

console.log('app loaded');
export const viteNodeApp = app;
