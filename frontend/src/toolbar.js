// src/toolbar.js
import React from "react";
import { DraggableNode } from "./draggableNode";
import { FaArrowRight, FaRobot, FaSignOutAlt, FaFont } from "react-icons/fa"; // icons
import "./index.css";

export const PipelineToolbar = () => {
  const buttons = [
    { type: "customInput", label: "Input", icon: <FaArrowRight /> },
    { type: "llm", label: "LLM", icon: <FaRobot /> },
    { type: "customOutput", label: "Output", icon: <FaSignOutAlt /> },
    { type: "text", label: "Text", icon: <FaFont /> },
  ];

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "14px",
        alignItems: "center",
        padding: "10px 20px",
        justifyContent: "center",
        marginTop: "80px",
      }}
    >
      {buttons.map((btn) => (
        <DraggableNode key={btn.type} type={btn.type} label={btn.label} icon={btn.icon} />
      ))}
    </div>
  );
};
