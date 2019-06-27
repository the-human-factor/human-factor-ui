import React from "react";
import { Link } from "@reach/router";
import HumanApi from "../api";


class ChallengeList extends React.Component {
  constructor(props) {
    super(props);
    this.api = new HumanApi();
  }

  render() {
    let challengeLinks = this.api.getChallengeIds().map(
      (id) => {
        let link = "/challenge/" + id;
        return <div> <br/> <Link to={link}> Take Challenge {id} </Link></div>
      }
    );

    return (
      <div>
        {challengeLinks}
      </div>
    );
  }
}

export default ChallengeList;
