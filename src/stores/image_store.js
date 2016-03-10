import { ReduceStore } from 'flux/utils';
import dispatcher from '../dispatchers/app_dispatcher';
import assign from 'object-assign';
import * as EditorActions from '../actions/editor_actions';

const adjustTextToBox = function (message, x, y, width, height) {
    const fontSize = Math.round(Math.min(width / message.length, height * 0.9));
    const textWidth = Math.round(width);
    const textTop = Math.round(y + height / 2 - fontSize / 2);
    const textLeft = Math.round(x);
    return { fontSize, textWidth, textTop, textLeft };
  }
const setDefaultStyle = function(message, width, height){
  return adjustTextToBox(message, 0, 0, width, height);
}

class ImageStore extends ReduceStore {
  getInitialState() {
    return {
      url: '',
      width: 0,
      height: 0,
      message: 'LGTM',
      textTop: 0,
      textLeft: 0,
      textWidth: 0,
      fontSize: 0
    };
  }

  reduce(state, action) {
    switch(action.type) {
      case EditorActions.ADJUST_TO_BOX:
        return assign({}, state,
          adjustTextToBox(
            state.message,
            action.x,
            action.y,
            action.width,
            action.height
          ));

      case EditorActions.SET_STYLE:
        return assign({}, state, {
          textTop:   action.textTop,
          textLeft:  action.textLeft,
          textWidth: action.textWidth,
          fontSize:  action.fontSize
        });
      case EditorActions.SET_IMAGE:
        return(assign({}, state, {
          url: action.url,
          fileType: action.fileType,
          width: action.width,
          height: action.height
        }, setDefaultStyle(state.message, action.width, action.height)));
    }
    return state;
  }
}

export default (new ImageStore(dispatcher));
