import React from "react";
import VideoRecorder from "../components/VideoRecorder";

class ChallengeRecorder extends React.Component {
  constructor(props) {
    super(props);
    
    this.videoRecorder = React.createRef();
    this.recording = false;
  }

  toggleRecording = () => {
    let self = this;
    if (self.recording) {
      self.stopRecording()
    } else {
      self.startRecording()
    }
    self.recording = !self.recording;
    console.log(self.recording);
  }

  startRecording() {
    this.videoRecorder.current.startRecording();
  }

  stopRecording() {
    this.videoRecorder.current.stopRecording();
  }

  toggleString() {
    if (this.recording) {
      return "STOP"
    }
    return "START"
  }

  render() {
    return (
      <div className="ChallengeRecorder">
        <h2>Record A Challenge</h2>
        <VideoRecorder ref={this.videoRecorder}/>
        <button id="btn-start-recording" onClick={this.toggleRecording}>
          {this.toggleString()}
        </button>
      </div>
    );
  }
}

export default ChallengeRecorder;
