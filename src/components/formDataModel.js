export const formDataModel = {
  '@timestamp': 'string',
  msgType: {
    type: 'enum',
    values: ['REST-IB-REQ', 'REST-OB-REQ', 'REST-OB-RES', 'REST-OB-ERROR', 'REST-IB-RES', 'REST-IB-ERROR', 'SERVICE-MSG', 'SERVICE-MSG-ERROR']
  },
  'sMsg.msg': 'string',
  'sMsg.uriTemplate': 'string',
  'context[\'idp-trace-id\']': 'string',
  'sMsg.reqPayload': 'string',
  'sMsg.resPayload': 'string',
  plaintext: 'string'
};
