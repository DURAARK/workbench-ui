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

                buildm: [{
                    "@id": "http://data.duraark.eu/resource/ifcspffile_d86c761c42e440659a8a5b945f695b76",
                    "@type": [
                        "http://data.duraark.eu/vocab/IFCSPFFile"
                    ],
                    "http://data.duraark.eu/vocab/actorCount": [{
                        "@value": "0",
                        "@type": "http://www.w3.org/2001/XMLSchema#nonNegativeInteger"
                    }],
                    "http://data.duraark.eu/vocab/authoringTool": [{
                        "@value": "20140606_1530(x64) - Exporter 15.2.0.0 - Alternate UI 15.2.0.0"
                    }, {
                        "@value": "Autodesk Revit 2015 (ENU)"
                    }, {
                        "@value": "The EXPRESS Data Manager Version 5.02.0100.07 : 28 Aug 2013"
                    }],
                    "http://data.duraark.eu/vocab/creator": [{
                        "@value": ""
                    }, {
                        "@value": "Nancy "
                    }],
                    "http://data.duraark.eu/vocab/dateCreated": [{
                        "@value": "2015-01-12T12:04:17"
                    }],
                    "http://data.duraark.eu/vocab/dimensionCount": [{
                        "@value": "3",
                        "@type": "http://www.w3.org/2001/XMLSchema#integer"
                    }],
                    "http://data.duraark.eu/vocab/entityCount": [{
                        "@value": "86",
                        "@type": "http://www.w3.org/2001/XMLSchema#nonNegativeInteger"
                    }],
                    "http://data.duraark.eu/vocab/fileSchema": [{
                        "@value": "IFC2X3"
                    }],
                    "http://data.duraark.eu/vocab/geometricPrecision": [{
                        "@value": "0.01",
                        "@type": "http://www.w3.org/2001/XMLSchema#decimal"
                    }],
                    "http://data.duraark.eu/vocab/hasType": [{
                        "@value": "Model"
                    }],
                    "http://data.duraark.eu/vocab/instanceCount": [{
                        "@value": "5311",
                        "@type": "http://www.w3.org/2001/XMLSchema#nonNegativeInteger"
                    }],
                    "http://data.duraark.eu/vocab/name": [{
                        "@value": "001"
                    }],
                    "http://data.duraark.eu/vocab/optionalAttributesSet": [{
                        "@value": "0.520128179451",
                        "@type": "http://www.w3.org/2001/XMLSchema#double"
                    }],
                    "http://data.duraark.eu/vocab/relationshipCount": [{
                        "@value": "362",
                        "@type": "http://www.w3.org/2001/XMLSchema#nonNegativeInteger"
                    }],
                    "http://data.duraark.eu/vocab/unit": [{
                        "@value": "KILONEWTON"
                    }, {
                        "@id": "http://qudt.org/vocab/unit#Ampere"
                    }, {
                        "@id": "http://qudt.org/vocab/unit#Candela"
                    }, {
                        "@id": "http://qudt.org/vocab/unit#CubicMeter"
                    }, {
                        "@id": "http://qudt.org/vocab/unit#DegreeCelsius"
                    }, {
                        "@id": "http://qudt.org/vocab/unit#Hertz"
                    }, {
                        "@id": "http://qudt.org/vocab/unit#Kilogram"
                    }, {
                        "@id": "http://qudt.org/vocab/unit#Lumen"
                    }, {
                        "@id": "http://qudt.org/vocab/unit#Lux"
                    }, {
                        "@id": "http://qudt.org/vocab/unit#Millimeter"
                    }, {
                        "@id": "http://qudt.org/vocab/unit#Pascal"
                    }, {
                        "@id": "http://qudt.org/vocab/unit#SecondTime"
                    }, {
                        "@id": "http://qudt.org/vocab/unit#SquareMeter"
                    }, {
                        "@id": "http://qudt.org/vocab/unit#Volt"
                    }, {
                        "@id": "http://qudt.org/vocab/unit#Watt"
                    }]
                }, {
                    "@id": "http://data.duraark.eu/resource/physicalasset_d86c761c42e440659a8a5b945f695b76",
                    "@type": [
                        "http://data.duraark.eu/vocab/PhysicalAsset"
                    ],
                    "http://data.duraark.eu/vocab/buildingCount": [{
                        "@value": "1",
                        "@type": "http://www.w3.org/2001/XMLSchema#nonNegativeInteger"
                    }],
                    "http://data.duraark.eu/vocab/columnCount": [{
                        "@value": "0",
                        "@type": "http://www.w3.org/2001/XMLSchema#nonNegativeInteger"
                    }],
                    "http://data.duraark.eu/vocab/componentCount": [{
                        "@value": "129",
                        "@type": "http://www.w3.org/2001/XMLSchema#nonNegativeInteger"
                    }],
                    "http://data.duraark.eu/vocab/doorCount": [{
                        "@value": "17",
                        "@type": "http://www.w3.org/2001/XMLSchema#nonNegativeInteger"
                    }],
                    "http://data.duraark.eu/vocab/floorCount": [{
                        "@value": "2",
                        "@type": "http://www.w3.org/2001/XMLSchema#nonNegativeInteger"
                    }],
                    "http://data.duraark.eu/vocab/identifier": [{
                        "@value": "3OR7OSGkH0PPgAMvHVQLjs"
                    }],
                    "http://data.duraark.eu/vocab/latitude": [{
                        "@value": "42.3582999997",
                        "@type": "http://www.w3.org/TR/xmlschema11-2/#double"
                    }],
                    "http://data.duraark.eu/vocab/longitude": [{
                        "@value": "-71.0602999997",
                        "@type": "http://www.w3.org/TR/xmlschema11-2/#double"
                    }],
                    "http://data.duraark.eu/vocab/name": [{
                        "@value": "001",
                        "@type": "http://schema.org/Text"
                    }],
                    "http://data.duraark.eu/vocab/spaceCount": [{
                        "@value": "0",
                        "@type": "http://www.w3.org/2001/XMLSchema#nonNegativeInteger"
                    }],
                    "http://data.duraark.eu/vocab/streetAddress": [{
                        "@value": "Enter address here"
                    }],
                    "http://data.duraark.eu/vocab/wallCount": [{
                        "@value": "46",
                        "@type": "http://www.w3.org/2001/XMLSchema#nonNegativeInteger"
                    }],
                    "http://data.duraark.eu/vocab/windowCount": [{
                        "@value": "14",
                        "@type": "http://www.w3.org/2001/XMLSchema#nonNegativeInteger"
                    }]
                }],
                physicalAssets: [{
                    digitalObjects: [{
                        label: 'Haus 30',
                        path: '/storage/1234-1234-1234-1234/digitalObjects/haus30.ifc',
                        physicalAssets: [0],
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