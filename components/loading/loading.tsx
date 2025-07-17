import React from "react";
import "./loading.scss";

export default function Loading({ fadeOut = false }: { fadeOut?: boolean }) {
  return (
    <div className={`loading-circle-container ${fadeOut ? "shrink" : ""}`}>
      <div className="loader" />
    </div>
  );
}
