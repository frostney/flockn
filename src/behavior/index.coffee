udefine ['eventmap', 'mixedice'], ->
  class Behavior
    constructor: (descriptor) ->
      mixedice [@, @::], new EventMap()
   
      @type = 'Behavior'
      @name = "#{@type}-#{Date.now()}"
   
      @children = {}
   
      @parent = null
   
      descriptor.call @
   
      @on 'update', (dt) =>
        for key, value of @children
          value.update dt
        null
   
    addBehavior: (behavior) ->
      @children[behavior.name] = behavior
      behavior.parent = @