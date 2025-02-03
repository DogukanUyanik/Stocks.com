import { useState } from "react";

// Custom useForm hook
const useFormRegister = (initialState) => {
  const [values, setValues] = useState(initialState);
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setValues((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e, callback) => {
    e.preventDefault();

    const validationErrors = validate(values);
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length === 0) {
      callback(values); 
    }
  };


  //validatie
  const validate = (values) => {
    const errors = {};
    if (!values.naam) errors.naam = "Name is required";
    if (!values.email) errors.email = "Email is required";
    if (!values.wachtwoord) errors.wachtwoord = "Password is required";
    return errors;
  };

  return { values, errors, handleChange, handleSubmit };
};

export default useFormRegister;
