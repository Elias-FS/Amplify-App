import './Notas.css'

import React, { useState, useEffect } from 'react';
import { API } from 'aws-amplify';
import { listNotes } from '../../graphql/queries';
import { createNote as createNoteMutation, deleteNote as deleteNoteMutation } from '../../graphql/mutations';
import Botao from '../Botao';

const initialFormState = { name: '', description: '' }

const CreateNote = () => {

  const [notes, setNotes] = useState([]);
  const [formData, setFormData] = useState(initialFormState);

  useEffect(() => {
    fetchNotes();
  }, []);

  async function fetchNotes() {
    const apiData = await API.graphql({ query: listNotes });
    setNotes(apiData.data.listNotes.items);
  }

  async function createNote(evento) {
    evento.preventDefault()
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
    <div>
        <h1 className='titulo'>Minhas notas 🗒</h1>
        <section className='formulario'>
            <form onSubmit={createNote}>
            <div className="campo-texto">
            <label>Nome Nota:</label>
            <input 
            onChange={e => setFormData({ ...formData, 'name': e.target.value})}
            placeholder="Digite um nome"
            value={formData.name}
            />
            <label>Descrição Nota:</label>
            <input
            onChange={e => setFormData({ ...formData, 'description': e.target.value})}
            placeholder="Digite uma descrição"
            value={formData.description}
            />
            <Botao>Criar Nota</Botao>
            </div>
            </form>
        </section>
            <div>
                  {
                    notes.map(note => (
                      <section className='nota'>
                        <form>
                          <div key={note.id || note.name}>
                            <h2>{note.name}🎯</h2>
                            <p>{note.description}</p>
                            <button onClick={() => deleteNote(note)}>Deletar Nota</button>
                          </div>
                        </form>
                      </section>
                  ))}
            </div>
          
        
    </div>
  )
}

export default CreateNote