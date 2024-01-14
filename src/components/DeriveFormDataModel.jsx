import React, { useState, useEffect, useContext } from 'react';
import JsonPointer from './JsonPointer';
import { FormDatamodelContext } from './FormDatamodelContext';
const DeriveFormDataModel = () => {
  const [logLines, setLogLines] = useState('');
  const [editedFormDataModel, setEditedFormDataModel] = useState({});
  const { updateFormDataModel } = useContext(FormDatamodelContext);
  useEffect(() => {
    // Retrieve formDataModel from local storage on component mount
    const savedFormDataModel = localStorage.getItem('formDataModel');
    if (savedFormDataModel) {
      setEditedFormDataModel(JSON.stringify(JSON.parse(savedFormDataModel), null, 2));
    }
  }, []);
  
  const deriveFormDataModel = () => {
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
    logLines.split('\n').forEach((logLine) => {
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
    <div>
      <textarea id="formDataSample" value={logLines} onChange={handleLogChange} />
      <button onClick={deriveFormDataModel}>Derive formDataModel</button>
      
      <div>
        <h2>Final JSON formDataModel</h2>
        <textarea id="formDataOutput" value={editedFormDataModel} onChange={handleEditedFormDataModelChange} />
        <button onClick={saveFormDataModel}>Save formDataModel</button>
        <button onClick={clearFormDataModel}>Clear formDataModel</button>
        <button type="button" onClick={() => updateFormDataModel(JSON.parse(localStorage.getItem('formDataModel')))}>load from local storage</button>
      </div>
    </div>
  );
};

export default DeriveFormDataModel;
