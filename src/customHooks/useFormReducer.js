import React, { useReducer } from 'react';

const FORM_INPUT_UPDATE = 'FORM_INPUT_UPDATE';
const RESET_FORM = 'RESET_FORM';

const formReducer = (state, action) => {
    if (action.type === FORM_INPUT_UPDATE) {
      const updatedValues = {
        ...state.inputValues,
        [action.input]: action.value
      };
      const updatedValidities = {
        ...state.inputValidities,
        [action.input]: action.isValid
      };
      let updatedFormIsValid = true;
      for (const key in updatedValidities) {
        updatedFormIsValid = updatedFormIsValid && updatedValidities[key];
      }
      return {
        formIsValid: updatedFormIsValid,
        inputValidities: updatedValidities,
        inputValues: updatedValues
      };
    }
    else if (action.type == RESET_FORM) {
      const updatedValues = {}
      const updatedValidities = {}

      for(let field in state.inputValues) updatedValues[field] = ''
      for(let field in state.inputValidities) updatedValidities[field] = false
      
      return {
        formIsValid: false,
        inputValidities: updatedValidities,
        inputValues: updatedValues
      };
    }
    return state;
}

const useFormReducer = fields => {
    const initialState = {
        inputValues: {},
        inputValidities: {},
        formIsValid: false
    }
    for(let field of fields)
    {
        initialState.inputValues[field] = ''
        initialState.inputValidities[field] = false
    }

    const [state, dispatch] = useReducer(formReducer, initialState)
    
    return [state, dispatch]
}

export default {
    useFormReducer,
    FORM_INPUT_UPDATE,
    RESET_FORM
};