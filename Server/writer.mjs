import Hyperswarm from 'hyperswarm'
import Hypercore from 'hypercore'
import goodbye from 'graceful-goodbye'
import b4a from 'b4a'

const swarm = new Hyperswarm()
goodbye(() => swarm.destroy())

const core = new Hypercore('./writer-storage')

await core.ready()
console.log('hypercore key:', b4a.toString(core.key, 'hex'))

process.stdin.on('data', data => core.append(data))
const TOPIC='8ad98e1df868c4b6557acf4fee185090fe4f734910f617409a44cf66598aae75'
swarm.join(b4a.from(TOPIC, 'hex'))
swarm.on('connection', (conn) => {
    core.replicate(conn);
    conn.on("error", err=> 
    console.error('socket error', err.code || err.message)
    )
    conn.on('data', function (data) {
        // console.log("data", data, data.toString());
        var message = data.toString();
        // console.log("message", message, message.substring(0, 4) )
        if (message.substring(0,4) =="data"){
            console.log("--", data.toString())
            core.append(message.substring(5));
        }
    })
})