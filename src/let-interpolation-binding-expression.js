import {bindingMode, createOverrideContext} from 'aurelia-binding';

import {
  InterpolationBinding,
  ChildInterpolationBinding
} from './interpolation-binding-expression';

export class LetInterpolationBindingExpression {
  /**
   * @param {ObserverLocator} observerLocator
   * @param {string} targetProperty
   * @param {string[]} parts
   * @param {Lookups} lookupFunctions
   */
  constructor(observerLocator, targetProperty, parts, lookupFunctions) {
    this.observerLocator = observerLocator;
    this.targetProperty = targetProperty;
    this.parts = parts;
    this.lookupFunctions = lookupFunctions;
  }

  createBinding() {
    return new LetInterpolationBinding(
      this.observerLocator,
      this.parts,
      this.targetProperty,
      this.lookupFunctions
    );
  }
}

export class LetInterpolationBinding {
  /**
   * 
   * @param {ObserverLocator} observerLocator
   * @param {strign} targetProperty
   * @param {string[]} parts
   * @param {Lookups} lookupFunctions
   */
  constructor(observerLocator, targetProperty, parts, lookupFunctions) {
    this.observerLocator = observerLocator;
    this.parts = parts;
    this.targetProperty = targetProperty;
    this.lookupFunctions = lookupFunctions;
    this.target = null;
  }

  /**
   * @param {Scope} source
   */
  bind(source) {
    if (this.isBound) {
      if (this.originalSource === source) {
        return;
      }
      this.unbind();
    }

    let { bindingContext, parentOverrideContext } = source.overrideContext;

    this.isBound = true;
    this.originalSource = source;
    this.source = createOverrideContext(bindingContext, parentOverrideContext);
    this.target = bindingContext;

    this.interpolationBinding = this.createInterpolationBinding();
    this.interpolationBinding.bind(this.source);
  }

  unbind() {
    if (!this.isBound) {
      return;
    }
    this.isBound = false;
    this.source = null;
    this.originalSource = null;
    this.target = null;
    this.interpolationBinding.unbind();
    this.interpolationBinding = null;
  }

  createInterpolationBinding() {
    if (this.parts.length === 3) {
      return new ChildInterpolationBinding(
        this.target,
        this.observerLocator,
        this.parts[1],
        bindingMode.oneWay,
        this.lookupFunctions,
        this.targetProperty,
        this.parts[0],
        this.parts[2]
      );
    }
    return new InterpolationBinding(this.observerLocator,
      this.parts,
      this.target,
      this.targetProperty,
      bindingMode.oneWay,
      this.lookupFunctions
    );
  }
}
