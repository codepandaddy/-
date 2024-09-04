const buffer1 = Buffer.from('geekbang');
const buffer2 = Buffer.from([1,2,3,4]);

const buffer3 = Buffer.alloc(20);

console.log(buffer1);
console.log(buffer2);
console.log(buffer3);

buffer2.writeInt8(12,1);
console.log(buffer2);
// 大端，不同设备 不同后台 不同标准
buffer2.writeInt16BE(512,2);
// 小端
buffer2.writeInt16LE(512,2);
console.log(buffer2);

// 二进制结构化包流动
const fs = require('fs');
const protobuf = require('protocol-buffers');
const schema = protobuf(fs.readFileSync(__dirname+'/test.proto', 'utf-8'));
// 后台接收schema并解析
console.log(schema);
const buffer = schema.Column.encode({
  id: 1,name:'node.js',price:80.4
});
// 前台解密
console.log(schema.Column.decode(buffer));