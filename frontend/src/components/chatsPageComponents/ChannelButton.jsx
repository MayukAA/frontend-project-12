import { useContext } from 'react';
import { useSelector } from 'react-redux';
import { GoUnread, GoMail } from 'react-icons/go';
import cn from 'classnames';
import leoProfanity from 'leo-profanity';

import { UtilsContext } from '../../context';

const ChannelButton = ({ id, name }) => {
  const { setCurrentChannel, scrollChnlEl } = useContext(UtilsContext);
  const { currentChannel, unreadChannels } = useSelector((state) => state.channelsUI);

  const isCurrentChannel = id === currentChannel.id;
  const isUnreadChannel = unreadChannels.includes(id);
  const profanityCleanChannelName = leoProfanity.clean(name);
  const buttonChannelClass = cn('w-100', 'rounded-0', 'text-start', 'text-truncate', 'btn', {
    'btn-secondary': isCurrentChannel,
  });

  return (
    <button
      type="button"
      className={buttonChannelClass}
      onClick={() => setCurrentChannel({ id, name, status: 'standart' })}
      ref={isCurrentChannel ? scrollChnlEl : null}
    >
      <span className="text-truncate me-1">
        {'# '}
        {profanityCleanChannelName}
      </span>
      {isUnreadChannel
        ? <GoUnread className="text-dark" style={{ minWidth: '1rem' }} />
        : <GoMail className={isCurrentChannel ? 'text-muted' : 'c-gray-500'} style={{ minWidth: '1rem' }} />}
    </button>
  );
};

export default ChannelButton;
