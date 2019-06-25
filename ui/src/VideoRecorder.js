import React from "react";
import RecordRTC from "recordrtc";

class VideoRecorder extends React.Component {
  constructor(props) {
    super(props);
    this.video = React.createRef();
    this.recording = false;
    this.recorder = null;
  }

  async captureCamera() {
    try {
      return navigator.mediaDevices.getUserMedia({ audio: true, video: true });
    } catch (error) {
      alert("Unable to capture your camera. Please check console logs.");
      console.error(error);
    }
  }

  startRecording = async () => {
    let self = this;
    self.recording = true;
    let camera = await this.captureCamera();

    self.video.current.muted = true;
    self.video.current.volume = 0;
    self.video.current.srcObject = camera;
    self.recorder = RecordRTC(camera, {
      type: "video"
    });
    self.recorder.startRecording();
    self.recorder.camera = camera;
    window.recorder = self.recorder;
  };

  stopRecordingCallback() {
    let self = this;
    self.recording = false;
    self.video.current.src = self.video.current.srcObject = null;
    self.video.current.muted = false;
    self.video.current.volume = 1;
    console.log(self.recorder);
    let blob = self.recorder.getBlob();
    console.log(blob);
    window.blobber = blob;
    self.video.current.src = URL.createObjectURL(blob);

    this.recorder.camera.stop();
    this.recorder.destroy();
    this.recorder = null;
  }

  stopRecording = () => {
    //this.recorder.stopRecording(() => {console.log('huh', arguments)});
    this.recorder.stopRecording(this.stopRecordingCallback.bind(this));
  };

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <title> Record a challenge </title>
          <div>Hello Challenge {this.props.challengeId}</div>
          <button id="btn-start-recording" onClick={this.startRecording}>
            Start Recording
          </button>
          <button id="btn-stop-recording" onClick={this.stopRecording}>
            Stop Recording
          </button>
          <video ref={this.video} controls autoPlay playsInline>
            {" "}
          </video>
        </header>
      </div>
    );
  }
}

export default VideoRecorder;
