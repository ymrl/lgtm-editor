import React from 'react';
import ReactDOM from 'react-dom';
import MainContainer from './containers/main_container';

window.addEventListener('load', () => {
  ReactDOM.render(
    React.createElement(MainContainer),
    document.querySelector('#main')
  );
});
