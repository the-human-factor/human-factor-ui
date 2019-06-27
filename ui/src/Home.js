import React from "react";
import { Link } from "@reach/router";
import HumanApi from "./api"


class Home extends React.Component {
    constructor(props) {
	super(props);
	this.api = new HumanApi();
    }
    render() {
	let challengeLinks = this.api.getChallengeIds().map(
	  (id) => {
	      let link = "/challenge/" + id;
	      return <div> <br/> <Link to={link}> Take Challenge {id} </Link></div>}); 
	return (
	  <div className="home">
	  <Link to="/createchallenge">Create a new challenge!</Link>
	  <br />
	  
	  <div>
	      {challengeLinks}
	  </div>
	  </div>
		);
    }
}

export default Home;
