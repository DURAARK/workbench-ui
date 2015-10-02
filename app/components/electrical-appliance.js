import Ember from 'ember';

export default Ember.Component.extend({
  selectedRoom: null,

  actions: {
    roomClicked(roomName) {
      console.log('Showing results for: ' + roomName);

      // FIXXME: get images dynamically based on room name!
      var room = Ember.Object.create({
        label: roomName,
        elecDetectImages: [{
          src: '/assets/nygade/elecdetect-test-set/results/wall1-result.jpg'
        }, {
          src: '/assets/nygade/elecdetect-test-set/results/wall0-result.jpg'
        }, {
          src: '/assets/nygade/elecdetect-test-set/results/wall5-result.jpg'
        }, {
          src: '/assets/nygade/elecdetect-test-set/results/wall4-result.jpg'
        }, {
          src: '/assets/nygade/elecdetect-test-set/results/wall2-result.jpg'
        }, {
          src: '/assets/nygade/elecdetect-test-set/results/wall3-result.jpg'
        }],
        ruleSetImages: [{
          src: '/assets/nygade/wiregen/output/svg_grammar/wall1.svg'
        }, {
          src: '/assets/nygade/wiregen/output/svg_grammar/wall0.svg'
        }, {
          src: '/assets/nygade/wiregen/output/svg_grammar/wall5.svg'
        }, {
          src: '/assets/nygade/wiregen/output/svg_grammar/wall4.svg'
        }, {
          src: '/assets/nygade/wiregen/output/svg_grammar/wall2.svg'
        }, {
          src: '/assets/nygade/wiregen/output/svg_grammar/wall3.svg'
        }],
        hypothesisImages: [{
          src: '/assets/nygade/wiregen/output/svg_hypothesis/wall1.svg'
        }, {
          src: '/assets/nygade/wiregen/output/svg_hypothesis/wall0.svg'
        }, {
          src: '/assets/nygade/wiregen/output/svg_hypothesis/wall5.svg'
        }, {
          src: '/assets/nygade/wiregen/output/svg_hypothesis/wall4.svg'
        }, {
          src: '/assets/nygade/wiregen/output/svg_hypothesis/wall2.svg'
        }, {
          src: '/assets/nygade/wiregen/output/svg_hypothesis/wall3.svg'
        }],
      });

      this.set('selectedRoom', room);
    },

    backToFloorplan() {
      this.set('selectedRoom', null);
    }
  }
});
