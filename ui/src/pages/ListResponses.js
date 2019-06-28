import React from "react";
import { Link } from "@reach/router";
import HumanApi from "../api";


class ResponseList extends React.Component {
  constructor(props) {
    super(props);
    this.api = new HumanApi();
  }

  render() {
    let responseLinks = this.api.getResponseIds().map(
      (id) => {
        let link = "/response/" + id;
        return <div> <br/> <Link to={link}> View Response {id} </Link></div>
      }
    );

    return (
      <div>
        {responseLinks}
      </div>
    );
  }
}

export default ResponseList;
