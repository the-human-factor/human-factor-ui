import React from "react";
import RecordRTC from "recordrtc";
import VideoRecorder from "./VideoRecorder";

class ChallengeRecorder extends React.Component {
  constructor(props) {
    super(props);
    
    this.videoRecorder = React.createRef();
    
  }

  startRecording = () => {
    let self = this;
    self.videoRecorder.current.startRecording();
  };

  stopRecording = () => {
    let self = this;
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
      <div className="ChallengeRecorder">
        <div>Record A Challenge {this.challengeString()}</div>
        <button id="btn-start-recording" onClick={this.startRecording}>
          Start Recording
        </button>
        <button id="btn-stop-recording" onClick={this.stopRecording}>
          Stop Recording
        </button>
        <VideoRecorder ref={this.videoRecorder}/>
      </div>
    );
  }
}

export default ChallengeRecorder;
