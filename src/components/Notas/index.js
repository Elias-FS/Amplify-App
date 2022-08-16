import "./Notas.css"

import {deleteNote as deleteNoteMutation } from '../../graphql/mutations';

const Notas = (name, description) => {

    async function deleteNote({ id }) {
        const newNotesArray = notes.filter(note => note.id !== id);
        setNotes(newNotesArray);
        await API.graphql({ query: deleteNoteMutation, variables: { input: { id } }});
      }


  return (
    <div>
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
    </div>
  )
}

export default Notas