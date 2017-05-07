

import {
  extend, virtualElements, arrayForEach, options, objectForEach
} from 'tko.utils';

import BindingHandlerObject from './BindingHandlerObject'


export default class Provider {
  constructor(options) {
    this.bindingHandlers = options.bindingHandlers || new BindingHandlerObject()
  }

  nodeHasBindings(/* node */) {}
  getBindingAccessors(/* node, context */) {}
  preprocessNode(/* node */) {}
  postProcess(/* node */) {}
}