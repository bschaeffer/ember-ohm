import Ember from 'ember';

const { isEmpty } = Ember;

let convertNumber = function(value) {
  return (isEmpty(value)) ? null : Number(value);
};

export default {
  serialize(context, options, value) { return convertNumber(value); },
  deserialize(context, options, value) { return convertNumber(value); }
};
