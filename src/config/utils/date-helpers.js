import { parse, format } from 'date-fns';

function formatDate(date) {
  // Check if the date is undefined or not a valid Date object
  if (!date || !(date instanceof Date) || isNaN(date.getTime())) {
    return;
  }
  let day = date.getDate().toString();
  let month = (date.getMonth() + 1).toString();
  let year = date.getFullYear().toString();

  day = day.length < 2 ? `0${day}` : day;
  month = month.length < 2 ? `0${month}` : month;
  return `${day}/${month}/${year}`;
}

function getReadableMonthFormat(dateString) {
  if (!dateString) {
    return '';
  }
  return format(parse(dateString, 'dd-MM-yyyy', new Date()), 'd MMMM yyyy');
}

export { formatDate, getReadableMonthFormat };
