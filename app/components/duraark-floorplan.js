import Ember from 'ember';

export default Ember.Component.extend({
  wallConfig: null,
  isRendered: false,

  // FIXXME: refactor into own lib!
  init() {
    this._super();
  },

  didInsertElement: function() {
    if (!this.isRendered && this.wallConfig) {
      this.renderFloorplan(this.wallConfig);
      this.isRendered = true;
    }
  },

  renderFloorplan: function(room) {
    var ROOMS = room,
      that = this;

    // FIXXME: find a better way to bind d3's 'onclick' handler to a function in this
    // component's scope!
    window.__onRoomClick = function(roomName) {
      that.sendAction('roomClicked', roomName);
    };

    var svgContainer = d3.select('#rise-canvas').append("svg")
      .attr("width", ROOMS.width).attr("height", ROOMS.height).attr("id", "svg");

    var rooms = svgContainer.selectAll("polygon")
      .data(ROOMS.ROOMS)
      .enter().append("polygon")
      .attr("points", function(d) {
        return d.points.map(function(d) {
          return d.x + "," + d.y;
        }).join(" ")
      })
      .attr("stroke", "black").attr("stroke-width", 2).attr("fill", "lightgray")
      .attr("onmouseover", "evt.target.setAttribute('opacity', '0.5');")
      .attr("onmouseout", "evt.target.setAttribute('opacity', '1');")
      .attr("onclick", function(d) {
        // FIXXME: find a better way to bind d3's 'onclick' handler to a function in this
        // component's scope!
        return 'window.__onRoomClick("' + d.label + '")';
      });

    var roomnames = svgContainer.selectAll("text")
      .data(ROOMS.ROOMS)
      .enter().append("text")
      .attr("x", function(d) {
        return d.center.x;
      })
      .attr("y", function(d) {
        return d.center.y;
      })
      .attr("style", "font-family:Arial;font-size:10px")
      .attr("text-anchor", "middle")
      .text(function(d) {
        return d.label;
      })
      .attr("onclick", function(d) {
        // FIXXME: find a better way to bind d3's 'onclick' handler to a function in this
        // component's scope!
        return 'window.__onRoomClick("' + d.label + '")';
      });
  },

  actions: {
    clickImage: function(img) {
      var win = window.open(img.src, '_blank');
      win.focus();
    }
  }

});
