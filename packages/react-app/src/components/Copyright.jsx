import React from "react";

const Copyright = () => {
  return (
    <div style={{ margin: "0 !important", padding: "10px", backgroundColor: "#9B5DE5" }}>
      <div style={{ marginTop: "25px", marginBottom: "25px", color: "#fff", textAlign: "center", fontWeight: 200 }}>
        Built by 🦈 &nbsp;&nbsp;
        <a
          target="_blank"
          href="https://velvetshark.com/"
          rel="noreferrer"
          style={{ color: "#fff", textDecoration: "underline", fontWeight: 200 }}
        >
          VelvetShark.com
        </a>
        {", "}
        {new Date().getFullYear()}
        {"."}
      </div>
    </div>
  );
};

export default Copyright;
