import Behavior from 'flockn/behavior';
import Model from 'flockn/model';

import {Input} from 'gamebox';

var keyData = new Model();

keyData.name = 'keys';
keyData.set('up', ['up', 'w']);
keyData.set('down', ['down', 's']);
keyData.set('left', ['left', 'a']);
keyData.set('right', ['right', 'd']);

var movements = ['up', 'down', 'left', 'right'];

export default function() {

  this.addModel(keyData);

  this.input.key.on('down', (key) => {



    var upKeys = this.data('keys').get('up');
    if (!Array.isArray(upKeys)) {
      upKeys = [upKeys];
    }

    this.trigger('up');
    this.trigger('down');
    this.trigger('left');
    this.trigger('right');

  });

}
