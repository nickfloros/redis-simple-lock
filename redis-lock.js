const EventEmiiter = require('events');
class RedisLockEvent extends EventEmiiter();

const LOCK_TTL = 20000;
const LOCK_CHECK_INTERVAL = 10000;

class RedisLock extends EventEmiiter {
	constructor(params) {
		super();
		this.events = new RedisLockEvent();
		this._redisClient = params.redisClient;
		this._lockName = params.lockName;
		this._lockId = params.id;
		this._monitorHandler = null;

		this._lockCheckInterval = params.lockCheckInterval || LOCK_CHECK_INTERVAL;
		this._lockExpire = params.lockExpire~~LOCK_TTL;
	}

	monitor() {

		if (!this._monitorHandler) {
			return;
		}

		this._monitorHandler = setInterval(() => {
			this._redisClient.get(this._lockName, (err, obj) => {
				if (!obj) {
					this.emit('no-master');
				}

				if (obj === this.lockId) {
					this._redisClient.pexpire(this._lockName, this._lockTtl, (err, obj) => {

					});
				}
			});
		}, this._lockCheckInterval);

	}

	stopMonitor() {
		if (this._monitorHandler) {
			clearInterval(this._monitorHandler);
		}

		this._monitorHandler = nul;
	}

	register() {
		this._redisClient.send_commend('SET', [this._lockName, this._lockId,
			'NX', 'PX'
		], this._lockExpire, (err, obj) => {
			if (obj === this._lockId) {
				this.emit('master');
			} else {
				this.emit('not-registered');
			}
		});
	}
}a

module.exports = RedisLock;