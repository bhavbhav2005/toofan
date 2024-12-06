import React, { useState } from 'react';
import axios from 'axios';

function AddStudentForm() {
  const [studentData, setStudentData] = useState({
    name: '',
    rollNo: '',
    scores: {
      Java: 0,
      CPP: 0,
      Python: 0,
      GenAI: 0,
      FSD: 0,
    },
  });

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;

    // Check if the field is inside 'scores'
    if (name in studentData.scores) {
      setStudentData({
        ...studentData,
        scores: { ...studentData.scores, [name]: Number(value) }, // Convert score to number
      });
    } else {
      setStudentData({ ...studentData, [name]: value });
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Send a POST request to add the student to the database
      // eslint-disable-next-line no-unused-vars
      const response = await axios.post('http://10.10.6.178:5000/student', studentData);
      alert('Student added successfully');
      // Optionally, reset the form after successful submission
      setStudentData({
        name: '',
        rollNo: '',
        scores: { Java: 0, CPP: 0, Python: 0, GenAI: 0, FSD: 0 },
      });
    } catch (error) {
      console.error('Error adding student:', error);
      alert('Failed to add student');
    }
  };

  return (
    <div className="container mt-4">
      <h2>Add Student</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label">Name:</label>
          <input
            type="text"
            name="name"
            className="form-control"
            value={studentData.name}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Roll Number:</label>
          <input
            type="text"
            name="rollNo"
            className="form-control"
            value={studentData.rollNo}
            onChange={handleChange}
            required
          />
        </div>

        <h4>Scores:</h4>
        <div className="row">
          {Object.keys(studentData.scores).map((subject) => (
            <div key={subject} className="col-4 mb-3">
              <label className="form-label">{subject}:</label>
              <input
                type="number"
                name={subject}
                className="form-control"
                value={studentData.scores[subject]}
                onChange={handleChange}
                required
              />
            </div>
          ))}
        </div>
        <button type="submit" className="btn btn-primary">
          Add Student
        </button>
      </form>
    </div>
  );
}

export default AddStudentForm;