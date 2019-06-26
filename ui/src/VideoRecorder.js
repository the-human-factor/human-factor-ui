import React from "react";
import RecordRTC from "recordrtc";

class VideoRecorder extends React.Component {
  constructor(props) {
    super(props);
    this.videoRecording = React.createRef();
    this.recording = false;
    this.recorder = null;
    this.camera = null;
    this.blob = null;
  }

  async captureCamera() {
    try {
      return navigator.mediaDevices.getUserMedia({ audio: true, video: true });
    } catch (error) {
      alert("Unable to capture your camera. Please check console logs.");
      console.error(error);
    }
  }

  setup = async () => {
    let self = this;
    self.camera = await this.captureCamera();
    self.videoRecording.current.muted = true;
    self.videoRecording.current.volume = 0;
    self.videoRecording.current.srcObject = self.camera;
  }

  startRecording = async () => {
    let self = this;
    if (self.camera == null) {
      await self.setup()
    }
    self.recording = true;
    
    self.recorder = RecordRTC(self.camera, {
      type: "video"
    });
    self.recorder.startRecording();
    self.recorder.camera = self.camera;
    window.recorder = self.recorder;
  }

  stopRecordingCallback() {
    let self = this;
    self.recording = false;

    self.videoRecording.current.src = self.videoRecording.current.srcObject = null;
    self.videoRecording.current.muted = false;
    self.videoRecording.current.volume = 1;
    self.blob = self.recorder.getBlob();
    console.log(self.blob);
    self.videoRecording.current.src = URL.createObjectURL(self.blob);

    this.recorder.camera.stop();
    this.recorder.destroy();
    this.recorder = null;
  }

  stopRecording = () => {
    this.recorder.stopRecording(this.stopRecordingCallback.bind(this));
  };

  componentDidMount() {
    this.setup()
  }

  render() {
    return (
	  <div>
        <video ref={this.videoRecording} autoPlay playsInline />
	  </div>
	);
  }
}

export default VideoRecorder;
