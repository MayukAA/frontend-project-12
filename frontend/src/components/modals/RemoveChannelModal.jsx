/* eslint-disable */

const RemoveChannelModal = ({ setCurrentModal, socket, id, name, currentChannelId, setCurrentChannel, defaultCurrentChannel }) => {
  const closeModal = () => setCurrentModal(null);

  const emitSocket = (chnlId) => {
    socket.emit('removeChannel', { id: chnlId }, () => {
      (chnlId === currentChannelId) && setCurrentChannel(defaultCurrentChannel);
    });
    closeModal();
  };

  return (
    <div>
      <div className="fade modal-backdrop show" />
      <div role="dialog" aria-modal="true" className="fade modal show" tabIndex="-1" style={{ display: 'block' }}>
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <div className="modal-title h4">Удалить канал <b># {name}</b></div>
              <button
                type="button"
                aria-label="Close"
                data-bs-dismiss="modal"
                className="btn btn-close"
                onClick={closeModal}
              />
            </div>
            <div className="modal-body">
              <p className="lead mb-2">Уверены?</p>
              <div className="d-flex justify-content-end">
                <button
                  type="button"
                  className="btn btn-outline-dark me-2"
                  onClick={closeModal}
                >
                  Отменить
                </button>
                <button
                  type="button"
                  className="btn btn-outline-danger"
                  onClick={() => emitSocket(id)}
                >
                  Удалить
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
