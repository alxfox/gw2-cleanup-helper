import React, { useState, useEffect } from "react";
import constantsData from "./constants.json";
/**
 * A react component for displaying Prices in a gold, silver, copper format
 * @param {*} name the label of this price
 * @param {*} value value in copper
 * @param {*} count a multiplier, count of items
 * @param {*} applyCount whether to apply the count as a multiplier to the price
 * @returns the component
 */
const Price = (name, value, count, applyCount) => {
  const val = applyCount ? value * count : value;
  return (
    <div>
      {" "}
      {name}: <span style={{ color: "yellow" }}>{Math.floor(val / 10000)}</span>{" "}
      <span style={{ color: "silver" }}>{Math.floor((val % 10000) / 100)}</span>{" "}
      <span style={{ color: "orange" }}>{val % 100}</span>
    </div>
  );
};

const Item = (props) => {
  const {
    icon,
    id,
    level,
    name,
    rarity,
    type,
    vendor_value,
    subtype,
    stats,
    count,
    buy,
    sell,
    flags,
    insBuy, //insignia/inscription buy and sell price
    insSell,
    upgrades,
  } = props;
  const multi = false; //TODO: make this a state (true while shift held down)
  return (
    <div className="tooltip">
      <span className="tooltiptext">
        <h4>
          {count > 1 ? count : null} {name}
        </h4>
        <div>Level: {level}</div>
        <div>
          {vendor_value > 0 && flags.find((x) => x !== "NoSell") === undefined
            ? Price("Vendor", vendor_value)
            : null}
          {buy > 0 ? Price("TP Buy", buy, count, multi) : null}
          {sell > 0 ? Price("TP Sell", sell, count, multi) : null}
          {insBuy > 0 ? Price("Ins Buy", insBuy, count, multi) : null}
          {insSell > 0 ? Price("Ins Sell", insSell, count, multi) : null}
          {upgrades !== undefined
            ? upgrades.map((upgrade, id) => (
                <React.Fragment key={id}>
                  {upgrade.buy > 0
                    ? Price("Upgr Buy", upgrade.buy, count, multi)
                    : null}
                  {upgrade.sell > 0
                    ? Price("Upgr Sell", upgrade.sell, count, multi)
                    : null}
                </React.Fragment>
              ))
            : null}
        </div>
        <div>{type}</div>
      </span>
      <img
        style={{ border: "2px solid " + constantsData.RARITY_COLORS[rarity] }}
        className="myimg"
        src={icon}
        alt=""
        width="68"
        height="68"
      />
    </div>
  );
};

export default Item;
