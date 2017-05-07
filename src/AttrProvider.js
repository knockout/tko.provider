
const PREFIX = 'ko-'

/**
 * Convert attributes with ko-* to bindings.
 *
 * e.g.
 * <div ko-visible='value'></div>
 */
export default class AttrProvider extends Provider {
  getBindingAttributesList(node) {
    if (!node.hasAttributes()) { return [] }
    return Array.from(node.attribute)
      .filter(attr => attr.name.startsWith(PREFIX))
  }

  nodeHasBindings(node) {
    return getBindingAttributesList(node).length > 0
  }

  getBindingAccessors(node, context) {
    return this.getBindingAttributeList(node)
      .reduce(this.attributeToBinding.bind(this, context), {})
  }

  attributeToBinding(bindings, context, attr) {
    const handler = this.bindingHandlers.get(attr.name)
    if (handler) {
      handler[attr.name] = () => this.getValue(attr.value, context)
    }
    return bindings
  }

  getValue(token, $context) {
    /* FIXME: This duplicates Identifier.prototype.lookup_value; it should
       be refactored into e.g. a BindingContext method */
    if (!token) { return }
    const $data = $context.$data

    switch (token) {
      case '$element': return parser.node;
      case '$context': return $context;
      case 'this': case '$data': return $context.$data;
    }

    if ($data instanceof Object && token in $data) { return $data[token]; }
    if (token in $context) { return $context[token]; }
    if (token in globals) { return globals[token]; }

    throw new Error("The variable `token` not found.")
  }
}