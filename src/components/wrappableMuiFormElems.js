import React from 'react';

import { makeStyles } from '@material-ui/core/styles';
import {
  Button,
  FormControl,
  FormHelperText,
  InputLabel,
  Input,
  TextField,
  Typography,
} from '@material-ui/core';

const useStyles = makeStyles(theme => ({
  uploadButton: {
    marginRight: theme.spacing(1),
    marginLeft: theme.spacing(1),
    paddingTop: 0,
    paddingBottom: 0,
    marginBottom: theme.spacing(1),
  },
}));

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
  const id = `mui-input-${input.name}`;
  const textId = `mui-input-${input.name}-text`;
  return (
    <FormControl error={touched && Boolean(error)} className={className}>
      <InputLabel htmlFor={id}>{label}</InputLabel>
      <Input id={id} aria-describedby={textId} {...input} {...custom} />
      <FormHelperText id={textId}>{error}</FormHelperText>
    </FormControl>
  );
};

export const FileInput = ({
  input: { onChange, value, ...input },
  meta: { touched, error, form },
  label,
  className,
  onFileChange,
  ...custom
}) => {
  const classes = useStyles();
  const id = `mui-input-${input.name}`;
  const textId = `mui-input-${input.name}-text`;

  const combinedOnChange = event => {
    onFileChange(event.target.files);
    onChange(event);
  };

  return (
    <div className={className}>
      <Typography variant="body1" color="error" id={textId}>
        {error}
      </Typography>
      <label htmlFor={id}>
        <Typography variant="body1" display="inline">
          {label}
        </Typography>
        <Button
          size="small"
          variant="outlined"
          color="primary"
          component="span"
          className={classes.uploadButton}
        >
          Upload
        </Button>
      </label>
      <Typography variant="body1" display="inline">
        {value}
      </Typography>
      <input
        id={id}
        type="file"
        style={{ display: 'none' }}
        onChange={combinedOnChange}
        aria-describedby={textId}
        {...input}
        {...custom}
      />
    </div>
  );
};
