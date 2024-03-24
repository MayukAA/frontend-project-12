/* eslint-disable */

import { useContext, useState } from 'react';
import { useTranslation, Trans } from 'react-i18next';
import { toast } from 'react-toastify';
import leoProfanity from 'leo-profanity';

import UtilsContext from '../../context/UtilsContext';
import StateContext from '../../context/StateContext';

const RemoveChannelModal = ({ id, name }) => {
  const { socket, t } = useContext(UtilsContext);
  const { setCurrentModal, btnDisabledNetworkWait } = useContext(StateContext);
  const [buttonsDisabled, setButtonsDisabled] = useState(false);
  const { i18n } = useTranslation();
  const profanityCleanChannelName = leoProfanity.clean(name);

  const currentLang = i18n.language;
  const closeModal = () => setCurrentModal(null);

  const emitSocket = (chnlId) => {
    setButtonsDisabled(true);

    socket.emit('removeChannel', { id: chnlId }, ({ status }) => {
      if (status === 'ok') {
        closeModal();
        toast.info(t('modals.channelRemoved', { channelName: profanityCleanChannelName }));
      }
    });
  };

  const getButtonStyle = () => (currentLang === 'ru' ? { minWidth: '6.063rem' } : { minWidth: '5.142rem' });

  return (
    <div>
      <div className="fade modal-backdrop show" />
      <div role="dialog" aria-modal="true" className="fade modal show" tabIndex="-1" style={{ display: 'block' }}>
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <div className="modal-title h4">
                <Trans i18nKey="modals.removeChannel" values={{ channelName: profanityCleanChannelName }}>
                  {'Удалить канал '}
                  <strong>
                    {'# '}
                    {{ profanityCleanChannelName }}
                  </strong>
                </Trans>
              </div>
              <button
                type="button"
                aria-label="Close"
                data-bs-dismiss="modal"
                className="btn btn-close"
                onClick={closeModal}
              />
            </div>
            <div className="modal-body">
              <p className="lead mb-2">{t('modals.confirmation')}</p>
              <div className="d-flex justify-content-end">
                <button
                  type="button"
                  className="btn btn-outline-dark me-2"
                  style={getButtonStyle()}
                  onClick={closeModal}
                  disabled={buttonsDisabled}
                >
                  {t('modals.cancel')}
                </button>
                <button
                  type="button"
                  className="btn btn-outline-danger"
                  style={getButtonStyle()}
                  onClick={() => emitSocket(id)}
                  disabled={buttonsDisabled || btnDisabledNetworkWait}
                >
                  {t('remove')}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RemoveChannelModal;
