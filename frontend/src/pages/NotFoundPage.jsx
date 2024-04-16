import { useContext } from 'react';
import { UtilsContext } from '../context/index';

const NotFoundPage = () => {
  const { t } = useContext(UtilsContext);

  return (
    <div className="text-center mt-4">
      <h1 className="h4 text-muted">{t('notFoundPage.core')}</h1>
      <a href="/">{t('notFoundPage.ref')}</a>
    </div>
  );
};

export default NotFoundPage;
