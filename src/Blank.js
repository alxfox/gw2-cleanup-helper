import React, { useState, useEffect } from "react";

const Blank = ({ img }) => {
  return (
    <div className="tooltip">
      <img
        style={{ border: "2px solid #000000" }}
        src={img}
        alt=""
        width="68"
        height="68"
      />
    </div>
  );
};

export default Blank;
