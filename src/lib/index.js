module.exports = function realState(def) {
    let originalSetState;
    let originalGetInitialState = def.getInitialState;
    let originalInit = def.init;
    
    let counter = 1;
    return Object.assign(def, {
        init() {
            originalSetState = this.setState;
            this.setState = this.__setRealState; 

            const rootStorage = this.el;
            rootStorage.__realState = this.state.__realState;

            originalInit && originalInit.apply(this, arguments);
        },

        // The getInitialState is call before init() and there is no reference to `this`
        // So we save the initial real state in `that.state.__initialRealState`
        // later we move the state in `this.__realState`

        // getInitialRealState is called only once and it will
        // override variables declared in getInitialState
        // What this function returns  will persist when
        // the parent state is updated and the component has to re-render
        // You can keep using this.setState as usual to update the state

        getInitialState(input, out) {
            debugger;
            const rootStorage = out.attributes && out.attributes.__rerenderEl || {};
            const state = originalGetInitialState && originalGetInitialState.apply(this, arguments) || {};

            let realState;
           
            if (!rootStorage.__realState) { // We did not go through the init yet
                realState = state.__realState = def.getInitialRealState && def.getInitialRealState.apply(this, arguments) || {};
                console.log('getInitialState: No lastState', realState);
            } else {
                //if(!that.counter) that.counter = counter++;
                if (!rootStorage.__realState) {
                    console.log('getInitialState 1!!!!!!!!  --------->  This should not happen');
                } else {
                    realState = rootStorage.__realState;
                    console.log('getInitialState', realState);
                }
            }

            // The core of this module... keep the real state across
            console.log('getInitialState',  realState);
            for (k in realState) {
                state[k] = realState[k];
            }
 
            return state;
        },

        // Override for the setState make sure we capture changes for variable in realState;
        __setRealState(name, value) {
            const rootStorage = this.el;

            if (typeof name === 'object') {
                // Merge in the new state with the old state
                var newState = name;
                for (var k in newState) {
                    if (newState.hasOwnProperty(k)) {
                        this.__setRealState(k, newState[k]);
                    }
                }
                return;
            }
   
            originalSetState.call(this, name, value);
 
            // If this is part of the real state update it
            const realState = rootStorage.__realState;
            console.log('__setRealState', realState, 'name', name, 'value', value);
            if (realState.hasOwnProperty(name)) {
                realState[name] = value;
            }
        },
    });
}