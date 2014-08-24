udefine ['eventmap', 'mixedice', './group'], (Group) ->
  store = {}
  
  class Behavior
    constructor: (descriptor, args...) ->
      mixedice [@, @::], new EventMap()
   
      @type = 'Behavior'
      @name = "#{@type}-#{Date.now()}"
   
      @children = new Group()
   
      @parent = null
   
      descriptor.apply @, args
   
      @on 'update', (dt) =>
        @children.forEach (child) -> child.update dt
   
    addBehavior: (behavior, args...) ->
      unless behavior instanceof Behavior
        if Object.hasOwnProperty.call store, behavior
          behavior = new Behavior behavior, store[behavior], args
      
      @children[behavior.name] = behavior
      behavior.parent = @
      
    @define: (name, factory) ->
      store[name] = factory
