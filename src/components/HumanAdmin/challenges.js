import React from 'react';

import {
  List,
  Datagrid,
  TextField,
  BooleanField,
  DateField,
  ReferenceField,
  Edit,
  SimpleForm,
  DisabledInput,
  ReferenceInput,
  TextInput,
  LongTextInput,
  BooleanInput
} from 'react-admin';

export const ChallengesList = props => (
  <List {...props}>
    <Datagrid rowClick="edit">
      <TextField source="id" />
      <BooleanField source="listed" />
      <TextField source="title" />
      <TextField source="user.full_name" />
      <TextField source="instructions" />
      <DateField source="created_at" />
      <DateField source="updated_at" />
    </Datagrid>
  </List>
);

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