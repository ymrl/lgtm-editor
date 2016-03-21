import React from 'react';
import ReactDOM from 'react-dom';
import MainContainer from './containers/main_container';
import EditorActions from './actions/editor_actions';

window.addEventListener('load', () => {
  ReactDOM.render(
    React.createElement(MainContainer),
    document.querySelector('#main')
  );
  document.body.addEventListener('paste', (e) => {
    for (let i = 0, l = e.clipboardData.items.length; i < l; i++) {
      const item = e.clipboardData.items[i];
      if(/^image\//.test(item.type)) {
        const blob = item.getAsFile();
        const reader = new FileReader();
        reader.addEventListener('loadend', () => {
          EditorActions.setImage({
            url: reader.result,
            fileType: item.type
          })
        })
        reader.readAsDataURL(blob);
      }
    }
  });
});
