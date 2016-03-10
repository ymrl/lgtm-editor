import React from 'react';
import ReactDOM from 'react-dom';
import { Surface, Image, Text } from 'react-canvas';
import LgtmCanvas from './lgtm_canvas';
import ccv from '../ccv';
import cascade from '../face';
import EditorActions from '../actions/editor_actions';


const CANVAS_REF = 'canvas';
export default class EditorPreview extends React.Component {
  constructor () {
    super();
  }

  adjustToImage() {
    const { width, height } = this.props.image;
    EditorActions.adjustToBox({ x: 0, y: 0, width, height});
  }
  detectFace(url) {
    const img = new window.Image();
    img.src = url;
    img.addEventListener('load', () => {
      const faces = ccv.detect_objects({
        "canvas" : ccv.grayscale(ccv.pre(img)),
  			"cascade" : cascade,
  			"interval" : 5,
  			"min_neighbors" : 1
      });
      const initialArea = {
        x: 0, y: 0,
        width: this.props.image.width,
        height: this.props.image.height
      };
      const areas = faces.reduce((areas, face) => {
        const result = areas.map((area) => this.findExcludeFaceArea(area, face))
        return Array.prototype.concat.apply([], result);
      }, [initialArea]).sort((a, b) => b.width * b.height - a.width * a.height);
      const useArea = areas[0] || initialArea;
      if (useArea) {
        EditorActions.adjustToBox(useArea);
      }
    });
  }

  findExcludeFaceArea(source, face) {
    if (source.x <= face.x + face.width &&
        face.x <= source.x + source.width &&
        source.y <= face.y + face.height &&
        face.y <= source.y + source.height
      ) {
      const result = [];
      if (source.y < face.y) {
        // 上側
        result.push({
          x: source.x,
          y: source.y,
          width: source.width,
          height: face.y - source.y
        });
      }
      if (source.x < face.x ) {
        // 左側
        result.push({
          x: source.x,
          y: source.y,
          width: face.x - source.x,
          height: source.height
        });
      }
      if (face.x + face.width < source.x + source.width) {
        // 右側
        result.push({
          x: face.x + face.width,
          y: source.y,
          width: source.x + source.width - face.x - face.width,
          height: source.height
        })
      }
      if (face.y + face.height < source.y + source.height) {
        // 下側
        result.push({
          x: source.x,
          y: face.y + face.height,
          width: source.width,
          height: source.y + source.height - face.y - face.height
        })
      }
      return result;
    }
    return [ source ];
  }

  getCanvasNode() {
    return ReactDOM.findDOMNode(this.refs[CANVAS_REF]);
  }

  exportImage(type) {
    this.refs[CANVAS_REF].exportImage(type);
  }

  handleChangeStyle(propertyName, e) {
    const newState = {
      fontSize: this.props.image.fontSize,
      textTop: this.props.image.textTop,
      textLeft: this.props.image.textLeft,
      textWidth: this.props.image.textWidth
    }
    newState[propertyName] = Number(e.target.value);
    EditorActions.setStyle(newState);
  }

  render () {
    const { url, width, height, fileType, message, fontSize, textTop, textLeft, textWidth} = this.props.image;

    return (
      <div className="lgtm-editor">
        { url ?
          <LgtmCanvas imageUrl={url}
            imageWidth={width}
            imageHeight={height}
            imageFileType={fileType}
            fontSize={fontSize}
            textTop={textTop}
            textLeft={textLeft}
            textWidth={textWidth}
            message={message}
            ref={CANVAS_REF}
          /> : null }
        { url ?
          <div className="toolset">
            <div>
              <button type="button" onClick={this.adjustToImage.bind(this, url)}>reset</button>
              <button type="button" onClick={this.detectFace.bind(this, url)}
                disabled={fileType === 'image/gif'}>detect face</button>
            </div>

            <div>
              <label>
                text size
                <input type="number" value={fontSize}
                  onChange={this.handleChangeStyle.bind(this, 'fontSize')} />
              </label>
            </div>
            <div>
              <label>
                text position (x)
                <input type="number" value={textLeft}
                  onChange={this.handleChangeStyle.bind(this, 'textLeft')} />
              </label>
            </div>
            <div>
              <label>
                text position (y)
                <input type="number" value={textTop}
                  onChange={this.handleChangeStyle.bind(this, 'textTop')} />
              </label>
            </div>
            <div>
              <label>
                text box width
                <input type="number" value={textWidth}
                  onChange={this.handleChangeStyle.bind(this, 'textWidth')} />
              </label>
            </div>
            <div>
              <button type="button"
                onClick={this.exportImage.bind(this, fileType)}>
                Export
              </button>
              <button type="button"
                onClick={this.exportImage.bind(this, "image/png")}>
                PNG
              </button>
              <button type="button"
                onClick={this.exportImage.bind(this, "image/jpeg")}>
                JPEG
              </button>
            </div>
          </div> : null
        }
      </div>
    );
  }
}
