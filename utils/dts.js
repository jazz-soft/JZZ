const fs = require('fs');
const ts = require('typescript');
const JZZ = require('..');

var dts = parseDts('../index.d.ts');
console.log(dts);

function parseDts(fname) {
  const code = fs.readFileSync(fname, 'utf8');
  const sourceFile = ts.createSourceFile(fname, code, ts.ScriptTarget.Latest, true);
  const tree = {};

  function parse(node) {
    // Look for Interfaces (e.g., interface Port)
    if (ts.isInterfaceDeclaration(node)) {
      const interfaceName = node.name.text;
      tree[interfaceName] = node.members
        .filter(m => m.name) // only nodes with names
        .map(m => m.name.getText());
    }

    // Look for functions in the JZZ namespace
    if (ts.isModuleDeclaration(node) && node.body) {
      const namespaceName = node.name.text;
      tree[namespaceName] = [];
      node.body.statements.forEach(s => {
        if (s.name) tree[namespaceName].push(s.name.text);
      });
    }

    ts.forEachChild(node, parse);
  }

  parse(sourceFile);
  return tree;
}
