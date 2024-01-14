import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import {
  QueryClient,
  QueryClientProvider,
  useQuery,
} from '@tanstack/react-query';
import { FormDatamodelContext } from './components/FormDatamodelContext.jsx';
import { formDataModel as formDataModelOrig } from './components/formDataModel.js';

const ContextUpdater = (props) => {
  // const { data } = useQuery('formDataModel', () => formDataModel);
  const [formDataModel, setFormDataModel] = React.useState(formDataModelOrig);
  const updateFormDataModel = (data) => {
    setFormDataModel(data);
  };
  return (
    <FormDatamodelContext.Provider value={{formDataModel, updateFormDataModel}}>
    <App />
    </FormDatamodelContext.Provider>
  );
}
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <QueryClientProvider client={new QueryClient()}>
    <ContextUpdater/>
    </QueryClientProvider>
  </React.StrictMode>,
)
