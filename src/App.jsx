import { useEffect, useReducer, useRef, useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import {signal } from '@preact/signals-react'
import ReactJson from 'react-json-view'
import useDraggable from './components/UseDraggable'
import { useFetcher } from "react-router-dom";
import {
  QueryClient,
  QueryClientProvider,
  useMutation,
  useQuery,
} from '@tanstack/react-query';

// import { nordTheme } from '@uiw/react-json-view/nord';
const ctr = signal(0);

// This is a simple modal component
const Modal = ({ content, onClose, position }) => (
  <div className="modal" style={{ position: 'absolute', top: position.top, left: position.left }}>
    <div className="modal-content w-96 max-h-80 overflow-hidden border border-gray-500 p-2 bg-white bg-opacity-100">
      <div className="flex justify-between items-start">
        <p className="overflow-ellipsis break-words overflow-hidden">{content}</p>
        <button 
          onClick={onClose} 
          className="close  text-gray-50 bg-red-500 rounded w-6 h-6 flex items-center justify-center"
        >
          &times;
        </button>
      </div>
    </div>
  </div>
);
const quickAndDirtyStyle = {
  width: "20px",
  height: "200px",
  background: "#FF9900",
  color: "#FFFFFF",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  position: "fixed",
  zIndex: 100,
  writingMode:'vertical-rl',
  top: 0
};

const SpitPanel = ({rowJson, onClose}) => {

  const [beforeDragWidth, setBeforeDragWidth] = useState(380);
  const [viewWidth, setViewWidth] = useState(380);
  const [pos, setPos] = useState({x: window.visualViewport.width - 380 - 25});
  const [ref, pressed] = useDraggable({
    onDrag: (x) => {setPos(x);
      const width = window.visualViewport.width - x.x - 25;
       setViewWidth(width); 
       return x;
    },
    onDragEnd: (x) => {console.log('dragEnd',x);
      // setBeforeDragWidth(beforeDragWidth => beforeDragWidth - parseInt(x.relx));
      const width = window.visualViewport.width - x.x - 25;
      setViewWidth(width);
    } 
  });
  return (
    <>
    <aside className='h-full ' ref={ref} style={{...quickAndDirtyStyle, left: pos.x+'px'}}><p>{pos.relx}x{pos.y}</p></aside>
    <div className="modal split-panel fixed right-0 top-0 flex ">
      <div className="modal-content" style={{width: viewWidth+'px'}}>
        <div className="modal-body  h-screen overflow-scroll  border border-gray-500  bg-white bg-opacity-100"
          >
          <div className="modal-inner-body">
            <ReactJson src={rowJson} quotesOnKeys={false} displayDataTypes={false} />
          </div>
          <div className="spacer ">x</div>
        </div>
      </div>
      <button onClick={onClose} 
          className="close text-gray-50 bg-red-500 rounded w-6 h-6 flex items-center justify-center">&times;</button>
    </div>
    </>
  )
}

function reducer(state, action) {
  switch (action.type) {
    case 'increment':
      return {age: state.age + 1};
    case 'decrement':
      return {age: state.age - 1};
    default:
      return {age: state.age};
  }
}

const queryClient = new QueryClient()


/**
 *  // Sample Log Line
 * @example
 *  const {'@timestamp': datetime, 'level': level, 'msgType': msgType,
 *   sMsg: { msg, reqHeaders, reqPayload, resPayload, uriTemplate}, 
 *   context: {'idp-trace-id': traceId}} = {
 *   "@timestamp": "2023-11-05 18:14:53.745 GMT",
 *   level: "INFO",
 *   thread: "RxCachedThreadScheduler-2",
 *   logger: "c.a.i.c.p.PricingCartProcessor",
 *   msgType: "SERVICE-MSG",
 *   sMsg: {
 *   msg: "START getActivePricingByKey ...wireless-sdg"
 *   },
 *   context: {
 *   "idp-trace-id": "b730e2f928efb5ed:e15ce5ed4c756286:b730e2f928efb5ed:1"
 *   },
 *   seq: 638,
 *   format: "nf-v1.0"
 * };
 * 
 * @returns 
 */
function App() {
  const [searchResult, setSearchResult] = useState([]);
  const [searchCriteria, setSearchCriteria] = useState([]);
  const [modalContent, setModalContent] = useState(null);
  const [position, setPosition] = useState({ top: 0, left: 0 });
  const [rowJson, setRowJson] = useState(null);
  const ref = useRef();
  const [state, dispatch] = useReducer(reducer, { age: 42 });
  
  // const { data, error, status } = useQuery({
  //   queryKey: ['query', searchCriteria],
  //   queryFn: async ({ queryKey }) => {
  //     console.log('Querying in useQuery', JSON.stringify(Object.fromEntries(queryKey[1].entries())))
  //     const respData = await fetch('/api/search', {
  //       method: 'get',
  //       // body:  queryKey[1],
  //       body: JSON.stringify(Object.fromEntries(queryKey[1].entries())),
  //       headers: {
  //         'Content-Type': 'application/json',
  //         'Accept': '*/*' 
  //       }
  //     }).then(res=>res.json());
  //     console.log('result received', respData)
  //     return respData;
  //   }
  // })
  // useEffect(() => {
  //   displayResultsInTable(data);
  // }, [data]);
  useEffect(() => {
    console.log('search criteria changed');
    for(let i of searchCriteria.entries()) {
      console.log(i)
    }
  }, [searchCriteria]);

  useEffect(function initFormDataFromLocalStorage () {
    var serializedData = localStorage.getItem('searchParams');
    new URLSearchParams(serializedData).forEach((value, key) => {
      const inputElement = ref.current.elements.namedItem(key);
      if (inputElement && (inputElement.type === 'checkbox' || inputElement.type === 'radio') ) {
        inputElement.checked = true;
      }
      if (inputElement) {
          inputElement.value = value;
      } 
    });
  }, []);

  function displayResultsInTable(respData) {
    if (respData && respData.result) {
      const formattedResult = respData.result.map( res => {
        // if (res && !res.context['idp-trace-id']) return;
      const {'@timestamp': datetime, 'level': level, 'msgType': msgType,
        sMsg: { msg, reqHeaders, reqPayload, resPayload, uriTemplate} = {}, 
        context: {'idp-trace-id': traceId} = {} } = res;
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
      }).filter(x => x);

      setSearchResult (formattedResult);
    }
  }

  async function search() {
    const formData = new FormData(ref.current);
    // for(let i of formData.entries()) {
    //   console.log(i)
    // }
    const params = new URLSearchParams(formData);
  // fetch("/path/to/server", {method:"POST", body:params})
  // const respData = await new Response(params).text();
    const url = new URL(location.href + 'api/search');
    url.search = params;
    localStorage.setItem('searchParams', params);
    setSearchCriteria(formData);
    const respData = await fetch(url, {data: formData}).then(res=>res.json());
    // const respData = await fetch('/api/search', {
    //         method: 'post',
    //         body: JSON.stringify(Object.fromEntries(formData.entries())),
    //         headers: {
    //           'Content-Type': 'application/json',                 
    //           'Accept': '*/*' 
    //         },
    //       }).then(res=>res.json());
    console.log('search called', respData);
    displayResultsInTable(respData)
  }

  const handleCellClick = (ev) => {
    console.log('rendering modal')
    // const rect = ev.target.getBoundingClientRect();
    const rect = {left: ev.pageX, top: ev.pageY}
    setPosition({ top: rect.top, left: rect.left });
    setModalContent(ev.target.innerText);
  };

  const handleClose = () => {
    setModalContent(null);
  };
  function showJsonInSplitPage(rowJson) {
    // display rowJson in a split page
    setRowJson(rowJson);
  }
  const handleSplitPanelClose = () => {
    setRowJson(null);
  }
  return (
    <QueryClientProvider client={queryClient}>
    <>
      <nav className="fixed bg-gray-700 top-0 w-full h-14 flex">
        <div className="p-2"><img src={reactLogo} className="logo react w-full h-full  p-0 " alt="React logo" /></div>
        <div className='p-2'><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="cursor-pointer h-full text-gray-200">
          <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
          </svg>
        </div>
        <div className="content text-gray-300 text-lg font-bold flex-grow flex items-center ">My ELK</div>
        <div className="p-2"><img src={reactLogo} className="logo react w-full h-full p-0" alt="React logo" /></div>
      </nav>
       
      <div className="m-2 mt-16">
        {position && JSON.stringify(position)}
        <form ref={ref}>
          <fieldset className='grid grid-cols-2'>
            <div>datetime:</div><div> <input name="datetime" className=' '/></div>
            <div>msgType:</div>
            <div>
              <label> <input type="checkbox" name="msgType[0]" id="" value="REST-IB-REQ" /> REST-IB-REQ</label><br/>
              <label> <input type="checkbox" name="msgType[1]" id="" value="REST-OB-REQ" /> REST-OB-REQ</label><br/>
              <label> <input type="checkbox" name="msgType[2]" id="" value="REST-OB-RES" /> REST-OB-RES</label><br/>
              <label> <input type="checkbox" name="msgType[3]" id="" value="REST-OB-ERROR" /> REST-OB-ERROR</label><br/>
              <label> <input type="checkbox" name="msgType[4]" id="" value="REST-IB-RES" /> REST-IB-RES</label><br/>
              <label> <input type="checkbox" name="msgType[5]" id="" value="REST-IB-ERROR" /> REST-IB-ERROR</label><br/>
              <label> <input type="checkbox" name="msgType[6]" id="" value="SERVICE-MSG" /> SERVICE-MSG</label><br/>
              <label> <input type="checkbox" name="msgType[7]" id="" value="SERVICE-MSG-ERROR" /> SERVICE-MSG-ERROR</label>
            </div>
            <div>msg:</div><div> <input name="msg" className=' '/></div>
            <div>uriTemplate:</div><div> <input name="uriTemplate" className=' '/></div>
            <div>traceId:</div><div> <input name="traceId" className=' '/></div>
            <div>reqPayload:</div><div> <input name="reqPayload" className=' '/></div>
            <div>resPayload:</div><div> <input name="resPayload" className=' '/></div>
            <div>Plain Text:</div><div> <input name="plaintext" className=' '/></div>
            <div></div>
            <button type="button" onClick={() => search()}>Search</button>
          </fieldset>
        </form>
      
        <table className='td-border w-full'>
          <thead>
          <tr>
            <th className="border-x border-y border-gray-500"></th>
            <th className="border-x border-y border-gray-500">datetime</th>
            <th className="border-x border-y border-gray-500">level</th>
            <th className="border-x border-y border-gray-500">msgType</th>
            <th className="border-x border-y border-gray-500">msg</th>
            <th className="border-x border-y border-gray-500">uriTemplate</th>
            <th className="border-x border-y border-gray-500">reqHeaders</th>
            <th className="border-x border-y border-gray-500">reqPayload</th>
            <th className="border-x border-y border-gray-500">resPayload</th>
            <th className="border-x border-y border-gray-500">traceId</th>
          </tr>
          </thead>
          <tbody>
          {searchResult.map((val, idx) =>
          (val && <tr key={idx}>{/* on click of a table cell show cell content in a popup*/}
              <td onClick={() => showJsonInSplitPage(val)}>Expand</td>
            <td>{val.datetime}</td>
            <td>{val.level}</td>
            <td onClick={(e) => handleCellClick(e)}>{val.msgType}</td>
            <td><div className='truncate overflow-hidden hover:overflow-auto w-40 h-14' onClick={(e) => handleCellClick(e)}>{val.msg}</div></td>
            <td><div className='truncate hover:overflow-auto w-40 h-14' onClick={(e) => handleCellClick(e)}>{val.uriTemplate}</div></td>
            <td className='relative'><div className='truncate  hover:overflow-auto w-40 h-14 text-left align-top'  onClick={(e) => handleCellClick(e)}>{JSON.stringify(val.reqHeaders)}</div></td>
            <td><div className='truncate overflow-hidden hover:overflow-auto w-40 h-14' onClick={(e) => handleCellClick(e)}>{JSON.stringify(val.reqPayload)}</div></td>
            <td><div className='truncate overflow-hidden hover:overflow-auto w-40 h-14' onClick={(e) => handleCellClick(e)}>{JSON.stringify(val.resPayload)}</div></td>
            <td>{val.traceId}</td>
            </tr>)
          )}
          </tbody>
        </table>
        {modalContent && <Modal content={modalContent} onClose={handleClose} position={position}/>}
        {rowJson && <SpitPanel rowJson={rowJson} onClose={handleSplitPanelClose}/>}
        
        <h1 className='text-3xl font-bold underline'>Signal test</h1>
        <button type="button" onClick={()=>{ctr.value++}}>Search</button> {ctr.value}
        <p className="read-the-docs">
          Click on the Vite and React logos to learn more
        </p>

        <button type="button" onClick={() => dispatch({type: 'increment'})}>Increment Age</button>
        {state.age}
      </div>
    </>
    </QueryClientProvider>
  )
}

export default App
