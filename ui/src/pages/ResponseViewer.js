import React from "react";
import VideoRecorder from "../components/VideoRecorder";
import HumanApi from "../api";

class ResponseViewer extends React.Component {
  constructor(props) {
    super(props);
    this.videoChallenge = React.createRef();
    this.videoResponse = React.createRef();
    this.api = new HumanApi();
    this.response = this.api.getResponse(this.props.responseId);
    this.challenge = this.api.getChallenge(this.response.challengeId);
    
  }

  startPlaying = () => {
    let self = this;
    self.videoChallenge.current.play();
    self.videoResponse.current.play();
    // Mute the response video until the challenge is played.
    // This should be done more react-ily.
    self.videoResponse.current.volume = 0;
    self.videoChallenge.current.onended =  () => {self.videoResponse.current.volume=1};
  };
  

  challengeString() {
      if (this.props.challengeId) {
    return this.props.challengeId;
      } 
      return "no challenge id";
  }

  render() {
    return (
      <div className="ResponseRecorder">
      <title> View response </title>
      <div> View Response {this.props.responseId} to Challenge {this.challengeString()}</div>
      <h1> Instructions </h1>
      <div> {this.challenge.instructions} 
      </div>
<br/>
          <button id="btn-start-recording" onClick={this.startPlaying}>
            Start Playing
          </button>
          <video width="250" ref={this.videoChallenge}>
      
      <source src ={this.challenge.link} type="video/webm" />
          </video>
          <video width="250" ref={this.videoResponse}>
      
      <source src ={this.response.link} type="video/webm" />
          </video>
      
      </div>
    );
  }
}

export default ResponseViewer;
