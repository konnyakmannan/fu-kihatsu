import glob from 'glob';

export function fetchReadmeList(cb) {
  glob('node_modules/**/README.md', (err, matches) => {
    if (err) {
      cb(err, null);
      return;
    }
    cb(null, matches);
  });
}
