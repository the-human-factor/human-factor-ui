import React from "react";

import Typography from "@material-ui/core/Typography";

import PaperPage from "components/PaperPage";

const Home = () => (
  <PaperPage title="The Human Factor">
    <br/>
    <Typography variant="body1">
      Truly interactive online learning for interpersonal skills.
    </Typography>
    <br/>
    <Typography variant="body1">
      Works best in <b>Chrome</b>.
    </Typography>
  </PaperPage>
);

export default Home;
