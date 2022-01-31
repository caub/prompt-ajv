const PromptSync = require('prompt-sync');
const Ajv = require('ajv');

const promptSync = PromptSync({
  history: createMemoryHistory()
});

const ajv = new Ajv({ coerceTypes: true, useDefaults: true });


module.exports = function prompt(schemaProps) {
  const res = {};

  for (const [key, {required, secret, ...props}] of Object.entries(schemaProps)) {
    const opts = {
      ask: `${props.description || key} ${props.default !== undefined ? `(${props.default}) ` : ''}`,
      ...secret && { echo: '*' }
    };

    res[key] = promptSync(opts) || undefined;

    while (!ajv.validate({ type: 'object', properties: { [key]: props }, required: required ? [key] : undefined }, res)) {
      console.error(ajv.errors.map(({message, params}) => `> ${message} ${JSON.stringify(params)}`).join('\n'));
      res[key] = promptSync(opts) || undefined;
    }
  }

  return res;
}

function createMemoryHistory() {
  const HIST = [];
  let ix = HIST.length;
  return {
    atStart() { return ix <= 0; },
    atPenultimate() { return ix === HIST.length - 1; },
    pastEnd() { return ix >= HIST.length; },
    atEnd() { return ix === HIST.length; },
    prev() { return HIST[--ix]; },
    next() { return HIST[++ix]; },
    reset() { ix = HIST.length; },
    push(str) { 
      if (HIST.includes(str)) return;
      HIST.push(str);
    },
    save() { },
  };
}