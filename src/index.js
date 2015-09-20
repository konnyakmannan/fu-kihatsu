import remote from 'remote';
const fileUtil = remote.require('./build/lib/fileUtil');

fileUtil.fetchReadmeList((err, matches) => {
  if (!err) document.write(matches.join());
});
