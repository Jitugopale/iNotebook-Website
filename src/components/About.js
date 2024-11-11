import React from 'react';

const About = () => {
  return (
    <div className="container my-5">
      <h2>About iNotebook Application</h2>
      <p className="lead">
        iNotebook is a simple note-taking application that allows users to easily
        create, update, and delete notes. With the option to categorize notes by tags, 
        you can easily keep your notes organized and access them whenever needed.
      </p>
      <h4>Features:</h4>
      <ul>
        <li>Add new notes with title, description, and tags.</li>
        <li>Edit existing notes and update their content.</li>
        <li>Delete notes when they are no longer needed.</li>
        <li>Tag your notes for better categorization and searchability.</li>
      </ul>
      <h4>How to use:</h4>
      <ol>
        <li>Click on "Add Note" to create a new note.</li>
        <li>Use the "Edit" button to update an existing note.</li>
        <li>Delete notes by clicking the delete icon next to each note.</li>
      </ol>
    </div>
  );
};

export default About;
