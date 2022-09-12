// export default function secondsToTime(e: number): string {
//     const h = Math.floor(e / 3600).toString().padStart(2, '0'),
//         m = Math.floor(e % 3600 / 60).toString().padStart(2, '0'),
//         s = Math.floor(e % 60).toString().padStart(2, '0');

//     return h + ':' + m + ':' + s;
//     //return `${h}:${m}:${s}`;
// }

export default function secondsToTime(d: number) {
  d = Number(d);
  var h = Math.floor(d / 3600);
  var m = Math.floor((d % 3600) / 60);
  var s = Math.floor((d % 3600) % 60);

  var hDisplay = h > 0 ? h + (h == 1 ? " hour, " : " hours, ") : "";
  var mDisplay = m > 0 ? m + (m == 1 ? " minute " : " minutes ") : "";
  var sDisplay = s > 0 ? s + (s == 1 ? " second" : " seconds") : "";
  return hDisplay + mDisplay + sDisplay;
}
