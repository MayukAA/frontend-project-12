import { useContext } from 'react';
import leoProfanity from 'leo-profanity';

import { UtilsContext } from '../../../context';
import getFormattedDate from '../../../utils/getFormattedDate';

const DateMessage = ({ date }) => {
  const { dayEl } = useContext(UtilsContext);

  const isToday = getFormattedDate(date, 'day') === getFormattedDate(new Date(), 'day');

  return (
    <small>
      <div className="card mx-auto rounded-5 opacity-75 text-muted text-center mb-2" style={{ maxWidth: 'max-content' }}>
        <span className="px-3" ref={isToday ? dayEl : null}>
          {getFormattedDate(date, 'day')}
        </span>
      </div>
    </small>
  );
};

const NoticeMessage = ({ date, root, data }) => {
  const { t } = useContext(UtilsContext);

  const { oldName, newName } = data;
  const profanityCleanOldName = leoProfanity.clean(oldName);
  const profanityCleanNewName = leoProfanity.clean(newName);
  const body = root === 'noticeAddChannel'
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
    >
      <div className="px-3">
        <span className="me-5">{body}</span>
        <span className="text-muted smallFont">{getFormattedDate(date, 'time')}</span>
      </div>
    </div>
  );
};

const ServiceMessage = ({ isService, date }) => {
  const { root, data } = isService;

  const messageTypeMap = {
    newDay: <DateMessage date={date} />,
    noticeAddChannel: <NoticeMessage date={date} root={root} data={data} />,
    noticeRenameChannel: <NoticeMessage date={date} root={root} data={data} />,
  };

  return messageTypeMap[root];
};

export default ServiceMessage;
