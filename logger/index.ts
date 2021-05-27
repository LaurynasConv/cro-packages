const ElProto = Element.prototype; ElProto.matches||(ElProto.matches=(ElProto as any).msMatchesSelector||ElProto.webkitMatchesSelector),ElProto.closest||(ElProto.closest=function(e: any){var t: any=this;do{if(ElProto.matches.call(t,e))return t}while(null!==(t=t.parentElement||t.parentNode)&&1===t.nodeType);return null}); // eslint-disable-line

const isQA = /cfQA_log=true/.test(document.cookie + window.location.href) || localStorage.cfQA_log === 'true';
export const logger: Logger = {
  init: identifier => {
    if (isQA) {
      logger.log = Function.prototype.bind.call(console.log, console, `[CONV]${identifier ? ` ${identifier}` : ''} |`); // eslint-disable-line no-console
    }
    return logger.log;
  },
  log: () => {},
};

logger.init();

interface Logger {
  init: (identifier?: string) => typeof console.log;
  log: typeof console.log;
}
