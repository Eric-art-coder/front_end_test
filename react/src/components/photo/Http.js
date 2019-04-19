const Http = {
  post() {
    return Promise.resolve({
      data: {
        list: [],
        totalPage: 0,
        pageSize: 10
      }
    });
  }
};

export default Http