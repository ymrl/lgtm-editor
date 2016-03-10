import React from 'react';
import EditorActions from '../actions/editor_actions';

export default class FileInput extends React.Component {
  handleImageSelect(e) {
    const file = e.target.files[0];
    if (!file) { return; }
    const fileType = file.type
    const reader = new FileReader();
    reader.onload = (evt) => {
      EditorActions.setImage({
        url: evt.target.result,
        fileType
      })
    }
    reader.readAsDataURL(file);
  }

  render() {
    return(
      <form>
        <input type="file" onChange={this.handleImageSelect.bind(this)} />
      </form>
    );
  }
}
