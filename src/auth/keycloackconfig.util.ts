import LocalDb from '../dbServices/dbServices';

const access_token_header = {
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded',
  },
};
const accessTokenRefreshPayload = (refresh_token: string, sname: string) => {
  return new URLSearchParams({
    refresh_token: refresh_token,
    grant_type: 'refresh_token',
    client_id: sname,
  });
};
const generalApiHeader = (access_token: string) => {
  return {
    token: access_token,
    optional: [
      {
        header: 'X-Auth-Token',
        value: access_token,
      },
    ],
  };
};
const fetchTokenFromDb = () => {
  const tokenStore = LocalDb.loadLocalDB('token', 'TokenList', 2);
  return new Promise((resolve, reject) => {
    try {
      LocalDb.get(tokenStore, 'TokenList', 'dataCookie', (data: any) => {
        if (data?.response?.value) {
          resolve(data.response.value);
        } else {
                reject({});
        }
      });
    } catch (e) {
      reject(e);
    }
  });
};
const setTokenToDb = (data: any) => {
  const tokenStore = LocalDb.loadLocalDB('token','TokenList', 2);
  LocalDb.set(tokenStore, 'TokenList', 'dataCookie', {
    value: data,
    title: 'TokenData',
  });
};
const clearDB = () => {
  const tokenStore = LocalDb.loadLocalDB('token','TokenList',2);
  LocalDb.clear(tokenStore, 'TokenList');
};

export {
  access_token_header,
  accessTokenRefreshPayload,
  generalApiHeader,
  fetchTokenFromDb,
  setTokenToDb,
  clearDB,
};
