import Ember from 'ember';

export
default Ember.Component.extend({
    spinner: null,

    didInsertElement: function() {
        var spinner = pleaseWait({
            //logo: "assets/images/pathgather.png",
            backgroundColor: '#f46d3b',
            loadingHtml: "<div class='sk-spinner sk-spinner-wave'><div class='sk-rect1'></div><div class='sk-rect2'></div><div class='sk-rect3'></div><div class='sk-rect4'></div><div class='sk-rect5'></div></div>"
            // loadingHtml: "<p class='loading-message'>A good day to you fine user!</p>"
        });

        this.set('spinner', spinner);
    },

    willDestroyElement: function() {
        var spinner = this.get('spinner');

        if (spinner) {
            spinner.finish();
        }
    }
});