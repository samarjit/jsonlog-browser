import React, { useState, useEffect, useContext } from 'react';
import JsonPointer from './JsonPointer';
import { FormDatamodelContext } from './FormDatamodelContext';
const DeriveFormDataModel = () => {
  const [visible, setVisible ]= useState(false);
  const [logLines, setLogLines] = useState('');
  const [editedFormDataModel, setEditedFormDataModel] = useState({});
  const { updateFormDataModel } = useContext(FormDatamodelContext);
  useEffect(() => {
    // Retrieve formDataModel from local storage on component mount
    const savedFormDataModel = localStorage.getItem('formDataModel');
    if (savedFormDataModel) {
      setEditedFormDataModel(JSON.stringify(JSON.parse(savedFormDataModel), null, 2));
      updateFormDataModel(JSON.parse(savedFormDataModel));
    }
  }, []);
  
  const deriveFormDataModel = (singleRecord) => {
    // Derive formDataModel based on log lines
    // Replace this with your own logic to derive the formDataModel
    const derivedFormDataModel = {
      // ...
    };
    let jsonPointers = {};
    try {
      if(editedFormDataModel && editedFormDataModel != '') {
        jsonPointers = eval('let x=' +editedFormDataModel+';x;');
      }
    } catch (e) { console.log('ignoring localstorage json parse error', e); }
    const newLogLines = singleRecord ? [logLines] : logLines.split('\n');
    newLogLines.forEach((logLine) => {
      try {
        const parsedLogLine = JSON.parse(logLine);
        const logLineJsonPointers = JsonPointer.dict(parsedLogLine);
        logLineJsonPointers &&
        Object.keys(logLineJsonPointers).forEach((jsonPointer) => {
          const jsnPtr = jsonPointer.replace(/^\//g, '').replace(/\//g, '.');
          if(!jsonPointers[jsnPtr]){
            jsonPointers[jsnPtr] = 'string';
          }
        });
        console.log(jsonPointers)
      } catch (e) { console.log(e) }
    });
    setEditedFormDataModel(JSON.stringify(jsonPointers, null, 2));
    
    // Save the derived formDataModel in local storage
    localStorage.setItem('formDataModel', JSON.stringify(jsonPointers));
  };
  
  const handleLogChange = (event) => {
    setLogLines(event.target.value);
  };
  
  const handleEditedFormDataModelChange = (event) => {
    const sampleLogs = event.target.value;
    
    setEditedFormDataModel(sampleLogs);
  };
  
  const saveFormDataModel = () => {
    // Save the edited formDataModel in local storage
    let jsonPointers = {};
    try {
      if(editedFormDataModel && editedFormDataModel != '') {
        const toEval = 'let x=' +editedFormDataModel+';x;';
        jsonPointers = eval(toEval);
      }
    } catch (e) { console.log('ignoring localstorage json parse error', e); }
    localStorage.setItem('formDataModel', JSON.stringify(jsonPointers));
  }

  const clearFormDataModel = () => {
    // Clear the formDataModel in local storage
    localStorage.removeItem('formDataModel');
    setEditedFormDataModel('');
  }
  return (
    <div className='bg-zinc-50 p-2'>
      <a href="#" onClick={() => setVisible(!visible)}>{visible && <>Close Data Model&times;</>} {!visible && <>Edit data model &raquo;</>} </a>
      {visible && <div >
        <h2>Infer Form data model from logs</h2>
        <h3>Paste sample log jsons (This will be define the Filter From and display table)</h3>
        <textarea id="formDataSample" className='w-10/12' value={logLines} onChange={handleLogChange} placeholder='Paste few log lines to infer data model, each line is expected to be json'/>
        <br/>
        <button className="border-gray-300" onClick={deriveFormDataModel}>Read single line log record(s)</button>
        <button className="border-gray-300" onClick={() => deriveFormDataModel('singleRecord')}>Read one multiline log record</button>
        
        <div>
          <h2>Inferred log data model</h2>
          <textarea id="formDataOutput" className='w-10/12' value={editedFormDataModel} onChange={handleEditedFormDataModelChange} placeholder='Inferred log datamodel will be shows here, edit and save'/>
          <br/>
          <button className="border-gray-300" onClick={saveFormDataModel}>Save to local storage</button>
          <button className="border-gray-300" onClick={clearFormDataModel}>Clear</button>
          <button className="border-gray-300" type="button" onClick={() => updateFormDataModel(JSON.parse(localStorage.getItem('formDataModel')))}>load from local storage</button>
        </div>
      </div>}
    </div>
  );
};

export default DeriveFormDataModel;
