import { BusinessEventData, ClassBusinessInterception } from "./class-business.interception";

export const BusinessEvent = (data?: BusinessEventData): MethodDecorator => {
    return (target: Object, propertyKey: string | symbol, descriptor: PropertyDescriptor) => {
        Reflect.defineMetadata('businessevent:is', true, target, propertyKey);
        if (data) {
            Reflect.defineMetadata('businessevent:data', data, target, propertyKey);
        }
    }
}

export const BusinessClass = (): ClassDecorator => {
    return (cls: Object) => {
        Reflect.defineMetadata('injectable:is', true, cls);
        Reflect.defineMetadata('intercept:is', true, cls);
        Reflect.defineMetadata('intercept:customs', [ClassBusinessInterception], cls);
    }
}