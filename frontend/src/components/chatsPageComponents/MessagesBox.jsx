/* eslint-disable */

import { useEffect, useContext, useRef } from 'react';
import { useSelector } from 'react-redux';
import { GoTrash, GoPencil } from 'react-icons/go';
import { BsThreeDotsVertical } from 'react-icons/bs';
import cn from 'classnames';
import _ from 'lodash';
import leoProfanity from 'leo-profanity';

import AuthorizationContext from '../../context/AuthorizationContext';
import UtilsContext from '../../context/UtilsContext';
import StateContext from '../../context/StateContext';
import RemoveMessageModal from '../modals/RemoveMessageModal';
import getFormattedDate from '../../utils/getFormattedDate';

const MessagesBox = ({ dayEl }) => {
  const { currentUser } = useContext(AuthorizationContext);
  const { currChnlMessages, t } = useContext(UtilsContext);
  const {
    setCurrentModal,
    isScrollBottom,
    setIsScrollBottom,
    fieldSizeForScroll,
    msgEditingMode,
    setMsgEditingMode,
    setTextEditableMsg,
    idEditableMsg,
    setIdEditableMsg,
  } = useContext(StateContext);
  const messagesContainerEl = useRef();
  const msgBoxBottom = useRef();
  const editableMsgEl = useRef();

  const { username } = currentUser;
  const marginForMsgMenu = '3.44rem';
  const { currentChannel } = useSelector((state) => state.channelsUI);
  const currChnlUsersMsgsCount = currChnlMessages.filter((msg) => !msg.isService).length;
  const currChnlRemovedMsgsIds = currChnlMessages
    .filter((msg) => msg.isService && msg.isService.root === 'removeMsg')
    .map((msg) => msg.isService.data.msgId);
  const currChnlEditedMsgs = currChnlMessages.reduce((acc, msg) => {
    if (msg.isService && msg.isService.root === 'editMsg') {
      acc[msg.isService.data.msgId] = msg.isService.data.newText;
    }
    return acc;
  }, {});

  useEffect(() => {
    msgBoxBottom.current.scrollIntoView({ behavior: 'smooth' });
  }, [currentChannel]);

  useEffect(() => {
    if (!msgEditingMode) {
      const lastMsgCurrChnl = currChnlMessages.at(-1);
      const isOwnMsg = lastMsgCurrChnl && lastMsgCurrChnl.author === username;

      if (isScrollBottom || isOwnMsg) {
        msgBoxBottom.current.scrollIntoView({ behavior: 'smooth' });
      }
    }
  }, [currChnlUsersMsgsCount, fieldSizeForScroll]);

  useEffect(() => {
    if (msgEditingMode) {
      const observer = new IntersectionObserver(() => {
        if (editableMsgEl.current) {
          editableMsgEl.current.scrollIntoView({ block: 'end', inline: 'nearest', behavior: 'smooth' });
        }
      },
      { root: messagesContainerEl.current, threshold: 0.99 },
      );

      observer.observe(editableMsgEl.current);
    }
  }, [idEditableMsg, fieldSizeForScroll]);

  const handleScroll = () => {
    const smallMarginPx = 25;
    const { scrollTop, clientHeight, scrollHeight } = messagesContainerEl.current;
    const scrollPos = scrollHeight % (scrollTop + clientHeight);

    setIsScrollBottom(scrollPos < smallMarginPx || (scrollTop + clientHeight) > scrollHeight);
  };

  const getServiceMessage = (id, isService, date) => {
    if (isService.root === 'newDay') {
      const isToday = getFormattedDate(date, 'day') === getFormattedDate(new Date(), 'day');

      return (
        <small key={id}>
          <div className="card mx-auto rounded-5 opacity-75 text-muted text-center mb-2" style={{ maxWidth: 'max-content' }}>
            <span className="px-3" ref={isToday ? dayEl : null}>
              {getFormattedDate(date, 'day')}
            </span>
          </div>
        </small>
      );
    }

    if (isService.root === 'noticeAddChannel' || isService.root === 'noticeRenameChannel') {
      const { data } = isService;
      const { oldName, newName } = data;
      const profanityCleanOldName = leoProfanity.clean(oldName);
      const profanityCleanNewName = leoProfanity.clean(newName);
      const body = isService.root === 'noticeAddChannel'
        ? t('serviceMessages.addChannel', { username: data.username })
        : t('serviceMessages.renameChannel', {
          username: data.username,
          oldName: profanityCleanOldName,
          newName: profanityCleanNewName,
        });

      return (
        <div
          className="card mx-auto rounded-5 opacity-75 text-muted text-center mb-2"
          style={{ maxWidth: 'max-content' }}
          key={id}
        >
          <div className="px-3">
            <span className="me-5">{body}</span>
            <span className="text-muted smallFont">{getFormattedDate(date, 'time')}</span>
          </div>
        </div>
      );
    }
  };

  const getUserMessage = (body, id, author, date) => {
    const profanityCleanBody = leoProfanity.clean(body);
    const profanityCleanEditedMsg = leoProfanity.clean(currChnlEditedMsgs[id]);
    const isOwnMsg = author === username;
    const isRemovedMsg = currChnlRemovedMsgsIds.includes(id);
    const isEditedMsg = Object.hasOwn(currChnlEditedMsgs, id);
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
      setTextEditableMsg(isEditedMsg ? currChnlEditedMsgs[id] : body);
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
        key={id}
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
              <ul className="dropdown-menu p-0" style={{ minWidth: '9rem' }}>
                <li>
                  <button
                    type="button"
                    className="dropdown-item rounded-1"
                    style={{ paddingBottom: '5px', paddingTop: '6px', paddingLeft: '12px' }}
                    onClick={() => setCurrentModal(<RemoveMessageModal
                      id={id}
                      currentChannelId={currentChannel.id}
                    />)}
                  >
                    <div className="d-flex align-items-center">
                      <GoTrash className="text-danger menu-svg me-2" />
                      <span>{t('remove')}</span>
                    </div>
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    className="dropdown-item rounded-1"
                    style={{ paddingBottom: '6px', paddingTop: '5px', paddingLeft: '12px' }}
                    onClick={handleEditButton}
                  >
                    <div className="d-flex align-items-center">
                      <GoPencil className="text-muted menu-svg me-2" />
                      <span>{t('chatsPage.edit')}</span>
                    </div>
                  </button>
                </li>
              </ul>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div
      id="messages-box"
      className="chat-messages overflow-auto ps-5"
      style={{ paddingBottom: currChnlUsersMsgsCount === 1 ? marginForMsgMenu : null }}
      ref={messagesContainerEl}
      onScroll={handleScroll}
    >
      {(currChnlMessages.length > 0) && currChnlMessages.map(({
        body,
        id,
        author,
        isService,
        date,
      }) => (isService
        ? getServiceMessage(id, isService, date)
        : getUserMessage(body, id, author, date)
      ))}
      <div ref={msgBoxBottom} />
    </div>
  );
};

export default MessagesBox;
