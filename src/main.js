/* eslint-disable quote-props */
const Multichain = require('multinodejs');
const fs = require('fs');
const dockers = require('../utils/docker');
const Enterprise = require('./empresa');

const masterPort = 8001;
const masterPassword = 'this-is-insecure-change-it';
const slavePort = 8002;

const streams = ['Registros', 'Sudeste', 'Norte', 'Nordeste', 'Sul'];
const enterprises = [];

const folder = `./notes/${Math.floor(new Date() / 1000)}`;
fs.mkdirSync(folder);

let transactionCounter = 0;
let enterprisesCounter = 0;

// randomInt :: (Int A, Int B) -> (Int C) | A < C < B
const getRandomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

// transactForever :: (Node, Node) ~> transactForever(Node, Node)
function transactForever(master, slave) {
  console.log(`Transações já realizadas: ${transactionCounter}`);
  const timer = Math.random() * 2000;
  setTimeout(async () => {
    const amount = timer / 20000;

    if (amount > 0.05) {
      master.node.send([slave.addr, amount]).catch((err) => {
        console.log(err);
      });
    } else {
      slave.node.send([master.addr, amount]).catch((err) => {
        console.log(err);
      });
    }
    transactionCounter += 1;
    transactForever(master, slave);
  }, timer);
}

// printNotes :: (Node, Node) ~> printNotes(Node, Node)
function printNotes(master, slave) {
  const timer = Math.random() * 2500;
  setTimeout(async () => {
    const { length } = enterprises;
    if (length) {
      console.log('Emitindo nota..');
      const sIndex = getRandomInt(1, 4);
      const eIndex = getRandomInt(0, length - 1);
      enterprises[eIndex].publishNote(folder, streams[sIndex]);
    }
    printNotes(master, slave);
  }, timer);
}

// registerEnterprises :: (Node, Node) ~> registerEnterprises(Node, Node)
function registerEnterprises(master, slave) {
  console.log(`Empresas já registradas: ${enterprisesCounter}`);
  const timer = Math.random() * 15000;
  setTimeout(async () => {
    if (timer > 7250) {
      const enterprise = new Enterprise(master, streams[0]);
      enterprises.push(enterprise);
    } else {
      const enterprise = new Enterprise(slave, streams[0]);
      enterprises.push(enterprise);
    }
    enterprisesCounter += 1;
    registerEnterprises(master, slave);
  }, timer);
}

(async () => {
  let slavePassword = await dockers.exec('docker exec docker-multichain_slavenode_1 cat root/.multichain/MyChain/multichain.conf');
  slavePassword = dockers.extractPassword(slavePassword);

  const slave = {
    node: Multichain({
      port: slavePort,
      host: 'localhost',
      user: 'multichainrpc',
      pass: slavePassword,
    }),
    addr: '',
  };

  slave.addr = ((await slave.node.getAddresses())['0']).toString();

  const master = {
    node: Multichain({
      port: masterPort,
      host: 'localhost',
      user: 'multichainrpc',
      pass: masterPassword,
    }),
    addr: '',
  };

  master.addr = ((await master.node.getAddresses())['0']).toString();

  streams.forEach(async (stream, i) => {
    if (i) {
      try {
        await master.node.create(['stream', stream, { 'restrict': 'onchain' }, { 'funcao': 'Registro de Empresas' }]);
      } catch (e) {
        console.log(e);
      }
    } else {
      try {
        master.node.create(['stream', stream, { 'restrict': 'offchain' }, { 'key1': 'value1' }]);
      } catch (e) {
        console.log(e);
      }
    }
  });

  transactForever(master, slave);
  registerEnterprises(master, slave);
  printNotes(master, slave);
})();
