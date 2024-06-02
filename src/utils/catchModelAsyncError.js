function catchModelAsyncError(callback, errorHandler) {
    return (...args) => {
      return callback(...args).catch((err) => {
        throw errorHandler(err);
      });
    };
  }
  
  export default catchModelAsyncError;
  