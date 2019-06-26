import React from "react";
import { Link } from "@reach/router";

const Home = () => (
  <div className="home">
  <Link to="/createchallenge">
      <button>Create a new challenge!</button>
    </Link>
    <Link to="/challenge/2341234">
      <button>Record a response!</button>
    </Link>
  </div>
);

export default Home;
