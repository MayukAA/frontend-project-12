/* eslint-disable */

const getFormattedDate = (date, dayOrTime) => {
  const langLocalStorage = localStorage.getItem('currentLanguage');
  const currentLang = langLocalStorage || 'ru';

  const dayOptions = { day: 'numeric', month: 'long' };
  const timeOptions = currentLang === 'ru'
    ? { hour: 'numeric', minute: 'numeric' }
    : { hour: 'numeric', minute: 'numeric', hour12: true };
  const formattedDay = new Date(date).toLocaleDateString(currentLang, dayOptions);
  const formattedTime = new Date(date).toLocaleString([], timeOptions);

  return dayOrTime === 'day' ? formattedDay : formattedTime;
};

export default getFormattedDate;
