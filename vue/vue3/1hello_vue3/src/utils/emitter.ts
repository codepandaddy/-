import mitt from 'mitt'

const emitter = mitt();

emitter.on('test1', () => {
  console.log(111);
  
});

emitter.emit('test1');

export default emitter;