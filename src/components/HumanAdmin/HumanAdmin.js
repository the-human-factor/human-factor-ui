import React from 'react';

import { Admin, Resource } from 'react-admin';
import { useTheme } from '@material-ui/core/styles';

import { history } from 'storeContainer';
import AdminLayout from './AdminLayout';
import dataProvider from './dataProvider';
import { ChallengesList, ChallengesEdit } from './challenges';

// Using the migration guide
// https://github.com/marmelab/react-admin/blob/next/UPGRADE.md

const HumanAdmin = () => {
  const theme = useTheme();

  return (
    <Admin
      dataProvider={dataProvider}
      title="Admin"
      history={history}
      theme={theme}
      layout={AdminLayout}
    >
      <Resource
        name="challengeAdmin"
        list={ChallengesList}
        edit={ChallengesEdit}
      />
    </Admin>
  );
};

export default HumanAdmin;
