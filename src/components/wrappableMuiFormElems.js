import React from 'react';

import TextField from '@material-ui/core/TextField';
import FormControl from '@material-ui/core/FormControl';
import FormHelperText from '@material-ui/core/FormHelperText';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';

export const renderTextField = ({
  input,
  label,
  meta: { touched, error },
  ...custom
}) => (
  <TextField label={label} error={touched && error} {...input} {...custom} />
);

export const renderInputWithHelper = ({
  input,
  label,
  meta: { touched, error },
  className,
  ...custom
}) => {
  const name = input.name;
  const id = `mui-input-${name}`;
  const textId = `mui-input-${name}-text`;
  return (
    <FormControl error={touched && Boolean(error)} className={className}>
      <InputLabel htmlFor={id}>{label}</InputLabel>
      <Input id={id} aria-describedby={textId} {...input} {...custom} />
      <FormHelperText id={textId}>{error}</FormHelperText>
    </FormControl>
  );
};

export const normalizeFileList = values => {
  const result = [];
  for (var i = 0; i < values.length; i++) {
    result[i] = values[i].name;
  }
  console.log(result);
  return result;
};

export const FileInput = ({
  input,
  label,
  meta: { touched, error },
  floatingLabelText,
  ...custom
}) => {
  const name = input.name;
  const id = `mui-input-${name}`;
  const textId = `mui-input-${name}-text`;
  // if (input.value && input.value[0] && input.value[0].name) {
  //   floatingLabelText = input.value[0].name;
  // }
  delete input.value;
  const reduxFormOnChange = input.onChange;
  delete input.onChange;
  const onChange = values => {
    console.log(values);
    reduxFormOnChange(values);
  };

  console.log(input);
  return (
    <Input
      id={id}
      type="file"
      accept="webm"
      aria-describedby={textId}
      onChange={onChange}
      {...input}
      {...custom}
    />
  );
};
