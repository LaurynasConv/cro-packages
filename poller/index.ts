if (window.NodeList && !NodeList.prototype.forEach) { NodeList.prototype.forEach = Array.prototype.forEach as any; } // eslint-disable-line
const defaultOptions: MutationObserverInit = { childList: true, subtree: true, attributes: true, characterData: true };
export const Observer: typeof MutationObserver = window.MutationObserver || (window as any).WebKitMutationObserver;

export function waitForElement<ElementType extends Element>(selector: string, callback: (elements: NodeListOf<ElementType>) => any, options?: WaitFormElementOptions): MutationObserver | undefined; // eslint-disable-line prettier/prettier
export function waitForElement<Callback extends ObserverFn>(selector: Callback, callback: (elements: ReturnType<Callback>) => any, options?: WaitFormElementOptions): MutationObserver | undefined; // eslint-disable-line prettier/prettier
export function waitForElement<ElementType extends Element, Callback extends ObserverFn>(
  selector: string | Callback,
  callback: (elements: NodeListOf<ElementType> | ReturnType<Callback>) => any,
  { timeout = 10000, container = document, options = defaultOptions }: WaitFormElementOptions = {},
) {
  if (Observer) {
    let observer: MutationObserver;
    const tOut = setTimeout(() => {
      observer.disconnect();
    }, timeout);
    const observerFn = (records: MutationRecord[]) => {
      const elements =
        typeof selector === 'string' ? container.querySelectorAll<ElementType>(selector) : selector(records);

      if ((typeof selector === 'function' && elements !== undefined) || elements?.length) {
        clearTimeout(tOut);
        observer.disconnect();
        callback(elements);
      }
    };
    observer = new Observer(observerFn);
    observer.observe(container, options);
    observerFn([]);
    return observer;
  }
}

type ObserverFn = (mutations: MutationRecord[]) => any;
interface WaitFormElementOptions {
  timeout?: number;
  container?: Document | Element;
  options?: MutationObserverInit;
}
