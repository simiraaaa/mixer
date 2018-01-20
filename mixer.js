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

  use: function(name, circulator) {

  },

  add: function() {

  },

};