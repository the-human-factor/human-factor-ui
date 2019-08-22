import React from "react";

import TextField from "@material-ui/core/TextField";
import FormControl from '@material-ui/core/FormControl';
import FormHelperText from '@material-ui/core/FormHelperText';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';

export const renderTextField =
  ({input, label, meta: { touched, error }, ...custom}) => (
    <TextField label={label}
               error={touched && error}
               {...input}
               {...custom}/>
  );

export const renderInputWithHelper = 
  ({input, label, meta: { touched, error }, ...custom}) => {
    const name = input.name;
    const id = `mui-input-${name}`;
    const textId = `mui-input-${name}-text`;
    return (
      <FormControl error={touched && Boolean(error)}>
        <InputLabel htmlFor={id}>{label}</InputLabel>
        <Input id={id}
               aria-describedby={textId}
               {...input}
               {...custom} />
        <FormHelperText id={textId}>{error}</FormHelperText>
      </FormControl>
    );
  };