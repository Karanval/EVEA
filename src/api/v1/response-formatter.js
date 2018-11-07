export default {

  toJSON: (object = {}) => {
    object = object.toJSON ? object.toJSON() : object;

    return object;
  }
};
