udefine ['./group'], (Group) ->

  store = {}
  
  class GameObject
    constructor: (descriptor, args...) ->
  
      # Default values    
      @x = 0
      @y = 0
        
      @children =
        gameobjects: new Group(),
        behaviors: new Group()
        
      @on 'render', =>
        @children.gameobjects.forEach (child) -> child.trigger 'render'
        
      @on 'update', =>
        @children.gameobjects.forEach (child) -> child.trigger 'update'
        @children.behaviors.forEach (child) -> child.trigger 'update'
      
    addGameObject: (gameObject) ->
      
    addBehavior: (behavior) ->
      
    @define: (name, factory) ->
      store[name] = factory
