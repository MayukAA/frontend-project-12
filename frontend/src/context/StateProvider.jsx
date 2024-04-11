/* eslint-disable */

import { useState } from 'react';
import StateContext from './StateContext';

const StateProvider = ({ children }) => {
  const [currentModal, setCurrentModal] = useState(null);
  const [isScrollBottom, setIsScrollBottom] = useState(true);
  const [fieldSizeForScroll, setFieldSizeForScroll] = useState('');
  const [msgEditingMode, setMsgEditingMode] = useState(false);
  const [textEditableMsg, setTextEditableMsg] = useState('');
  const [idEditableMsg, setIdEditableMsg] = useState(null);
  const [btnDisabledNetworkWait, setBtnDisabledNetworkWait] = useState(false);

  const handleResetMsgEditingMode = () => {
    setTextEditableMsg('');
    setIdEditableMsg(null);
    setMsgEditingMode(false);
  };

  return (
    <StateContext.Provider value={{
      currentModal,
      setCurrentModal,
      isScrollBottom,
      setIsScrollBottom,
      fieldSizeForScroll,
      setFieldSizeForScroll,
      msgEditingMode,
      setMsgEditingMode,
      textEditableMsg,
      setTextEditableMsg,
      idEditableMsg,
      setIdEditableMsg,
      btnDisabledNetworkWait,
      setBtnDisabledNetworkWait,
      handleResetMsgEditingMode,
    }}>
      {children}
    </StateContext.Provider>
  );
};

export default StateProvider;
