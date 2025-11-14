const validations = {
  fields: {
    email: {
      required: true,
      pattern: /^[^\s-]\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}[^\s-]$/i,
    },
  },

  validate(field, value) {
    return this.fields[field] ? this.fields[field].pattern.test(value) : false;
  },
};

export default validations;
