/* eslint-disable quote-props */
const Multichain = require('multinodejs');
const cp = require('child_process');
const makeEnterprise = require('./makeEnterprise').f;

const masterPort = 8001;
const masterPassword = 'this-is-insecure-change-it';
const slavePort = 8002;

const streams = ['Registros', 'Sudeste', 'Resto'];

let transactionCounter = 0;
let enterprisesCounter = 3;


function exec(command, options = { log: false, cwd: process.cwd() }) {
  if (options.log) console.log(command);

  return new Promise((done, failed) => {
    cp.exec(command, { ...options }, (err, stdout, stderr) => {
      if (err) {
        err.stdout = stdout;
        err.stderr = stderr;
        failed(err);
        return;
      }
      done({ stdout, stderr });
    });
  });
}

function extractPassword(stdout) {
  let response;
  stdout.stdout.split('\n').forEach((val) => {
    const arr = val.split('=');
    if (arr[0] === 'rpcpassword') {
      response = String(arr[1]);
    }
  });
  return response;
}

function makeNote(node) {
}

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
    transactionCounter++;
    transactForever(master, slave);
  }, timer);
}

function printNotes(master, slave) {
  const timer = Math.random() * 2500;
  setTimeout(async () => {
    if (timer > 150) {
      const nf = makeNote(master);
    } else {
      const nf = makeNote(slave);
    }
  }, timer);
}

function registerEnterprises(master, slave) {
  console.log(`Empresas já registradas: ${enterprisesCounter}`);
  const timer = Math.random() * 5000;
  setTimeout(async () => {
    if (timer > 2500) {
      const enterprise = makeEnterprise(master.addr);
      master.node.publish([streams[0], `${enterprise.json.identificacao}`, enterprise])
        .catch(err => console.log(err));
    } else {
      const enterprise = makeEnterprise(slave.addr);
      slave.node.publish([streams[0], `${enterprise.json.identificacao}`, enterprise])
        .catch(err => console.log(err));
    }
    enterprisesCounter++;
    registerEnterprises(master, slave);
  }, timer);
}

(async () => {
  let slavePassword = await exec('docker exec docker-multichain_slavenode_1 cat root/.multichain/MyChain/multichain.conf');
  slavePassword = extractPassword(slavePassword);

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
      master.node.create(['stream', stream, { 'restrict': 'onchain' }, { 'key1': 'value1' }]).catch(e => console.log(e));
    } else {
      master.node.create(['stream', stream, { 'restrict': 'offchain' }, { 'key1': 'value1' }]).catch(e => console.log(e));
    }
  });

  transactForever(master, slave);
  registerEnterprises(master, slave);
  //printNotes(master, slave);
})();
