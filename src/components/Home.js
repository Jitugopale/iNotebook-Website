import React from 'react'
import Notes from './Notes'



const Home = (props) => {
  const {showAlert}= props
  return (
    <div>
      {/* <div className="container">
        <h2>Your Notes</h2>
        {notes.map((note) => (
          <p key={note.id}>{note.title}</p>
        ))}
      </div>  */}
      <Notes showAlert={showAlert}/>

    </div>
  )
}

export default Home
