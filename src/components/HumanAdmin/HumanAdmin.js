import React from "react";

import { Admin, Resource } from 'react-admin';

import dataProvider from "./dataProvider";
import { ChallengesList, ChallengesEdit } from "./challenges";
import PaperPage from "components/PaperPage";

const HumanAdmin = () => {

  return (
    <PaperPage title="Admin" >
        <Admin dataProvider={dataProvider}>
          <Resource name="challenges"
                    list={ChallengesList}
                    edit={ChallengesEdit}  />
        </Admin>
    </PaperPage>
  );
};

export default HumanAdmin;