import React from "react";
import { Link } from "@reach/router";
import { makeStyles } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import Container from "@material-ui/core/Container";

const AdapterLink = React.forwardRef((props, ref) => (
  <Link innerRef={ref} {...props} />
));

const useStyles = makeStyles(theme => ({
  fullPage: {
    backgroundColor: "#EEE",
    minHeight: "100vh",
    paddingBottom: 10
  },
  toolBar: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between"
  },
  appBar: {
    background: "linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)",
    paddingTop: 5,
    marginBottom: 15
  }
}));

export default function NavPage(props) {
  const classes = useStyles();

  return (
    <div className={classes.fullPage}>
      <AppBar position="static" className={classes.appBar}>
        <Toolbar className={classes.toolBar}>
          <div>
            <Typography variant="h1" color="inherit">
              The Human Factor
            </Typography>
            <Button
              color="inherit"
              component={AdapterLink}
              to="/challenges/create"
            >
              Create A Challenge
            </Button>
            <Button color="inherit" component={AdapterLink} to="/challenges">
              List Challenges
            </Button>
            <Button color="inherit" component={AdapterLink} to="/responses">
              List Responses
            </Button>
          </div>
          <div>
            <Button color="inherit" component={AdapterLink} to="/login">
              Login
            </Button>
          </div>
        </Toolbar>
      </AppBar>
      <Container maxWidth="md">{props.children}</Container>
    </div>
  );
}
