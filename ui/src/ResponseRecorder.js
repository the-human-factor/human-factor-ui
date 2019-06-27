import React from "react";
import RecordRTC from "recordrtc";
import VideoRecorder from "./components/VideoRecorder";

class ResponseRecorder extends React.Component {
  constructor(props) {
    super(props);
    
    this.videoChallenge = React.createRef();
    this.videoRecorder = React.createRef();
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
          <title> Record a challenge </title>
          <div>Record A Challenge {this.challengeString()}</div>
          <button id="btn-start-recording" onClick={this.startRecording}>
            Start Recording
          </button>
          <button id="btn-stop-recording" onClick={this.stopRecording}>
            Stop Recording
          </button>
          <video width="250" ref={this.videoChallenge}>
            
            <source src = "https://fat.gfycat.com/PowerlessDiligentAstarte.webm" type="video/webm" />
          </video>
          <VideoRecorder ref={this.videoRecorder}/>
      </div>
    );
  }
}
// <source src="http://dl5.webmfiles.org/big-buck-bunny_trailer.webm" type="video/webm" />

export default ResponseRecorder;
