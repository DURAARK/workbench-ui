import Ember from 'ember';

export default Ember.Component.extend({
  e57Metadata: null,
  wallConfig: null,

  init: function() {
    console.log('onInit');

  }.on('init'),

  didInsertElement: function() {
    let that = this;
    this.addGeoFunctions();

    Ember.$.get('/assets/bygade/wall.json').then(function(response) {
      that.wallConfig = response;
      that.render(that.wallConfig);
    });
  },

  render: function(wallConfig) {
    // create floor plan: process wall jsons
    var ROOMS = [];
    var room2wall = {};

    _.forEach(wallConfig.Walls, function(wall) {
      // build room->walls index
      if (!room2wall[wall.attributes.roomid])
        room2wall[wall.attributes.roomid] = [];

      room2wall[wall.attributes.roomid].push(wall);
    });

    var totalbb = new AABB();
    for (var roomid in room2wall) {
      // create new room
      var room = {
          "label": roomid,
          "center": new Vec2(),
          "walls": [],
          "points": []
        }
        // get ordered wall cycle
      var unordered = room2wall[roomid].slice(),
        ordered = [];

      while (unordered.length > 0) {
        var nocycle = true;
        if (ordered.length == 0) {
          // start with any element
          ordered.push(unordered.pop());
        } else {
          var current = ordered[ordered.length - 1];
          // find element "right" to the current one
          for (var i in unordered) {
            if (unordered[i].left == current.right) {
              ordered.push(unordered[i]);
              unordered.splice(i, 1);
              nocycle = false;
              break;
            }
          }
          if (nocycle) {
            console.log("error: non-closing cycle!");
            ordered.push(unordered.pop());
          }
        }
      }
      room.walls = ordered;

      // extract vertices for ordered wall cycle
      _.forEach(room.walls, function(wall) {
        var v = new Vec2(wall.attributes.origin[0], wall.attributes.origin[1]);
        totalbb.insert(v.x, v.y);
        room.points.push(v);
      });

      // calculate center
      var roombb = new AABB();
      room.points.forEach(function(p) {
        roombb.insert(p.x, p.y);
      });
      room.center = roombb.center();

      ROOMS.push(room);
    }
    console.log("total bounding box:" + totalbb);

    // scale points
    var aspect = totalbb.width() / totalbb.height();
    var TARGET_WIDTH = 500;
    var TARGET_HEIGHT = TARGET_WIDTH / aspect;
    var scale = function(v, bb) {
      v.x = (v.x - totalbb.bbmin.x) * TARGET_WIDTH / totalbb.width();
      v.y = (v.y - totalbb.bbmin.y) * TARGET_WIDTH / totalbb.width();
    }

    _.forEach(ROOMS, function(room) {
      for (var p in room.points) {
        scale(room.points[p]);
      }
      scale(room.center);
    });

    //The SVG Container
    var svgContainer = d3.select('#rise-canvas').append("svg")
      .attr("width", TARGET_WIDTH)
      .attr("height", TARGET_HEIGHT);

    var rooms = svgContainer.selectAll("polygon")
      .data(ROOMS)
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
        return "alert('" + d.label + "');";
      });

    var roomnames = svgContainer.selectAll("text")
      .data(ROOMS)
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
        return "alert('" + d.label + "');";
      });

    console.log(roomnames);
  },

  addGeoFunctions: function() {
    function Vec2(x, y) {
      this.x = x !== undefined ? x : 0;
      this.y = y !== undefined ? y : 0;
    }
    Vec2.prototype.add = function(other) {
      return new Vec2(this.x + other.x, this.y + other.y);
    };
    Vec2.prototype.sub = function(other) {
      return new Vec2(this.x - other.x, this.y - other.y);
    };
    Vec2.prototype.mul = function(scalar) {
      return new Vec2(this.x * scalar, this.y * scalar);
    };
    Vec2.prototype.length = function() {
      return Math.sqrt(this.x * this.x + this.y * this.y);
    };
    Vec2.prototype.equals = function(other) {
      return (this.x == other.x && this.y == other.y && this.wallid == other.wallid);
    };
    Vec2.prototype.toString = function() {
      return "[" + this.x + "," + this.y + "]";
    }

    function AABB(bbmin, bbmax) {
      this.bbmin = bbmin !== undefined ? bbmin : new Vec2(Number.MAX_VALUE, Number.MAX_VALUE);
      this.bbmax = bbmax !== undefined ? bbmax : new Vec2(Number.MIN_VALUE, Number.MIN_VALUE);
    }
    AABB.prototype.insert = function(x, y) {
      if (x < this.bbmin.x) this.bbmin.x = x;
      if (x > this.bbmax.x) this.bbmax.x = x;
      if (y < this.bbmin.y) this.bbmin.y = y;
      if (y > this.bbmax.y) this.bbmax.y = y;
    };
    AABB.prototype.isInside = function(v) {
      return (v.x >= this.bbmin.x && v.x <= this.bbmax.x && v.y >= this.bbmin.y && v.y <= this.bbmax.y);
    };
    AABB.prototype.width = function() {
      return this.bbmax.x - this.bbmin.x;
    };
    AABB.prototype.height = function() {
      return this.bbmax.y - this.bbmin.y;
    };
    AABB.prototype.center = function() {
      return new Vec2((this.bbmin.x + this.bbmax.x) / 2.0, (this.bbmin.y + this.bbmax.y) / 2.0);
    }
    AABB.prototype.toString = function() {
        return this.bbmin.toString() + "--" + this.bbmax.toString();
      }
      //-----------------------------------------------------------------------------------

    window.Vec2 = Vec2;
    window.AABB = AABB;
  },

  actions: {
    clickImage: function(img) {
      var win = window.open(img.src, '_blank');
      win.focus();
    }
  }

});
