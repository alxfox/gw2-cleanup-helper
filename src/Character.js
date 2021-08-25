import React, { useState, useEffect, useContext } from "react";
import Inventory from "./Inventory";
import { AppContext } from "./App";
const Character = ({ char }) => {
  const [invs, setInvs] = useState([]);
  const context = useContext(AppContext);
  const link =
    "https://api.guildwars2.com/v2/characters/" +
    char +
    "/inventory?access_token=" +
    context;
  useEffect(() => {
    console.log(link);
    fetch(link)
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        const bags = data.bags;
        const invs = bags.map((bag) => (bag === null ? null : bag.inventory));
        console.log(invs);
        setInvs(invs);
      });
  }, []);
  return (
    <div>
      <h1>{char}</h1>
      <Inventory inventories={invs}></Inventory>
    </div>
  );
};

export default Character;
