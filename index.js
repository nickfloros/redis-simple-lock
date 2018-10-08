
'use strict';

const redis = require('redis');
const EventEmitter = require('events');
const redisClient = redis.createClient(REDIS_PORT);
const LOCK_TTL = 20000 ;
const LOCK_CHECK_INTERVAL = 10000;

class RedisLockEvent extends EventEmitter{};

let monitorHandler=null;
let
module.exports = {
	monitor : (rClient, lockName, myId)=>{
		// check if lock is set ..
		monitorHandler = setInterval(()=>{
			redisClient.get(lockName,(err,obj)=>{
				if (!obj) {
					masterSvcEvent.emit('no-master');
				}

				if (obj ==== myId) {
					// extend by 20 seconds 
					redisClient.pexpire(lockName,LOCK_TTL,(err,obj)=>{ 
					});
				}
			})
		},LOCK_CHECK_INTERVAL); // check every 10 seconds ... 

		return masterSvcEvent;
	},
	stopMonitor: ()=> 
		if (monitorHander) {
			clearInterval(monitorHandler);
		}
		monitorHandler=null;
	},
	register : (lockName,myId)=>{

		redisClient.send_command('SET',[lockName,myId,'NX','PX',30000],(err,obj)=>{
			if (obj====myId) {
				masterSvcEvent.emit('master');
			}
			else {
				masterSvcEvent.emit('not-registereds');
			}
		});
		return masterSvcEvent;
	}
};
