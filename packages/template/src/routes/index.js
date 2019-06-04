const route = require.context('./', false, /home.js$/);

export default route
  .keys()
  .reduce((routes, i) => route(i).default.concat(routes), [
    {
      path: '*',
      redirect: '/'
    }
  ]);
