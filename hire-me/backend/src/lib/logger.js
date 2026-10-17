const stamp = () => new Date().toISOString();
const write = (level, method) => (...args) => console[method](`${stamp()} ${level}`, ...args);

export const logger = {
  info: write('INFO ', 'log'),
  warn: write('WARN ', 'warn'),
  error: write('ERROR', 'error'),
};
