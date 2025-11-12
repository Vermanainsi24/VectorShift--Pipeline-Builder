// src/nodes/inputNode.js
import React, { useState, useEffect } from "react";
import { Handle, Position } from "reactflow";
import "../index.css"; // or './node-ui.css' if you created a node-ui file

export default function InputNode({ id, data = {} }) {
  const [name, setName] = useState(data.inputName || `input_${id.split('-').pop()}`);
  const [type, setType] = useState(data.inputType || "Text");

  useEffect(() => {
    // sync to node data if upstream expects it (optional)
    if (data && typeof data.onChange === "function") {
      data.onChange({ inputName: name, inputType: type });
    }
  }, [name, type, data]);

  return (
    <div className="vs-node vs-node-card">
      <div className="vs-node-header">
        <div className="vs-node-title">Input</div>
      </div>

      <div className="vs-node-body">
        <label className="vs-label">Name</label>
        <input
          className="vs-input"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="input_1"
        />

        <label className="vs-label">Type</label>
        <select
          className="vs-select"
          value={type}
          onChange={(e) => setType(e.target.value)}
        >
          <option>Text</option>
          <option>File</option>
          <option>Number</option>
        </select>
      </div>

      {/* Output handle on the right */}
      <Handle
        type="source"
        position={Position.Right}
        id={`${id}-output`}
        style={{ top: "50%", background: "#06b6d4", border: "2px solid white" }}
      />
    </div>
  );
}
