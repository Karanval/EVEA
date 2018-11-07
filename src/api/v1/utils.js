export default {
  copyObject(obj) {
    return Object.assign({}, obj);
  },

  stringifyId(id) {
    if (typeof id === 'object') {
      let identifier = '';

      Object.keys(id).forEach((key) => {
        identifier = `${identifier} ${key}=${id[key]}`;
      });

      return identifier.trim();
    }

    return id;
  }
};
