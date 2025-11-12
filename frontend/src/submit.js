// src/submit.js
import React from "react";

/**
 * submitPipeline - default export
 * POST nodes and edges to the backend and return the parsed response.
 *
 * nodes: array, edges: array
 */
const submitPipeline = async (nodes = [], edges = []) => {
  const res = await fetch("http://localhost:8000/pipelines/parse", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ nodes, edges }),
  });

  if (!res.ok) {
    const txt = await res.text();
    throw new Error(`Server error ${res.status}: ${txt}`);
  }

  return res.json();
};

/**
 * SubmitButton - named export used by App.js
 * Accepts nodes and edges as props (so it can send the current pipeline).
 */
export function SubmitButton({ nodes = [], edges = [], label = "Submit" }) {
  const handleClick = async () => {
    try {
      const data = await submitPipeline(nodes, edges);
      alert(
        `Pipeline Results:\n\nNodes: ${data.num_nodes}\nEdges: ${data.num_edges}\nIs DAG: ${
          data.is_dag ? "✅ Yes" : "❌ No"
        }`
      );
    } catch (err) {
      console.error("submit error:", err);
      alert("Submit failed: " + (err.message || err));
    }
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      style={{
        padding: "8px 12px",
        borderRadius: 8,
        border: "none",
        background: "#0ea5a4",
        color: "white",
        cursor: "pointer",
        fontWeight: 600,
      }}
    >
      {label}
    </button>
  );
}

// single default export for this module
export default submitPipeline;
