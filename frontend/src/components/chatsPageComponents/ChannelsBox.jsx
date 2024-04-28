import { useEffect, useContext, useRef } from 'react';
import { useSelector } from 'react-redux';
import { GoPlus, GoTrash, GoPencil } from 'react-icons/go';

import { UtilsContext, StateContext } from '../../context/index';
import { selectorsChannels } from '../../slices/channelsSlice';
import { resetUnreadChannel } from '../../slices/channelsUISlice';

import ChannelButton from './ChannelButton';
import DropdownMenuTwoLines from './DropdownMenuTwoLines';
import AddChannelModal from '../modals/AddChannelModal';
import RemoveChannelModal from '../modals/RemoveChannelModal';
import RenameChannelModal from '../modals/RenameChannelModal';

const ChannelsBox = ({ dispatch }) => {
  const { t, scrollChnlEl } = useContext(UtilsContext);
  const { setCurrentModal, handleResetMsgEditingMode } = useContext(StateContext);
  const channelsContainerEl = useRef();

  const channels = useSelector(selectorsChannels.selectAll);
  const channelsNames = channels.map((chnl) => chnl.name);
  const { currentChannel } = useSelector((state) => state.channelsUI);

  const currDropdownCls = 'dropdown-toggle dropdown-toggle-split rounded-0 btn btn-secondary pt-2';
  const notCurrDropdownCls = 'dropdown-toggle dropdown-toggle-split rounded-0 btn pt-2';

  useEffect(() => {
    // fix dropdown not closing;
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
                <ChannelButton id={id} name={name} />
                <button
                  type="button"
                  className={id === currentChannel.id ? currDropdownCls : notCurrDropdownCls}
                  data-bs-toggle="dropdown"
                >
                  <span className="visually-hidden">{t('chatsPage.management')}</span>
                </button>
                <DropdownMenuTwoLines
                  SvgOne={GoTrash}
                  SvgTwo={GoPencil}
                  nameOne={t('remove')}
                  nameTwo={t('chatsPage.rename')}
                  onClickOne={() => setCurrentModal(<RemoveChannelModal id={id} name={name} />)}
                  onClickTwo={() => setCurrentModal(<RenameChannelModal
                    id={id}
                    oldName={name}
                    channelsNames={channelsNames}
                  />)}
                />
              </div>
            </li>
          ) : (
            <li className="nav-item w-100" key={id}>
              <ChannelButton id={id} name={name} />
            </li>
          )
        ))}
      </ul>
    </div>
  );
};

export default ChannelsBox;
