import React from "react";
import RecordRTC from "recordrtc";

class VideoRecorder extends React.Component {
  static STATUS = {
    WAITING_FOR_CAMERA: 'waiting_for_camera',
    READY_TO_RECORD: 'ready_to_record',
    RECORDING: 'recording',
    REPLAY: 'replay',
  };

  constructor(props) {
    super(props);
    this.videoElement = React.createRef();
    this.recorder = null;
    this.camera = null;
    this.blob = null;

    this.status = VideoRecorder.STATUS.WAITING_FOR_CAMERA;

    this.loadedData = this.loadedData.bind(this);
    this.startRecording = this.startRecording.bind(this);
    this.stopRecording = this.stopRecording.bind(this);
    this.stopRecordingWithCallback = this.stopRecordingWithCallback.bind(this);
    this.resetForRecording = this.resetForRecording.bind(this);
    this.setup = this.setup.bind(this);
    this.mute = this.mute.bind(this);
    this.unmute = this.unmute.bind(this);
    this.stopRecordingCallback = this.stopRecordingCallback.bind(this);
  }

  static defaultProps = {
    width: "640",
    height: "480",
    allowReview: false,
    onStatusChange: (status) => {}
  };

  componentDidMount() {
    this.setup()
    this.videoElement.current.addEventListener('loadeddata', this.loadedData)
  }

  updateStatus(status) {
    this.status = status;
    this.props.onStatusChange(status);
  }

  loadedData(event) {
    if (this.status === VideoRecorder.STATUS.WAITING_FOR_CAMERA) {
      this.updateStatus(VideoRecorder.STATUS.READY_TO_RECORD)
    }
  };

  async setup() {
    this.camera = await this.captureCamera();
    this.videoElement.current.muted = true;
    this.videoElement.current.volume = 0;
    this.videoElement.current.srcObject = this.camera;
    this.videoElement.current.controls = false;
    this.videoElement.current.autoPlay = true;
  }

  async captureCamera() {
    try {
      return navigator.mediaDevices.getUserMedia({ audio: true, video: true });
    } catch (error) {
      alert("Unable to capture your camera. Please check console logs.");
      console.error(error);
    }
  }

  async startRecording() {
    if (this.camera == null || this.status !== VideoRecorder.STATUS.READY_TO_RECORD) {
      throw new Error("Can't start playing status:" + this.status)
    }
    this.updateStatus(VideoRecorder.STATUS.RECORDING)
    
    this.recorder = RecordRTC(this.camera, {type: "video"});
    this.recorder.startRecording();
    this.recorder.camera = this.camera;
    window.recorder = this.recorder;
  }

  stopRecordingCallback() {
    this.videoElement.current.src = this.videoElement.current.srcObject = null;
    this.videoElement.current.muted = false;
    this.videoElement.current.volume = 1;
    this.videoElement.current.autoPlay = false;

    if (this.props.allowReview) {
      this.videoElement.current.controls = true;
    }
    this.blob = this.recorder.getBlob();
    this.videoElement.current.src = URL.createObjectURL(this.blob);

    this.recorder.camera.stop();
    this.recorder.destroy();
    this.recorder = null;

    this.updateStatus(VideoRecorder.STATUS.REPLAY);
  }

  mute() {
    this.videoElement.current.volume = 0;
    this.videoElement.current.muted = true;
  }

  unmute() {
    this.videoElement.current.volume = 1;
    this.videoElement.current.muted = false;
  }

  stopRecording() {
    this.recorder.stopRecording(this.stopRecordingCallback);
  }

  stopRecordingWithCallback(callback) {
    this.recorder.stopRecording(() =>
      {this.stopRecordingCallback();
       callback();
      });
  }

  resetForRecording() {
    this.blob = null;
    this.updateStatus(VideoRecorder.STATUS.WAITING_FOR_CAMERA)
    this.setup();
  }

  getBlob() {
    return this.blob;
  }

  render() {
    // const divStyle = {
    //   backgroundColor: '#333',
    //   width: this.props.width + "px",
    //   height: this.props.height + "px",
    // };

    return (
      <div>
        <video
          ref={this.videoElement}
          autoPlay
          playsInline
          width={this.props.width}
          height={this.props.height}
        />
      </div>
    );
  }
}

export default VideoRecorder;
