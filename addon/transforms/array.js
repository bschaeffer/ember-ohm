import Ember from 'ember';
import lookupTransform from '../utils/lookup-transform';

const { isArray } = Ember;

let convertArray = function(direction, context, options, arrayValue) {
  Ember.assert(
    "The array serializer can only serialize arrays.",
    isArray(arrayValue)
  );

  const type = options.itemSerializer || 'default';
  let transform = lookupTransform(context, type);
  return arrayValue.map(function(item) {
    transform = lookupTransform(context, type);
    return transform[direction].call(null, context, options, item);
  });
};

export default {
  serialize(context, options, value) {
    return convertArray('serialize', context, options, value);
  },

  deserialize(context, options, value) {
    return convertArray('deserialize', context, options, value);
  }
};
