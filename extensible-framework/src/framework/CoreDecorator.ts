function Plugin(manifest: Object) {
    return (target: any) => {
    // save a reference to the original constructor
    var original = target;
    
    // a utility function to generate instances of a class
    function construct(constructor: any, args: any) {
        var c : any = function () {
        return constructor.apply(this, args);
        }
        c.prototype = constructor.prototype;
        c.prototype._manifest = manifest;
        return new c();
    }
    
    // the new constructor behaviour
    var f : any = function (...args: any[]) {
        //console.log("New: " + original.name);
        return construct(original, args);
    }
    
    // copy prototype so intanceof operator still works
    f.prototype = original.prototype;
    
    // return new constructor (will override original)
    return f;
    }
}

//contribution: https://github.com/GermainBergeron/dose/blob/master/src/Dose.ts
class Injector {

    private static registery: {[key: string]: any} = {};

    static getRegistered(key: string) {
        var registered = Injector.registery[key];
        if (registered) {
            return registered;
        } else {
            throw new Error(`Error: ${key} was not registered.`);
        }
    }

    static register(key: string, value: any) {
        var registered = Injector.registery[key];
        if (registered) {
            console.log(`Overriding registered value at ${key}.`);
        } else {
            console.log(`Registered value at ${key}.`);
        }
        Injector.registery[key] = value;
    }
}

/* Injection functions */
function injectMethod(...keys: string[]) {
    return (target: any, key: string, descriptor: any) => {
        var originalMethod = descriptor.value;
        descriptor.value = function (...args: any[]) {
            var add = keys.map((key: string) => Injector.getRegistered(key));
            args = args.concat(add);

            var result = originalMethod.apply(this, args);
            return result;
        };
        return descriptor;
    };
}

function injectProperty(...keys: string[]) {
    return (target: any, key: string) => {
        target[key] = Injector.getRegistered(keys[0]);
    };
}

function inject(...keys: string[]) {
    return (...args: any[]) => {
        var params = [];
        for(var i=0;i<args.length; i++){
            args[i] ? params.push(args[i]) : null
        }
        switch (params.length) {
            case 2:
                return injectProperty(keys[0]).apply(this, args);
            case 3:
                return injectMethod(...keys).apply(this, args);
            default:
                throw new Error("Decorators are not valid here!");
        }
    };
}

export {Plugin, Injector, inject}

