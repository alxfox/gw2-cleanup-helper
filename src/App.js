import logo from "./logo.svg";
import "./App.css";
import React, { useState, useEffect, useContext } from "react";
import Bank from "./Bank";
import Character from "./Character";
import { getStuff } from "./APIAccess";
import configData from "./config.json";
export const AppContext = React.createContext("test");
function App() {
  const [token, setToken] = useState("" + configData.API_KEY);
  const [characters, setCharacters] = useState([]);

  useEffect(() => {
    // var x = await getStuff();
    // console.log("a " + x);
    // setCharacters(x);
    // console.log("b");
    fetch("https://api.guildwars2.com/v2/characters?access_token=" + token)
      .then((response) => response.json())
      .then((data) => {
        var x = data.map((name, id) => {
          return { name, id };
        });
        // setCharacters(x);
        setCharacters([{ name: configData.CHARACTER, id: 0 }]);
      });
  }, [token]);

  return (
    <AppContext.Provider value={token}>
      {/* <Bank></Bank> */}
      {characters.map((char) => {
        console.log(char[1]);
        return <Character key={char.id} char={char.name}></Character>;
      })}
    </AppContext.Provider>
  );
}

export default App;
