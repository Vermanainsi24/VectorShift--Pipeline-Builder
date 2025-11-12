// src/nodes/outputNode.js
import React, { useState, useEffect } from "react";
import { Handle, Position } from "reactflow";
import "../index.css"; // or './node-ui.css'

export default function OutputNode({ id, data = {} }) {
  const [name, setName] = useState(data.outputName || `output_${id.split('-').pop()}`);
  const [type, setType] = useState(data.outputType || "Text");

  useEffect(() => {
    if (data && typeof data.onChange === "function") {
      data.onChange({ outputName: name, outputType: type });
    }
  }, [name, type, data]);

  return (
    <div className="vs-node vs-node-card">
      <div className="vs-node-header">
        <div className="vs-node-title">Output</div>
      </div>

      <div className="vs-node-body">
        <label className="vs-label">Name</label>
        <input
          className="vs-input"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="output_1"
        />

        <label className="vs-label">Type</label>
        <select
          className="vs-select"
          value={type}
          onChange={(e) => setType(e.target.value)}
        >
          <option>Text</option>
          <option>Image</option>
          <option>JSON</option>
        </select>
      </div>

      {/* Input handle on the left */}
      <Handle
        type="target"
        position={Position.Left}
        id={`${id}-input`}
        style={{ top: "45%", background: "#06b6d4", border: "2px solid white" }}
      />
    </div>
  );
}
