import '../styles.scss';
import 'bootstrap';
import { useTranslation } from 'react-i18next';

const NotFoundPage = () => {
  const { t } = useTranslation();

  return (
    <div className="text-center mt-4">
      <h1 className="h4 text-muted">{t('notFoundPage.core')}</h1>
      <a href="/">{t('notFoundPage.ref')}</a>
    </div>
  );
};

export default NotFoundPage;
