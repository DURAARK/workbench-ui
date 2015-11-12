import Ember from 'ember';

export default Ember.Component.extend({
  selectedRoom: null,

  roomInfoChanged: function() {
    let roomInfo = this.get('roomInfo'),
      baseUrl = this.duraark.getAPIEndpoint('geometricEnrichment'),
      selectedRoom = Ember.Object.create({
        orthophoto: {
          walls: []
        },
        grammar: {
          walls: []
        },
        hypothesis: {
          walls: []
        }
      });

    _.forEach(roomInfo.rise.orthophoto.walls, item => {
      // console.log('url: ' + baseUrl + item);
      selectedRoom.get('orthophoto.walls').pushObject(baseUrl + item);
    });

    _.forEach(roomInfo.rise.hypothesis.walls, item => {
      // console.log('url: ' + baseUrl + item);
      selectedRoom.get('hypothesis.walls').pushObject(baseUrl + item);
    });

    _.forEach(roomInfo.rise.grammar.walls, item => {
      // console.log('url: ' + baseUrl + item);
      selectedRoom.get('grammar.walls').pushObject(baseUrl + item);
    });

    this.set('selectedRoom', selectedRoom);
  }.observes('roomInfo'),

  actions: {
    roomClicked(roomName) {
        console.log('Showing results for: ' + roomName);

        let controller = this,
          get = function(aUrl, aCallback) {
            var anHttpRequest = new XMLHttpRequest();
            anHttpRequest.onreadystatechange = function() {
              if (anHttpRequest.readyState == 4 && anHttpRequest.status == 200)
                aCallback(anHttpRequest.responseText);
            }

            anHttpRequest.open("GET", aUrl, true);
            anHttpRequest.send(null);
          };

        // roomName = 'room0';

        // let file = '/duraark-storage/sessions/nygade_1001-fixed/master/Nygade_Scan1001.e57';
        let file = '/duraark-storage/sessions/byg72-2nd-scan_fixed/master/CITA_Byg72_2nd_Scan.e57';

        this.duraark.getRoomInfo(file, roomName).then(function(roomInfo) {
          if (!roomInfo) {
            throw new Error('getRoomInfo result is invalid!');
          }
          let room = Ember.Object.create(roomInfo);
          controller.set('roomInfo', room);
        });

        this.duraark.getRoomX3D(file, roomName).then(function(x3dInfo) {
          if (!x3dInfo) {
            throw new Error('x3d result is invalid!');
          }
          let baseUrl = controller.duraark.getAPIEndpoint('geometricEnrichment');
          controller.set('roomX3DUrl', baseUrl + x3dInfo.url);
        }).catch(err => {
          throw new Error(err);
        });
      },


      backToFloorplan() {
        this.set('selectedRoom', null);
      }
  }
});
