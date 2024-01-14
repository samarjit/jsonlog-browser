import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import {signal } from '@preact/signals-react'

const ctr = signal(0);

function App() {
  const [count, setCount] = useState(0)
  const [searchResult, setSearchResult] = useState([]);
  async function search() {
    const respData = await fetch('http://localhost:8081/api/search').then(res=>res.json());
    console.log('search called', respData);
    // const {'@timestamp': datetime, 'level': level, 'msgType': msgType,
    //   sMsg: { msg, reqHeaders, reqPayload, resPayload, uriTemplate}, 
    //   context: {'idp-trace-id': traceId}} = {
    //   "@timestamp": "2023-11-05 18:14:53.745 GMT",
    //   level: "INFO",
    //   thread: "RxCachedThreadScheduler-2",
    //   logger: "c.a.i.c.p.PricingCartProcessor",
    //   msgType: "SERVICE-MSG",
    //   sMsg: {
    //   msg: "START getActivePricingByKey ...wireless-sdg"
    //   },
    //   context: {
    //   "idp-trace-id": "b730e2f928efb5ed:e15ce5ed4c756286:b730e2f928efb5ed:1"
    //   },
    //   seq: 638,
    //   format: "nf-v1.0"
    // };
    // console.log(datetime)
    if (respData.result) {
      const formattedResult = respData.result.map( res => {
        const {'@timestamp': datetime, 'level': level, 'msgType': msgType,
      sMsg: { msg, reqHeaders, reqPayload, resPayload, uriTemplate}, 
      context: {'idp-trace-id': traceId}} = res;
        return {
          datetime,
          level,
          msgType,
          msg,
          uriTemplate,
          reqHeaders,
          reqPayload,
          resPayload,
          traceId,
        }
      });

      setSearchResult (formattedResult);
    }
  }
  return (
    <>
      <div>
        <a href="https://vitejs.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>
          Edit <code>src/App.jsx</code> and save to test HMR
        </p>
      </div>
      <h1 className='text-3xl font-bold underline'>Signal test</h1>
      <button type="button" onClick={()=>{ctr.value++}}>Search</button> {ctr.value}
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
      <button type="button" onClick={() => search()}>Search</button>
      <table className='td-border'>
        <tbody>
        {searchResult.map((val, idx) =>
         (<tr key={idx}>
          <td>{val.datetime}</td>
          <td>{val.level}</td>
          <td>{val.msgType}</td>
          <td><div className='truncate overflow-hidden hover:overflow-auto w-40 h-14'>{val.msg}</div></td>
          <td><div className='truncate hover:overflow-auto w-40 h-14'>{val.uriTemplate}</div></td>
          <td className='relative'><div className='truncate  hover:overflow-auto w-40 h-14 text-left align-top'  >{JSON.stringify(val.reqHeaders)}</div></td>
          <td><div className='truncate overflow-hidden hover:overflow-auto w-40 h-14'>{JSON.stringify(val.reqPayload)}</div></td>
          <td><div className='truncate overflow-hidden hover:overflow-auto w-40 h-14'>{JSON.stringify(val.resPayload)}</div></td>
          <td>{val.traceId}</td>
          </tr>)
        )}
        </tbody>
      </table>
    </>
  )
}

export default App
