const defineRenderer = require('./defineRenderer');

module.exports = function realState(def) {

    // We start with the original from the def. 
    // Below in "init" this will be replace with a version bound to this
    let originalGetInitialState = def.getInitialState;
    let originalRenderer; // Assigned below after calling own custom defineRenderer
    let originalInit = def.init;

    let defOverride = {
        init() {
            if (!this.__originalSetState){
                this.__originalSetState = this.setState;
                this.setState = this.__setRealState;
                // NOTE: This is the most important part of the file!
                defOverride.getInitialState = defOverride.getInitialState.bind(this);
            }
            if (this.state.__initialRealState) {
                this.__realState = this.state.__initialRealState;
                delete this.state.__initialRealState;
            }
            // Call the init if exists 
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
            const state = originalGetInitialState && originalGetInitialState.apply(this, arguments) || {};

            let realState;
           
            // Unless we have a 'this' that point to the widget this is not going to work.
            if (!this || !this.__realState) { // We did not go through the init yet
                realState = state.__initialRealState = state.__initialRealState || def.getInitialRealState && def.getInitialRealState.apply(this, arguments) || {};
            } else {
                realState = this.__realState;
            }

            // The core of this module... keep the real state across re-renderings
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
   
            this.__originalSetState.call(this, name, value);
 
            // If this is part of the real state update it
            const realState = this.state.__initialRealState || this.__realState;
            if (realState.hasOwnProperty(name)) {
                realState[name] = value;
            }
        },
    }
    // Combine user definition and ours
    defOverride = Object.assign(def, defOverride);
    
    // Create a render
    if (!defOverride.renderer) defOverride.renderer  = def.renderer || defineRenderer(defOverride);

    return defOverride;
}