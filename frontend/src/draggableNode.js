// src/draggableNode.js
import React from "react";

export const DraggableNode = ({ type, label, icon }) => {
  const onDragStart = (event) => {
    event.dataTransfer.setData(
      "application/reactflow",
      JSON.stringify({ nodeType: type })
    );
    event.dataTransfer.effectAllowed = "move";
  };

  return (
    <div
      draggable
      onDragStart={onDragStart}
      style={{
        background: "#0f172a",
        color: "#fff",
        borderRadius: "12px",
        minWidth: "90px",
        height: "70px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        fontWeight: 600,
        gap: "6px",
        cursor: "grab",
        userSelect: "none",
        transition: "transform 0.15s ease, box-shadow 0.2s ease",
        boxShadow: "0 4px 12px rgba(102, 134, 207, 0.3)",
        
      }}
    >
      <div style={{ fontSize: "18px" }}>{icon}</div>
      <span style={{ fontSize: "13px" }}>{label}</span>
    </div>
  );
};
