import './App.css';

import React, { useState, useEffect } from 'react';
import { API } from 'aws-amplify';
import { listNotes } from './graphql/queries';
import { createNote as createNoteMutation, deleteNote as deleteNoteMutation } from './graphql/mutations';


import Amplify from 'aws-amplify';
import { withAuthenticator, AmplifySignOut  } from '@aws-amplify/ui-react-v1'
import '@aws-amplify/ui-react/styles.css'
import awsExports from './aws-exports';

Amplify.configure(awsExports);

const initialFormState = { name: '', description: '' }


function App() {
  const [notes, setNotes] = useState([]);
  const [formData, setFormData] = useState(initialFormState);

  useEffect(() => {
    fetchNotes();
  }, []);

  async function fetchNotes() {
    const apiData = await API.graphql({ query: listNotes });
    setNotes(apiData.data.listNotes.items);
  }

  async function createNote() {
    if (!formData.name || !formData.description) return;
    await API.graphql({ query: createNoteMutation, variables: { input: formData } });
    setNotes([ ...notes, formData ]);
    setFormData(initialFormState);
  }

  async function deleteNote({ id }) {
    const newNotesArray = notes.filter(note => note.id !== id);
    setNotes(newNotesArray);
    await API.graphql({ query: deleteNoteMutation, variables: { input: { id } }});
  }
  

  return (
    <div className="App">
      <h1>Minhas notas</h1>
        <input
          onChange={e => setFormData({ ...formData, 'name': e.target.value})}
          placeholder="Nome da Nota"
          value={formData.name}
        />
        <input
          onChange={e => setFormData({ ...formData, 'description': e.target.value})}
          placeholder="Descrição da nota"
          value={formData.description}
        />
        <button onClick={createNote}>Criar Nota</button>
        <div style={{marginBottom: 30}}>
          {
            notes.map(note => (
              <div key={note.id || note.name}>
                <h2>{note.name}</h2>
                <p>{note.description}</p>
                <button onClick={() => deleteNote(note)}>Deletar Nota</button>
              </div>
            ))
          }
        </div>
      <AmplifySignOut />
    </div>
  );
}

export default withAuthenticator(App);