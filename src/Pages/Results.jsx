import React, { useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

function renderBoldText(line) {
  const boldRegex = /\*\*(.*?)\*\*/g;
  const parts = [];
  let lastIndex = 0;
  let match;

  while ((match = boldRegex.exec(line)) !== null) {
    if (match.index > lastIndex) {
      parts.push(line.slice(lastIndex, match.index));
    }
    parts.push(
      <strong key={match.index} style={{ fontWeight: "bold" }}>
        {match[1]}
      </strong>
    );
    lastIndex = boldRegex.lastIndex;
  }

  if (lastIndex < line.length) {
    parts.push(line.slice(lastIndex));
  }

  return parts;
}

const bulletDoubleBoldRegex = /^[*-]\s*\*\*(.*?)\*\*\s*\*\*(.*?)\*\*/;
const boldKeyValueRegex = /^\*\*(.*?)\*\*\s*(.*)$/;
const daysOfWeekRegex = /^(Monday|Tuesday|Wednesday|Thursday|Friday|Saturday|Sunday)$/i;

function formatPlan(aiText) {
  const lines = aiText.split("\n");
  const tableRows = [];

  lines.forEach((line, idx) => {
    const trimmed = line.trim();
    if (!trimmed) return;

    let match = bulletDoubleBoldRegex.exec(trimmed);
    if (match) {
      tableRows.push(
        <tr key={idx}>
          <td style={{ width: "35%", backgroundColor: "#fafafa", fontWeight: "bold", padding: "12px", color: "#333", borderRight: "1px solid #e3e3e3", verticalAlign: "top" }}>
            {renderBoldText(match[1].trim())}
          </td>
          <td style={{ padding: "12px", color: "#333", verticalAlign: "top" }}>
            {renderBoldText(match[2].trim())}
          </td>
        </tr>
      );
      return;
    }

    // Check if line is a day of the week
    if (daysOfWeekRegex.test(trimmed)) {
      tableRows.push(
        <tr key={idx}>
          <td colSpan={2} style={{ 
            fontSize: "1.4rem",  // Smaller than section headers
            fontWeight: "bold", 
            padding: "10px",
            borderBottom: "1px solid #ccc", 
            color: "#333",
            textAlign: "center",
            backgroundColor: "#f1f1f1"
          }}>
            {trimmed}
          </td>
        </tr>
      );
      return;
    }

    match = boldKeyValueRegex.exec(trimmed);
    if (match) {
      tableRows.push(
        <tr key={idx}>
          <td colSpan={2} style={{ fontSize: "1.6rem", fontWeight: "bold", padding: "12px", borderBottom: "2px solid #ccc", color: "#444" }}>
            {renderBoldText(match[1].trim())}
          </td>
        </tr>
      );
      return;
    }

    if (trimmed.includes(":")) {
      const [key, val] = trimmed.split(":");
      if (val !== undefined) {
        tableRows.push(
          <tr key={idx}>
            <td style={{ width: "35%", backgroundColor: "#fafafa", fontWeight: "bold", padding: "12px", color: "#444", borderRight: "1px solid #e3e3e3", verticalAlign: "top" }}>
              {renderBoldText(key.trim())}
            </td>
            <td style={{ padding: "12px", color: "#333", verticalAlign: "top" }}>
              {renderBoldText(val.trim())}
            </td>
          </tr>
        );
        return;
      }
    }

    if (trimmed.startsWith("*") || trimmed.startsWith("-")) {
      tableRows.push(
        <tr key={idx}>
          <td colSpan={2} style={{ padding: "10px", color: "#333", backgroundColor: "#fafafa" }}>
            {renderBoldText(trimmed.substring(1).trim())}
          </td>
        </tr>
      );
      return;
    }

    if (trimmed.startsWith("#") || trimmed.startsWith("🏋️‍♂️")) {
      tableRows.push(
        <tr key={idx}>
          <td colSpan={2} style={{ fontSize: "2rem", fontWeight: "bold", padding: "16px", borderBottom: "3px solid #ccc", color: "#333", textAlign: "center", backgroundColor: "#f9f9f9" }}>
            {renderBoldText(trimmed.replace(/#/g, "").trim())}
          </td>
        </tr>
      );
      return;
    }

    tableRows.push(
      <tr key={idx}>
        <td colSpan={2} style={{ padding: "12px", color: "#333" }}>
          {renderBoldText(trimmed)}
        </td>
      </tr>
    );
  });

  return tableRows;
}

export default function ResultsPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const trainingPlan = location.state?.trainingPlan || "No training plan available.";
  const planRef = useRef(null);

  const handleSaveAsPDF = () => {
    const input = planRef.current;

    html2canvas(input, { scale: 3 }).then((canvas) => {
      const imgData = canvas.toDataURL("image/jpeg");
      const pdf = new jsPDF("p", "mm", "a4");
      const imgWidth = 210; // A4 page width in mm
      const pageHeight = 297; // A4 page height in mm
      let imgHeight = (canvas.height * imgWidth) / canvas.width; // Maintain aspect ratio
      let heightLeft = imgHeight;
      let position = 0;
      let pageNumber = 1;

      pdf.addImage(imgData, "JPEG", 0, position, imgWidth, imgHeight);
      pdf.text(`Page ${pageNumber}`, 10, 290); // Page number

      heightLeft -= pageHeight;

      while (heightLeft > 0) {
        position -= pageHeight; // Move down for new page
        pageNumber++;
        pdf.addPage();
        pdf.addImage(imgData, "JPEG", 0, position, imgWidth, imgHeight);
        pdf.text(`Page ${pageNumber}`, 10, 290); // Page number on each page
        heightLeft -= pageHeight;
      }

      pdf.save("training_plan.pdf");
    });
  };

  const handleGoHome = () => {
    navigate("/"); // Redirect to home
  };

  return (
    <div style={{
      background: "linear-gradient(120deg, rgba(255, 255, 255, 0.8) 0%, rgba(238, 242, 243, 0.5) 100%)",
      minHeight: "100vh",
      padding: "3rem",
      margin: "30px auto",
      borderRadius: "25px",
      boxShadow: "0px 10px 30px rgba(0, 0, 0, 0.2)",
      maxWidth: "90%",
      backdropFilter: "blur(10px)"
    }}>
      <div ref={planRef} style={{
        maxWidth: "1000px",
        margin: "0 auto",
        backgroundColor: "rgba(255, 255, 255, 0.9)",
        boxShadow: "0px 10px 30px rgba(0, 0, 0, 0.1)",
        padding: "2.5rem",
        borderRadius: "20px",
        backdropFilter: "blur(15px)"
      }}>
        <table style={{
          width: "100%",
          borderCollapse: "separate",
          borderSpacing: "0",
          fontSize: "18px",
          color: "#333"
        }}>
          <tbody>{formatPlan(trainingPlan)}</tbody>
        </table>
      </div>
    
      {/* Save to PDF & Restart Buttons */}
      <div style={{ textAlign: "center", marginTop: "2rem" }}>
        <button className="next-btn"
          onClick={handleSaveAsPDF}
          style={{
            padding: "14px 28px",
            fontSize: "1.1rem",
            fontWeight: "bold",
            borderRadius: "25px",
            background: "linear-gradient(135deg, #007bff, #0056b3)",
            boxShadow: "0 6px 12px rgba(0, 0, 0, 0.2)",
            transition: "transform 0.2s ease-in-out"
          }}
          onMouseOver={(e) => (e.currentTarget.style.transform = "scale(1.1)")}
          onMouseOut={(e) => (e.currentTarget.style.transform = "scale(1.0)")}
        >
          📥 Save Plan
        </button>
    
        <button className="next-btn"
          onClick={handleGoHome}
          style={{
            marginLeft: "30px",
            padding: "14px 28px",
            fontSize: "1.1rem",
            fontWeight: "bold",
            borderRadius: "25px",
            background: "linear-gradient(135deg, #28a745, #218838)",
            boxShadow: "0 6px 12px rgba(0, 0, 0, 0.2)",
            transition: "transform 0.2s ease-in-out"
          }}
          onMouseOver={(e) => (e.currentTarget.style.transform = "scale(1.1)")}
          onMouseOut={(e) => (e.currentTarget.style.transform = "scale(1.0)")}
        >
          📋 Restart Survey
        </button>
      </div>
    </div>
    
  );
}
