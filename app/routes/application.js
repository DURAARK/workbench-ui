import Ember from 'ember';

export default Ember.Route.extend({
  model: function() {
    return this.store.findAll('session');
  },

  setupController: function(controller, model) {
    this._super(controller, model);
  },

  actions: {
    showError: function(err) {
      alert('Error occured:\n' + err);
    },

    setNumDigitalObjects: function(num) {
      this.controller.set('numDigitalObjects', num);
    },

    setNumActionsPending: function(num) {
      this.controller.set('numActionsPending', num)
    },

    addPendingAction: function() {
      var num = this.controller.get('numActionsPending');
      this.controller.set('numActionsPending', ++num);
    },

    removePendingAction: function() {
      var num = this.controller.get('numActionsPending');

      if (num > 0) {
        this.controller.set('numActionsPending', --num);
      }
    },

    isLoading: function(flag, message) {
      this.controller.set('isLoading', flag);

      if (flag === true) {
        if (message) {
          this.controller.set('loadingMessage', message);
        } else {
          this.controller.set('loadingMessage', ' ');
        }
      } else {
        this.controller.set('loadingMessage', null);
      }
    }
  }

  //
  // setupController: function(controller, model) {
  // 	debugger;
  // 	this._super(controller, model);
  // },

  // actions: {
  // 	highlightSession: function(session) {
  // 		var sessions = this.modelFor('preingest');

  // 		sessions.forEach(function(item) {
  // 			item.set('isSelected', false);
  // 		});

  // 		session.set('isSelected', true);
  // 	}
  // }
});
