import React, { useState } from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Pie } from 'react-chartjs-2';
import './App.css';

// Chart.js components ko register karna lazmi hai
ChartJS.register(ArcElement, Tooltip, Legend);

function App() {
  const [students, setStudents] = useState([]);
  const [name, setName] = useState('');
  const [score, setScore] = useState('');

  // --- Logic: Student Add Karna ---
  const addStudent = () => {
    // Validation: Sirf alphabets
    const namePattern = /^[A-Za-z\s]+$/;
    if (!namePattern.test(name)) {
      alert("Invalid Name! Please use alphabets only.");
      return;
    }

    // Validation: Score 0-100
    const s = parseInt(score);
    if (isNaN(s) || s < 0 || s > 100) {
      alert("Invalid Score! Please enter a number between 0 and 100.");
      return;
    }

    // Grade Logic
    let grade = "";
    if (s >= 90) grade = 'A+';
    else if (s >= 80) grade = 'B';
    else if (s >= 70) grade = 'C';
    else if (s >= 60) grade = 'D';
    else if (s >= 50) grade = 'E';
    else grade = 'F';

    setStudents([...students, { name, score: s, grade }]);
    setName('');
    setScore('');
    document.getElementById('studentName').focus();
  };

  // --- Logic: Enter Key Movement ---
  const handleKeyDown = (e, target) => {
    if (e.key === 'Enter') {
      if (target === 'name' && name.trim() !== "") {
        document.getElementById('studentScore').focus();
      } else if (target === 'score') {
        addStudent();
      }
    }
  };

  // --- Logic: Export to CSV ---
  const exportToCSV = () => {
    if (students.length === 0) return alert("No data to export!");
    let csv = "Name,Score,Grade\n";
    students.forEach(s => csv += `${s.name},${s.score},${s.grade}\n`);
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'Grade_Report.csv';
    a.click();
  };

  // --- Chart Data Structure ---
  const chartData = {
    labels: ['A+', 'B', 'C', 'D', 'E', 'F'],
    datasets: [{
      data: [
        students.filter(s => s.grade === 'A+').length,
        students.filter(s => s.grade === 'B').length,
        students.filter(s => s.grade === 'C').length,
        students.filter(s => s.grade === 'D').length,
        students.filter(s => s.grade === 'E').length,
        students.filter(s => s.grade === 'F').length,
      ],
      backgroundColor: ['#2ecc71', '#3498db', '#f1c40f', '#e67e22', '#9b59b6', '#e74c3c'],
    }]
  };

  const average = students.length > 0 
    ? (students.reduce((acc, s) => acc + s.score, 0) / students.length).toFixed(2) 
    : 0;

  return (
    <div className="container">
      <h2>--- GRADE BOOK MENU ---</h2>
      
      <div className="input-section">
        <input 
          id="studentName"
          type="text" 
          placeholder="Enter Name" 
          value={name}
          onChange={(e) => setName(e.target.value)}
          onKeyDown={(e) => handleKeyDown(e, 'name')}
          autoFocus 
        />
        <input 
          id="studentScore"
          type="number" 
          placeholder="Enter Score" 
          value={score}
          onChange={(e) => setScore(e.target.value)}
          onKeyDown={(e) => handleKeyDown(e, 'score')}
        />
        <button className="btn-add" onClick={addStudent}>Add Student</button>
      </div>

      <div className="main-content">
        <div className="report-area">
          <table id="studentTable">
            <thead>
              <tr>
                <th>Name</th>
                <th>Score</th>
                <th>Grade</th>
              </tr>
            </thead>
            <tbody>
              {students.map((s, index) => (
                <tr key={index}>
                  <td>{s.name}</td>
                  <td>{s.score}</td>
                  <td>{s.grade}</td>
                </tr>
              ))}
            </tbody>
          </table>
          
          <div className="average">Class Average: {average}</div>
          
          <button className="btn-export" onClick={exportToCSV}>
            Download Report (Excel)
          </button>
        </div>

        <div className="chart-container">
          {students.length > 0 ? (
            <Pie data={chartData} options={{ maintainAspectRatio: false }} />
          ) : (
            <p style={{textAlign: 'center', marginTop: '50px'}}>Add data to see chart</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;