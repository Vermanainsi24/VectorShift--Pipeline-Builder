import React, { useEffect, useRef, useState } from 'react';
import { Handle, Position } from 'reactflow';

export const TextNode = ({ id, data = {} }) => {
  const [currText, setCurrText] = useState(data?.text || '');
  const [variables, setVariables] = useState([]);
  const taRef = useRef(null);

  useEffect(() => {
    const regex = /\{\{\s*([A-Za-z_$][A-Za-z0-9_$]*)\s*\}\}/g;
    const found = new Set();
    let m;
    while ((m = regex.exec(currText)) !== null) found.add(m[1]);
    setVariables(Array.from(found));
  }, [currText]);

  useEffect(() => {
    const ta = taRef.current;
    if (!ta) return;
    ta.style.height = 'auto';
    ta.style.height = `${ta.scrollHeight}px`;
    const newWidth = Math.min(420, Math.max(180, ta.scrollWidth + 10));
    ta.style.width = `${newWidth}px`;
  }, [currText]);

  // const inputs = variables.map(v => ({ id: `var-${v}`, label: v }));

  return (
    <div style={{ padding: 8, border: '1px solid #ddd', borderRadius: 8, background: '#fff' }}>
      <div><strong>Text</strong></div>
      <textarea
        ref={taRef}
        value={currText}
        onChange={(e) => setCurrText(e.target.value)}
        placeholder="Type text... use {{variable}}"
        style={{ resize: 'none', fontSize: 13, padding: 6, borderRadius: 6, width: 200 }}
      />
      <div style={{ fontSize: 12, color: '#666', marginTop: 6 }}>
        Variables: {variables.length ? variables.join(', ') : 'none'}
      </div>

      {/* create target handles for each variable on left */}
      {variables.map((v) => (
        <Handle key={v} type="target" position={Position.Left} id={`var-${v}`} />
      ))}

      <Handle type="source" position={Position.Right} id={`${id}-output`} />
    </div>
  );
};

export default TextNode;
