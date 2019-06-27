import React from "react";
import { Link } from "@reach/router";

const Home = () => (
  <div className="home">
  	<Link to="/createchallenge">Create a new challenge!</Link>
  	<br />
  	<Link to="/challenge/2341234">Record a response!</Link>
  </div>
);

export default Home;
