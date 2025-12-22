import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import duration from 'dayjs/plugin/duration';
import 'dayjs/locale/th';

dayjs.extend(relativeTime);
dayjs.extend(duration);
dayjs.locale('th');

// export function CommentDuration(str: string) {
//   const dateObj = dayjs(str); 
//   const now = dayjs();       

//   const diffMs = now.diff(dateObj);
  
//   const durationObj = dayjs.duration(diffMs);

//   const days = Math.floor(durationObj.asDays()); 
//   const hours = durationObj.hours();
//   const minutes = durationObj.minutes();

//   if (diffMs < 60000) {
//       return "เมื่อสักครู่";
//   }

//   let result = "";
//   if (days > 0) result += `${days} วัน `;
//   if (hours > 0) result += `${hours} ชั่วโมง `;
//   result += `${minutes} นาทีที่แล้ว`;

//   return result;
// }

export function CommentDuration(str: string) {
  return dayjs(str).fromNow();
}
