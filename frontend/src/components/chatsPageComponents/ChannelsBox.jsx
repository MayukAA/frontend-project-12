import { useEffect, useContext, useRef } from 'react';
import { useSelector } from 'react-redux';
import {
  GoUnread,
  GoMail,
  GoPlus,
  GoTrash,
  GoPencil,
} from 'react-icons/go';
import cn from 'classnames';
import leoProfanity from 'leo-profanity';

import { UtilsContext, StateContext } from '../../context/index';
import { selectorsChannels } from '../../slices/channelsSlice';
import { resetUnreadChannel } from '../../slices/channelsUISlice';

import AddChannelModal from '../modals/AddChannelModal';
import RemoveChannelModal from '../modals/RemoveChannelModal';
import RenameChannelModal from '../modals/RenameChannelModal';

const ChannelsBox = ({ dispatch }) => {
  const { setCurrentChannel, t } = useContext(UtilsContext);
  const { setCurrentModal, handleResetMsgEditingMode } = useContext(StateContext);
  const channelsContainerEl = useRef();
  const scrollChnlEl = useRef();

  const channels = useSelector(selectorsChannels.selectAll);
  const channelsNames = channels.map((chnl) => chnl.name);
  const { currentChannel, unreadChannels } = useSelector((state) => state.channelsUI);

  const currDropdownCls = 'dropdown-toggle dropdown-toggle-split btn-chnl btn btn-dark pt-2';
  const notCurrDropdownCls = 'dropdown-toggle dropdown-toggle-split btn-chnl btn pt-2';

  useEffect(() => {
    // исправление незакрывающегося dropdown;
    const dropdownUlEl = document.querySelector('.dropdown-menu.show');
    if (dropdownUlEl) dropdownUlEl.classList.remove('show');

    dispatch(resetUnreadChannel(currentChannel.id));

    handleResetMsgEditingMode();
  }, [currentChannel]);

  useEffect(() => {
    if (scrollChnlEl.current) {
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (!entry.isIntersecting && scrollChnlEl.current) {
            scrollChnlEl.current.scrollIntoView({ behavior: 'smooth' });
          }
        },
        { root: channelsContainerEl.current, threshold: 0.99 },
      );

      observer.observe(scrollChnlEl.current);
    }
  }, [scrollChnlEl.current]);

  const getButtonChannel = ({ id, name }) => {
    const isCurrentChannel = id === currentChannel.id;
    const isUnreadChannel = unreadChannels.includes(id);
    const profanityCleanChannelName = leoProfanity.clean(name);
    const buttonChannelClass = cn('d-flex', 'w-100', 'btn', 'btn-chnl', 'align-items-center', 'justify-content-between', 'text-start', 'text-truncate', {
      'btn-dark': isCurrentChannel,
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

  return (
    <div className="col-4 col-md-2 border-end bg-light flex-column h-100 d-flex px-0">
      <div className="d-flex justify-content-between p-4 px-3 mt-1 mb-2">
        <b>{t('chatsPage.channels')}</b>
        <button
          type="button"
          className="text-primary btn btn-group-vertical p-0 ms-1"
          onClick={() => setCurrentModal(<AddChannelModal channelsNames={channelsNames} />)}
        >
          <GoPlus className="largeIcon" />
          <span className="visually-hidden">+</span>
        </button>
      </div>
      <ul
        id="channels-box"
        className="nav flex-column nav-pills nav-fill overflow-auto h-100 d-block px-2 mb-3"
        ref={channelsContainerEl}
      >
        {channels.map(({ id, name, removable }) => (removable
          ? (
            <li className="nav-item w-100" key={id}>
              <div role="group" className="d-flex dropdown btn-group">
                {getButtonChannel({ id, name })}
                <button
                  type="button"
                  className={id === currentChannel.id ? currDropdownCls : notCurrDropdownCls}
                  data-bs-toggle="dropdown"
                >
                  <span className="visually-hidden">{t('chatsPage.management')}</span>
                </button>
                <ul className="dropdown-menu p-0" style={{ minWidth: '9rem' }}>
                  <li>
                    <button
                      type="button"
                      className="dropdown-item rounded-1"
                      style={{ paddingBottom: '5px', paddingTop: '6px', paddingLeft: '12px' }}
                      onClick={() => setCurrentModal(<RemoveChannelModal
                        id={id}
                        name={name}
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
                      onClick={() => setCurrentModal(<RenameChannelModal
                        id={id}
                        oldName={name}
                        channelsNames={channelsNames}
                      />)}
                    >
                      <div className="d-flex align-items-center">
                        <GoPencil className="text-muted menu-svg me-2" />
                        <span>{t('chatsPage.rename')}</span>
                      </div>
                    </button>
                  </li>
                </ul>
              </div>
            </li>
          ) : (
            <li className="nav-item w-100" key={id}>
              {getButtonChannel({ id, name })}
            </li>
          )
        ))}
      </ul>
    </div>
  );
};

export default ChannelsBox;
