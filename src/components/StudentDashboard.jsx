// src/components/StudentDashboard.js
import { useState, useEffect } from 'react';

function StudentDashboard({ studentName }) {
  const [assignments, setAssignments] = useState([]);
  const [submittedFiles, setSubmittedFiles] = useState({});
  const [marks, setMarks] = useState({});

  useEffect(() => {
    const savedAssignments = JSON.parse(localStorage.getItem('assignments')) || [];
    setAssignments(savedAssignments);

    const savedStudents = JSON.parse(localStorage.getItem('students')) || [];
    const student = savedStudents.find(s => s.name === studentName) || { submissions: {}, marks: {} };
    setSubmittedFiles(student.submissions);
    setMarks(student.marks); // Load marks for the student

    // Reset marks for new assignments
    const updatedMarks = {};
    savedAssignments.forEach(assignment => {
      if (!student.marks[assignment.id]) {
        updatedMarks[assignment.id] = null; // Reset marks to null for new assignments
      }
    });
    setMarks(prevMarks => ({ ...prevMarks, ...updatedMarks }));
  }, [studentName]);

  const handleFileUpload = (e, assignmentId) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        const fileData = reader.result;
        setSubmittedFiles({
          ...submittedFiles,
          [assignmentId]: { fileName: file.name, file: fileData },
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const submitAssignment = (assignmentId) => {
    const updatedStudents = JSON.parse(localStorage.getItem('students')) || [];
    const studentIndex = updatedStudents.findIndex(s => s.name === studentName);

    if (studentIndex !== -1) {
      updatedStudents[studentIndex].submissions[assignmentId] = submittedFiles[assignmentId];
    } else {
      updatedStudents.push({
        name: studentName,
        submissions: { [assignmentId]: submittedFiles[assignmentId] },
        marks: {}, // Initialize marks if student doesn't exist
      });
    }

    localStorage.setItem('students', JSON.stringify(updatedStudents));
    alert('Assignment submitted successfully!');
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold mb-4">Student Dashboard ({studentName})</h1>
      <h2 className="text-2xl font-semibold mb-4">Assignments</h2>
      <ul className="space-y-4">
        {assignments.map((assignment) => (
          <li key={assignment.id} className="bg-white p-4 rounded-md shadow-md">
            <h3 className="text-lg font-bold">{assignment.title}</h3>
            <p>{assignment.description}</p>
            <p className="text-gray-500">Due Date: {assignment.dueDate}</p>

            <input
              type="file"
              onChange={(e) => handleFileUpload(e, assignment.id)}
              className="mb-2"
            />
            <button
              onClick={() => submitAssignment(assignment.id)}
              className="bg-green-500 text-white p-2 rounded-md hover:bg-green-600"
            >
              Submit Assignment
            </button>

            {submittedFiles[assignment.id] && (
              <span className="text-gray-700"> Submitted: {submittedFiles[assignment.id].fileName}</span>
            )}

            {marks[assignment.id] !== undefined && (
              <div className="mt-2">
                <strong>Marks: </strong>
                <span>{marks[assignment.id] === null ? 'Not Assigned' : marks[assignment.id]}</span>
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default StudentDashboard;
