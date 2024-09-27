// src/components/MentorDashboard.js
import { useState, useEffect } from 'react';

function MentorDashboard() {
  const [assignments, setAssignments] = useState([]);
  const [students, setStudents] = useState([
    { name: 'Aman', submissions: {}, marks: {} },
    { name: 'Harshit', submissions: {}, marks: {} },
    { name: 'Aditya', submissions: {}, marks: {} },
    { name: 'Sachin', submissions: {}, marks: {} },
  ]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [submittedFile, setSubmittedFile] = useState(null);
  const [marks, setMarks] = useState({}); // State to hold marks input
  const [confirmationMessage, setConfirmationMessage] = useState('');

  useEffect(() => {
    const storedAssignments = JSON.parse(localStorage.getItem('assignments')) || [];
    setAssignments(storedAssignments);

    const storedStudents = JSON.parse(localStorage.getItem('students')) || students;
    setStudents(storedStudents);
  }, []);

  const addAssignment = () => {
    if (title && description && dueDate) {
      const newAssignment = {
        id: assignments.length + 1,
        title,
        description,
        dueDate,
      };

      const updatedAssignments = [...assignments, newAssignment];
      setAssignments(updatedAssignments);
      localStorage.setItem('assignments', JSON.stringify(updatedAssignments));

      // Initialize marks for the new assignment to null for each student
      const updatedStudents = students.map(student => {
        student.submissions[newAssignment.id] = null; // Ensure submission is set to null for new assignment
        student.marks[newAssignment.id] = null; // Set marks to null for the new assignment
        return student;
      });
      
      setStudents(updatedStudents);
      localStorage.setItem('students', JSON.stringify(updatedStudents));

      setTitle('');
      setDescription('');
      setDueDate('');
    } else {
      alert('Please fill all fields.');
    }
  };

  const deleteAssignment = (assignmentId) => {
    const updatedAssignments = assignments.filter(assignment => assignment.id !== assignmentId);
    setAssignments(updatedAssignments);
    localStorage.setItem('assignments', JSON.stringify(updatedAssignments));

    const updatedStudents = students.map(student => {
      delete student.submissions[assignmentId]; // Remove submission
      delete student.marks[assignmentId]; // Remove marks for this assignment
      return student;
    });
    setStudents(updatedStudents);
    localStorage.setItem('students', JSON.stringify(updatedStudents));
  };

  const handleSubmission = (studentName, assignmentId) => {
    if (submittedFile) {
      const submissionData = {
        file: URL.createObjectURL(submittedFile),
        fileName: submittedFile.name,
      };

      const updatedStudents = students.map(student => {
        if (student.name === studentName) {
          student.submissions[assignmentId] = submissionData; // Update submission
        }
        return student;
      });

      setStudents(updatedStudents);
      localStorage.setItem('students', JSON.stringify(updatedStudents));
      setSubmittedFile(null); // Reset the file input
    } else {
      alert('Please select a file to submit.');
    }
  };

  const handleMarksChange = (e, studentName, assignmentId) => {
    const newMarks = e.target.value;

    setMarks((prevMarks) => ({
      ...prevMarks,
      [studentName]: {
        ...prevMarks[studentName],
        [assignmentId]: newMarks, // Update marks state for the specific student and assignment
      },
    }));
  };

  const submitMarks = (studentName, assignmentId) => {
    const updatedStudents = students.map(student => {
      if (student.name === studentName && marks[studentName]?.[assignmentId] !== undefined) {
        student.marks[assignmentId] = marks[studentName][assignmentId]; // Assign marks to the student
      }
      return student;
    });
    
    setStudents(updatedStudents);
    localStorage.setItem('students', JSON.stringify(updatedStudents));

    // Reset the marks input for that student and assignment
    setMarks((prevMarks) => ({
      ...prevMarks,
      [studentName]: {
        ...prevMarks[studentName],
        [assignmentId]: '', // Reset input for this assignment
      },
    }));

    // Show confirmation message
    setConfirmationMessage(`Marks submitted for ${studentName} on assignment ${assignmentId}.`);
    setTimeout(() => setConfirmationMessage(''), 3000); // Clear message after 3 seconds
  };

  const deleteSubmission = (studentName, assignmentId) => {
    const updatedStudents = students.map(student => {
      if (student.name === studentName) {
        delete student.submissions[assignmentId]; // Remove submission
      }
      return student;
    });
    setStudents(updatedStudents);
    localStorage.setItem('students', JSON.stringify(updatedStudents));
  };

  const getSubmissionStatus = (student, assignmentId) => {
    const submission = student.submissions[assignmentId];
    const studentMarks = student.marks[assignmentId]; // Get current marks for the student and assignment
  
    if (submission) {
      return (
        <div className="flex items-center">
          <a
            href={submission.file}
            download={submission.fileName}
            className="text-blue-500 mr-2"
          >
            Download
          </a>
          <button
            onClick={() => deleteSubmission(student.name, assignmentId)}
            className="bg-red-500 text-white px-2 py-1 rounded"
          >
            Delete
          </button>
          <div className="flex items-center ml-2">
            <input
              type="number"
              placeholder="Marks"
              value={marks[student.name]?.[assignmentId] || ''} // Ensure value reflects latest marks
              onChange={(e) => handleMarksChange(e, student.name, assignmentId)}
              className="border p-1 w-24 ml-2"
            />
            <button
              onClick={() => submitMarks(student.name, assignmentId)}
              className="bg-green-500 text-white px-2 py-1 rounded ml-2"
            >
              Submit Marks
            </button>
          </div>
          <span className="ml-2 font-semibold">Marks: {studentMarks !== undefined ? studentMarks : 'N/A'}</span>
        </div>
      );
    } else {
      return <span className="text-red-500">Pending</span>;
    }
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold mb-4">Mentor Dashboard</h1>

      {confirmationMessage && (
        <div className="bg-green-500 text-white p-2 rounded mb-4">
          {confirmationMessage}
        </div>
      )}

      <div className="bg-white shadow-md p-6 rounded-md mb-6">
        <h2 className="text-xl font-semibold mb-4">Assign a New Task</h2>
        <input
          type="text"
          placeholder="Assignment Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="border p-2 w-full mb-4"
        />
        <textarea
          placeholder="Assignment Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="border p-2 w-full mb-4"
        ></textarea>
        <input
          type="date"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
          className="border p-2 w-full mb-4"
        />
        <button
          onClick={addAssignment}
          className="bg-blue-500 text-white p-2 rounded-md w-full hover:bg-blue-600"
        >
          Assign Task
        </button>
      </div>

      <h2 className="text-2xl font-semibold mb-4">Assigned Tasks</h2>
      <ul className="space-y-4">
        {assignments.map((assignment) => (
          <li key={assignment.id} className="bg-white shadow p-4 rounded-md">
            <h3 className="text-xl font-semibold">{assignment.title}</h3>
            <p>{assignment.description}</p>
            <p className="text-gray-500">Due Date: {assignment.dueDate}</p>
            <button
              onClick={() => deleteAssignment(assignment.id)}
              className="bg-red-500 text-white px-2 py-1 rounded mt-2"
            >
              Delete Assignment
            </button>
            <h4 className="mt-4 font-semibold">Student Submissions:</h4>
            {students.map(student => (
              <div key={student.name} className="flex items-center justify-between mb-2">
                <span>{student.name}</span>
                {getSubmissionStatus(student, assignment.id)}
              </div>
            ))}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default MentorDashboard;
