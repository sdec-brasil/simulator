const fs = require('fs');
const fake = require('../utils/fields');
const Note = require('../utils/note');

const maybeF = (f) => {
  if (Math.random() > 0.5) {
    return f();
  }
  return undefined;
};

class Enterprise {
  constructor({ node, addr }, stream) {
    this.node = node;
    this.nodeAddr = addr;
    this.registered = false;

    this.json = {};

    this.json.endBlock = undefined;
    this.register(stream);

    this.json.razao = fake.empresa.razaoSocial();
    this.json.fantasia = fake.empresa.nomeFantasia();
    this.json.tipoId = fake.utils.rad(1, 2);

    if (this.json.tipoId === 1) {
      this.json.id = fake.pessoa.identificacao();
    } else {
      this.json.id = fake.empresa.identificacao();
    }

    this.json.logEnd = fake.logradouro();
    this.json.numEnd = fake.numero();
    this.json.compEnd = fake.complemento();
    this.json.bairroEnd = fake.bairro();
    this.json.cidadeEnd = fake.utils.codMunicipio();
    this.json.estadoEnd = fake.estado();
    this.json.paisEnd = '';
    this.json.cepEnd = fake.cep();
    this.json.email = maybeF(fake.email);
    this.json.tel = maybeF(fake.telefone);
  }

  register(stream) {
    this.node.getNewAddress()
      .then((addr) => {
        this.json.endBlock = addr;
        return addr;
      }).then((addr) => {
        this.node.publish([stream, [this.json.id, addr], { json: this.json }])
          .then(() => {
            this.registered = true;
            console.log('Empresa registrada');
          }).catch(err => console.log(err));
      })
      .catch((err) => {
        throw new Error(err);
      });
  }

  fund() {
    console.log('\t Reabastecendo Empresa');
    this.node.send([this.json.endBlock, 0.1])
      .catch((err) => {
        console.log(`\t Não foi possível reabastecer: ${err}`);
      });
  }

  publishNote(folder, stream) {
    const addr = this.json.endBlock;
    const note = new Note(this.json.endBlock);

    console.log('\t Registrando Nota');
    this.node.publishFrom([addr, stream, note.meta, note.note, 'offchain'])
      .then((txid) => {
        const json = JSON.stringify(note);
        fs.writeFile(`${folder}/${txid}.json`, json, 'utf8', () => {
          console.log(`\t Nota registrada | txid: ${txid}`);
        });
      }).catch((err) => {
        if (err.code === -716 || err.code === -6) {
          console.log('\t Nota não emitida por falta de fundos, recargando carteira...');
          this.fund();
        } else {
          console.log(err);
          throw new Error('#publishNote Err');
        }
      });
  }
}

module.exports = Enterprise;
