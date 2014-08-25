udefine ->
  
  store = {}
  
  class Scene
    constructor: (descriptor, args...) ->
      
    @define: (name, factory) ->
      store[name] = factory
