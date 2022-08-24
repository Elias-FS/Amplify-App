import "./Notas.css";

import React, { useState, useEffect } from "react";
import { API, Storage } from "aws-amplify";
import { listNotes } from "../../graphql/queries";
import {
  createNote as createNoteMutation,
  deleteNote as deleteNoteMutation,
} from "../../graphql/mutations";
import Botao from "../Botao";

const initialFormState = { name: "", description: "" };

const CreateNote = () => {
  const [notes, setNotes] = useState([]);
  const [formData, setFormData] = useState(initialFormState);

  async function onChange(e) {
    if (!e.target.files[0]) return;
    const file = e.target.files[0];
    setFormData({ ...formData, image: file.name });
    await Storage.put(file.name, file);
    fetchNotes();
  }

  useEffect(() => {
    fetchNotes();
  }, []);

  async function fetchNotes() {
    const apiData = await API.graphql({ query: listNotes });
    const notesFromAPI = apiData.data.listNotes.items;
    await Promise.all(
      notesFromAPI.map(async (note) => {
        if (note.image) {
          const image = await Storage.get(note.image);
          note.image = image;
        }
        return note;
      })
    );
    setNotes(apiData.data.listNotes.items);
  }

  async function createNote(evento) {
    evento.preventDefault();
    if (!formData.name || !formData.description) return;
    await API.graphql({
      query: createNoteMutation,
      variables: { input: formData },
    });
    if (formData.image) {
      const image = await Storage.get(formData.image);
      formData.image = image;
    }
    setNotes([...notes, formData]);
    setFormData(initialFormState);
  }

  async function deleteNote({ id }) {
    const newNotesArray = notes.filter((note) => note.id !== id);
    setNotes(newNotesArray);
    await API.graphql({
      query: deleteNoteMutation,
      variables: { input: { id } },
    });
  }

  return (
    <div>
      <h1 className="titulo">Minhas notas 🗒</h1>
      <section className="formulario">
        <form onSubmit={createNote}>
          <div className="campo-texto">
            <label>Nome Nota:</label>
            <input
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              placeholder="Digite um nome"
              value={formData.name}
            />
            <label>Descrição Nota:</label>
            <input
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              placeholder="Digite uma descrição"
              value={formData.description}
            />
            <input type="file" onChange={onChange} />
            <Botao>Criar Nota</Botao>
          </div>
        </form>
      </section>
      <div>
        {notes.map((note) => (
          <section key={note.id || note.name} className="nota">
            <div className="form">
              <div>
                <h2>{note.name}🎯</h2>
                <p>{note.description}</p>
                {note.image && (
                  <img
                    src={note.image}
                    style={{ width: 400 }}
                    alt={"Imagem da nota"}
                  />
                )}
                <div>
                  <button onClick={() => deleteNote(note)}>Deletar Nota</button>
                </div>
              </div>
            </div>
          </section>
        ))}
      </div>
    </div>
  );
};

export default CreateNote;
