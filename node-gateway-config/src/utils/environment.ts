import CoreConstants from '@utils/constants/core';

export const getEnvironment = (): string => {
  return process.env.NODE_ENV || CoreConstants.ENVIRONMENT.DEVELOPMENT;
};

export const isProduction = (): boolean => {
  return getEnvironment() === CoreConstants.ENVIRONMENT.PRODUCTION;
};

export const isDevelopment = (): boolean => {
  return getEnvironment() === CoreConstants.ENVIRONMENT.DEVELOPMENT;
};