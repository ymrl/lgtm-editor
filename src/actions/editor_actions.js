import { dispatch } from '../dispatchers/app_dispatcher';
export const SET_IMAGE = 'editor_actions/set_image';
export const SET_STYLE = 'editor_actions/set_style';
export const ADJUST_TO_BOX = 'editor_actions/adjust_to_box';

const dispatchImage = function(url, fileType, width, height) {
  dispatch({ type: SET_IMAGE, url, fileType, width, height });
}

const EditorActions = {
  adjustToBox(params) {
    dispatch({
      type: ADJUST_TO_BOX,
      x: params.x,
      y: params.y,
      width: params.width,
      height: params.height
    });
  },

  setStyle(params) {
    dispatch({
      type: SET_STYLE,
      textTop:   params.textTop,
      textLeft:  params.textLeft,
      textWidth: params.textWidth,
      fontSize:  params.fontSize
    })
  },

  setImage(params) {
    if (params.url && params.width && params.height) {
      dispatchImage(params.url, params.fileType, params.width, params.height);
    } else if (params.url) {
      const imgElm = new window.Image();
      imgElm.src = params.url;
      imgElm.addEventListener('load', () => {
        dispatchImage( params.url, params.fileType,
          imgElm.naturalWidth, imgElm.naturalHeight );
      });
    }
  }
}
export default EditorActions;
