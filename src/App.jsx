// App.jsx
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { useState } from "react";
import { db } from "./firebase";

const departments = {
  SITE: { 2013: 96.85, 2014: 98.65, 2015: 94.65, add: 10, name: "SITE" },
  SECE: { 2013: 92.13, 2014: 94.85, 2015: 88.98, add: 10, name: "SECE" },
  CBME: { 2013: 84.98, 2014: 89.68, 2015: 86.05, add: 10, name: "CBME" },
  SCEE: { 2013: 75.48, 2014: 79.55, 2015: 75.93, add: 10, name: "SCEE" },
  SMIE: { 2013: 70.1, 2014: 88.53, 2015: 80.25, add: 10, name: "SMIE" },
  SCBE: { 2013: 70.83, 2014: 76.03, 2015: 76.48, add: 10, name: "SCBE" },
};

function App() {
  const [sgp1, setSgp1] = useState("");
  const [sgp2, setSgp2] = useState("");
  const [department, setDepartment] = useState("SITE");
  const [results, setResults] = useState([]);

  const minimum = (SGP1, SGP2, year, cutoff_dict) => {
    if (SGP1 <= 4 && SGP2 <= 4) {
      SGP1 *= 30;
      SGP2 *= 40;
    }
    const cutoff = cutoff_dict[year];
    const add = cutoff_dict["add"];

    const SGP3 = (428 / 90) * (cutoff - add) - (SGP1 + SGP2);
    const min_GPA = SGP3 / 37;

    if (min_GPA > 4) {
      return ["Unattainable", "N/A"];
    }
    return [min_GPA.toFixed(2), SGP3.toFixed(2)];
  };

  const calculate = async () => {
    if (!sgp1 || !sgp2) {
      alert("Please enter valid SGP values");
      return;
    }

    const sgp1Value = parseFloat(sgp1);
    const sgp2Value = parseFloat(sgp2);
    const cutoff_dict = departments[department];

    const newResults = [2013, 2014, 2015].map((year) => ({
      year,
      ...minimum(sgp1Value, sgp2Value, year, cutoff_dict),
    }));

    setResults(newResults);

    try {
      await addDoc(collection(db, "sgp_data"), {
        timestamp: serverTimestamp(),
        sgp1: sgp1Value,
        sgp2: sgp2Value,
      });
    } catch (error) {
      console.error("Error saving data:", error);
    }
  };

  return (
    <div className="app">
      <style>
        {`
          * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
            font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
          }

          .app {
            background: #f0f2f5;
            min-height: 100vh;
          }

          .container {
            max-width: 800px;
            margin: 0 auto;
            padding: 20px;
          }

          .calculator {
            background: white;
            padding: 2rem;
            border-radius: 10px;
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
          }

          header {
            background: #0d47a1;
            color: white;
            padding: 2rem 0;
            margin-bottom: 2rem;
          }

          header h1 {
            text-align: center;
            font-size: 2.5rem;
            margin-bottom: 1rem;
          }

          header p {
            text-align: center;
            opacity: 1;
          }

          .form-group {
            margin-bottom: 1.5rem;
          }

          label {
            display: block;
            margin-bottom: 0.5rem;
            color: #000000;
            font-weight: 500;
          }

          input,
          select {
            width: 100%;
            padding: 0.8rem;
            border: 2px solid #666666;
            border-radius: 5px;
            font-size: 1rem;
          }

          button {
            background: #0d47a1;
            color: white;
            padding: 1rem 2rem;
            border: none;
            border-radius: 5px;
            cursor: pointer;
            font-size: 1rem;
            width: 100%;
            transition: background 0.3s;
            font-weight: bold;
          }

          button:hover {
            background: #1565c0;
          }

          button:focus {
            outline: 3px solid #90caf9;
            outline-offset: 2px;
          }

          .results {
            margin-top: 2rem;
            padding: 1rem;
            border-radius: 5px;
            background: #ffffff;
            border: 1px solid #cccccc;
          }

          .result-table {
          // color:black;
            width: 100%;
            border-collapse: collapse;
          }

          .result-table th,
          .result-table td {
            padding: 0.8rem;
            text-align: left;
            border-bottom: 1px solid #666666;
          }

          .result-table th {
            background: #0d47a1;
            color: white;
          }

          footer {
            text-align: center;
            padding: 2rem 0;
            color: #000000;
            font-size: 0.9rem;
          }

          .info-box {
            background: #bbdefb;
            color: #000000;
            padding: 1rem;
            border-radius: 5px;
            margin-bottom: 1rem;
            border: 1px solid #1976d2;
          }

          input:focus,
          select:focus {
            outline: 3px solid #90caf9;
            border-color: #0d47a1;
          }
        `}
      </style>

      <header>
        <div className="container">
          <h1>AAIT GPA Calculator</h1>
          <p>Calculate your required SGP for different departments</p>
        </div>
      </header>

      <div className="container">
        <div className="calculator">
          <div className="info-box">
            <p>
              Enter your SGP scores for Semester 1 and 2 to calculate the
              required SGP for Semester 3.
            </p>
          </div>

          <div className="form-group">
            <label htmlFor="sgp1">Semester 1 SGP</label>
            <input
              type="number"
              id="sgp1"
              step="0.01"
              placeholder="Enter SGP for Semester 1"
              value={sgp1}
              onChange={(e) => setSgp1(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label htmlFor="sgp2">Semester 2 SGP</label>
            <input
              type="number"
              id="sgp2"
              step="0.01"
              placeholder="Enter SGP for Semester 2"
              value={sgp2}
              onChange={(e) => setSgp2(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label htmlFor="department">Department</label>
            <select
              id="department"
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
            >
              {Object.keys(departments).map((dept) => (
                <option key={dept} value={dept}>
                  {dept}
                </option>
              ))}
            </select>
          </div>

          <button onClick={calculate}>Calculate</button>

          <div className="results">
            <h3>Results</h3>
            <table className="result-table">
              <thead>
                <tr>
                  <th>Year</th>
                  <th>Required GPA</th>
                  <th>Required SGP</th>
                </tr>
              </thead>
              <tbody>
                {results.map((result) => (
                  <tr key={result.year}>
                    <td>{result.year}</td>
                    <td>{result[0]}</td>
                    <td>{result[1]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <footer>
        <div className="container">
          <p>© 2024 SGP Calculator. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

export default App;
