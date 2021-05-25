if (!Element.prototype.matches) {
  Element.prototype.matches = (Element.prototype as any).msMatchesSelector || Element.prototype.webkitMatchesSelector;
}

if (!Element.prototype.closest) {
  Element.prototype.closest = function (selector: string) {
    let element: Element | Node = this; // eslint-disable-line @typescript-eslint/no-this-alias

    do {
      if (Element.prototype.matches.call(element, selector)) return element;
      element = element.parentElement || element.parentNode;
    } while (element !== null && element.nodeType === 1);
    return null;
  };
}

if (window.NodeList && !NodeList.prototype.forEach) {
  NodeList.prototype.forEach = Array.prototype.forEach as any;
}

export {};
