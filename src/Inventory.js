import React, { useState, useEffect, useContext } from "react";
import Item from "./Item";
import Blank from "./Blank";
import { fetchItems, fetchPrices } from "./APIAccess";
import "./Inventory.css";
import constantsData from "./constants.json";
function isTradeable(item) {
  if (
    item.flags.includes("AccountBound") ||
    item.flags.includes("SoulbindOnAcquire")
  )
    return false;
  return true;
}
function isEquipment(item) {
  return (
    item.type === "Weapon" || item.type === "Back" || item.type === "Armor"
  );
}
function getStatSalvage(item) {
  if (isEquipment(item) && item.rarity === "Exotic") {
    const set = constantsData.STAT_SETS[item.details.infix_upgrade.id];
    if (set === undefined) return undefined;
    if (item.type === "Weapon") return constantsData.INSCRIPTIONS[set];
    else if (item.type === "Armor") return constantsData.INSIGNIAS[set];
  }
  return undefined;
}
function getUpgrades(item) {
  if (isEquipment(item)) {
    const set = constantsData.STAT_SETS[item.details.infix_upgrade.id];
    if (set === undefined) return undefined;
    if (item.type === "Weapon") return constantsData.INSCRIPTIONS[set];
    else if (item.type === "Armor") return constantsData.INSIGNIAS[set];
  }
  return undefined;
}

const Inventory = ({ inventories }) => {
  const [items, setItems] = useState([]);
  useEffect(() => {
    //save personal itemdata to re-add later (like count)
    var charSpecificItemData = [];
    var idsTP = [];
    const ids = inventories
      .map((inventory) => {
        return inventory.map((item) => {
          if (item) {
            charSpecificItemData.push({
              id: item.id,
              count: item.count,
              upgrades: item.upgrades,
            });
            if (item.upgrades !== undefined) {
              idsTP = idsTP.concat(item.upgrades);
            }
            return item.id;
          } else {
            charSpecificItemData.push({
              id: "",
              count: 0,
              upgrades: undefined,
            });
            return "";
          }
        });
      })
      .flat();
    console.log("allIDs: " + ids);

    const myRet = fetchItems(ids);
    myRet.then((items) => {
      items.forEach((item) => {
        const ins = getStatSalvage(item);
        if (ins !== undefined) idsTP.push(ins);
        if (isTradeable(item)) idsTP.push(item.id);
      });
      const pri = fetchPrices(idsTP);
      pri.then((prices) => {
        console.log("prices", prices);
        const out = charSpecificItemData.map(({ id, count, upgrades }) => {
          if (id === "") return undefined;
          const item = items.find((item) => item.id === id);
          const price = prices.find((price) => price.id === id);
          if (price === undefined) {
            item.buy = 0;
            item.sell = 0;
          } else {
            item.buy = price.buys.unit_price;
            item.sell = price.sells.unit_price;
          }
          item.upgrades = [];
          if (upgrades !== undefined) {
            item.upgrades = upgrades.map((upgrade) => {
              const price = prices.find((price) => price.id === upgrade);
              return {
                id: upgrade,
                buy: price.buys.unit_price,
                sell: price.sells.unit_price,
              };
            });
          }
          item.count = count;
          const statSet = getStatSalvage(item);
          if (statSet !== undefined) {
            //console.log("item has ins price? ", item);
            const insPrice = prices.find((price) => price.id === statSet);
            if (insPrice === undefined) {
              item.insBuy = 0;
              item.insSell = 0;
            } else {
              //console.log("item has ins price: ", item);
              item.insBuy = insPrice.buys.unit_price;
              item.insSell = insPrice.sells.unit_price;
            }
          }

          return item;
        });
        console.log(out);
        setItems(out);
      });
    });
  }, [inventories]);
  return (
    <div className="inventory">
      {items.map((item, id) => {
        // console.log(item);
        if (id === 201) console.log(item);
        if (item === undefined)
          return (
            <Blank
              img="https://render.guildwars2.com/file/CC3A2CAADBB2F2B13B1E70079E7E207B08D16E93/65946.png"
              key={id}
            ></Blank>
          );
        else return <Item {...item} key={id}></Item>;
      })}
    </div>
  );
};

export default Inventory;
