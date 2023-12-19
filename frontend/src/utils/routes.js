const apiPath = '/api/v1';

const routes = {
  loginPath: () => [apiPath, 'login'].join('/'),
  chatsPagePath: () => '/',
  loginPagePath: () => '/login',
};

export default routes;
