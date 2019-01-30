// We can include a CSS file just by requiring it. Sweet!
// NOTE: If the line belows run on the server that is fine
//       because we make it a no-op using the following code
//       in our configure.js file:
//       require('lasso/node-require-no-op').enable('.css', '.less');
require('./style.css');


var realState = require('../../lib');
 
module.exports = require('marko-widgets').defineComponent(realState({
    // Use the following template to render our UI component
    template: require('./template.marko'),

    // This is called only once and it will
    // override variables declared in getInitialState
    // What this function returns  will persist when
    // the parent state is updated and the component has to re-render
    // You can keep using this.setState as usual to update the state
    getInitialRealState: function(input, out) {
        var value = input.value || 0;

        console.log("OUT", out);
        //var state = realState(out.attributes.__renderedEl.state, {

        //});

        // Our widget will consist of a single property
        // in the state and that will be the current
        // integer value of the number spinner
        return {
            value: value
        };
    },
    getTemplateData: function(state, input) {
        var value = state.value;

        var className = 'number-spinner with-real-state';

        if (value < 0) {
            className += ' negative';
        } else if (value > 0) {
            className += ' positive';
        }
        return {
            value: value,
            className: className
        };
    },
    handleDecrementClick: function() {
        // Change the internal state (triggers a rerender)
        this.setState('value', this.state.value - 1);
    },
    handleIncrementClick: function() {
        // Change the internal state (triggers a rerender)
        this.setState('value', this.state.value + 1);
    }
}));