define(['mixedice', 'eventmap'], function(mixedice, EventMap) {
  var Viewport = {};

  Viewport.scale = {};
  Viewport.scale.mode = 'scaleToFit';
  Viewport.scale.x = 1.0;
  Viewport.scale.y = 1.0;

  Viewport.width = 800;
  Viewport.height = 600;

  return Viewport;
}); 