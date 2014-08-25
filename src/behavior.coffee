udefine ['eventmap', 'mixedice', './group'], (Group) ->
  store = {}
  
  class Behavior
    constructor: (descriptor, args...) ->
      mixedice [@, Behavior::], new EventMap()
   
      @type = 'Behavior'
      @name = "#{@type}-#{Date.now()}"
      @tags = []
   
      @children = new Group()
   
      @parent = null
   
      descriptor.apply @, args
   
      @on 'update', (dt) =>
        @children.forEach (child) -> child.trigger 'update', dt
   
    addBehavior: (behavior, args...) ->
      unless behavior instanceof Behavior
        if typeof behavior is 'string'
          if Object.hasOwnProperty.call store, behavior
            behavior = new Behavior store[behavior], args
        else
          behavior = new Behavior behavior, args
      
      @children.push behavior
      behavior.parent = @
      
    @define: (name, factory) ->
      store[name] = factory
