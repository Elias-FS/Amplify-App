import './App.css';

//import React, { useState, useEffect } from 'react';
//import { API } from 'aws-amplify';
//import { listNotes } from './graphql/queries';
//import { createNote as createNoteMutation, deleteNote as deleteNoteMutation } from './graphql/mutations';


import Amplify from 'aws-amplify';
import { withAuthenticator, AmplifySignOut  } from '@aws-amplify/ui-react-v1'
import '@aws-amplify/ui-react/styles.css'
import awsExports from './aws-exports';

Amplify.configure(awsExports);

//const initialFormState = { name: '', description: '' }


function App() {

  

  return (
    <div className="App">
      <h1>My Notes App</h1>
      
      <AmplifySignOut />
    </div>
  );
}

export default withAuthenticator(App);