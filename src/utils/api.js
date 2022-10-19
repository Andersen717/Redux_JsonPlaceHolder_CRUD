const api = (_method, url, _body) =>
  fetch(
    "https://my-json-server.typicode.com/Andersen717/FakeJsonData/data" + url,
    {
      method: _method,
      body: JSON.stringify(_body),
      headers: {
        "Content-Type": "application/json",
      },
    }
  );

export default api;
