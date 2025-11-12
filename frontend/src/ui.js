// src/ui.js
import { useState, useRef, useCallback, useEffect } from "react";
import ReactFlow, { Controls, Background, MiniMap } from "reactflow";
import { useStore } from "./store";
import { shallow } from "zustand/shallow";

import InputNode from './nodes/inputNode';
import LLMNode from './nodes/llmNode';
import OutputNode from './nodes/outputNode';
import TextNode from './nodes/textNode';


import "reactflow/dist/style.css";

const gridSize = 20;
const proOptions = { hideAttribution: true };

const nodeTypes = {
  customInput: InputNode,
  llm: LLMNode,
  customOutput: OutputNode,
  text: TextNode,
};

const selector = (state) => ({
  nodes: state.nodes,
  edges: state.edges,
  getNodeID: state.getNodeID,
  addNode: state.addNode,
  onNodesChange: state.onNodesChange,
  onEdgesChange: state.onEdgesChange,
  onConnect: state.onConnect,
});

export const PipelineUI = () => {
  const reactFlowWrapper = useRef(null);
  const [reactFlowInstance, setReactFlowInstance] = useState(null);

  const {
    nodes,
    edges,
    getNodeID,
    addNode,
    onNodesChange,
    onEdgesChange,
    onConnect,
  } = useStore(selector, shallow);

  // DEBUG: log store nodes every time they change
  useEffect(() => {
    console.log("[PipelineUI] store nodes count:", nodes?.length, "edges:", edges?.length);
  }, [nodes, edges]);

  // DEBUG: when reactFlowInstance is ready, print its nodes & a minimal snapshot
  useEffect(() => {
    if (!reactFlowInstance) return;

    try {
      // reactFlowInstance.getNodes / toObject may vary by version; try both
      const instNodes = typeof reactFlowInstance.getNodes === "function"
        ? reactFlowInstance.getNodes()
        : (reactFlowInstance.toObject ? reactFlowInstance.toObject().nodes : null);

      console.log("[PipelineUI] reactFlowInstance nodes:", instNodes);

      // inspect minimap DOM after a short delay (allow it to render)
      setTimeout(() => {
        const mm = document.querySelector(".react-flow__minimap");
        if (!mm) {
          console.warn("[PipelineUI] MiniMap element not found in DOM");
          return;
        }
        console.log("[PipelineUI] MiniMap element found:", mm);
        const svg = mm.querySelector("svg");
        console.log("[PipelineUI] MiniMap svg element:", !!svg);
        const shapes = svg ? svg.querySelectorAll("rect, path, g, circle, ellipse, polygon") : [];
        console.log("[PipelineUI] MiniMap shape count:", shapes.length);
        // show first few shapes (tagName + fill + stroke)
        shapes.forEach((s, i) => {
          if (i < 6) {
            console.log("  shape", i, s.tagName, "fill:", s.getAttribute("fill"), "stroke:", s.getAttribute("stroke"));
          }
        });
      }, 400);
    } catch (err) {
      console.error("[PipelineUI] error reading instance:", err);
    }
  }, [reactFlowInstance]);

  // const getInitNodeData = (nodeID, type) => {
  //   return { id: nodeID, nodeType: `${type}` };
  // };

  const onDrop = useCallback(
    (event) => {
      event.preventDefault();
      if (!reactFlowWrapper.current || !reactFlowInstance) return;

      const reactFlowBounds = reactFlowWrapper.current.getBoundingClientRect();
      const raw = event.dataTransfer.getData("application/reactflow");
      if (!raw) return;

      let appData;
      try {
        appData = JSON.parse(raw);
      } catch {
        return;
      }
      const type = appData?.nodeType;
      if (!type) return;

      const position = reactFlowInstance.project({
        x: event.clientX - reactFlowBounds.left,
        y: event.clientY - reactFlowBounds.top,
      });

      const nodeID = getNodeID(type);
      const newNode = {
        id: nodeID,
        type,
        position,
        data: { id: nodeID, nodeType: type },
      };
      addNode(newNode);
    },
    [reactFlowInstance, addNode, getNodeID]
  );

  const onDragOver = useCallback((event) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
  }, []);

  return (
    <>
      <div ref={reactFlowWrapper} style={{ width: "100vw", height: "100vh" }}>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onDrop={onDrop}
          onDragOver={onDragOver}
          onInit={setReactFlowInstance}
          nodeTypes={nodeTypes}
          proOptions={proOptions}
          snapGrid={[gridSize, gridSize]}
          connectionLineType="smoothstep"
        >
          <Background color="#aaa" gap={gridSize} />
          <Controls />
          
<MiniMap
  nodeStrokeColor={(node) => {
    if (node.type === "llm") return "#7c3aed";
    if (node.type === "text") return "#06b6d4";
    if (node.type === "customInput") return "#10b981";
    if (node.type === "customOutput") return "#f59e0b";
    return "#64748b";
  }}
  nodeColor={(node) => {
    if (node.type === "llm") return "#e9d5ff";
    if (node.type === "text") return "#ecfeff";
    if (node.type === "customInput") return "#ecfdf5";
    if (node.type === "customOutput") return "#fff7ed";
    return "#f1f5f9";
  }}
  nodeBorderRadius={4}
  maskColor="rgba(2,6,23,0.08)"
  zoomable
  pannable
  style={{
    width: 200,
    height: 140,
    position: "absolute",
    right: 18,
    bottom: 18,
    borderRadius: 10,
    boxShadow: "0 8px 22px rgba(2,6,23,0.09)",
    background: "linear-gradient(180deg,#ffffff,#f3f6fb)",
    zIndex: 99999,
  }}
/>

          
        </ReactFlow>
      </div>
    </>
  );
};
