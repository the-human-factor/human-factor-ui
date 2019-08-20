import React from "react";

import { Link } from "@reach/router";

const AdapterLink = React.forwardRef((props, ref) => (
  <Link innerRef={ref} {...props} />
));

export default AdapterLink;