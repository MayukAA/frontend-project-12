import { AppContext } from './index';
import AuthorizationProvider from './AuthorizationProvider';
import UtilsProvider from './UtilsProvider';
import StateProvider from './StateProvider';

const AppProvider = ({ children }) => (
  <AuthorizationProvider>
    <UtilsProvider>
      <StateProvider>
        <AppContext.Provider value={null}>
          {children}
        </AppContext.Provider>
      </StateProvider>
    </UtilsProvider>
  </AuthorizationProvider>
);

export default AppProvider;
