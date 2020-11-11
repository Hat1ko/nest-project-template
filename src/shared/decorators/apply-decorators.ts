export function applyDecorators(...decorators: Array<ClassDecorator | MethodDecorator>) {
  return <TFunction extends Function, Y>(
    target: TFunction | Object,
    propertyKey?: string | symbol,
    descriptor?: TypedPropertyDescriptor<Y>,
  ) => {
    for (const decorator of decorators || []) {
      target instanceof Function
        ? (decorator as ClassDecorator)(target)
        : (decorator as MethodDecorator)(target, propertyKey, descriptor)
    }
  }
}
