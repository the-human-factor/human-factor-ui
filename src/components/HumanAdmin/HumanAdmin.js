import React from 'react';

import { Admin, Resource } from 'react-admin';

import AdminLayout from './AdminLayout';
import dataProvider from './dataProvider';
import { ChallengesList, ChallengesEdit } from './challenges';

const HumanAdmin = () => {
  return (
    <Admin dataProvider={dataProvider} appLayout={AdminLayout} title="Admin">
      <Resource name="challenges" list={ChallengesList} edit={ChallengesEdit} />
    </Admin>
  );
};

export default HumanAdmin;
