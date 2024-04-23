import { useContext } from 'react';
import { GoPencil, GoTrash } from 'react-icons/go';
import { BsThreeDotsVertical } from 'react-icons/bs';
import _ from 'lodash';
import leoProfanity from 'leo-profanity';
import cn from 'classnames';

import { AuthorizationContext, UtilsContext, StateContext } from '../../../context';
import DropdownMenuTwoLines from '../DropdownMenuTwoLines';
import getFormattedDate from '../../../utils/getFormattedDate';
import RemoveMessageModal from '../../modals/RemoveMessageModal';

const UserMessage = ({
  body,
  id,
  author,
  date,
  editedMessages,
  currentChannel,
}) => {
  const { currentUser } = useContext(AuthorizationContext);
  const { currChnlMessages, t, editableMsgEl } = useContext(UtilsContext);
  const {
    setCurrentModal,
    setMsgEditingMode,
    setTextEditableMsg,
    idEditableMsg,
    setIdEditableMsg,
  } = useContext(StateContext);

  const { username } = currentUser;
  const idsRemovedMessages = currChnlMessages
    .filter((msg) => msg.isService && msg.isService.root === 'removeMsg')
    .map((msg) => msg.isService.data.msgId);
  const profanityCleanBody = leoProfanity.clean(body);
  const profanityCleanEditedMsg = leoProfanity.clean(editedMessages[id]);
  const isOwnMsg = author === username;
  const isRemovedMsg = idsRemovedMessages.includes(id);
  const isEditedMsg = Object.hasOwn(editedMessages, id);
  const isEditableMsg = id === idEditableMsg;
  const green = '#198754';

  const msgPositionClass = cn('w-75', { 'ms-auto': isOwnMsg, 'pe-5': isOwnMsg });
  const msgCardClass = cn('card', 'rounded-3', 'mb-2', 'px-2', 'py-1', {
    'not-own-msg-card': !isOwnMsg,
    'own-msg-card': isOwnMsg,
    'ms-auto': isOwnMsg,
    'text-end': isOwnMsg,
    'bg-dark': isOwnMsg,
    'text-light': isOwnMsg,
  });
  const msgTextClass = cn('m-0', {
    'text-start': isOwnMsg,
    'text-muted': isRemovedMsg,
    'fst-italic': isRemovedMsg,
  });

  const getStyleMsg = () => (isEditableMsg
    ? { maxWidth: 'max-content', borderLeftWidth: 'thick', borderLeftColor: green }
    : { maxWidth: 'max-content' });

  const handleEditButton = () => {
    setIdEditableMsg(id);
    setTextEditableMsg(isEditedMsg ? editedMessages[id] : body);
    setMsgEditingMode(true);
  };

  const getTextWithParagraphs = (text) => text.split('\n').map((paragraph) => (
    <p className="m-0" key={_.uniqueId('key_')}>{paragraph}</p>
  ));

  const getMsgBody = () => {
    if (isRemovedMsg) return t('chatsPage.messageDeleted');
    if (isEditedMsg) return getTextWithParagraphs(profanityCleanEditedMsg);

    return getTextWithParagraphs(profanityCleanBody);
  };

  return (
    <div
      className={msgPositionClass}
      ref={isEditableMsg ? editableMsgEl : null}
    >
      <div className={msgCardClass} style={getStyleMsg()}>
        <p className="m-0">
          <b className="me-2">{author}</b>
          <span className="text-muted smallFont m-0">{getFormattedDate(date, 'time')}</span>
        </p>
        <div className={msgTextClass}>{getMsgBody()}</div>
        {(isEditedMsg && !isRemovedMsg) && (
          <div className="d-flex ms-auto">
            <GoPencil className="text-muted me-1" />
            <p className="text-muted smallFont m-0">{t('chatsPage.edited')}</p>
          </div>
        )}
        {(isOwnMsg && !isRemovedMsg) && (
          <div>
            <button
              type="button"
              className="btn btn-sm btn-msg-menu text-primary rounded-3"
              style={{ paddingInline: '5px' }}
              data-bs-toggle="dropdown"
            >
              <BsThreeDotsVertical className="bigIcon" />
              <span className="visually-hidden">{t('chatsPage.management')}</span>
            </button>
            <DropdownMenuTwoLines
              SvgOne={GoTrash}
              SvgTwo={GoPencil}
              nameOne={t('remove')}
              nameTwo={t('chatsPage.edit')}
              onClickOne={() => setCurrentModal(<RemoveMessageModal
                id={id}
                currentChannelId={currentChannel.id}
              />)}
              onClickTwo={handleEditButton}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default UserMessage;
