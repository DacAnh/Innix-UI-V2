import { parse, format } from 'date-fns';
import { vi } from 'date-fns/locale';

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

// function getReadableMonthFormat(dateString) {
//   if (!dateString) {
//     return '';
//   }
//   return format(parse(dateString, 'dd-MM-yyyy', new Date()), 'd MMMM yyyy');
// }

export { formatDate };

export const getReadableMonthFormat = (date) => {
  if (!date) return '';

  // 1. Chuyển input thành đối tượng Date
  const dateObj = new Date(date);

  // 2. Kiểm tra xem ngày có hợp lệ không (Invalid Date)
  if (isNaN(dateObj.getTime())) {
    return '';
  }

  // 3. Format (Ví dụ: 22 tháng 11)
  try {
    return format(dateObj, "d 'tháng' M", { locale: vi });
  } catch (e) {
    return '';
  }
};
