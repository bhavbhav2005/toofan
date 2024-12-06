import React, { useEffect, useState } from "react";
import axios from "axios";

const StudentsTable = () => {
  const [students, setStudents] = useState([]);
  const [editRow, setEditRow] = useState(null);
  const [updatedScores, setUpdatedScores] = useState({});

  // Fetch all students' data
  const fetchStudents = async () => {
    try {
      console.log("Fetching Students...");
      const response = await axios.get(
        "http://10.10.6.178:5000/allstudents",
        {
          headers: { "ngrok-skip-browser-warning": true },
        }
      );
      setStudents(response.data);
      console.log("Fetch completed");
    } catch (error) {
      console.error("Error fetching students:", error);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  // Handle update button click
  const handleUpdateClick = (rollNo, scores) => {
    setEditRow(rollNo);
    setUpdatedScores(scores);
  };

  // Handle input change for updated scores
  const handleScoreChange = (e) => {
    const { name, value } = e.target;
    setUpdatedScores((prevScores) => ({
      ...prevScores,
      [name]: parseInt(value, 10) || 0,
    }));
  };

  // Handle submit button click to update student
  const handleSubmitClick = async (rollNo) => {
    try {
      const response = await axios.put(
        `http://10.10.6.178:5000/student/${rollNo}`,
        { scores: updatedScores },
        {
          headers: { "ngrok-skip-browser-warning": true },
        }
      );
      alert(response.data.message || "Student updated successfully!");
      setEditRow(null); // Exit edit mode
      fetchStudents(); // Refresh table data
    } catch (error) {
      console.error("Error updating student:", error);
      alert("Failed to update student.");
    }
  };

  // Handle delete button click with confirmation dialog
  const handleDeleteClick = async (rollNo) => {
    const isConfirmed = window.confirm(
      `Are you sure you want to delete the student with Roll Number: ${rollNo}?`
    );
    if (isConfirmed) {
      try {
        const response = await axios.delete(
          `http://10.10.6.178:5000/student/${rollNo}`,
          {
            headers: { "ngrok-skip-browser-warning": true },
          }
        );
        alert(response.data.message || "Student deleted successfully!");
        fetchStudents(); // Refresh table data after deletion
      } catch (error) {
        console.error("Error deleting student:", error);
        alert("Failed to delete student.");
      }
    }
  };

  return (
    <div className="container mt-5">
      <h3>Students List</h3>
      <table className="table table-striped">
        <thead>
          <tr>
            <th>Name</th>
            <th>Roll Number</th>
            <th>Java</th>
            <th>CPP</th>
            <th>Python</th>
            <th>GenAI</th>
            <th>FSD</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {students.map((student) => (
            <tr key={`row${student.rollNo}`} id={`row${student.rollNo}`}>
              <td>{student.name}</td>
              <td>{student.rollNo}</td>
              {["Java", "CPP", "Python", "GenAI", "FSD"].map((subject) => (
                <td key={subject}>
                  {editRow === student.rollNo ? (
                    <input
                      type="number"
                      name={subject}
                      className="form-control"
                      value={updatedScores[subject] || ""}
                      onChange={handleScoreChange}
                    />
                  ) : (
                    student.scores[subject]
                  )}
                </td>
              ))}
              <td>
                {editRow === student.rollNo ? (
                  <button
                    className="btn btn-success me-2"
                    onClick={() => handleSubmitClick(student.rollNo)}
                  >
                    Submit
                  </button>
                ) : (
                  <button
                    id={`update${student.rollNo}`}
                    className="btn btn-primary me-2"
                    onClick={() => handleUpdateClick(student.rollNo, student.scores)}
                  >
                    Update
                  </button>
                )}
                <button
                  id={`delete${student.rollNo}`}
                  className="btn btn-danger"
                  onClick={() => handleDeleteClick(student.rollNo)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default StudentsTable;
