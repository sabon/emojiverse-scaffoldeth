import { PageHeader } from "antd";
import React from "react";

// displays a page header

export default function Header() {
  return (
    <a href="https://emojiverse.fun">
      <PageHeader
        title="Emojiverse"
        className="header"
        ghost={false}
        style={{ cursor: "pointer", backgroundColor: "#9b5de5" }}
      />
    </a>
  );
}
