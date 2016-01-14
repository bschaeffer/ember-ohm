# ember-ohm

Attribute serialization, transformation and change tracking for regular, plain
old `Ember.Object`'s.

## Installation

```bash
$ ember install ember-ohm
```

## Usage

### Model

To get everything, extend the `Model`:

```javascript
import Ohm from 'ember-ohm/model';

User = Ohm.extend({
  name: Ohm.attr('string'),
  age: Ohm.attr('number'),
  xp: Ohm.attr('number', {readOnly: true});
});

user = User.create({name: 'Braden', age: '28', xp: 9000});
```

### Serialization/Transformation

Serializing your model's attributes goes like so:

```javascript
user.serialize(); // => {name: 'Braden', age: 28}
user.serialize('xp', 'age'); // => {xp: 9000, age: 28}
```

**Important**: Calling `serialize` with no arguments observes the attribute's
`readOnly` option. Passing a variable number of properties to serialize
ignores that option.

The default attribute transforms are `default`, `boolean`, `number`,
`string` and `array`. You can see all those [here](addons/ember-ohm/transforms).

#### Custom Transform

Registering a custom transform is easy, too. Say we want to create a transform
that uses the `moment.js` library:

1. In your application directory, create a `transforms/moment.js` file.
2. Write this code:
    ```javascript
    /* global moment */

    export default {
      serialize(context, options, value) {
        return moment(value).toISOString();
      },

      deserialize(context, options, value) {
        return moment(value, options.parseFormat);
      }
    };
    ```

3. Meanwhile, on Mele Island (TM)...

    ```javascript
    User = Ohm.Model.extend({
      createdAt: Ohm.attr('momentjs', {parseFormat: 'MM-DD-YY'})
    });

    user = User.create({createdAt: '7-7-85'});
    user.get('createdAt'); // => moment.js object
    user.serialize(); // => {createdAt: '1995-08-09T05:00:00.000Z'}
    ```

**Note**: The `context` variable is used just the object/record whose attribute
is being transformed.

### Change Tracking

`Ohm.attr` can tracks changes on an any `Ember.Object`, but using it with
`ember-ohm/model` is more useful. Take the following:

```javascript
import Ohm from 'ember-ohm/model';

User = Ohm.extend({
  name: Ohm.attr('string'),
  age: Ohm.attr('number')
});

user = User.create({name: 'Braden', age: 28});
```

#### `isDirty`, `isClean` and `{attr}Changed`

Using the above object definition, we can have to following:

```javascript
user.get('isDirty'); // => false
user.get('isClean'); // => true
user.get('nameChanged'); // => false

user.set('name', 'Brodie');

user.get('isDirty'); // => true
user.get('isClean'); // => false
user.get('nameChanged'); // => true
```

#### Comiting and reverting

We can also commit and rollback changes manually. The power is yours!!!

```javascript
// Commit
user.get('isDirty'); // => false
user.set('name', 'New Name');
user.get('nameChanged'); // => true
user.get('isDirty'); // => true

user.commit();
user.get('name'); // => 'New Name'
user.get('nameChanged'); // => false
user.get('isDirty'); // => false

// Revert
user.set('name' 'Jimmy');
user.get('nameChanged'); // => true
user.get('isDirty'); // => true

user.revert();
user.get('name', 'New Name');
user.get('nameChanged'); // => false
user.get('isDirty'); // => false
```

You can also commit and revert changes to **individual attributes**:

```javascript
// Commit
user.set('name', 'New Name');
user.set('age', 23);

user.commit('name')
user.get('nameChanged'); // => false
user.get('ageChanged'); // => true
user.get('isDirty'); // => true

// Revert
user.set('name', 'Jimmy');
user.set('age', 42);

user.revert('name');
user.get('name') // => 'New Name'
user.get('nameChanged'); // => false

user.get('age') // => 42
user.get('ageChanged'); // => true
user.get('isDirty'); // => true
```

## Running Tests

* `npm test` (Runs `ember try:testall` to test your addon against multiple Ember versions)
* `ember test`
* `ember test --server`

## Building

* `ember build`

For more information on using ember-cli, visit [http://www.ember-cli.com/](http://www.ember-cli.com/).
