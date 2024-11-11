import { useState } from 'react';
import NoteContext from './noteContext'; //import note context
// import { useState } from 'react';

const NoteState=(props)=>{  //Note ko sari state provide karegi
  const host = "http://Localhost:5000"
    // const s1={
    //     "name":"Harry",
    //     "class":"5b"
    // }
    // const [state, setState] = useState(s1);
    // const update=()=>{
    //     setTimeout(() => {
    //         setState({
    //             "name":"Larry",
    //             "class":"6b"
    //         })
    //     }, 1000);
    // }

    const notesInitial=[];
    const [notes, setNotes] = useState(notesInitial)

    //Get all Note
    const getNotes=async()=>{
      //TODO: API CALL
      // API Call
      const response = await fetch(`${host}/api/notes/fetchallnotes`,{
        method: 'GET',
        headers: {
          'Content-Type':'application/json',
          'auth-token': localStorage.getItem('token')
        },
        // body: JSON.stringify(title,description,tag)
      });
      const json = await response.json(); //parse karegi json
      // console.log(json)
      setNotes(json);
    }

    //Add a Note
    const addNote=async(title,description,tag)=>{
      //TODO: API CALL
      // API Call
      const response = await fetch(`${host}/api/notes/addnote`,{
        method: 'POST',
        headers: {
          'Content-Type':'application/json',
          'auth-token': localStorage.getItem('token')
        },
        body: JSON.stringify({title,description,tag})
      });
      const note = await response.json();
      setNotes(notes.concat(note)); //concat return new array
      // console.log(json)
  
      // console.log("Adding a New Note");
      // const note= json;
    }

    //Delete a Note
    const deleteNote=async(_id)=>{
      //TODO: API CALL
      const response = await fetch(`${host}/api/notes/deletenote/${_id}`,{
        method: 'DELETE',
        headers: {
          'Content-Type':'application/json',
          'auth-token': localStorage.getItem('token')
        },
        // body: JSON.stringify(title,description,tag)
      });
      const json = await response.json();
      console.log(json);

      // console.log("Deleting the note with id"+_id);
      const newNotes = notes.filter((note)=>{return note._id!==_id})
      setNotes(newNotes);

    }

    //Edit a Note
    
    const editNote=async(id,title,description,tag)=>{
      // API Call
      const response = await fetch(`${host}/api/notes/updatenote/${id}`,{
        method: 'PUT',
        headers: {
          'Content-Type':'application/json',
          'auth-token': localStorage.getItem('token')
        },
        body: JSON.stringify({title,description,tag})
      });
      const json = await response.json();
      console.log(json);
      console.log(id);

      let newNotes = JSON.parse(JSON.stringify(notes))
      // Logic to edit in client
      for (let index = 0; index < newNotes.length; index++) {
        const element = newNotes[index];
        if(element._id === id){
          newNotes[index].title = title;
          newNotes[index].description = description;
          newNotes[index].tag = tag;
          break;
        }
      }
      setNotes(newNotes);
    }

    return(
        //value note state provide kr rahi hai
        <NoteContext.Provider value={{notes,addNote,setNotes,deleteNote,editNote,getNotes}}> 
            {props.children}
        </NoteContext.Provider> //jo chiz provide krni hai vo value ke andar hai
    )
}

export default NoteState;