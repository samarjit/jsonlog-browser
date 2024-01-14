export const formDataModel = {
  '@timestamp': 'string',
   type: {
    type: 'enum',
    values: ['IB-REQ', 'OB-REQ', 'OB-RES', 'IB-RES']
  },
  'msg': 'string',
  'url': 'string',
  'convId': 'string',
  'data.req': 'string',
  'data.res': 'string',
  plaintext: 'string'
};
