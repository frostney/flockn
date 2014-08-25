udefine ->
  class Group
    constructor: ->
      @length = 0
   
      @tags = {}
      @names = {}
   
    push: (obj, tags = obj?.tags or []) ->
      return if Object.hasOwnProperty.call @names, obj.name
   
      @[@length] = obj
      for tag in tags
        @tags[tag] = @tags[tag] or []
        @tags[tag].push @length
      @names[obj.name] = @length
   
      ++@length
   
    pop: -> @[length - 1]
   
    splice: ->
   
    forEach: (callback) ->
      for i in [0 .. @length - 1]
        callback @[i]
      null
    
    filter: (callback) ->
      @[i] for i in [0 .. @length - 1] when callback @[i] is true
    
    byName: (name) -> @[@names[name]]
   
    byTag: (tag) -> @tags[tag].map (index) => @[index]