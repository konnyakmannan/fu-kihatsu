import fs from 'fs';
import remote from 'remote';
import marked from 'marked';
import { highlight } from 'highlight.js';

const dialog = remote.require('dialog');
const browserWindow = remote.require('browser-window');

var currentPath = '';

window.onload = () => {
  const editor = ace.edit('input_text');
  editor.getSession().setMode('ace/mode/markdown');
  editor.setTheme('ace/theme/twilight');

  const renderer = new marked.Renderer();

  renderer.list = (body, ordered) => {
    return `<div class="list" role="list>">${body}</div>\n`;
  };

  renderer.listitem = (text) => {
    const listitem = '<paper-icon-item>\n' +
                        '  <div class="avatar blue" item-icon></div>\n' +
                        `  <div class="flex">${text}</div>\n` +
                      '</paper-icon-item>\n';

    return listitem;
  };

  marked.setOptions({
    renderer: renderer,
    gfm: true,
    tables: true,
    break: false,
    pedantic: false,
    sanitize: true,
    smartLists: false,
    smartypants: false,
    highlight: (code, lang) => {
      if (lang === null && lang === undefined) return code;

      try {
        return highlight(lang, code).value;
      } catch (e) {
        console.error(e);
        return code;
      }

    }
  });

  editor.on('change', () => {
    const view = document.getElementById('view_text');

    const txt = editor.getValue();
    // const convertedText = txt.replace(/(?:\r\n|\r|\n)/g, '<br />');

    view.innerHTML = marked(txt);

    MathJax.Hub.Configured();
    MathJax.Hub.Queue(["Typeset", MathJax.Hub, view])
  });

  var btnOpen = document.getElementById('btnOpen');
  btnOpen.addEventListener('click', () => { openLoadFile(editor); });

  var btnSave = document.getElementById('btnSave');
  btnSave.addEventListener('click', () => { saveFile(editor); });
};

function openLoadFile(editor) {
  const win = browserWindow.getFocusedWindow();
  dialog.showOpenDialog(
    win,
    {
      properties: ['openFile'],
      filters: [
        {
          name: 'Documents',
          extensions: ['md']
        }
      ]
    },
    (path) => {
      if (path) {
        readFile(editor, path[0]);
      }
    }
  );
}

function readFile(editor, path) {
  currentPath = path;
  fs.readFile(path, (e, text) => {
    if (e !== null) {
      alert('error: ' + e);
      return;
    }
    const footer = document.getElementById('footer_fixed');
    footer.innerHTML = path;
    editor.setValue(text.toString(), -1);
  });
}

function saveFile(editor) {
  const win = browserWindow.getFocusedWindow();
  if (currentPath === '') {
    saveNewFile(editor);
    return;
  }
  dialog.showMessageBox(
    win,
    {
      title: 'ファイルの上書き保存を行います',
      type: 'info',
      buttons: ['OK', 'Cancel'],
      detail: '本当に保存しますか?'
    },
    (response) => {
      if (response === 0) {
        const data = editor.getValue();
        writeFile(currentPath, data);
      }
    }
  );
}

function saveNewFile(editor) {
  const win = browserWindow.getFocusedWindow();
  dialog.showOpenDialog(
    win,
    {
      properties: ['openFile'],
      filters: [
        {
          name: 'Documents',
          extensions: ['md']
        }
      ]
    },
    (path) => {
      if (path) {
        const data = editor.getValue();
        currentPath = path;
        writeFile(currentPath, data);
      }
    }
  );
}

function writeFile(path, data) {
  fs.writeFile(path, data, (e) => {
    if (e !== null) {
      alert('error: ' + e);
      return;
    }
  });
}
