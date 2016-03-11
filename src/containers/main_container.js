import React from 'react';
import {Container} from 'flux/utils';

import ImageStore from '../stores/image_store';
import EditorPreview from '../components/editor_preview';
import FileInput from '../components/file_input';
import UrlInput from '../components/url_input';


class MainContainer extends React.Component {
  static getStores() {
    return [ ImageStore ];
  }

  static calculateState(prevState) {
    return {
      image: ImageStore.getState()
    };
  }

  render() {
    return(
      <div>
        <EditorPreview image={this.state.image} />
        <FileInput />
        <UrlInput />
      </div>
    );
  }
}
export default Container.create(MainContainer);
