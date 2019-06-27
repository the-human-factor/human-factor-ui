import React from "react";

const Header = props => (
  <div>
    <div>This is a header</div>
    {props.children}
  </div>
);

export default Header;
