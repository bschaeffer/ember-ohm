import Ember from 'ember';

const { get } = Ember;

export default function(context, type) {
  const container = get(context, 'container');
  const service = container.lookup('service:ohm');
  let cache = {};
  let transform;

  if (service) {
    cache = get(service, 'transformCache');
  }

  if (cache[type]) {
    transform = cache[type];
  } else {
    transform = container.lookupFactory(`transform:${type}`);

    if (!transform) {
      transform = container.lookupFactory(`ember-ohm@transform:${type}`);
    }

    if (!transform) {
      Ember.warn(
        `Could not find the '${type}' transform. Using default.`,
        true,
        {id: 'ember-ohm:lookup-transform'}
      );

      transform = container.lookupFactory('ember-ohm@transform:default');
    }

    cache[type] = transform;
  }

  return transform;
}
