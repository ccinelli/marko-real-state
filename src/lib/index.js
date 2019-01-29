module.exports = function realState(def) {
    let originalSetState;
    let originalGetInitialState = def.getInitialState;
    let that;
    let _realState;

    return Object.assign(def, {
        init() {
            that = this;
            originalSetState = this.setState;
            this.setState = this.__setRealState; 
        },

        // The getInitialState is call before init() and there is no reference to `this`
        // So we save the initial real state in `that.state.__initialRealState`
        // later we move the state in `this.__realState`

        // getInitialRealState is called only once and it will
        // override variables declared in getInitialState
        // What this function returns  will persist when
        // the parent state is updated and the component has to re-render
        // You can keep using this.setState as usual to update the state

        getInitialState(input) {
            const state = originalGetInitialState && originalGetInitialState.apply(this, arguments) || {};

            let realState;
           
            if (!that) { // We did not go through the init yet
                realState = state.__initialRealState = def.getInitialRealState && def.getInitialRealState.apply(this, arguments) || {};
            } else {
                if (!that.__realState) {
                    if (that.state.__initialRealState) {
                        realState = that.__realState = that.state.__initialRealState;
                        delete that.state.__initialRealState;
                    } else {
                        console.log('!!!!!!!!  --------->  This should not happen');
                        realState = that.__realState = def.getInitialRealState && def.getInitialRealState.apply(this, arguments) || {};
                    }
                } else {
                    realState = that.__realState;
                }
            }

            // The core of this module... keep the real state across
            for (k in realState) {
                state[k] = realState[k];
            }
 
            return state;
        },

        // Override for the setState make sure we capture changes for variable in realState;
        __setRealState(name, value) {
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
            const realState = this.state.__initialRealState || this.__realState;
            if (realState.hasOwnProperty(name)) {
                realState[name] = value;
            }
        },
    });
}