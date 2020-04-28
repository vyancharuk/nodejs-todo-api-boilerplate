const addHeaders = async (request: any, jwt?: string): Promise<any> => {
  request
    .set('Content-Type', 'application/json')
    .set('Accept', 'application/json');

  if (jwt) {
    request.set('Authorization', `Bearer ${jwt}`);
  }

  return request;
};

export { addHeaders };
