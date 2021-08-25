import React, { useState, useEffect, useContext } from "react";
import Inventory from "./Inventory";
import { AppContext } from "./App";
const Bank = () => {
  const tok = useContext(AppContext);
  return (
    <div>
      <h1>Bank</h1>
      <Inventory inventories={[]}></Inventory>
    </div>
  );
};

export default Bank;
