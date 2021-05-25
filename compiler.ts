import path from 'path';

import fs from 'fs-extra';
import * as chokidar from 'chokidar';
import * as typescript from 'typescript';
import UglifyJS from 'uglify-js';

// const createdFiles: { fileName: string; code: string }[] = [];

chokidar.watch('*/index.ts').on('change', file => {
  const options: typescript.CompilerOptions = {
    target: typescript.ScriptTarget.ES5,
    noImplicitUseStrict: true,
    declaration: true,
    indentLevel: 2,
    indentSize: 2,
    tabSize: 2,
  };
  // const host = typescript.createCompilerHost(options);
  // host.writeFile = (fileName: string, code: string) => createdFiles.push({ fileName, code });
  // const program = typescript.createProgram([file], options, host);
  // program.emit();

  // createdFiles.forEach(({ fileName, code }) => {
  //   if (/\.js$/.test(fileName)) {
  //     const transpiled = code
  //       .split(/[\r\n]/)
  //       .map(line => {
  //         if (/\/\* html \*\//.test(line)) {
  //           const startPadding = line.match(/^\s+/);
  //           const updated = line
  //             .replace(/\/\* html \*\/|\\n/g, '')
  //             .replace(/^\s+</, '<')
  //             .replace(/>\s+$/, '>')
  //             .replace(/>\s+</g, '><')
  //             .replace(/\s\s+/g, ' ')
  //             .trim();

  //           return `${startPadding ? startPadding[0] : ''}${updated}`;
  //         }

  //         return line;
  //       })
  //       .join('\n');
  //     const minified = UglifyJS.minify(transpiled);

  //     fs.writeFileSync(fileName, transpiled);
  //     fs.writeFileSync(fileName.replace(/\.js$/, '.min.js'), minified.code);
  //     // console.log({ transpiled, minified }); // eslint-disable-line no-console
  //   } else {
  //     fs.writeFileSync(fileName, code);
  //   }
  // });
  const rawCode = fs.readFileSync(file, 'utf-8');
  const transpiled = typescript
    .transpile(rawCode, options)
    .split(/[\r\n]/)
    .map(line => {
      if (/\/\* html \*\//.test(line)) {
        const startPadding = line.match(/^\s+/);
        const updated = line
          .replace(/\/\* html \*\/|\\n/g, '')
          .replace(/^\s+</, '<')
          .replace(/>\s+$/, '>')
          .replace(/>\s+</g, '><')
          .replace(/\s\s+/g, ' ')
          .trim();

        return `${startPadding ? startPadding[0] : ''}${updated}`;
      }

      return line;
    })
    .join('\n');
  const minified = UglifyJS.minify(transpiled);
  const minDirname = path.join(path.dirname(file), 'min');

  fs.ensureDirSync(minDirname);
  fs.writeFileSync(path.join(minDirname, 'index.js'), minified.code);
  // console.log({ transpiled, minified }); // eslint-disable-line no-console
});
