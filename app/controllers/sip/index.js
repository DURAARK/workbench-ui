import Ember from 'ember';

function SipGeneratorAPI(sip, store) { // FIXXME: remove Ember.Store dependency!
	this._sip = sip;
	this._store = store;
}

SipGeneratorAPI.prototype.upload = function(finishCB) {
	var session = this._sip,
		store = this._store,
		sip = this._store.createRecord('sip', {
			label: session.label
		}),
		physicalAsset = session.physicalAssets[0],
		digitalObjects = [];

	console.log('Starting archival: ' + session.label);

	sip.set('physicalAsset', physicalAsset);

	sip.save().then(function(sipRecord) {
		console.log('SIP creation job successfully queued');
		finishCB(sipRecord);
	});
};

var _convertFromSession = function(session) {
	var sip = session;
	return sip;
};

export default Ember.Controller.extend({
	actions: {
		archive: function(session) {
			var finishCB = function(sip) {
				console.log('Successfully created SIP: ' + sip.get('label'));
			};

			var sip = _convertFromSession(session);
			var generator = new SipGeneratorAPI(sip, this.store);

			// FIXXME: convert to promise!
			generator.upload(finishCB);
		}
	}

	// TODO: refactor into:
	// onResponse: function() {
	// }
});