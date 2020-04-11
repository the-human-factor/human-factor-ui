import React from 'react';

import { Box, Button, Grid, Link, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';

import PaperPage from 'components/PaperPage';
import { UserSelectors, UserActions } from 'modules/user';
import { useActions, useSelectors } from 'hooks';

const Action = props => {
  const { isLoggedIn, isAdmin, user } = useSelectors(UserSelectors);
  return (isLoggedIn)? (
    <Button
      size="large"
      variant="contained"
      color="primary"
      href="/role-plays/77404ffe-fbf6-4317-89eb-676941a78f4a"
    >
      Role Play Introduction
    </Button>
  ) : (
    <Button
      size="large"
      variant="contained"
      color="primary"
      href="/login"
    >
      Log In + Register
    </Button>
  );
}

const Home = () => (
  <PaperPage title="Training Great Skillfull Communication"
             style={{maxWidth: "40em"}}>
    <Box ml={2} mr={2}>
      <Typography variant="caption">
        Odd as it may seem, I am my remembering self, and the experiencing self, who does my living, is like a stranger to me. - Daniel Kahneman
      </Typography>
    </Box>
    <Typography variant="body1">
      When there is a difficult conversation, how often do you review the words you plan on saying, only to find yourself speaking entirely differently in the moment? It's normal to experience a disconnect because the thoughts and reflections of our discursive mind are a fraction of the whole and in the moment of expression our being reveals itself entire.
    </Typography>
    <Typography variant="body1">
    Great skillfullness in communication comes from integrating our body, emotions and thoughts so that we speak from deep congruence. Integration comes from making contact with these elements in the interaction moment, not to force them together, but to find what's needed for harmony.
    </Typography>
    <Typography variant="body1">
      <b>Video role plays</b> are a playground where we can break down interactions into micro moments of reaction. Each reaction is a jumping off point for inquiry, compassion and transmutation. It's a record of where we've been and a pointer to how we can be.
    </Typography>
    <Typography variant="body1">
      <b>Give it a try on your own, or email us to set up a free exploratory coaching session.</b>
    </Typography>
    <Box m={3}>
      <Grid container justify = "center">
        <Action />
      </Grid>
    </Box>
    <Typography variant="body1">
      This app is inspired by the
      <Link href="http://clinica.ispa.pt/ficheiros/areas_utilizador/user11/facilitative_interpersonal_skill_manual_and_rating_scale.pdf"> Facilitative Interpersonal Skills Assessment</Link>
      . A research assessment shown to be the most predictive indicator of psychotherapist effectiveness.
    </Typography>
  </PaperPage>
);

export default Home;
