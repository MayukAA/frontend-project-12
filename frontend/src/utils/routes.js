const apiPath = '/api/v1';

const routes = {
  loginPath: () => [apiPath, 'login'].join('/'),
  dataPath: () => [apiPath, 'data'].join('/'),
  chatsPagePath: () => '/',
  loginPagePath: () => '/login',
};

export default routes;
