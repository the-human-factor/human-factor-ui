import React from "react";

const Header = props => (
  <div>
    <h1>The Human Factor</h1>
    {props.children}
  </div>
);

export default Header;
