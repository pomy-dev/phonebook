import { Realm } from '@realm/react';

export class PhoneObject extends Realm.Object {
  static schema = {
    name: 'PhoneObject',
    embedded: true, // Embedded object (no separate collection)
    properties: {
      phone_type: { type: 'string', default: 'call' },
      number: { type: 'string', default: '' },
    },
  };
}

export class SocialMediaObject extends Realm.Object {
  static schema = {
    name: 'SocialMediaObject',
    embedded: true,
    properties: {
      platform: { type: 'string', default: 'Facebook' },
      link: { type: 'string', default: 'https://facebook.com' },
    },
  };
}

export class WorkingHoursObject extends Realm.Object {
  static schema = {
    name: 'WorkingHoursObject',
    embedded: true,
    properties: {
      day: { type: 'string' },
      time: { type: 'string' },
    },
  };
}

export class TeamMember extends Realm.Object {
  static schema = {
    name: 'TeamMember',
    embedded: true,
    properties: {
      profile_picture: { type: 'string', default: null },
      name: { type: 'string' },
      position: { type: 'string' },
    },
  };
}

export class Review extends Realm.Object {
  static schema = {
    name: 'Review',
    embedded: true,
    properties: {
      name: { type: 'string' },
      review: { type: 'string' },
      rating: { type: 'int', default: 1 },
      date: { type: 'date', default: () => new Date() },
    },
  };
}

export class GeoPoint extends Realm.Object {
  static schema = {
    name: 'GeoPoint',
    embedded: true, // Embedded object (no separate collection)
    properties: {
      type: { type: 'string', default: 'Point' },
      coordinates: { type: 'list', objectType: 'double', default: [0, 0] }, // Array of numbers (longitude, latitude)
    },
  };
}

export class Entity extends Realm.Object {
  static schema = {
    name: 'Entity',
    primaryKey: 'company_name',
    properties: {
      company_name: { type: 'string', indexed: true },
      view: { type: 'int', default: 0 },
      company_type: { type: 'string', default: 'Government' },
      company_tags: { type: 'list', objectType: 'string', default: [] },
      subscription_type: { type: 'string', default: 'Bronze' },
      description: { type: 'string', optional: true, default: null },
      phone: { type: 'list', objectType: 'PhoneObject', default: [] },
      address: { type: 'string', optional: true, default: null },
      address_coordinates: { type: 'object', objectType: 'GeoPoint', default: { type: 'Point', coordinates: [0, 0] } }, // Use GeoPoint schema
      email: { type: 'string', optional: true, default: null },
      logo: { type: 'string', optional: true, default: null },
      banner: { type: 'string', optional: true, default: null },
      large_description: { type: 'string', optional: true, default: null },
      social_media: { type: 'list', objectType: 'SocialMediaObject', default: [] },
      working_hours: { type: 'list', objectType: 'WorkingHoursObject', default: [] },
      team: { type: 'list', objectType: 'TeamMember', default: [] },
      gallery: { type: 'list', objectType: 'string', default: [] },
      publications: { type: 'list', objectType: 'objectId', default: [] },
      promotions: { type: 'list', objectType: 'objectId', default: [] },
      services: { type: 'list', objectType: 'string', default: [] },
      reviews: { type: 'list', objectType: 'Review', default: [] },
      created_at: { type: 'date', default: () => new Date() },
      paid: { type: 'bool', default: false },
      paid_at: { type: 'date', optional: true, default: null },
      updated_at: { type: 'date', optional: true, default: null },
    },
  };
}