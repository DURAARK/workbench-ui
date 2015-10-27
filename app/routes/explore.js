import Ember from 'ember';
export
default Ember.Route.extend({
  // setupController(controller, model) {
  //     this._super();
  //     var appState = this.modelFor('application');
  //     controller.set('appState', appState.get('explore'));
  //
  //     // this.send('setActiveRoute', appState.get('explore.activeRoute'));
  //   },

    actions: {
      setActiveRoute(routeName) {
        let controller = this.controllerFor('explore');

        controller.set('isActiveKnowledgeBase', false);
        controller.set('isActiveContext', false);
        controller.set('isActiveContext', false);

        if (routeName === 'knowledgebase') {
          controller.set('isActiveKnowledgeBase', true);
        } else if (routeName === 'context') {
          controller.set('isActiveContext', true);
        } else if (routeName === 'metadata') {
          controller.set('isActiveContext', true);
        };
      }
    }
});
