import { useContext } from 'react';
import { UtilsContext } from '../../context/index';

const LoadingDataModal = () => {
  const { t } = useContext(UtilsContext);

  return (
    <div>
      <div className="fade modal-backdrop show" />
      <div role="dialog" aria-modal="true" className="fade modal show" tabIndex="-1" style={{ display: 'block' }}>
        <div className="modal-dialog modal-dialog-centered w-25">
          <div className="modal-content">
            <div className="d-flex modal-body align-self-center my-2">
              <p className="align-content-center middleIcon me-3 mb-0">
                {t('chatsPage.loading')}
              </p>
              <div className="loader align-self-center" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoadingDataModal;
