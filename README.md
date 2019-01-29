Marko (v3) Real State
===========================

This module lets you to create components with "real states" that persist during parents re-renders

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

```
const realState = require('../../lib');
 
// Notice the `defineComponent(` *`realState`* `({`
module.exports = require('marko-widgets').defineComponent(realState({
    // This is called only once and it will
    // override variable declared in getInitialState
    // What is return in this function will persist when
    // the parent state is updated and the component has to re-render
    // You can keep using setState as usual to update the state
    
    getInitialRealState: function(input) {
        var value = input.value || 0;
        return {
            value: value
        };
    },
    ...
```


# Sample app

```
git clone https://github.com/ccinelli/marko-real-state.git
cd marko-real-state
node server.js
```

# TODO

- Tests 