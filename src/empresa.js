import fake from '../utils/fields';

async function getAddress() {
  this.node.getNewAddress().then((addr) => {
    this.json.enderecoBlockchain = addr;
  }).catch((err) => {
    throw new Error(err);
  });
}

class Enterprise {
  constructor(node) {
    this.node = node;
    this.registered = false;

    this.json = {};

    this.json.enderecoBlockchain = undefined;
    this.recordAddress();

    this.json.razaoSocial = fake.empresa.razaoSocial();
    this.json.nomeFantasia = fake.empresa.nomeFantasia();
    this.json.identificacao = fake.empresa.identificacao();
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

  async recordAddress() {
    try {
      await getAddress.bind(this)();
    } catch (err) {
      throw new Error(err);
    }
  }

  register(stream) {
    this.node.publish(stream, `${this.json.identificacao}`, { json: this.json })
      .then(() => {
        this.registered = true;
      })
      .catch(err => console.log(err));
  }

  emit() {
    this.console.log('oi');
  }
}

export default Enterprise;
