import express from "express";
import bodyParser from 'body-parser';
import fs from 'fs';
import readline from 'readline';
import cors from 'cors';

const app = express();

// app.use(cors);
app.use(bodyParser.json());
// support parsing of application/json type post data
app.use(express.static("public"));
app.use(express.static("public"));

function applyANDcondition(queryParams, foundAr) {
  if (!foundAr || !foundAr.length) return false;
  let allConditionNotMet = true;
  Object.entries(queryParams).filter(i => i[1] != '')
  .reduce((prev, curr) => { if(curr[1] != '')prev.push(curr[0]); return prev; }, [])
  .forEach(qp => {
    if (!foundAr.includes(qp)) {
      allConditionNotMet = false;
    }
  });
  return allConditionNotMet;
}
// Search log files which contains json data
app.get('/api/search', searchHandler);
app.post('/api/search', searchHandler);

/**
 * sample obj {"@timestamp":"2023-12-16 03:51:31.838 GMT","level":"DEBUG","thread":"http-nio-8080-exec-9","logger":"c.a.i.l.R.eus.1328224815","msgType":"REST-OB-REQ",
 * "sMsg":{"reqHeaders":{"content-length":"145","idpctx-feature-svc-oms-eus-secondary-uri-enabled":"true","idpctx-session-id":"58fa372851c-4d66-8c9b-96177f3998","idpctx-feature-svc-cpop-bb-tmf-oms-crp-enabled":"true","x-att-clientid":"OMSAdaptorMs","idpctx-feature-svc-bb-tmf-oms-groupconflict-rule-execution-enabled":"false","idp-trace-id":"d12daf6b98d2f566:d12daf6b98d2f566:0:1","idpctx-appname":"cpop","x-att-conversationid":"58fa372851c-4d66-8c9b-96177f3998","accept":"text/plain, application/json, application/x-jackson-smile, application/xml, application/*+json, text/xml, ","authorization":"Basic xxxxxxxxxx","idpctx-feature-eus-cache-enabled":"true","content-type":"application/json"},
 * "method":"POST","uri":"https://unifiedservices.it.att.com/restservices/unifiedservices/v1/unifiedOrderManagement/initiateUnifiedOrder",
 * "reqPayload":"{\"InitiateUnifiedOrderRequest\":{\"addressId\":\"0000099Z3P\",\"customerSubType\":\"R\",\"productType\":[\"UV\"],\"orderActionType\":\"A\",\"maxPairsToAnalyze\":5}}","uriTemplate":"/restservices/unifiedservices/v1/unifiedOrderManagement/initiateUnifiedOrder"},
 * "context":{"idp-trace-id":"d12daf6b98d2f566:d12daf6b98d2f566:0:1",
 * "idpctx-session-id":"58fa372851c-4d66-8c9b-96177f3998",
 * "x-att-clientid":"CpopPricingMs"},"seq":143,"format":"nf-v1.0"}
 * @param {*} queryParams queryParam['sMsg.uriTemplate'] = 'https://unifiedservices.it.att.com'
 * @param {*} key sMsg.uriTemplate
 * @param {*} obj {sMsg: {uriTemplate: 'xyz',  }
 * @param {*} found retult with key if found
 */
function findObj(queryParams, key, obj, found) {
  const keys = key.split('.');
  let currentObj = obj;
  for (const k of keys) {
    currentObj = currentObj && currentObj[k];
  }
  if (currentObj && !Array.isArray(queryParams[key]) && typeof queryParams[key] === 'object') {
    Object.keys(queryParams[key]).forEach(qp => {
      findObj(queryParams[key], qp, currentObj, found);
    });
    found.push(key);
  }
  if (currentObj && (typeof currentObj === 'string') && currentObj.includes(queryParams[key])) {
    found.push(key);
  }
  if (currentObj && (typeof currentObj === 'number' && currentObj === parseFloat(queryParams[key]))) {
    found.push(key);
  }
  if (queryParams[key] && Array.isArray(queryParams[key])) {
    const matched = queryParams[key].find(qp => currentObj.includes(qp));
    if (matched) found.push(key);
  }
}

async function searchHandler(req, res, next) {
  console.log('serving search', req.query , 'post data', req.body)
  // get path params from request
  const queryParams = req.query || req.body;

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
    } catch (e) {continue;}
    let found = [];
    if (queryParams) {
      for (const key in queryParams) {
        if (queryParams[key] === '') continue;
        findObj(queryParams, key, parsedLine, found);
      }
      // if (queryParams.msgType && queryParams.msgType.includes(parsedLine.msgType)) found = ['msgType',...found];
      // if (queryParams.msg && parsedLine.msg.includes(queryParams.msg)) found = ['msg',...found];
      // if (queryParams.traceId && parsedLine.context && parsedLine.context['idp-trace-id'] && parsedLine.context['idp-trace-id'].includes(queryParams.traceId)) found = ['traceId',...found];
      // if (queryParams.uriTemplate && parsedLine.uriTemplate.includes(queryParams.uriTemplate)) found = ['uriTemplate',...found];
      // if (queryParams.reqPayload && parsedLine.reqPayload.includes(queryParams.reqPayload)) found = ['reqPayload',...found];
      // if (queryParams.resPayload && parsedLine.resPayload.includes(queryParams.resPayload)) found = ['resPayload',...found];
      // if (queryParams.plaintext && line.includes(queryParams.plaintext)){        found = ['plaintext',...found];      }
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
   // topLines = backupLines;
    res.json({success: false, result: [], errorMsg: 'No matching lines found'});
    return;
  } else {
    console.log('returning filtered lines');
  }
  res.json({success: true, result: topLines, errorMsg: ''});
}

console.log('sendig response')
// if (import.meta.env.PROD)
app.listen(3000, () => {
  console.log("App listening on http://localhost:3000");
});

console.log('app loaded');
export const viteNodeApp = app;
