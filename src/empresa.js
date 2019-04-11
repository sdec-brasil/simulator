import fake from '../utils/fields';

async function getAddress(node) {
  node.getNewAddress().then(addr => addr).catch((err) => {
    throw new Error(err);
  });
}

class Enterprise {
  constructor(node) {
    this.json = {};

    this.json.enderecoBlockchain = undefined;
    this.recordAddress(node);

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

  async recordAddress(node) {
    this.json.enderecoBlockchain = getAddress(node);
  }


  register() {
    this.console.log('oi');
  }

  emit() {
    this.console.log('oi');
  }
}

export default Enterprise;
