var mixer = {
  _objects: {},
  _cached: {},
  _useCache: true,
  _autoBuild: true,

  enableCache: function() {
    this._useCache = true;
    return this;
  },

  disableCache: function() {
    this._useCache = false;
    return this;
  },

  enableAutoBuild: function() {
    this._autoBuild = true;
    return this;
  },

  disableAutoBuild: function() {
    this._autoBuild = false;
    return this;
  },

  /**
   * 追加済みのオブジェクトをすべて生成してキャッシュする
   */
  build: function() {

  },
  
  extend: function(object, property) {
    for (var k in property) {
      object[k] = property[k];
    }
    return object;
  },

  mix: function(target, name) {
    return this.extend(target, this.use(name));
  },

  get: function(name) {
    return this._objects[name];
  },

  getAccessor: function(name, circulator) {
    circulator = circulator || {};
    if (circulator[name]) return {};
  },

  use: function(name, circulator) {

    circulator = circulator || {};
    if (circulator[name]) return {};
    var p = mixer.extend({}, mixer._objects[name] || {});
    var accessor = mixer.extend({}, p.accessor);
    var target = {};
    if (p.supers) {
      p.supers.forEach(function(parent) {
        mixer.extend(target, mixer.use(parent, circulator));
        // mixer.extend(p.accessor, mixer.getAccessor(parent, circulator));
        circulator[parent] = true;
      });
    }
    mixer.extend(target, p.props);
    mixer.defineAccessor(target, accessor);
    return target;

  },

  add: function(name, supers, props, descMap) {
    if (typeof supers === 'undefined') {
      descMap = props;
      props = supers;
      supers = null;
    }
    if (typeof supers === 'string') {
      supers = [supers];
    }
    this._objects[name] = {
      __mixerName: name,
      supers: supers,
      props: props || {},
      accessor: descMap || {},
    };

    return this.wrapDefer(name);
  },

  accessor: function(target, descMap) {
    for (var k in descMap) {
      var desc = descMap[k];
      var d = {
        enumerable: true,
        configurable: true,
      };

      if (desc.get) d.get = desc.get;
      if (desc.set) d.set = desc.set;
      Object.defineProperty(target, k, d);
    }
    return target;
  },

  defineAccessor: function(name, descMap) {
    var def = this.get(name);
    for (var k in descMap) {
      def.accessor[k] = descMap[k];
    }
    return this.wrapDefer(name);
  },

  wrapDefer: function(name) {
    return mixer.extend({ name: name }, mixer._deferProperty);
  },

  _deferProperty: {
    accessor: function(descMap) {
      return mixer.defineAccessor(this.name, descMap);
    },

    extend: function(property) {
      mixer.extend(mixer.get(this.name).props, property);
      return this;
    }
  }
};