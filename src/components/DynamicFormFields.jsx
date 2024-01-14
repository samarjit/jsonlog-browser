import { useState, useContext } from 'react';
import { FormDatamodelContext } from './FormDatamodelContext';
// import { formDataModel } from './formDataModel';

export default function DynamicFormFields (){
  const [formData, setFormData] = useState({});
  const {formDataModel} = useContext(FormDatamodelContext);
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value
    }));
  };

  const renderFormFields = () => {
    return Object.entries(formDataModel).map(([fieldName, fieldType]) => {
      if ((typeof(fieldType) === 'string' && fieldType === 'string') || fieldType.type === 'string') {
        return (
          <div key={fieldName} className='m-2'>
            <div>{fieldName}:</div>
            <div>
              <input name={fieldName} className=' ' onChange={handleInputChange} />
            </div>
          </div>
        );
      } else if (fieldType.type === 'enum') {
        return (
          <div key={fieldName} className='m-2'>
            <div>{fieldName}:</div>
            <div className='flex flex-wrap'>
              {fieldType.values.map((value) => (
                <label key={value} className='m-1'>
                  <input type="checkbox" name={fieldName} value={value} onChange={handleInputChange} /> {value}
                </label>
              ))}
            </div>
          </div>
        );
      }
      return null;
    });
  };

  return (
    <div className='flex flex-wrap'>
      {renderFormFields()}
      {/* Rest of the code */}
    </div>
  );
}
