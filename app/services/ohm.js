import Ember from 'ember';

export default Ember.Service.extend({
  init: function() {
    Ember.set(this, 'transformCache', {});
  }
});
