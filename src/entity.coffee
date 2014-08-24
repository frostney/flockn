entityStore = {}

class Entity
  constructor: (@name, func, args...) ->

    # Default values    
    @sprite =
      image: null
      x: 0
      y: 0
      
    # Execute function
    func.apply @, args if func?
    
    entityStore[name] =
      factory: func
      arguments: args
      instance: this
    
  add: (component) ->
    
  define: (obj) -> @[key] = value for own key, value of obj

  clone: (name) ->
    new Entity(name, Entity.get(@name).factory, Entity.get(@name).arguments)
    
  @get: (name) -> entityStore[name]
