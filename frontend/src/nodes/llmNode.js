import React from 'react';
import { Handle, Position } from 'reactflow';

export const LLMNode = ({ id, data }) => {
  return (
    <div style={{ width: 200, height: 80, border: '1px solid black', padding: 8, borderRadius: 8, background: '#fff' }}>
      <Handle type="target" position={Position.Left} id={`${id}-system`} style={{ top: '33%' }} />
      <Handle type="target" position={Position.Left} id={`${id}-prompt`} style={{ top: '66%' }} />

      <div><strong>LLM</strong></div>
      <div style={{ fontSize: 12, marginTop: 6 }}>This is a LLM node.</div>

      <Handle type="source" position={Position.Right} id={`${id}-response`} />
    </div>
  );
};

export default LLMNode;
