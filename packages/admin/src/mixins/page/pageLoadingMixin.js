const pageLoadingMixin = {
  data() {
    return {
      showLoading: false
    };
  },
  methods: {
    triggerLoading(bool) {
      this.showLoading = bool;
    }
  }
};

export default pageLoadingMixin;
