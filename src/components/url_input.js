import React from 'react';
import EditorActions from '../actions/editor_actions';

export default class UrlInput extends React.Component {
  constructor() {
    super();
    this.state = { url: '', gif: false };

  }
  handleUrlInput(e) {
    const url = e.target.value;
    this.setState({ url });
  }

  handleCheckGif(e) {
    const gif = e.target.checked;
    this.setState({ gif });

  }

  handleOk(e) {
    e.preventDefault();
    EditorActions.setImage({ url: this.state.url, fileType: this.state.gif ? 'image/gif' : null });
  }

  render() {
    return(
      <form>
        <label> Image URL: <input type="text" onChange={this.handleUrlInput.bind(this)} /></label>
        <label><input type="checkbox" onChange={this.handleCheckGif.bind(this)} /> GIF</label>
        <button onClick={this.handleOk.bind(this)}>OK</button>
      </form>
    );
  }
}
