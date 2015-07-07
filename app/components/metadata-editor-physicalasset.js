import Ember from 'ember';

var EntryLine = Ember.Object.extend({
  value: null
});

var FormEntry = Ember.Object.extend({
  origKey: null,
  key: null,
  type: null,
  multiples: false,
  values: [],
  newValue: '',
  addLabel: ''
});

export default Ember.Component.extend({
  formDescription: [],

  actions: {
    addItem: function(item) {
      var newValue = item.get('newValue');
      item.set('newValue', '');

      console.log('newValue: ' + newValue);
      item.get('values').pushObject(EntryLine.create({
        value: newValue
      }));
    },

    next: function() {
      var formDescription = this.get('formDescription');
      console.log('form: ' + JSON.stringify(formDescription, null, 4));
    }
  },

  onBuildmChange: function() {
    var da = this.get('buildm'),
      formDescription = [],
      controller = this,
      schemaInfo = this.getSchemaInfo();

      console.log('schemaInfo:\n' +JSON.stringify(schemaInfo, null, 4));

    _.each(da, function(value, key) {

      if (key[0] !== '@') {
        var entry = controller.buildFormDescription(value, key);

        if (entry) {
          formDescription.pushObject(entry);
        }
      }
    });

    this.set('formDescription', formDescription);
  }.observes('buildm').on('init'),

  buildFormDescription: function(value, key) {
    var entry = FormEntry.create({
      origKey: key,
      values: []
    });

    entry.set('key', key.replace('http://data.duraark.eu/vocab/', ''));
    entry.set('type', value[0]['type']);
    entry.set('multiples', false);

    _.each(value, function(item, idx) {
      console.log('key: ' + entry.key + ' | value: ' + item['@value']);

      var v = item['@value'];

      if (v && v !== '') {
        entry.get('values').pushObject(EntryLine.create({
          value: v
        }));
      }
    });

    return entry;
  },

  getSchemaInfo: function(key) {
    var schemaInfo = {};

    var schema = {
      "xs:schema": {
        "-xmlns:xs": "http://www.w3.org/2001/XMLSchema",
        "-xmlns:vc": "http://www.w3.org/2007/XMLSchema-versioning",
        "-elementFormDefault": "qualified",
        "-attributeFormDefault": "unqualified",
        "-vc:minVersion": "1.1",
        "xs:element": {
          "-name": "buildm",
          "xs:annotation": {
            "xs:documentation": "DURAARK - descriptive metadata schema for building information "
          },
          "xs:complexType": {
            "xs:sequence": {
              "xs:element": [{
                "-name": "physicalAsset",
                "xs:annotation": {
                  "xs:documentation": "Descriptive metadata about the tangible building."
                },
                "xs:complexType": {
                  "xs:sequence": {
                    "xs:element": [{
                      "-name": "Identifier",
                      "-type": "xs:string",
                      "-maxOccurs": "unbounded",
                      "xs:annotation": {
                        "xs:documentation": "A nonambiguous reference of the phyiscal asset within a given context."
                      }
                    }, {
                      "-name": "name",
                      "-type": "xs:string",
                      "-maxOccurs": "unbounded",
                      "xs:annotation": {
                        "xs:documentation": "Title or name of the building, usually consisting of a combination of function and location."
                      }
                    }, {
                      "-name": "latitude",
                      "-type": "xs:string",
                      "xs:annotation": {
                        "xs:documentation": "The latitude of the physical asset’s location in decimal degrees."
                      }
                    }, {
                      "-name": "longitude",
                      "-type": "xs:string",
                      "xs:annotation": {
                        "xs:documentation": "The longitutde of the physical asset’s location in decimal degrees."
                      }
                    }, {
                      "-name": "owner",
                      "-type": "xs:string",
                      "-minOccurs": "0",
                      "-maxOccurs": "unbounded",
                      "xs:annotation": {
                        "xs:documentation": "Person or organization who owns the physical asset. The element may be repeated to described different owners."
                      }
                    }, {
                      "-name": "buildingArea",
                      "-type": "xs:string",
                      "-minOccurs": "0",
                      "xs:annotation": {
                        "xs:documentation": "Total floor area inside the building, including the measuring unit."
                      }
                    }, {
                      "-name": "floorCount",
                      "-type": "xs:integer",
                      "-minOccurs": "0",
                      "xs:annotation": {
                        "xs:documentation": "Total number of floors of the physical asset, including basement, sub-basement, ground and top levels."
                      }
                    }, {
                      "-name": "numberOfRooms",
                      "-type": "xs:integer",
                      "-minOccurs": "0",
                      "xs:annotation": {
                        "xs:documentation": "Total number of rooms of the physical asset."
                      }
                    }, {
                      "-name": "function",
                      "-type": "xs:string",
                      "-minOccurs": "0",
                      "-maxOccurs": "unbounded",
                      "xs:annotation": {
                        "xs:documentation": "Current or intended use of the Physical Asset."
                      }
                    }, {
                      "-name": "architecturalStyle",
                      "-type": "xs:string",
                      "-minOccurs": "0",
                      "-maxOccurs": "unbounded",
                      "xs:annotation": {
                        "xs:documentation": "Architectural Style of the Physical Asset."
                      }
                    }, {
                      "-name": "description",
                      "-type": "xs:string",
                      "-minOccurs": "0",
                      "-maxOccurs": "unbounded",
                      "xs:annotation": {
                        "xs:documentation": "A description of the physical asset, e.g. to give historical background or further describe the status."
                      }
                    }, {
                      "-name": "location",
                      "-type": "xs:string",
                      "-minOccurs": "0",
                      "xs:annotation": {
                        "xs:documentation": "A general description of the Physical Asset’s location."
                      }
                    }, {
                      "-name": "streetAddress",
                      "-type": "xs:string",
                      "-minOccurs": "0",
                      "xs:annotation": {
                        "xs:documentation": "The street address corresponding to the Physical Asset."
                      }
                    }, {
                      "-name": "postalCodeStart",
                      "-type": "xs:string",
                      "-minOccurs": "0",
                      "xs:annotation": {
                        "xs:documentation": "The postal code which corresponds to the location of the physical asset. If the physical asset is in a range of postal codes, for example if it describes a large appartment complex which spans over several postal codes, then this element marks the starting value of the postal code range. "
                      }
                    }, {
                      "-name": "postalCodeEnd",
                      "-type": "xs:string",
                      "-minOccurs": "0",
                      "xs:annotation": {
                        "xs:documentation": "If an address of a physical asset spans over several postal codes, e.g. for a large appartment complex, the starting postal code of the range is noted in postalCodeStart and the end of the range is noted in postalCodeEnd. In the case of addresses which just have one postal code, this value is empty."
                      }
                    }, {
                      "-name": "postOfficeBoxNumber",
                      "-type": "xs:string",
                      "-minOccurs": "0",
                      "xs:annotation": {
                        "xs:documentation": "If the mailing address of the physical asset includes a post office box number, this number is described in this field."
                      }
                    }, {
                      "-name": "addressRegion",
                      "-type": "xs:string",
                      "-minOccurs": "0",
                      "xs:annotation": {
                        "xs:documentation": "The region corresponding to the location of the physical asset, such as a state, province or area designation."
                      }
                    }, {
                      "-name": "postalLocality",
                      "-type": "xs:string",
                      "-minOccurs": "0",
                      "xs:annotation": {
                        "xs:documentation": "The town / locality corresponding to the location of the physical asset."
                      }
                    }, {
                      "-name": "architect",
                      "-type": "xs:string",
                      "-minOccurs": "0",
                      "-maxOccurs": "unbounded",
                      "xs:annotation": {
                        "xs:documentation": "The architect(s) of the physical asset."
                      }
                    }, {
                      "-name": "contributor",
                      "-type": "xs:string",
                      "-minOccurs": "0",
                      "-maxOccurs": "unbounded",
                      "xs:annotation": {
                        "xs:documentation": "A person who contributed to the construction of the physical asset, e.g. the structural engineer or stone mason. "
                      }
                    }, {
                      "-name": "startDate",
                      "-type": "xs:integer",
                      "-minOccurs": "0",
                      "xs:annotation": {
                        "xs:documentation": "Year when the construction phase of the physical asset began."
                      }
                    }, {
                      "-name": "completionDate",
                      "-type": "xs:integer",
                      "-minOccurs": "0",
                      "xs:annotation": {
                        "xs:documentation": "Year when the construction phase of the physical asset was completed."
                      }
                    }, {
                      "-name": "constructionTime",
                      "-type": "xs:integer",
                      "-minOccurs": "0",
                      "xs:annotation": {
                        "xs:documentation": "Duration of the construction phase of the physical asset in days."
                      }
                    }, {
                      "-name": "rebuildingDate",
                      "-type": "xs:date",
                      "-minOccurs": "0",
                      "-maxOccurs": "unbounded",
                      "xs:annotation": {
                        "xs:documentation": "Year when the rebuilding date of the physical asset began."
                      }
                    }, {
                      "-name": "modificationDetails",
                      "-type": "xs:string",
                      "-minOccurs": "0",
                      "-maxOccurs": "unbounded",
                      "xs:annotation": {
                        "xs:documentation": "Explanation of the modification of the physical asset."
                      }
                    }, {
                      "-name": "cost",
                      "-type": "xs:double",
                      "-minOccurs": "0",
                      "-maxOccurs": "unbounded",
                      "xs:annotation": {
                        "xs:documentation": "Financial efforts which were needed for realizing the constructino of the physical asset, in USD. "
                      }
                    }, {
                      "-name": "rightsDetails",
                      "-type": "xs:string",
                      "-minOccurs": "0",
                      "-maxOccurs": "unbounded",
                      "xs:annotation": {
                        "xs:documentation": "Information about rights, such as copyrights, license information or regulatory requirements related to the Physical Asset."
                      }
                    }]
                  }
                }
              }, {
                "-name": "digitalObject",
                "-maxOccurs": "unbounded",
                "xs:annotation": {
                  "xs:documentation": "Descriptive metadata about the digital object containing a representation of the physical asset, such as a plan or a scan."
                },
                "xs:complexType": {
                  "xs:sequence": {
                    "xs:element": [{
                      "-name": "Identifier",
                      "-type": "xs:string",
                      "-maxOccurs": "unbounded",
                      "xs:annotation": {
                        "xs:documentation": "A nonambigious reference of the digital object within a given context. Where possible, formal identification systems should be used."
                      }
                    }, {
                      "-name": "creator",
                      "-type": "xs:string",
                      "-maxOccurs": "unbounded",
                      "xs:annotation": {
                        "xs:documentation": "Creator/author of the digital object."
                      }
                    }, {
                      "-name": "name",
                      "-type": "xs:string",
                      "-maxOccurs": "unbounded",
                      "xs:annotation": {
                        "xs:documentation": "The name of the digital object. This may be the file name or reflect on the data which is inside the object."
                      }
                    }, {
                      "-name": "dateCreated",
                      "-type": "xs:dateTime",
                      "xs:annotation": {
                        "xs:documentation": "The date the digital object was created."
                      }
                    }, {
                      "-name": "isPartOf",
                      "-type": "xs:string",
                      "-minOccurs": "0",
                      "-maxOccurs": "unbounded",
                      "xs:annotation": {
                        "xs:documentation": "Links the digital object to an overaching digital object it is a part of, e.g. in the case of plans for different fllors the object may link to an overall plan view of all the physical asset’s rooms. The corresponding overaching object shall be identified through it’s identifier."
                      }
                    }, {
                      "-name": "hasPart",
                      "-type": "xs:string",
                      "-minOccurs": "0",
                      "-maxOccurs": "unbounded",
                      "xs:annotation": {
                        "xs:documentation": "Links the digital object to child objects it may be related to, e.g. in the case of scans of the different floors which the overaching building representation may link to. The children objects sjall be referenced through their identifiers."
                      }
                    }, {
                      "-name": "format",
                      "-type": "xs:string",
                      "-minOccurs": "0",
                      "xs:annotation": {
                        "xs:documentation": "The media type format of the digital object. Recommendation is to use the mime type to fill this value. "
                      }
                    }, {
                      "-name": "hasType",
                      "-type": "xs:string",
                      "-minOccurs": "0",
                      "xs:annotation": {
                        "xs:documentation": "The type of this digital object, e.g. plan or scan."
                      }
                    }, {
                      "-name": "hasFormatDetails",
                      "-type": "xs:string",
                      "-minOccurs": "0",
                      "xs:annotation": {
                        "xs:documentation": "Additional information out the digital object, e.g. it’s encoding or compression information"
                      }
                    }, {
                      "-name": "description",
                      "-type": "xs:string",
                      "-minOccurs": "0",
                      "-maxOccurs": "unbounded",
                      "xs:annotation": {
                        "xs:documentation": "A description of the digital object, e.g. to give information of how and why the object was created."
                      }
                    }, {
                      "-name": "provenance",
                      "-type": "xs:string",
                      "-minOccurs": "0",
                      "-maxOccurs": "unbounded",
                      "xs:annotation": {
                        "xs:documentation": "A statement of any changes in ownership and custody of the digital object since its creation that are significant for its authenticity, integrity, and interpretation."
                      }
                    }, {
                      "-name": "license",
                      "-type": "xs:anyURI",
                      "-minOccurs": "0",
                      "xs:annotation": {
                        "xs:documentation": "A link to the license information to the digital object."
                      }
                    }, {
                      "-name": "unitCode",
                      "-type": "xs:string",
                      "-minOccurs": "0",
                      "xs:annotation": {
                        "xs:documentation": "The unit of measurement given using the UN/CEFACT Common Code (3 characters). This determines in which unit properties corresponding to the Digital Object are entered."
                      }
                    }, {
                      "-name": "levelOfDetail",
                      "-type": "xs:string",
                      "-minOccurs": "0",
                      "xs:annotation": {
                        "xs:documentation": "The level of detail / level of development (LOD) in which the physical asset is described / captured in the digital object. If a standard reference system is used to describe the LOD, the system shall be named with the value. "
                      }
                    }, {
                      "-name": "event",
                      "-type": "xs:string",
                      "-minOccurs": "0",
                      "-maxOccurs": "unbounded",
                      "xs:annotation": {
                        "xs:documentation": "Information for what the digital object was used for, such as in the case of digital objects created for presentations or competitions."
                      }
                    }]
                  }
                }
              }]
            }
          }
        }
      }
    };

    var schemaInfo = {
      digitalObject: {},
      physicalAsset: {}
    };

    var elements = schema['xs:schema']['xs:element']['xs:complexType']['xs:sequence']['xs:element'];
    _.each(elements, function(element) {

            var curElement = element['-name'];

      // console.log('ELEMENT: ' + curElement);

      var si = null;
      if (curElement === 'DigitalObject') {
        si = schemaInfo.digitalObject;
      } else {
        si = schemaInfo.physicalAsset;
      };

      var subels = element['xs:complexType']['xs:sequence']['xs:element'];
      _.each(subels, function(els) {
        var info = {},
        name = els['-name'];

        // info['name'] = els['-name'];
        info['doc'] = els['xs:annotation']['xs:documentation'];
        info['type'] = els['-type'];
        info['minOccurs'] = els['-minOccurs'];
        info['maxOccurs'] = els['-maxOccurs'];

        si[name] = info;

        // console.log('  * ' + els['-name']);
        // console.log('     - doc: ' + els['xs:annotation']['xs:documentation']);
        // console.log('     - type: ' + els['-type']);
        // console.log('     - minOccurs: ' + els['-minOccurs']);
        // console.log('     - maxOccurs: ' + els['-maxOccurs']);
      });
    });

    return schemaInfo;
  },

  extractFromJSONLD: function(value, key) {
    if (key[0] !== '@') {
      var k = key.replace('http://data.duraark.eu/vocab/', ''),
        values = [];

      _.each(value, function(item) {
        console.log('key: ' + k + ' | value: ' + item['@value']);

        var v = item['@value'];

        if (v && v !== '') {
          values.push(v);
        }
      });

      return {
        key: k,
        values: values
      };
    }

    return null;
  }
});
