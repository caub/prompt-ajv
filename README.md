# prompt-ajv

```js
const prompt = require('prompt-ajv');

const obj = prompt({
  name: {type: 'string', minLength: 2, required: true},
  pw: {type: 'string', secret: true},
  size: {type: 'string', enum: ['xs', 'sm', 'lg'], default: 'sm'},
  age: {type: 'integer', description: 'How old ru?', minimum: 0, maximum: 150},
  height: {type: 'number', description: 'Height in meters?', minimum: 0, maximum: 2.8, default: 1.8},
});

console.log('obj:', obj);
```