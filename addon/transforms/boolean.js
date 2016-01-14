export default {
  serialize(context, options, value) {
    return Boolean(value);
  },

  deserialize(context, options, value) {
    var type = typeof value;

    if (type === "boolean") {
      return value;
    } else if (type === "string") {
      return value.match(/^true$|^t$|^1$/i) !== null;
    } else if (type === "number") {
      return value === 1;
    } else {
      return false;
    }
  }
};
