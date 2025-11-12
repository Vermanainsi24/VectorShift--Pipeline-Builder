import React from "react";
import { Handle, Position } from "reactflow";
import "./nodeStyles.css";

export default function NodeBase({ id, title, inputs = [], outputs = [], children, className = "" }) {
  return (
    <div className={`vs-node ${className}`} data-node-id={id}>
      <div className="vs-node-header">
        <div className="vs-node-title">{title}</div>
      </div>

      <div className="vs-node-body">
        <div className="vs-node-handles vs-node-handles-left">
          {inputs.map((h) => (
            <div key={h.id} className="vs-handle-row">
              <Handle type="target" position={Position.Left} id={h.id} />
              <div className="vs-handle-label">{h.label}</div>
            </div>
          ))}
        </div>

        <div className="vs-node-content">{children}</div>

        <div className="vs-node-handles vs-node-handles-right">
          {outputs.map((h) => (
            <div key={h.id} className="vs-handle-row">
              <div className="vs-handle-label">{h.label}</div>
              <Handle type="source" position={Position.Right} id={h.id} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
