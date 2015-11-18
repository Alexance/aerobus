require('babel-core/register');
let utilities = require('../src/utilities');

let assert = require('chai').assert;
let aerobus = require('../src/Bus').default;


let data = {}, delimiter = '.', trace = (...args) => {}, strategy = 'cycle' | 'random' | 'default' // == '' | undefined


describe('airybus', () => {
	it('should be a function', () => {
		let bus = aerobus(delimiter, trace);		
		assert.isFunction(bus);
	});

	it('should be equal delimiter', () => {
		let bus = aerobus(delimiter, trace);
		assert.strictEqual(bus.delimiter, delimiter);
	});
	it('change delimeter should not throw', () => {
		let bus = aerobus(delimiter, trace);
		assert.ok(bus.delimiter = delimiter);
	});

	it('should be equal trace', () => {
		let bus = aerobus(delimiter, trace);
		assert.strictEqual(bus.trace, trace);
	});
	it('change trace should not throw', () => {
		let bus = aerobus(delimiter, trace);
		assert.ok(bus.trace = trace);
	});


	it('root should return Channel object', () => {
		let bus = aerobus(delimiter, trace);
		assert.ok(utilities.isChannel(bus.root));
	});
	it('change delimeter should throw because bus already is not empty', () => {
		assert.throw(() => {
			let bus = aerobus(delimiter, trace);
			bus.root;
			bus.delimiter = delimiter;
		});
	});
	it('change trace should throw because bus already is not empty', () => {
		assert.throw(() => {
			let bus = aerobus(delimiter, trace);
			bus.root;
			bus.trace = trace;
		});
	});
	it('root parent should return undefined', () => {
		let bus = aerobus(delimiter, trace);
		assert.ok(utilities.isUndefined(bus.root.parent));
	});


	it('root isEnabled should return true default', () => {
		let bus = aerobus(delimiter, trace);
		assert.ok(bus.root.isEnabled);
	});
	it('root disable should return root Channel object', () => {
		let bus = aerobus(delimiter, trace);
		assert.strictEqual(bus.root.disable(), bus.root);
	});
	it('root isEnabled should return false after disable', () => {
		let bus = aerobus(delimiter, trace);
		bus.root.disable()
		assert.notOk(bus.root.isEnabled);
	});
	it('root enable(false) should return root Channel object', () => {
		let bus = aerobus(delimiter, trace);
		assert.strictEqual(bus.root.enable(false), bus.root);
	});
	it('root isEnabled should return false after enable(false)', () => {
		let bus = aerobus(delimiter, trace);
		bus.root.enable(false);
		assert.notOk(bus.root.isEnabled);
	});
	it('root enable(true) should return root Channel object', () => {
		let bus = aerobus(delimiter, trace);
		assert.strictEqual(bus.root.enable(true), bus.root);
	});
	it('root isEnabled should return true after enable(true)', () => {
		let bus = aerobus(delimiter, trace);
		bus.root.enable(true);
		assert.ok(bus.root.isEnabled);
	});


	it('error should return Channel object', () => {
		let bus = aerobus(delimiter, trace);
		assert.ok(utilities.isChannel(bus.error));
	});
	it('error parent should return undefined', () => {
		let bus = aerobus(delimiter, trace);
		assert.ok(utilities.isUndefined(bus.error.parent));
	});


	it('bus(test) should return custom Channel object', () => {
		let bus = aerobus(delimiter, trace);
		assert.ok(utilities.isChannel(bus('test')));
	});
	it('test name should be test', () => {
		let bus = aerobus(delimiter, trace);
		assert.strictEqual(bus('test').name, 'test');
	});
	it('test parent should return root Channel object', () => {
		let bus = aerobus(delimiter, trace);
		assert.strictEqual(bus('test').parent, bus.root);
	});
	it('bus(\'parent.child\').parent.name should return \'parent\' value', () => {
		let bus = aerobus(delimiter, trace);
		assert.strictEqual(bus('parent.child').parent.name, 'parent');
	});


	let invocations = 0, subscriber = (message) => {invocations++;};
	it('bus.root.subscribe(subscriber) should return root Channel object', () => {
		let bus = aerobus(delimiter, trace);
		assert.strictEqual(bus.root.subscribe(subscriber), bus.root);
	}); 
	it('bus.root.subscribers should return array containing subscriber', () => {
		let bus = aerobus(delimiter, trace);
		bus.root.subscribe(subscriber);
		assert.notOk(bus.root.subscribers.indexOf(subscriber) === -1);
	});

	it('bus.root.publish(data) should return root Channel object', () => {
		let bus = aerobus(delimiter, trace);
		bus.root.subscribe(subscriber);
		assert.strictEqual(bus.root.publish(data), bus.root);
	});  
	it('subscriber should be invoked', () => {
		let bus = aerobus(delimiter, trace);
		invocations = 0;
		bus.root.subscribe(subscriber);
		bus.root.publish(data)
		assert.strictEqual(invocations, 1);
	});  

	it('bus.root.unsubscribe(subscriber) should return root Channel object', () => {
		let bus = aerobus(delimiter, trace);
		bus.root.subscribe(subscriber);
		assert.strictEqual(bus.root.unsubscribe(subscriber), bus.root);
	});  
	it('bus.root.subscribers should return array/iterator not containing subscriber', () => {
		let bus = aerobus(delimiter, trace);
		bus.root.subscribe(subscriber);
		bus.root.unsubscribe(subscriber)
		assert.ok(bus.root.subscribers.indexOf(subscriber) === -1);
	});  


	it('bus(\'test1\', \'test2\') should return Domain object', () => {
		let bus = aerobus(delimiter, trace)
		  , domain = bus('test1', 'test2');
		assert.ok(utilities.isDomain(domain));
	});
	it('domain channels should return array of Channel objects', () => {
		let bus = aerobus(delimiter, trace)
		  , domain = bus('test1', 'test2')
		  , channels = domain.channels;
		assert.strictEqual(channels[0], bus('test1'));
		assert.strictEqual(channels[1], bus('test2'));
	});

	it('Domain disable should return Domain object', () => {
		let bus = aerobus(delimiter, trace)
		  , domain = bus('test1', 'test2');
		assert.strictEqual(domain.disable(), domain);
	});
	it('Domain channels isEnabled should return false after disable', () => {
		let bus = aerobus(delimiter, trace)
		  , domain = bus('test1', 'test2');
		domain.disable();
		assert.notOk(bus('test1').isEnabled);
		assert.notOk(bus('test2').isEnabled);
	});
	it('Domain enable(false) should return Domain object', () => {
		let bus = aerobus(delimiter, trace)
		  , domain = bus('test1', 'test2');
		assert.strictEqual(domain.enable(false), domain);
	});
	it('Domain channels isEnabled should return false after enable(false)', () => {
		let bus = aerobus(delimiter, trace)
		  , domain = bus('test1', 'test2');
		domain.enable(false);
		assert.notOk(bus('test1').isEnabled);
		assert.notOk(bus('test2').isEnabled);
	});
	it('Domain enable(true) should return Domain object', () => {
		let bus = aerobus(delimiter, trace)
		  , domain = bus('test1', 'test2');
		assert.strictEqual(domain.enable(true), domain);
	});
	it('Domain channels isEnabled should return true after enable(true)', () => {
		let bus = aerobus(delimiter, trace)
		  , domain = bus('test1', 'test2');
		domain.enable(true);
		assert.ok(bus('test1').isEnabled);
		assert.ok(bus('test2').isEnabled);
	});

	it('domain subscribe should return Domain object', () => {
		let bus = aerobus(delimiter, trace)
		  , domain = bus('test1', 'test2');
		assert.strictEqual(domain.subscribe(subscriber), domain);
	});
	it('Domain channels should return array/iterator containing subscriber', () => {
		let bus = aerobus(delimiter, trace)
		  , domain = bus('test1', 'test2');
		domain.subscribe(subscriber);
		assert.notOk(bus('test1').subscribers.indexOf(subscriber) === -1);
		assert.notOk(bus('test2').subscribers.indexOf(subscriber) === -1);
	});

	it('domain publish should return Domain object', () => {
		let bus = aerobus(delimiter, trace)
		  , domain = bus('test1', 'test2');
		invocations = 0;
		domain.subscribe(subscriber);
		assert.strictEqual(domain.publish(data), domain);
	});
	it('subscriber should be invoked twice', () => {
		let bus = aerobus(delimiter, trace)
		  , domain = bus('test1', 'test2');
		invocations = 0;
		domain.subscribe(subscriber);
		domain.publish(data)
		assert.strictEqual(invocations, 2);
	});	
	it('bus.unsubscribe should return bus function', () => {
		let bus = aerobus(delimiter, trace)
		  , domain = bus('test1', 'test2');
		domain.subscribe(subscriber);
		assert.strictEqual(bus.unsubscribe(subscriber), bus);
	});
	it('channels should return array not containing subscriber', () => {
		let bus = aerobus(delimiter, trace)
		  , domain = bus('test1', 'test2');
		domain.subscribe(subscriber);
		bus.unsubscribe(subscriber)
		assert.ok(bus('test1').subscribers.indexOf(subscriber) === -1);
		assert.ok(bus('test2').subscribers.indexOf(subscriber) === -1);
	});


	let invocations1 = 0, invocations2 = 0, subscriber1 = message => invocations1++, subscriber2 = message => invocations2++
	it('subscribe for same subscribers should return Channel object', () => {
		let bus = aerobus(delimiter, trace);		 
		assert.strictEqual(bus.root.subscribe(subscriber1, subscriber2), bus.root);
	});

	it('publish cyclically should call subscribers cyclically', () => {
		let bus = aerobus(delimiter, trace);
		bus.root.subscribe(subscriber1, subscriber2);
		assert.strictEqual(bus.root.publish(data, 'cyclically'), bus.root);
		assert.ok(invocations1 === 1 && invocations2 === 0);
		assert.strictEqual(bus.root.publish(data), bus.root);
		assert.ok(invocations1 === 1 && invocations2 === 1);
	});

	it('publish randomly should call subscribers randomly', () => {
		invocations1 = 0, invocations2 = 0;
		let bus = aerobus(delimiter, trace);		 
		bus.root.subscribe(subscriber1, subscriber2);
		assert.strictEqual(bus.root.publish(data, 'randomly'), bus.root);
		assert.ok(invocations1 + invocations2 === 1);
		assert.strictEqual(bus.root.publish(data), bus.root);
		assert.ok(invocations1 + invocations2 === 2);
	});

	it('bus channels should return array of channels', () => {
		let bus = aerobus(delimiter, trace);
		bus('test1', 'test2', 'test3');
		bus('test4');
		assert.includeMembers(bus.channels, [bus('root'), bus('test1'), bus('test2'), bus('test3'), bus('test4')]);
	});

	it('channel clear shoud clear subscribers', () => {
		let bus = aerobus(delimiter, trace);
		bus.root.subscribe(subscriber1, subscriber2);
		assert.strictEqual(bus.clear(), bus);
		assert.includeMembers(bus.channels, []);
	});

	it('retentions should work', () => {
		invocations = 0;
		let bus = aerobus(delimiter, trace);
		assert.strictEqual(bus.root.retentions, undefined);
		assert.strictEqual(bus.root.retain(1), bus.root);
		bus.root.publish(data);
		bus.root.subscribe(subscriber);
		assert.strictEqual(invocations, 1);
	});

});