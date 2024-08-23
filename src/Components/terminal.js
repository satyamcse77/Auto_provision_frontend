import React from 'react';

const LinuxShell = ({ shellOutput }) => {
  return (
    <div className="shell" style={{ marginBottom: "10px" }}>
      <div className="shell-header">
        <span className="shell-title">Linux Shell</span>
      </div>
      <div className="shell-body">
        <pre className="shell-output">{shellOutput}</pre>
      </div>
    </div>
  );
};

export default LinuxShell;
