import DS from 'ember-data';

export default DS.Model.extend({
  label: DS.attr('string'),
  path: DS.attr('string'),
  buildm: DS.attr(),

  physicalAsset: DS.belongsTo('physical-assets'),
  derivatives: DS.hasMany('digital-objects'),

  createdAt: DS.attr('date'),
  updatedAt: DS.attr('date')
});
