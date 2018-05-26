import bb from 'bluebird';
import google from 'googleapis';
import key from './key.json';


const jwtClient = new google.auth.JWT(
  key.client_email,
  null,
  key.private_key,
  ["https://www.googleapis.com/auth/analytics.readonly"],
  null
);
const authorize = () => {
  return new bb(function (resolve, reject) {
    return jwtClient.authorize((err, tokens) => {
      if (err) return reject(err);
      return resolve(tokens);
    });
  });
}
const analytics = google.analytics('v3');
const getGA = bb.promisify(analytics.data.ga.get);


export const getPageView = async (startDate, endDate) => {
  try {
    const tokens = await authorize();
    const resp = await getGA({
      // ここで JWT クライアントを設定
      'auth': jwtClient,
      'ids': 'ga:174262730',
      'start-date': startDate,
      'end-date': endDate,
      'metrics': 'ga:pageviews,ga:uniquePageviews,ga:timeOnPage,ga:bounces,ga:entrances,ga:exits',
      'dimensions': 'ga:pagePath',
      'sort':'-ga:pageviews'
    });
    return resp.totalResults;
  } catch (err) {
    console.log(err);
    return;
  }
}
