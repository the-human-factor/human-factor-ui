import React from "react";

import { Link } from "@reach/router";

// Todo: Wrap this together with @material-ui/core/Link
const AdapterLink = React.forwardRef((props, ref) => (
  <Link innerRef={ref} {...props} />
));

export default AdapterLink;