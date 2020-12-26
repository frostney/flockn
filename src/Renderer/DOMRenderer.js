import Graphics from '../Graphics';
import createRootElement from '../Graphics/createRootElement';
import * as mouse from '../input/mouse';

const factory = () => {
  const root = window;

  const pixelize = (num) => `${num}px`;
  const unpixelize = (str) => parseFloat(str) || 0;

  Graphics.renderer = 'DOM';

  let rootElement = null;

  Graphics.on('initialize', (Game) => {
    rootElement = createRootElement.call(Game, 'div', (rootEl) => {
      /* eslint no-param-reassign: 0 */

      rootEl.style.backgroundColor = this.color.toString();
      rootEl.style.overflow = 'hidden';
      rootEl.style.cursor = 'default';

      ['userSelect', 'mozUserSelect', 'webkitUserSelect'].forEach((select) => {
        rootEl.style[select] = 'none';
      });
    });
  });

  Graphics.on('add', (obj) => {
    // TODO: Models shouldn't be added to the DOM.
    // Currently we do a check if has an id, but sometime in the
    //  future they might have
    if (!obj.id) {
      return;
    }

    const elementId = obj.id.toLowerCase();

    // Remove previous elements of the same id
    if (document.getElementById(elementId) != null) {
      (() => {
        const parentId = obj.parent.id.toLowerCase();

        const parentElem = document.getElementById(parentId);
        parentElem.removeChild(document.getElementById(elementId));
      })();
    }

    const { parent } = obj;

    const parentElem = (() => {
      if ((parent && parent.isRoot) || parent == null) {
        return rootElement;
      }

      const parentId = obj.parent.id.toLowerCase();
      const element = document.getElementById(parentId);
      if (element == null) {
        return rootElement;
      }

      return element;
    })();

    const element = document.createElement('div');
    element.id = elementId;
    element.className = [obj.type.toLowerCase(), obj.name.toLowerCase()].join(
      ' '
    );
    element.style.position = 'absolute';

    switch (obj.type) {
      case 'Scene':
        element.style.width = pixelize(obj.parent.width);
        element.style.height = pixelize(obj.parent.height);
        break;
      case 'GameObject':
        element.style.left = pixelize(obj.position.x);
        element.style.top = pixelize(obj.position.y);
        element.style.width = pixelize(obj.width);
        element.style.height = pixelize(obj.height);

        mouse.events.forEach((eventName) => {
          root.addEventListener(eventName, (evt) => {
            obj.trigger(mouse.relativePosition(evt, rootElement, obj));
          });
        });

        // Mouseenter and Mouseleave are kinda special right now
        root.addEventListener(
          'mouseenter',
          (evt) => {
            obj.trigger('mouseenter', evt);
          },
          true
        );

        root.addEventListener(
          'mouseleave',
          (evt) => {
            obj.trigger('mouseleave', evt);
          },
          true
        );

        break;
      default:
        break;
    }

    parentElem.appendChild(element);
  });

  Graphics.on('texture-image-loaded', (obj, texture) => {
    const element = document.getElementById(obj.id.toLowerCase());

    if (element != null) {
      element.style.backgroundImage = `url(${texture.image.filename})`;
      element.style.width = pixelize(obj.width);
      element.style.height = pixelize(obj.height);
    }
  });

  Graphics.on('texture-label-loaded', (obj /* , texture */) => {
    const element = document.getElementById(obj.id.toLowerCase());

    if (element != null) {
      element.style.width = pixelize(obj.width);
      element.style.height = pixelize(obj.height);
    }
  });

  const dirtyObjects = {};

  Graphics.after('render', (obj) => {
    const objId = obj.id.toLowerCase();

    dirtyObjects[objId] = obj;
  });

  Graphics.on('render', (obj) => {
    const objId = obj.id.toLowerCase();

    // Update element attributes
    const element = document.getElementById(objId);

    if (element != null) {
      // const prevObj = dirtyObjects[objId] || {};

      switch (obj.type) {
        case 'GameObject': {
          const elemVisible = element.style.display === 'block';

          if (elemVisible !== obj.visible) {
            element.style.display = obj.visible ? 'block' : 'hidden';
          }

          if (!elemVisible) {
            return;
          }

          const elemX = unpixelize(element.style.left);
          const elemY = unpixelize(element.style.top);
          const elemWidth = unpixelize(element.style.width);
          const elemHeight = unpixelize(element.style.height);

          if (elemX !== obj.position.x) {
            element.style.left = pixelize(obj.position.x);
          }

          if (elemY !== obj.position.y) {
            element.style.top = pixelize(obj.position.y);
          }

          if (elemWidth !== obj.width) {
            element.style.width = pixelize(obj.width);
          }

          if (elemHeight !== obj.height) {
            element.style.height = pixelize(obj.height);
          }

          if (obj.angle) {
            ['transform', 'mozTransform', 'webkitTransform'].forEach(
              (transform) => {
                element.style[transform] = `rotate(${obj.angle}deg)`;
              }
            );
          }

          if (obj.alpha !== 1) {
            element.style.opacity = obj.alpha;
          }

          // Set background color
          element.style.backgroundColor = obj.texture.backgroundColor.toString();

          // Set origin
          [
            'transformOrigin',
            'mozTransformOrigin',
            'webkitTransformOrigin',
          ].forEach((transformOrigin) => {
            element.style[
              transformOrigin
            ] = `${obj.origin.x}px ${obj.origin.y}px`;
          });

          // Set border
          if (obj.border.width > 0) {
            element.style.borderWidth = pixelize(obj.border.width);
            element.style.borderStyle = 'solid';
            element.style.borderColor = obj.border.color.toString();

            if (obj.border.radius > 0) {
              element.style.borderRadius = pixelize(obj.border.radius);
            }
          }

          if (obj.texture.image.drawable) {
            if (obj.texture.image.offset.x !== 0) {
              element.style.backgroundPositionX = `${
                obj.texture.image.offset.x * -1
              }px`;
            }

            if (obj.texture.image.offset.y !== 0) {
              element.style.backgroundPositionY = `${
                obj.texture.image.offset.y * -1
              }px`;
            }
          }

          if (obj.texture.label.drawable) {
            element.innerText = obj.texture.label.text;

            element.style.whiteSpace = 'nowrap';

            if (obj.texture.label.font.size) {
              element.style.fontSize = pixelize(obj.texture.label.font.size);
            }

            if (obj.texture.label.font.color) {
              element.style.color = obj.texture.label.font.color.toString();
            }

            if (obj.texture.label.font.name) {
              element.style.fontFamily = obj.texture.label.font.name;
            }

            obj.texture.label.font.decoration.forEach((decoration) => {
              switch (decoration) {
                case 'bold':
                  element.style.fontWeight = 'bold';
                  break;
                case 'italic':
                  element.style.fontStyle = 'italic';
                  break;
                case 'underline':
                  element.style.textDecoration = 'underline';
                  break;
                default:
                  break;
              }
            });
          }

          break;
        }
        case 'Scene': {
          const elemVisibleStyle = element.style.display;

          if (obj.parent.activeScene !== obj.name) {
            if (elemVisibleStyle !== 'hidden') {
              element.style.display = 'hidden';
            }
          } else if (elemVisibleStyle !== 'block') {
            element.style.display = 'block';
          }
          break;
        }
        default:
          break;
      }
    }
  });
};

export default factory;
