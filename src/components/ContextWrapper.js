export default {
  functional: true,
  render(h, { props, children }) {
    return h(
      "template",
      {
        attrs: props,
        provide() {
          debugger;
          return {
            mapContext: this.mapContext
          };
        }
      },
      children
    );
  }
};
