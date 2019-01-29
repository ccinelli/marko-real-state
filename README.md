Marko (v3) Real State
===========================

This module lets you to create components with "real states" that persist during parent's re-renders

# Why
Marko 3 has an unusual way to dal with states. When a parent re-render the `getInitialState` function of the child component is called in the children and they lose their state.

This let you persist the state across re-renders.

# Installation
```
npm install marko-real-state
```
Or 
```
yarn add marko-real-state
```

# Use

```javascript
const realState = require('../../lib');
 
// Notice the `defineComponent(` *`realState`* `({`
module.exports = require('marko-widgets').defineComponent(realState({
    // This is called only once and it will
    // override variables declared in getInitialState
    // What this function returns  will persist when
    // the parent state is updated and the component has to re-render
    // You can keep using this.setState as usual to update the state
    
    getInitialRealState: function(input) {
        var value = input.value || 0;
        return {
            value: value
        };
    },
    ...
```

# Sample app

#### Download it:

```
git clone https://github.com/ccinelli/marko-real-state.git
cd marko-real-state
# Run with this: [or browser-refresh server.js]
node server.js
```

#### The app will start with all counters at 0:

![step0](https://user-images.githubusercontent.com/38021940/51940298-7aaa7900-23c6-11e9-8a24-77bea041536f.png)

#### Increment the 2 children

![step1](https://user-images.githubusercontent.com/38021940/51940306-7da56980-23c6-11e9-8eae-2240fbc68141.png)

#### Increment the parent

![step2](https://user-images.githubusercontent.com/38021940/51940315-826a1d80-23c6-11e9-9ee2-ba72331b655c.png)

#### The child with realState maintains its state

# TODO

- Tests