import React from 'react';
import ReactDOM from 'react-dom';
//import Exploder from 'exploder';
import { Surface, Image, Text } from 'react-canvas';
import { Encoder, Decoder } from 'readwrite-gif';
import request from 'superagent';
import assign from 'object-assign';
import encode64 from '../b64';

const CANVAS_REF = 'canvas';
export default class LgtmCanvas extends React.Component {
  constructor (props) {
    super();
    this.renderedFrames = {};
    this.state = { frames: null, frameIndex: 0, length: 0 }
  }

  componentDidMount(){
    this.onReadImage(this.props);
  }

  onReadImage(props) {
    const { imageFileType, imageUrl, imageHeight, imageWidth }  = props;
    if (imageFileType === 'image/gif') {
      const agent = request.get(imageUrl).end((err, res) => {
        if(!err) {
          const arr = new Uint8Array(res.xhr.response);
          const decoder = new Decoder(arr);
          this.loadFrames(decoder);
        }
      });
      agent.xhr.responseType = 'arraybuffer';
    }
    this.setState({ frames: null, started: null })
  }

  loadFrames(decoder) {
    const { imageWidth, imageHeight } = this.props;
    const canvas = document.createElement('canvas');
    canvas.width = imageWidth;
    canvas.height = imageHeight;
    const ctx = canvas.getContext('2d');
    const frames = [];
    let length = 0;
    for (let i = 0, len = decoder.numFrames(); i < len ; i++) {
      const frame = decoder.frameInfo(i);
      const imagedata = ctx.createImageData(imageWidth, imageHeight);
      decoder.decodeAndBlitFrameRGBA(i, imagedata.data); // Decode 0th frame
      ctx.putImageData(imagedata, 0, 0);
      frames.push(assign({}, frame, { url: canvas.toDataURL() }));
      length += frame.delay;
      ctx.clearRect(0, 0, imageWidth, imageHeight)
    }
    this.renderedFrames = {};
    this.setState({
      frames,
      length,
      started: (new Date()).getTime(),
      frameIndex: 0
    }, this.animationLoop.bind(this));
  }

  componentWillReceiveProps(props) {
    this.renderedFrames = {};
    this.onReadImage(props);
    this.setState({frames: null});
  }

  animationLoop() {
    const { frames, length, started } = this.state;
    if (frames, started) {
      const now = (new Date).getTime();
      const offset = (now - started) % (10 * length);
      let frameIndex = 0;
      let delaySum = 0;
      for (let l = frames.length; frameIndex < l; frameIndex++) {
        delaySum += frames[frameIndex].delay * 10;
        if (delaySum > offset) { break; }
      }
      this.setState({ frameIndex });
      window.requestAnimationFrame(this.animationLoop.bind(this));
    }
  }

  getImageStyle() {
    const { imageWidth, imageHeight } = this.props;
    return {
      top: 0,
      left: 0,
      zIndex: 0,
      width: imageWidth,
      height: imageHeight
    }
  }

  getTextStyle() {
    const {fontSize, textTop, textLeft, textWidth} = this.props;
    return {
      top: textTop,
      left: textLeft,
      width: textWidth,
      height: fontSize,
      lineHeight: fontSize,
      fontSize,
      textAlign: 'center',
      fontWeight: 'bolder',
      shadowColor: '#000',
      shadowBlur: fontSize * 0.2,
      shadowOffsetX: 0,
      shadowOffsetY: 0,
      zIndex: 9999,
      color: '#fff'
    };
  }

  componentDidUpdate() {
    const { frames, frameIndex } = this.state;
    const { imageWidth, imageHeight } = this.props;

    if (frames) {
      this.renderedFrames[frameIndex] = this.getDOMNode().getContext('2d').getImageData(0, 0, imageWidth, imageHeight);
    }
  }

  exportImage(type = this.props.imageFileType) {
    const { frames, imageFileType } = this.state;
    const { imageWidth, imageHeight } = this.props;
    if (type === 'image/gif' && frames) {
      if (Object.keys(this.renderedFrames).length === frames.length) {
        const encoder = new Encoder();
        encoder.setRepeat(0);
        encoder.setDelay(frames[0].delay);
        encoder.start();
        const canvas = document.createElement('canvas');
        canvas.width = imageWidth;
        canvas.height = imageHeight;
        const ctx = canvas.getContext('2d')
        for(let i = 0, l = frames.length; i < l; i++) {
          ctx.clearRect(0, 0, imageWidth, imageHeight);
          ctx.putImageData(this.renderedFrames[i], 0, 0);
          encoder.addFrame(ctx);
        }
        encoder.finish();
        window.open(`data:image/gif;base64,${encode64(encoder.stream().getData())}`);
      }
    } else {
      window.open(this.getDOMNode().toDataURL(type));
    }
  }

  getDOMNode() {
    return ReactDOM.findDOMNode(this)
  }

  renderFrames() {
    const { frames, frameIndex } = this.state;
    return frames.map((frame, index) => index <= frameIndex ?
      <Image
        style={assign(this.getImageStyle(), {zIndex: index})}
        src={frames[index].url} key={index} /> : null
    );
  }

  render() {
    const { imageUrl, imageWidth, imageHeight, message } = this.props;
    const { frames } = this.state;
    return(
      <Surface
        width={imageWidth} height={imageHeight}
        top={0} left={0} scale={1}>
        { frames ?
            this.renderFrames() :
            <Image style={this.getImageStyle()} src={imageUrl} />
        }
        <Text style={this.getTextStyle()}>{message}</Text>
      </Surface> : null
    );
  }
}
