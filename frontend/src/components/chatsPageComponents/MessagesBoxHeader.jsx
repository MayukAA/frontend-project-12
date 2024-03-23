import { useContext } from 'react';
import UtilsContext from '../../context/UtilsContext';

const MessagesBoxHeader = () => {
  const { currentChannel, currChnlUsersMsgsCount, t } = useContext(UtilsContext);

  return (
    <div className="bg-light shadow-sm small p-3 mb-3">
      <p className="m-0">
        <b>
          {'# '}
          {currentChannel.name}
        </b>
      </p>
      <span className="text-muted">
        {t('chatsPage.messagesCount.messages', { count: currChnlUsersMsgsCount })}
      </span>
    </div>
  );
};

export default MessagesBoxHeader;
