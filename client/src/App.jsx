import axios from "axios";
import { useEffect, useState } from "react";

function App() {

  const [students, setStudents] = useState([]);
  const [name, setName] = useState("");
  const [course, setCourse] = useState("");
  const [age, setAge] = useState("");
  const [editingId, setEditingId] = useState(null); 
  const [message, setMessage] = useState("");

  useEffect(() => {
    axios
    .get("http://localhost:5001/students")
    .then((response) => {
      setStudents(response.data);
    });
  
  }, []);

  function addStudents() {
    axios.get("http://localhost:5001/students")
    .then((response) => {
      setStudents(response.data);
    });
  }

  useEffect(() => {
   addStudents();
  }, []);

  function clearForm() {
    setName("");
    setCourse("");
    setAge("");
    setMessage("");
    setEditingId(null);
  }

  function getStudents () {
    if(!name || !course || !age) {
      setMessage("Invalid Inputs.");
      return;
    }
    if(editingId != null) {
      const myinfo = students.find((student) => student._id == editingId);
      if (myinfo.name == name && myinfo.course == course && myinfo.age == age) {
        setMessage("No changes detected.");
        return;
      }
    } 

     const duplicate = students.find((student) => student._id != editingId && student.name.toLowerCase() == name.toLowerCase() && student.course.toLowerCase() == course.toLowerCase());  
     if (duplicate) {
       setMessage("Duplicate information found.");
       return;
     }

    setMessage(""); 

    if(editingId == null) {
      axios.post("http://localhost:5001/students", {name, course, age})
      .then(() => {
        clearForm();
        addStudents();
      });
    } 

    else {
      axios.put("http://localhost:5001/students/" + editingId, {name, course, age})
      .then(() => {
        setMessage("Student successfully updated!");
        setName("");
        setCourse("");
        setAge("");
        setEditingId(null);
        addStudents();
      });
    }
  }

  function editStudents(student) {
    setEditingId(student._id);
    setName(student.name);
    setCourse(student.course);
    setAge(student.age);
  }

  function deleteStudents(id) {
    axios.delete("http://localhost:5001/students/" + id)
    .then (() => {
      setMessage("Student successfully deleted!");
      addStudents();
    });
  }

  return (
    <div>
      <h1> Student Management System </h1>

      <h2> {editingId == null ? "Add Student" : "Edit Student"} </h2>

         <input placeholder="Name" value={name} onChange={(event) => setName(event.target.value)}/>

         <br></br>

         <input placeholder="Course" value={course} onChange={(event) => setCourse(event.target.value)}/>

         <br></br>

         <input placeholder="Age" value={age} onChange={(event) => setAge(event.target.value)}/>

         <br></br>
         
        <p>{message}</p>
        <button type="button" onClick={getStudents}> {editingId == null ? "Add Student" : "Update Student"} </button>
        
        {editingId != null && (
          <button type="button" onClick={clearForm}> Clear </button>
        )}

      <h2> Students </h2>

      {students.length === 0 && <p>No students found.</p>}

      {students.map((student) => (
      <div key={student._id}>
          <p>Name: {student.name}</p>
          <p>Course: {student.course}</p>
          <p>Age: {student.age}</p>

          <button type="button" onClick={() => editStudents(student)}> Edit </button>
          <button type="button" onClick={() => deleteStudents(student._id)}> Delete </button>
        </div>
      ))}
    </div>
  );

}

export default App;