const apiPath = '/api/v1';

const routes = {
  loginPath: () => [apiPath, 'login'].join('/'),
  dataPath: () => [apiPath, 'data'].join('/'),
  signupPath: () => [apiPath, 'signup'].join('/'),
  chatsPagePath: () => '/',
  loginPagePath: () => '/login',
  signupPagePath: () => '/signup',
};

export default routes;
