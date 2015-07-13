// This script is for Node.js only. Don't use it in HTML!
var JZZ;
eval(require('fs').readFileSync(require('path').join(__dirname, 'javascript', 'JZZ.js'))+'');
module.exports = JZZ;