import React from "react";
import { Link } from "@reach/router";

const Home = () => (
  <div>
    Hey Brian!
    <Link to="/challenge/2341234">
      <button>Record a video!</button>
    </Link>
  </div>
);

export default Home;
