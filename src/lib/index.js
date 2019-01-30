module.exports = function realState(def) {
    let originalSetState;
    let originalGetInitialState = def.getInitialState;
    let originalInit = def.init;
    let that;


    let counter = 1;
    return Object.assign(def, {
        init() {
            that = this;
            originalSetState = this.setState;
            this.setState = this.__setRealState; 
            if (that.state.__initialRealState) {
                realState = that.__realState = that.state.__initialRealState;
                console.log('INIT: that.state.__initialRealState moving', that.counter, realState);
                delete that.state.__initialRealState;
            }
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

        getInitialState(input) {
            debugger;
            const state = originalGetInitialState && originalGetInitialState.apply(this, arguments) || {};

            let realState;
           
            if (!that) { // We did not go through the init yet
                realState = state.__initialRealState = def.getInitialRealState && def.getInitialRealState.apply(this, arguments) || {};
                console.log('No that', realState);
            } else {
                if(!that.counter) that.counter = counter++;
                if (!that.__realState) {
                    if (that.state.__initialRealState) {
                        realState = that.__realState = that.state.__initialRealState;
                        console.log('that.state.__initialRealState moving', that.counter, realState);
                        delete that.state.__initialRealState;
                    } else {
                        console.log('!!!!!!!!  --------->  This should not happen', that.counter);
                        realState = that.__realState = def.getInitialRealState && def.getInitialRealState.apply(this, arguments) || {};
                    }
                } else {
                    realState = that.__realState;
                    console.log('that.__realState', that && that.counter, realState);
                }
            }

            // The core of this module... keep the real state across
            console.log('getInitialState', that && that.counter, realState);
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

            if (that && this !== that) console.error(new Error('THIS IS NOT THAT!'));
 
            // If this is part of the real state update it
            const realState = this.state.__initialRealState || this.__realState;
            console.log('__setRealState', that && that.counter, realState, 'name', name, 'value', value);
            if (realState.hasOwnProperty(name)) {
                realState[name] = value;
            }
        },
    });
}