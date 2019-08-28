import React, { useState } from "react";

import Button from "@material-ui/core/Button";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import { Field, reduxForm } from "redux-form";
import { makeStyles } from '@material-ui/styles';
import { useSelector } from "react-redux";

import api from "modules/api";
import { selectors as UserSelectors } from "modules/user";
import { required, passwordsMatch, validPassword } from "components/reactFormValidation";
import { renderInputWithHelper } from "components/wrappableMuiFormElems";

const useStyles = makeStyles(theme => ({
  textField: {
    marginRight: theme.spacing(5)
  },
  form: {
    padding: 10,
    display: "flex",
    flexDirection: "column",
    alignItems: "left"
  },
  paper: {
    padding: 10,
    minWidth: 650,
  },
}));

const ChangePassword = props => {
  const { handleSubmit, pristine, submitting, valid } = props;
  const classes = useStyles();

  const [awaitingResponse, setAwaitingResponse] = useState(false);
  const changePassword = (credentials) => {
    setAwaitingResponse(true);
    api.changePassword(credentials)
      .then((res) => {
        alert("Password successfully changed.");
        setAwaitingResponse(false);
      })
      .catch((error) => {
        const message = (((error || {}).response || {}).data || {}).message;
        alert(`Failed to change password, ${message}`);
        setAwaitingResponse(false);
      });
  }

  return (
    <form className={classes.form} onSubmit={handleSubmit(changePassword)}>
      <Typography variant="h3">
        Change Password:
      </Typography>
      <Field className={classes.textField}
             name="oldPassword"
             label="Old Password"
             type="password"
             component={renderInputWithHelper}
             validate={[required]}/>

      <Field className={classes.textField}
             name="password"
             label="New Password"
             type="password"
             component={renderInputWithHelper}
             validate={[required, validPassword]}/>

      <Field className={classes.textField}
             name="passwordConfirmation"
             label="Re-enter New Password"
             type="password"
             component={renderInputWithHelper}
             validate={[required, passwordsMatch]}/>

      <Button className={classes.submit}
              type="submit"
              variant="contained"
              color="primary"
              disabled={pristine || !valid || submitting || awaitingResponse}>
        Change Password
      </Button>
    </form>
  );
}

const ReduxChangePassword = reduxForm({ form: "changePassword" })(ChangePassword);

const Profile = () => {
  const classes = useStyles();
  const user = useSelector(state => UserSelectors.user(state));

  console.log(user);

  return (
    <Paper className={classes.paper}>
        <Typography variant="h2">
          Hi {user.full_name}!
        </Typography>
        <ReduxChangePassword/>
    </Paper>
  );
};

export default Profile;
