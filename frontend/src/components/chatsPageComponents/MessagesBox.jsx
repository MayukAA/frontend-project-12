import { useEffect, useContext, useRef } from 'react';
import { useSelector } from 'react-redux';
import _ from 'lodash';

import { AuthorizationContext, UtilsContext, StateContext } from '../../context/index';
import ServiceMessage from './messages/ServiceMessage';
import UserMessage from './messages/UserMessage';

const MessagesBox = () => {
  const { currentUser } = useContext(AuthorizationContext);
  const { currChnlMessages, editableMsgEl } = useContext(UtilsContext);
  const {
    isScrollBottom,
    setIsScrollBottom,
    fieldSizeForScroll,
    msgEditingMode,
    idEditableMsg,
  } = useContext(StateContext);
  const messagesContainerEl = useRef();
  const msgBoxBottom = useRef();

  const { username } = currentUser;
  const marginForMsgMenu = '3.44rem';
  const { currentChannel } = useSelector((state) => state.channelsUI);
  const currChnlUsersMsgsCount = currChnlMessages.filter((msg) => !msg.isService).length;
  const currChnlEditedMsgs = currChnlMessages.reduce((acc, msg) => {
    if (msg.isService && msg.isService.root === 'editMsg') {
      acc[msg.isService.data.msgId] = msg.isService.data.newText;
    }
    return acc;
  }, {});

  useEffect(() => {
    msgBoxBottom.current.scrollIntoView({ behavior: 'smooth' });
  }, [currentChannel.id]);

  useEffect(() => {
    if (!msgEditingMode) {
      const lastMsgCurrChnl = currChnlMessages.at(-1);
      const isOwnMsg = lastMsgCurrChnl && lastMsgCurrChnl.author === username;

      if (isScrollBottom || isOwnMsg) {
        msgBoxBottom.current.scrollIntoView({ behavior: 'smooth' });
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currChnlUsersMsgsCount, fieldSizeForScroll]);

  useEffect(() => {
    if (!msgEditingMode && isScrollBottom) {
      msgBoxBottom.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [currChnlEditedMsgs]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (msgEditingMode) {
      const observer = new IntersectionObserver(
        () => {
          if (editableMsgEl.current) {
            editableMsgEl.current.scrollIntoView({ block: 'end', inline: 'nearest', behavior: 'smooth' });
          }
        },
        { root: messagesContainerEl.current, threshold: 0.99 },
      );

      observer.observe(editableMsgEl.current);
    }
  }, [idEditableMsg, fieldSizeForScroll]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleScroll = () => {
    const smallMarginPx = 25;
    const { scrollTop, clientHeight, scrollHeight } = messagesContainerEl.current;
    const scrollPos = scrollHeight % (scrollTop + clientHeight);

    setIsScrollBottom(scrollPos < smallMarginPx || (scrollTop + clientHeight) > scrollHeight);
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
        ? <ServiceMessage isService={isService} date={date} key={_.uniqueId('key_')} />
        : (
          <UserMessage
            body={body}
            id={id}
            author={author}
            date={date}
            editedMessages={currChnlEditedMsgs}
            currentChannel={currentChannel}
            key={_.uniqueId('key_')}
          />
        )
      ))}
      <div ref={msgBoxBottom} />
    </div>
  );
};

export default MessagesBox;
