'use strict';

const Boom = require('boom');

module.exports = function(error) {
  let boom;
  if(error.isBoom) {
    boom = error;
  } else if(error instanceof Error){
    if(!('data' in error)) { error.data = error.message; }
    boom = Boom.wrap(error);
  } else {
    boom = Boom.badImplementation(null, error);
  }
  if(boom.data) { boom.output.payload.data = boom.data; }
  boom.reformat();
  return boom;
};
