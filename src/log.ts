import gradient from 'gradient-string';

export function log(message: string, logger = console.log) {
  return logger(message);
}

export function gradientLog(message: string, from = '#C86DD7', to = '#3023AE') {
  let coolGradient = gradient(from, to);
  return console.log(coolGradient(message))
}
