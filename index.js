import moment from 'moment-timezone';
import googlehome from 'google-home-notifier';

import { getPageView } from './ga';
import jarvis from './jarvis.json';


const LANG = 'ja';
const SERVICE_TIMEZONE = 'Asia/Tokyo';


googlehome.ip(jarvis.ip);
googlehome.device(jarvis.name, LANG);

const now = () => { return moment().tz(SERVICE_TIMEZONE); }
const yesterday = now().subtract(1, 'day').format('YYYY-MM-DD');
const dayBefore = now().subtract(2, 'day').format('YYYY-MM-DD');

getPageView(dayBefore, yesterday).then(views => {
  const message = `昨日の、グシュタードへの訪問者数は、、${views}人、でした。`;
  googlehome.notify(message, function(res) {
    console.log(res);
  });
}).catch(err => {
  console.log(err);
});
