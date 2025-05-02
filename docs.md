# EDITME-libName Documentation
EDITME-description  
  
If you like using this library, please consider [supporting the development ❤️](https://github.com/sponsors/Sv443)

<br>


<!-- #region Preamble -->
## Preamble:
This library is written in TypeScript and contains builtin TypeScript declarations, but it will also work in plain JavaScript after removing the `: type` annotations in the example code snippets.  
  
Each feature's example code snippet can be expanded by clicking on the text "Example - click to view".  
The signatures and examples are written in TypeScript and use ESM import syntax to show you which types need to be provided and will be returned.  
The library itself supports importing an ESM, CommonJS or global variable definition bundle, depending on your use case.  
  
If the signature section contains multiple signatures of the function, each occurrence represents an overload and you can choose which one you want to use.  
They will also be further explained in the description below that section.  
  
Warning emojis (⚠️) denote special cautions or important notes that you should be aware of when using the feature.  
  
If you need help with something, please [create a new discussion](https://github.com/Sv443-Network/EDITME-repo/discussions) or [join my Discord server.](https://dc.sv443.net/)  
For submitting bug reports or feature requests, please use the [GitHub issue tracker.](https://github.com/Sv443-Network/EDITME-repo/issues)

<br>


<!-- #region Features -->
## Table of Contents:
- [**Preamble** (info about the documentation)](#preamble)
- [**Features**](#features)
  - [**Category:**](#category)
    - [`class MyClass`](#class-myclass) - class that does stuff
      - [`type MyClassOptions`](#type-myclassoptions) - options for `MyClass`
    - [`myFunction()`](#myfunction) - function that does stuff
      - [`const myFunctionConst`](#const-myfunctionconst) - some const that belongs to `myFunction()`
      - [`type MyFunctionReturnType`](#type-myfunctionreturntype) - type associated with `myFunction()`
    - [`type OtherType`](#type-othertype) - some other type not related to anything particular

<br><br>


<!-- #region Features -->
## Features:

<br>


<!-- #region Category -->
## Category:

<br>


<!-- #region MyClass -->
### `class MyClass`
Signature:  
```ts
new MyClass(options?: MyClassOptions): MyClass;
```
  
Inheritance:
```ts
abstract class MyClass<TEvtMap extends EventsMap = DefaultEvents>
  extends MyOtherClass<TEvtMap>
    extends NanoEmitter<TEvtMap>;
```

A class that does stuff.  
  
Inherits from `MyOtherClass` and `NanoEmitter` to allow you to create custom events.  
  
The options object is optional. See the [type `MyClassOptions`](#type-myclassoptions) for all available properties.  
  
<details><summary>Example - click to view</summary>

```ts
import { MyClass } from '@sv443-network/editme-pkgname';

const myClass = new MyClass({
  property1: 'value1',
  property2: 42,
});
```
</details>

<br>

#### `MyClass.myMethod()`
Signature:  
```ts
MyClass.myMethod(param1: string, param2: number): void;
```
  
A method of the class that does stuff.  

<br><br>

### `type MyClassOptions`
The options for the `MyClass` constructor.  
The object can have the following properties:
| Property | Type | Description |
| :-- | :-- | :-- |
| `property1` | `string` | The first property of the options object. |
| `property2` | `number` | The second property of the options object. |

<br><br>



<br><br><br><br>

<!-- #region Footer -->
<div style="text-align: center;" align="center">

Made with ❤️ by [Sv443](https://github.com/Sv443)  
If you like this library, please consider [supporting development](https://github.com/sponsors/Sv443)

</div>

<br><br><br><br>
