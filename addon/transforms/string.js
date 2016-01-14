import Ember from 'ember';

const { isNone } = Ember;

let convertString = function(value) {
  return isNone(value) ? null : String(value);
};

export default {
  serialize(context, options, value) { return convertString(value); },
  deserialize(context, options, value) { return convertString(value); }
};
