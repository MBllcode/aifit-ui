import React from "react";
import { useLocation } from "react-router-dom";

/**
 * 1) Convert **bold** text to <strong>, removing the asterisks.
 */
function renderBoldText(line) {
  const boldRegex = /\*\*(.*?)\*\*/g;
  const parts = [];
  let lastIndex = 0;
  let match;

  while ((match = boldRegex.exec(line)) !== null) {
    // Text before the bold
    if (match.index > lastIndex) {
      parts.push(line.slice(lastIndex, match.index));
    }
    // The bold text
    parts.push(
      <strong key={match.index} style={{ fontWeight: "bold" }}>
        {match[1]}
      </strong>
    );
    lastIndex = boldRegex.lastIndex;
  }

  // Remaining text
  if (lastIndex < line.length) {
    parts.push(line.slice(lastIndex));
  }

  return parts;
}

/**
 * 2) Regex for "[* or -] **Left** **Right**"
 *    => 2-col row with left=Left, right=Right
 */
const bulletDoubleBoldRegex = /^[*-]\s*\*\*(.*?)\*\*\s*\*\*(.*?)\*\*/;

/**
 * 3) Regex for "**Key** Value"
 *    => If no Value => heading row
 *    => Else => Key-Value row
 */
const boldKeyValueRegex = /^\*\*(.*?)\*\*\s*(.*)$/;

/**
 * 4) The main logic that parses lines and creates <tr> elements:
 *    - bulletDoubleBoldRegex => 2-col row
 *    - boldKeyValueRegex => heading row or 2-col row
 *    - "Key: Value" => 2-col row
 *    - lines starting with "*" or "-" => single-col "centered" row
 *    - lines starting with "#" => bigger heading row
 *    - fallback => normal paragraph row
 */
function formatPlan(aiText) {
  const lines = aiText.split("\n");
  const tableRows = [];

  lines.forEach((line, idx) => {
    const trimmed = line.trim();
    if (!trimmed) return; // Skip empty lines

    // 1) "[* or -] **Left** **Right**"
    let match = bulletDoubleBoldRegex.exec(trimmed);
    if (match) {
      const leftSide = match[1].trim();
      const rightSide = match[2].trim();

      tableRows.push(
        <tr key={idx}>
          <td
            style={{
              width: "35%",
              backgroundColor: "#fafafa",
              fontWeight: "bold",
              padding: "12px",
              color: "#333",
              borderRight: "1px solid #e3e3e3",
              verticalAlign: "top"
            }}
          >
            {renderBoldText(leftSide)}
          </td>
          <td style={{ padding: "12px", color: "#333", verticalAlign: "top" }}>
            {renderBoldText(rightSide)}
          </td>
        </tr>
      );
      return;
    }

    // 2) "**Key** Value"
    match = boldKeyValueRegex.exec(trimmed);
    if (match) {
      const keyText = match[1].trim();
      const valueText = match[2].trim();

      // No value => heading
      if (!valueText) {
        tableRows.push(
          <tr key={idx}>
            <td
              colSpan={2}
              style={{
                fontSize: "1.6rem",
                fontWeight: "bold",
                padding: "12px",
                borderBottom: "2px solid #ccc",
                color: "#444"
              }}
            >
              {renderBoldText(keyText)}
            </td>
          </tr>
        );
      } else {
        // Key-Value row
        tableRows.push(
          <tr key={idx}>
            <td
              style={{
                width: "35%",
                backgroundColor: "#fafafa",
                fontWeight: "bold",
                padding: "12px",
                color: "#444",
                borderRight: "1px solid #e3e3e3",
                verticalAlign: "top"
              }}
            >
              {renderBoldText(keyText)}
            </td>
            <td
              style={{ padding: "12px", color: "#333", verticalAlign: "top" }}
            >
              {renderBoldText(valueText)}
            </td>
          </tr>
        );
      }
      return;
    }

    // 3) "Key: Value"
    if (trimmed.includes(":")) {
      const [key, val] = trimmed.split(":");
      if (val !== undefined) {
        const cleanKey = key.trim();
        const cleanValue = val.trim();
        if (cleanKey || cleanValue) {
          tableRows.push(
            <tr key={idx}>
              <td
                style={{
                  width: "35%",
                  backgroundColor: "#fafafa",
                  fontWeight: "bold",
                  padding: "12px",
                  color: "#444",
                  borderRight: "1px solid #e3e3e3",
                  verticalAlign: "top"
                }}
              >
                {renderBoldText(cleanKey)}
              </td>
              <td
                style={{ padding: "12px", color: "#333", verticalAlign: "top" }}
              >
                {renderBoldText(cleanValue)}
              </td>
            </tr>
          );
          return;
        }
      }
    }

    // 4) If line starts with "*" or "-", single-col row (centered)
    if (trimmed.startsWith("*") || trimmed.startsWith("-")) {
      const content = trimmed.substring(1).trim();
      tableRows.push(
        <tr key={idx}>
          <td
            colSpan={2}
            style={{
              padding: "10px",
              color: "#333",
              backgroundColor: "#fafafa",
            }}
          >
            {renderBoldText(content)}
          </td>
        </tr>
      );
      return;
    }

    // 5) If line starts with "#", etc. => big heading row
    if (trimmed.startsWith("#") || trimmed.startsWith("🏋️‍♂️")) {
      const headingText = trimmed.replace(/#/g, "").trim();
      tableRows.push(
        <tr key={idx}>
          <td
            colSpan={2}
            style={{
              fontSize: "2rem",
              fontWeight: "bold",
              padding: "16px",
              borderBottom: "3px solid #ccc",
              color: "#333",
              textAlign: "center",
              backgroundColor: "#f9f9f9"
            }}
          >
            {renderBoldText(headingText)}
          </td>
        </tr>
      );
      return;
    }

    // 6) Fallback => paragraph row
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
  const trainingPlan = location.state?.trainingPlan || "No training plan available.";

  return (
    <div
      style={{
        /* A subtle gradient background. Adjust colors as desired: */
        background: "linear-gradient(120deg, #eef2f3 0%, #ffffff 100%)",
        minHeight: "100vh",
        padding: "2rem"
      }}
    >
      <div
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
          backgroundColor: "#fff",
          boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
          padding: "2rem",
          borderRadius: "16px"
        }}
      >
        {/* Main Table */}
        <table
          style={{
            width: "100%",
            borderCollapse: "separate",
            borderSpacing: "0"
          }}
        >
          <tbody>{formatPlan(trainingPlan)}</tbody>
        </table>

        {/* Button */}
        <div style={{ textAlign: "center", marginTop: "2rem" }}>
          <button
            style={{
              backgroundColor: "#007bff",
              color: "#fff",
              padding: "0.75rem 1.5rem",
              borderRadius: "9999px",
              border: "none",
              fontSize: "1rem",
              fontWeight: "bold",
              cursor: "pointer",
              boxShadow: "0 2px 4px rgba(0,0,0,0.2)",
              transition: "background-color 0.3s ease"
            }}
            onMouseOver={(e) => (e.currentTarget.style.backgroundColor = "#0056b3")}
            onMouseOut={(e) => (e.currentTarget.style.backgroundColor = "#007bff")}
          >
            Save Plan 📥
          </button>
        </div>
      </div>
    </div>
  );
}
