import React from "react";
import Dropdown from '../UI/dropdown'


const DropdownItems = [
  "All",
  "Venus Flytraps",
  "Tropical Pitchers",
  "American Pitchers",
  "Butterworts",
  "Sundews",
];

function FilterRow() {
  return (
    <div className=" flex justify-start items-start">
  <Dropdown items={DropdownItems} label="Category" />
  </div>
  );
};

export default FilterRow;