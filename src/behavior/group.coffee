udefine ->
  class BehaviorGroup
    constructor: ->
      @length = 0
   
      @tags = {}
      @names = {}
   
    push: (behavior, tags = behavior.tags) ->
      return if Object.hasOwnProperty.call @names, behavior.name
   
      @[@length] = behavior
      for tag in tags
        @tags[tag] = @tags[tag] or []
        @tags[tag].push @length
      @names[behavior.name] = @length
   
      ++@length
   
    pop: -> @[length - 1]
   
    splice: ->
   
    forEach: (callback) ->
      for i in [0 .. @length - 1]
        callback @[i]
      null
   
    byName: (name) -> @[@names[name]]
   
    byTag: (tag) -> @tags[tag].map (index) => @[index]