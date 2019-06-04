import xhr from 'lt-xhr';

export const getSeries = param => xhr('get', '/front/index/getSeries', param);
