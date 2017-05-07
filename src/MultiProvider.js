
import Provider from './Provider'


class MultiProvider extends Provider {
  constructor(...args) {
    super(...args)
    this.providers = []
  }

  addProvider(provider) {
    this.providers.push(provider)
    provider.bindingHandlers = this.bindingHandlers
  }

  nodeHasBindings(node) {
    return this.providers.some(p => p.nodeHasBindings(p))
  }

  preprocessNode(node) {
    for (const provider of this.providers) {
      const new_nodes = provider.preprocessNode(node)
      if (new_nodes) { return new_nodes }
    }
    return node
  }

  getBindingAccessors(node, ctx) {
    node = this.preprocessNode(node)
    return this.providers.reduce((acc, p) => this.reduceBindings(acc, p), {})
  }

  reduceBindings(bindings, p) {
    return Object.assign(bindings, p.getBindingAccessors(node, ctx, bindings))
  }
}