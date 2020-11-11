import { plainToClass } from 'class-transformer'
import { isArray } from 'util'
import { ClassType } from 'class-transformer/ClassTransformer'

function isFunction(variableToCheck) {
  //If our variable is an instance of "Function"
  if (variableToCheck instanceof Function) {
    return true
  }
  return false
}

export enum TransformType {
  FUNCTION,
  CLASS,
}

export type CustomTransformer = { type: TransformType; method: ClassType<any> | Function }

export function TransformResult(transformers: CustomTransformer[] | ClassType<any>, params?) {
  return function(target, propertyKey, descriptor) {
    const transform = (transformer: CustomTransformer, target) => {
      return transformer.type === TransformType.FUNCTION
        ? (transformer.method as Function)(target)
        : plainToClass(transformer.method as ClassType<any>, target, params)
    }

    var originalMethod = descriptor.value
    descriptor.value = function() {
      var args = []
      for (var _i = 0; _i < arguments.length; _i++) {
        args[_i] = arguments[_i]
      }
      var result = originalMethod.apply(this, args)

      let generalResult = result

      if (!Array.isArray(transformers))
        transformers = [{ type: TransformType.CLASS, method: transformers }]

      transformers.map(transformer => {
        var isPromise =
          !!generalResult &&
          (typeof generalResult === 'object' || typeof result === 'function') &&
          typeof generalResult.then === 'function'

        generalResult = isPromise
          ? generalResult.then(function(data) {
              return transform(transformer, data)
            })
          : transform(transformer, generalResult)
      })
      return generalResult
    }
  }
}
