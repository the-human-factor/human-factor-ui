import React from 'react';

import {
  List,
  Show,
  SimpleShowLayout,
  RichTextField,
  Datagrid,
  TextField,
  FunctionField,
  BooleanField,
  DateField,
  EditButton,
  Edit,
  SimpleForm,
  DisabledInput,
  TextInput,
  LongTextInput,
  BooleanInput
} from 'react-admin';

const ChallengeShow = props => (
    <Show {...props}
          /* disable the app title change when shown */
          title=" ">
        <SimpleShowLayout>
            <RichTextField source="instructions" />
        </SimpleShowLayout>
    </Show>
);

// TODO: lodash has a truncate, use it.
function truncate(s, n){
  if (s.length <= n) { return s; }
  var subString = s.substr(0, n-1);
  return subString + "...";
};

const linkToChallenge = row => {
  const path = `/challenges/${row.id}`;
  return <a href={path}>{row.id}</a>;
}

export const ChallengesList = props => (
  <List {...props}>
    <Datagrid expand={<ChallengeShow />} rowClick="expand">
      <FunctionField label="id"
                     render={linkToChallenge} />
      <BooleanField source="listed" />
      <TextField source="title" />
      <TextField source="user.full_name" />
      <FunctionField label="instructions"
                     render={r => truncate(r.instructions, 13)} />
      <DateField source="created_at" />
      <DateField source="updated_at" />
      <EditButton />
    </Datagrid>
  </List>
);

ChallengesList.defaultProps = {
  perPage: 500,
  pagination: <React.Fragment />
}

export const ChallengesEdit = props => (
  <Edit {...props}>
    <SimpleForm>
      <DisabledInput source="id" />
      <DisabledInput source="user.full_name" />
      <TextInput source="title" />
      <LongTextInput source="instructions" />
      <BooleanInput source="listed" />
    </SimpleForm>
  </Edit>
);