/* eslint-disable no-undef */

require('dotenv').config()
const { app, BrowserWindow, ipcMain } = require('electron')
const path = require('path')
const Hypercore = require("hypercore");
const Hyperswarm = require('hyperswarm')
const Hyperbee = require("hyperbee");
const b4a = require('b4a')
const goodbye = require('graceful-goodbye')
const { v4: uuidv4 } = require("uuid");

const conns = []

goodbye(() => swarm.destroy())

const createHyperdrive = async () => {
  const store = new Hypercore("./store", process.env.KEY);
  store.on("ready", async () => {
    // const db = new Hyperbee(store, {
    //   keyEncoding: "utf-8",
    //   valueEncoding: "binary",
    // });
    // await db.ready();
    // global.db = db;
    const foundPeers = store.findingPeers();
    const topic = b4a.from(process.env.TOPIC, 'hex')
    const swarm = new Hyperswarm()
    const discovery = swarm.join(topic, { client: true, server: true })

    discovery.flushed().then(() => {
      console.log("Connected to topic:", topic);
    });
    const window = new BrowserWindow({
      webPreferences: {
        preload: path.join(__dirname) + '/middleware/preload.js',
      },
    })
    swarm.on('connection', (conn) => {
      store.replicate(conn);
      const name = b4a.toString(conn.remotePublicKey, 'hex')
      console.log('*Got Connection:', name, '*')
      conns.push(conn)
      conn.once('close', () => conns.splice(conns.indexOf(conn), 1))
      // conn.on('data', (data) => {
      //   window.webContents.send(
      //     'message:received',
      //     name,
      //     b4a.toString(data, 'utf-8')
      //   )
      // })
    })
    swarm.flush().then(()=> foundPeers());
    await store.update();
    
    ipcMain.on('message:send', async (event, message) => {
      console.log("message", message);
      // const uid = uuidv4();
      // await db.put(uid, JSON.stringify(message));
      for (const conn of conns) {
        conn.write("data:" +message)
      }
    })
  
    // ipcMain.on('message:send', (event, message) =>
    //   window.webContents.send('update-counter', message)
    // )
    window.loadFile(path.join(__dirname) + '/pages/index.html')
    console.log("store's length is ", store.length);
    for await(const block of store.createReadStream({start: 0, live:true})){
      window.webContents.send(
        'message:send',
        'YOU',
        block.toString()
      )
      console.log('block', block.toString());
    }
  })
  // global.drive = drive;
}

app.whenReady().then(async () => {
  // await discovery.flushed()
  // mainWindow()
  createHyperdrive();
})