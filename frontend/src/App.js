
import React from "react";
import { PipelineToolbar } from "./toolbar";
import { PipelineUI } from "./ui";
import { SubmitButton } from "./submit";
import { useStore } from "./store";
import { shallow } from "zustand/shallow";

function App() {
  // get nodes/edges from store (to pass to SubmitButton)
  const selector = (s) => ({ nodes: s.nodes, edges: s.edges });
  const { nodes, edges } = useStore(selector, shallow);

  return (
    <div className="app-shell">
      <header className="app-header">
        <div className="brand">
          <div className="logo">VS</div>
          <h1>VectorShift — Pipeline Builder</h1>
        </div>

        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <div style={{ color: "var(--muted)", fontSize: 13 }}>Drag nodes to the canvas</div>
        </div>
      </header>

      <div style={{ display: "flex", alignItems: "flex-start", gap: 0 }}>
        {/* left toolbar */}
        <div style={{ flex: "0 0 auto", padding: 12 }}>
          <div style={{ width: 150 }}>
            <div className="pipeline-toolbar">
              <PipelineToolbar />
            </div>
          </div>
        </div>

        {/* main canvas */}
        <main style={{ flex: 1 }}>
          <div className="reactflow-wrapper">
            <PipelineUI />
          </div>
        </main>
      </div>

      {/* floating submit */}
      <div className="submit-float">
        <SubmitButton nodes={nodes} edges={edges} />
      </div>
    </div>
  );
}

export default App;
