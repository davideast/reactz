import gradient from 'gradient-string';

export function log(message: string, logger = console.log) {
  return logger(message);
}

const enum PurpleGradient {
  from = '#C86DD7',
  to = '#3023AE',
}

const enum GreenGradient {
  from = '#6dd793',
  to = '#B02B2B',
}

const enum RedGradient {
  from = '#BB6262',
  to = '#B02B2B',
}

export function purpleGradient(message: string) {
  return gradient(PurpleGradient.from, PurpleGradient.to)(message);
}

export function greenGradient(message: string) {
  return gradient(GreenGradient.from, GreenGradient.to)(message);
}

export function redGradient(message: string) {
  return gradient(RedGradient.from, RedGradient.to)(message);
}

function _gradientLog(message: string, from: string, to: string) {
  let logGradient = gradient(from, to);
  return console.log(logGradient(message));
}

export function gradientLog(message: string, from = PurpleGradient.from, to = PurpleGradient.to) {
  return _gradientLog(message, from, to);
}

export function errorLog(message: string) {
  return _gradientLog(message, RedGradient.from, RedGradient.to);
}

export function successLog(message: string) {
  return _gradientLog(message, GreenGradient.from, GreenGradient.to);
}
