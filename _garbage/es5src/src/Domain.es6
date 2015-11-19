// creates domain class (group of channels)
'use strict';

import Publication from "Publication";
import Subscription from "Subscription";

import {BUS , CHANNELS} from "symbols"; 
import {MESSAGE_ARGUMENTS} from "messages";


export default class Domain {
  constructor(bus, channels) {
    this[BUS] = bus;
    this[CHANNELS] = channels;
  }
  disable() {
    for (let channel of this[CHANNELS].values()) channel.disable();
    return this;
  }
  enable(value) {
    for (let channel of this[CHANNELS].values()) channel.enable(value);
    return this;
  }
  ensure(value) {
    for (let channel of this[CHANNELS].values()) channel.ensure(value);
    return this;
  }
  preserve(count) {
    for (let channel of this[CHANNELS].values()) channel.preserve(count);
    return this;
  }
  // creates new publication to all this[CHANNELS] in this domain
  publish(data) {
    if (arguments.length) {
      for (let channel of this[CHANNELS].values()) channel.trigger(data);
      return this;
    } else {
      let publication = new Publication(this[BUS]);
      for (let channel of this[CHANNELS].values()) channel.attach(publication);
      return publication;
    }
  }
  // creates subscription to all this[CHANNELS] in this domain
  // every subscriber must be a function
  subscribe(...subscribers) {
    if (!subscribers.length) throw new Error(MESSAGE_ARGUMENTS);
    let subscription = new Subscription(this[BUS], _ArraySlice.call(subscribers));
    for (let channel of this[CHANNELS].values()) channel.attach(subscription);
    return subscription;
  }
  // unsubscribes all subscribers from all this[CHANNELS] in this domain
  unsubscribe(...subscribers) {
    for (let channel of this[CHANNELS].values()) channel.unsubscribe(...subscribers);
    return this;
  }
}