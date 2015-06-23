import Ember from 'ember';

function _createSipDescriptionFrom(session) {
    return session;
}

export
default Ember.Route.extend({
    model: function() {
        return {
            sessions: [{
                label: 'Haus 30',

                physicalAssets: [{
                    descMD: {
                            Identifier: 'f81d4fae-7dec-11d0-a765-00a0c91e6bf6', // mandatory, exactly one allowed, string
                            name: 'Haus 30', // mandatory, multiple allowed, string
                            latitude: '14', // mandatory, exactly one, string
                            longitude: '43', // mandatory, exactly one, string
                            owner: 'Haus 30 owner', // optional, multiple allowed, string
                            buildingArea: '2943', // optional, exactly one allowed, string                                
                            floorCount: 4, // optional, exactly one allowed, integer                               
                            numberOfRooms: 23, // optional, exactly one allowed, integer                               
                            'function': 'Acts as Haus 30', // optional, multiple allowed, string
                            architecturalStyle: 'Haus 30 style', // optional, multiple allowed, string
                            description: 'The Haus 30', // optional, multiple allowed, string
                            location: 'Haus 30 Strasse 42', // optional, exactly one allowed, string
                            streetAddress: 'Haus 30 Strasse 42' // optional, exactly one allowed, string

                            // TODO: convert remaining properties from XML below:

                            // <xs:element name="postalCodeStart" type="xs:string" minOccurs="0">

                            // </xs:element>
                            // <xs:element name="postalCodeEnd" type="xs:string" minOccurs="0">

                            // </xs:element>
                            // <xs:element name="postOfficeBoxNumber" type="xs:string" minOccurs="0">

                            // </xs:element>
                            // <xs:element name="addressRegion" type="xs:string" minOccurs="0">

                            // </xs:element>
                            // <xs:element name="addressCountry" type="xs:string" minOccurs="0">

                            // </xs:element>
                            // <xs:element name="postalLocality" type="xs:string" minOccurs="0">

                            // </xs:element>
                            // <xs:element name="architect" type="xs:string" minOccurs="0" maxOccurs="unbounded">

                            // </xs:element>
                            // <xs:element name="contributor" type="xs:string" minOccurs="0" maxOccurs="unbounded">

                            // </xs:element>
                            // <xs:element name="startDate" type="xs:integer" minOccurs="0">

                            // </xs:element>
                            // <xs:element name="completionDate" type="xs:integer" minOccurs="0">

                            // </xs:element>
                            // <xs:element name="constructionTime" type="xs:integer" minOccurs="0">

                            // </xs:element>
                            // <xs:element name="rebuildingDate" type="xs:date" minOccurs="0" maxOccurs="unbounded">

                            // </xs:element>
                            // <xs:element name="modificationDetails" type="xs:string" minOccurs="0" maxOccurs="unbounded">

                            // </xs:element>
                            // <xs:element name="cost" type="xs:double" minOccurs="0" maxOccurs="unbounded">

                            // </xs:element>
                            // <xs:element name="rightsDetails" type="xs:string" minOccurs="0" maxOccurs="unbounded">

                            // </xs:element>
                    },
                    digitalObjects: [{
                        label: 'Haus 30',
                        path: '/storage/1234-1234-1234-1234/digitalObjects/haus30.ifc',
                        physicalAssets: [0],
                        techMD: {
                            filename: 'haus30.ifc',
                            size: 592843,
                            type: 'IFC-SPF',
                        },
                        descMD: {
                            Identifier: 'f81d4fae-7dec-11d0-a765-00a0c91e6bf6', // mandatory, exactly one allowed, string
                            name: 'Haus 30' // mandatory, multiple allowed, string
                        },
                        semMD: {
                            candidates: [{}], // TODO
                            seeds: [{}], // TODO
                            selection: [{}] // TODO
                        },
                        derivatives: [{
                            label: 'Difference to: Haus 30 (Scan: 2014-03-22)',
                            path: '/storage/1234-1234-1234-1234/digitalObjects/deviation-2014-03-22.rdf',
                            type: 'difference-detection',
                            techMD: {
                                filename: 'deviation-2014-03-22.rdf',
                                size: 8924,
                                type: 'ifcPCDiff',
                                creator: 'Difference Detection Tool v0.4.3',
                                copyright: 'UBO'
                            }
                        }, {
                            label: 'Registration to: Haus 30 (Scan: 2014-03-22)',
                            path: '/storage/1234-1234-1234-1234/digitalObjects/registraction-2014-03-22.rdf',
                            type: 'registration',
                            techMD: {
                                filename: 'registration-2014-03-22.rdf',
                                size: 384,
                                type: 'ifcPCReg',
                                creator: 'Registration Tool v0.4.3',
                                copyright: 'UBO'
                            }
                        }]
                    }, {
                        label: 'Haus 30',
                        path: '/storage/1234-1234-1234-1234/digitalObjects/haus30.e57',
                        physicalAssets: [0],
                        techMD: {
                            filename: 'haus30.e57',
                            size: 2837423,
                            type: 'E57',
                        },
                        descMD: {
                            creator: 'I Architect'
                        },
                        semMD: {
                            candidates: [{}], // TODO
                            seeds: [{}], // TODO
                            selection: [{}] // TODO
                        },
                        derivatives: [{
                            label: 'Haus 30 (Reconstruction)',
                            path: '/storage/1234-1234-1234-1234/digitalObjects/haus30-reconstruction.ifc',
                            type: 'reconstruction',
                            techMD: {
                                filename: 'haus30-reconstruction.ifc',
                                size: 592243,
                                type: 'IFC-SPF',
                                creator: 'IFC Reconstruction Tool v0.5.0',
                                copyright: 'UBO'
                            }
                        }, {
                            label: 'Haus 30 (with electrical appliances)',
                            path: '/storage/1234-1234-1234-1234/digitalObjects/haus30-electrical-appliances.ifc',
                            type: 'electrical-appliances',
                            techMD: {
                                filename: 'haus30-electrical-appliances.ifc',
                                size: 42523,
                                type: 'IFC-SPF',
                                creator: 'RISE v0.6.1',
                                copyright: 'FhA'
                            }
                        }, {
                            label: 'Difference to: Haus 30 (Scan: 2014-03-22)',
                            path: '/storage/1234-1234-1234-1234/digitalObjects/deviation-2014-03-22.rdf',
                            type: 'difference-detection',
                            techMD: {
                                filename: 'deviation-2014-03-22.rdf',
                                size: 8924,
                                type: 'ifcPCDiff',
                                creator: 'Difference Detection Tool v0.4.3',
                                copyright: 'UBO'
                            }
                        }, {
                            label: 'Registration to: Haus 30 (Scan: 2014-03-22)',
                            path: '/storage/1234-1234-1234-1234/digitalObjects/registraction-2014-03-22.rdf',
                            type: 'registration',
                            techMD: {
                                filename: 'registration-2014-03-22.rdf',
                                size: 384,
                                type: 'ifcPCReg',
                                creator: 'Registration Tool v0.4.3',
                                copyright: 'UBO'
                            }
                        }]
                    }]
                }],

                digitalObjects: [{
                    label: 'Haus 30',
                    path: '/storage/1234-1234-1234-1234/digitalObjects/haus30.ifc',
                    physicalAssets: [0],
                    techMD: {
                        filename: 'haus30.ifc',
                        size: 592843,
                        type: 'IFC-SPF',
                    },
                    descMD: {
                        creator: 'I Architect'
                    },
                    semMD: {
                        candidates: [{}], // TODO
                        seeds: [{}], // TODO
                        selection: [{}] // TODO
                    }
                }, {
                    label: 'Haus 30',
                    path: '/storage/1234-1234-1234-1234/digitalObjects/haus30.e57',
                    physicalAssets: [0],
                    techMD: {
                        filename: 'haus30.e57',
                        size: 2837423,
                        type: 'E57',
                    },
                    descMD: {
                        creator: 'I Architect'
                    },
                    semMD: {
                        candidates: [{}], // TODO
                        seeds: [{}], // TODO
                        selection: [{}] // TODO
                    }
                }]
            }]
        }
    },

    setupController: function(controller, model) {
        this._super(controller, model);

        var session = model.sessions[0];
        var sip = _createSipDescriptionFrom(session);

        controller.set('sip', sip);
    }
});