import remote from 'remote';
// const fileUtil = remote.require('./build/lib/fileUtil');
// 
// fileUtil.fetchReadmeList((err, matches) => {
//   if (!err) document.write(matches.join());
// });
const editor = ace.edit('input_text');
editor.getSession().setMode('ace/mode/tex');
editor.setTheme('ace/theme/twilight');
