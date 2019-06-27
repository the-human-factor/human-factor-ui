import React from "react";
import VideoRecorder from "../components/VideoRecorder";
import HumanApi from "../api";

class ResponseRecorder extends React.Component {
  constructor(props) {
    super(props);
    this.videoChallenge = React.createRef();
    this.videoRecorder = React.createRef();
    this.api = new HumanApi();
    this.challenge = this.api.getChallenge(this.props.challengeId);
  }

  startRecording = () => {
    let self = this;
    console.log(self.videoChallenge)
    self.videoChallenge.current.play();
    self.videoRecorder.current.startRecording();
  };

  stopRecording = () => {
    let self = this;
    self.videoChallenge.current.currentTime = 0;
    self.videoChallenge.current.play();
    self.videoRecorder.current.stopRecording();
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
          <title> Record a Response </title>
          <div>Record A Response {this.challengeString()}</div>
      <h1> Instructions </h1>
      <div> {this.challenge.instructions} 
      </div>
<br/>
          <button id="btn-start-recording" onClick={this.startRecording}>
            Start Recording
          </button>
          <button id="btn-stop-recording" onClick={this.stopRecording}>
            Stop Recording
          </button>
          <video width="250" ref={this.videoChallenge}>
            
      <source src ={this.challenge.link} type="video/webm" />
          </video>
          <VideoRecorder ref={this.videoRecorder}/>
      </div>
    );
  }
}
// <source src="http://dl5.webmfiles.org/big-buck-bunny_trailer.webm" type="video/webm" />

export default ResponseRecorder;
