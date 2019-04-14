const fake = require('../utils/fields');
const Note = require('../utils/note');

class Enterprise {
  constructor({ node, addr }, stream) {
    this.node = node;
    this.nodeAddr = addr;
    this.registered = false;

    this.json = {};

    this.json.enderecoBlockchain = undefined;
    this.register(stream);

    this.json.razaoSocial = fake.empresa.razaoSocial();
    this.json.nomeFantasia = fake.empresa.nomeFantasia();
    this.json.tipoId = fake.utils.rad(1, 2);

    if (this.json.tipoId === 1) {
      this.json.identificacao = fake.pessoa.identificacao();
    } else {
      this.json.identificacao = fake.empresa.identificacao();
    }

    this.json.logradouroEndereco = fake.logradouro();
    this.json.numeroEndereco = fake.numero();
    this.json.complementoEndereco = fake.complemento();
    this.json.bairroEndereco = fake.bairro();
    this.json.cidadeEndereco = fake.cidade();
    this.json.estadoEndereco = fake.estado();
    this.json.paisEndereco = '';
    this.json.cepEndereco = fake.cep();
    this.json.email = fake.email();
    this.json.telefone = fake.telefone();
  }

  register(stream) {
    this.node.getNewAddress()
      .then((addr) => {
        this.json.enderecoBlockchain = addr;
        return addr;
      }).then((addr) => {
        this.node.publish([stream, [this.json.identificacao, addr], { json: this.json }])
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
    this.node.send([this.json.enderecoBlockchain, 0.1])
      .catch((err) => {
        console.log(`\t Não foi possível reabastecer: ${err}`);
      });
  }

  publishNote(stream) {
    const addr = this.json.enderecoBlockchain;
    const note = new Note(this.json.enderecoBlockchain);

    console.log('\t Registrando Nota');
    this.node.publishFrom([addr, stream, note.meta, note.note, 'offchain'])
      .then(() => console.log('\t Nota registrada')).catch((err) => {
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
