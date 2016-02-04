export default class X3DViewer {
  constructor(x3dElement, loadScene, loadCallback, nameSpaceName, width, height, showStats, showDebugger, keysEnabled, middleDrag) {
    this._inlineNodes = [];
    // init x3d
    x3dom.reload(); // NOTE: when inserting the <X3D> element after the 'x3dom.js' is loaded you have to call 'reload()'
    this._x3dElement = $(x3dElement)[0];
    this._runtime = this._x3dElement.runtime;

    this._sceneNode = document.getElementById('roomScene');

    // init scene
    this._defaultScene = './dist/lib/hello-world.x3d';
    if (loadScene) {
      this._loadScene = loadScene;
    } else {
      this._loadScene = this._defaultScene;
    }
    this._defaultNameSpaceName = "hello-world";
    if (!nameSpaceName) {
      nameSpaceName = this._defaultNameSpaceName;
    }
    this.inlineScene(this._loadScene, nameSpaceName, loadCallback);

    // init stats
    this.setStats(showStats);

    // init debugger
    this.setDebugger(showDebugger);

    // // init keys
    // this.setKeys(keysEnabled);

    // // init middleDrag
    // this.setMiddleDrag(middleDrag);

    // init size
    // this._width = width;
    // x3dElement.setAttribute('width', this._width);
    this._height = height;
    this._x3dElement.setAttribute('height', this._height);
  }

  // Loads the scene located at url and calls the callback when loaded.
  inlineScene(url, nameSpaceName, callback) {
    var inline = document.createElement('inline');
    inline.setAttribute('url', url);
    inline.setAttribute('nameSpaceName', nameSpaceName);
    inline.setAttribute('mapDEFToID', 'true');
    this._sceneNode.appendChild(inline);
    //
    this._inlineNodes.push({
      name: nameSpaceName,
      node: inline
    });
    //
    inline.addEventListener('load', callback, false);

    this.showAll();
    return inline;
  }

  deleteScenes() {
    for (var i = this._sceneNode.childNodes.length - 1; i >= 0; i--) {
      if (this._sceneNode.childNodes[i] && this._sceneNode) {
        this._sceneNode.removeChild(this._sceneNode.childNodes[i]);
      }
    }
  }

  // Returns an array with all children of the default scene node.
  /*getScene() {
    var result = new Array();
    for (var i = 0; i < this._sceneNode.childNodes.length; i++) {
      // check if we have a real X3DOM Node
      if (this._sceneNode.childNodes[i].nodeType === Node.ELEMENT_NODE) {
        result.push(this._sceneNode.childNodes[i]);
      }
    }
    return result;
  }*/

  /*
   * functionality
   */

  showAll() {
    let that = this;
    setTimeout(() => {
      that.runtime.showAll();
    }, 500);
  }

  resetView() {
    this.runtime.resetView();
  }

  setStats(value) {
    return;
    if (value == null) {
      var toggle = this.runtime.statistics(); // FIXXME: for whatever weird reason the code line below only works with this line present...
      (this.runtime.statistics()) ? this.runtime.statistics(false): this.runtime.statistics(true);
    } else {
      if (value == true) {
        this.runtime.statistics(true);
      } else {
        this.runtime.statistics(false);
      }
    }
  }

  setDebugger(value) {
    if (value == null) {
      var toggle = this.runtime.debug(); // FIXXME: for whatever weird reason the code line below only works with this line present...
      (this.runtime.debug()) ? this.runtime.debug(false): this.runtime.debug(true);
    } else {
      if (value == true) {
        this.runtime.debug(true);
      } else {
        this.runtime.debug(false);
      }
    }
  }

  setKeys(value) {
    if (value == true) {
      this.runtime.enableKeys();
    } else {
      this.runtime.disableKeys();
    }
  }

  setMiddleDrag(value) {
    if (value == true) {
      this.runtime.enableMiddleDrag();
    } else {
      this.runtime.disableMiddleDrag();
    }
  }

  /*
   * getters and setters
   */

  get x3dElement() {
    return this._x3dElement;
  }

  get runtime() {
    return this._runtime;
  }

  get width() {
    return this._width;
  }

  set width(width) {
    this.x3dElement.setAttribute('width', width);
    this._width = width;
  }

  get height() {
    return this._height;
  }

  set height(height) {
    this.x3dElement.setAttribute('height', height);
    this._height = height;
  }

  get sceneNode() {
    return this._sceneNode;
  }

  get inlineNodes() {
    return this._inlineNodes;
  }
}
