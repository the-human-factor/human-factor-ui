import React from 'react';
import RecordRTC from 'recordrtc';

import ErrorContext from 'components/ErrorContext';

class VideoRecorder extends React.Component {
  static STATUS = {
    WAITING_FOR_CAMERA: 'WAITING_FOR_CAMERA',
    READY_TO_RECORD: 'READY_TO_RECORD',
    RECORDING: 'RECORDING',
    REPLAY: 'REPLAY',
  };

  static defaultProps = {
    width: '640',
    height: '480',
    recordWidth: 1024,
    recordHeight: 768,
    allowReview: false,
    className: '',
    onStatusChange: status => {},
    onPlay: (e, t) => {},
    onPause: (e, t) => {},
    onSeeked: (e, t) => {},
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
    this.setupCamera = this.setupCamera.bind(this);
    this.mute = this.mute.bind(this);
    this.unmute = this.unmute.bind(this);
    this.stopRecordingCallback = this.stopRecordingCallback.bind(this);
  }

  static contextType = ErrorContext;

  componentDidMount() {
    this.handleError = this.context;
    this.setupCamera();
    this.addVideoListeners();
  }

  componentDidUpdate() {
    this.addVideoListeners();
  }

  addVideoListeners() {
    const elem = this.videoElement.current;
    const props = this.props;
    elem.addEventListener('loadeddata', this.loadedData);
    elem.addEventListener('play', e => props.onPlay(e, elem.currentTime));
    elem.addEventListener('pause', e => props.onPause(e, elem.currentTime));
    elem.addEventListener('seeked', e => props.onSeeked(e, elem.currentTime));
  }

  updateStatus(status) {
    this.status = status;
    this.props.onStatusChange(status);
  }

  loadedData(event) {
    if (this.status === VideoRecorder.STATUS.WAITING_FOR_CAMERA) {
      this.updateStatus(VideoRecorder.STATUS.READY_TO_RECORD);
    }
  }

  async setupCamera() {
    this.camera = await this.captureCamera();
    if (this.camera) {
      this.videoElement.current.muted = true;
      this.videoElement.current.volume = 0;
      this.videoElement.current.srcObject = this.camera;
      this.videoElement.current.controls = false;
      this.videoElement.current.autoplay = true;
    }
  }

  async captureCamera() {
    // https://developer.mozilla.org/en-US/docs/Web/API/MediaDevices/getUserMedia
    return navigator.mediaDevices
      .getUserMedia({
        audio: true,
        video: {
          width: this.props.recordWidth,
          height: this.props.recordHeight,
        },
      })
      .catch(error => {
        this.handleError(error, 'Error in mediaDevices.getUserMedia', true);
        return undefined;
      });
  }

  async startRecording() {
    if (
      this.camera == null ||
      this.status !== VideoRecorder.STATUS.READY_TO_RECORD
    ) {
      this.handleError(
        new Error("Can't start playing status:" + this.status),
        'Error in startRecording VideoRecorder',
        true
      );
      return;
    }
    this.updateStatus(VideoRecorder.STATUS.RECORDING);
    this.videoElement.current.muted = true;

    const settings = {
      type: 'video',
      canvas: {
        width: this.props.width,
        height: this.props.height,
      },
      mimeType: 'video/webm;codecs=vp8',
    };

    this.recorder = RecordRTC(this.camera, settings);
    this.recorder.startRecording();
    this.recorder.camera = this.camera;
    window.recorder = this.recorder;
  }

  stopRecordingCallback() {
    this.videoElement.current.src = this.videoElement.current.srcObject = null;
    this.videoElement.current.muted = false;
    this.videoElement.current.volume = 1;
    this.videoElement.current.autoplay = false;

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
    this.recorder.stopRecording(() => {
      this.stopRecordingCallback();
      callback();
    });
  }

  resetForRecording() {
    this.blob = null;
    this.updateStatus(VideoRecorder.STATUS.WAITING_FOR_CAMERA);
    this.setupCamera();
  }

  getBlob() {
    return this.blob;
  }

  render() {
    return (
      <video
        className={this.props.className}
        ref={this.videoElement}
        playsInline
        autoPlay
        width={this.props.width}
        height={this.props.height}
      />
    );
  }
}

export default VideoRecorder;
