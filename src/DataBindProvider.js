
import Provider from './Provider'
import Parser from './parser.js';
import parseObjectLiteral from './preparse';


export default class DataBindProvider extends Provider {

  getBindingString(node) {
    switch (node.nodeType) {
      case node.ELEMENT_NODE:
        return node.getAttribute(options.defaultBindingAttribute);
      case node.COMMENT_NODE:
        return virtualElements.virtualNodeBindingValue(node);
      default:
        return null;
    }
  }

  /** Call bindingHandler.preprocess on each respective binding string.
   *
   * The `preprocess` property of bindingHandler must be a static
   * function (i.e. on the object or constructor).
   */
  processBinding(key, value) {
    // Get the "on" binding from "on.click"
    const [on, name] = key.split('.')
    const handler = this.bindingHandlers.get(name || on);
    if (handler.preprocess) {
      value = handler.preprocess(value, key, this.processBinding)
    }
    return `${name}:${value}`
  }

  preProcessBindingString(bindingString) {
    return parseObjectLiteral(bindingString)
      .map((keyValueItem) => this.processBinding(
          keyValueItem.key || keyValueItem.unknown,
          keyValueItem.value
        ))
      .join(",")
  }

  getBindingAccessors(node, context) {
    const binding_string = this.getBindingString(node)
    if (!binding_string) { return }
    const parser = new Parser(node, context, options.bindingGlobals)
    return parser.parse(binding_string)
  }

}