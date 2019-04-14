const Leite = require('leite');
const bip39 = require('bip39');

const leite = new Leite();

const utils = {
  randomReais: (min = 10, max = 500) => ((Math.random() * (max - min + 1)) + min).toFixed(2),
  getRandomInt: (min, max) => Math.floor(Math.random() * (max - min + 1)) + min,
  telefone: () => leite.pessoa.rg().replace(/./g, '').replace('-', ''),
  email: () => `${leite.pessoa.email()}`,
  randomDate: () => leite.pessoa.nascimento({ formato: 'YYYYMMDD' }),
  randomItem: () => `${utils.getRandomInt(1, 99)}.${utils.getRandomInt(1, 99)}`,
  randomDiscriminacao: () => bip39.generateMnemonic(),
  randomMunicipio: () => `${utils.getRandomInt(1000000, 9999999)}`,
  randomCNAE: () => `${leite.empresa.cnpj()}`,
  randomNBS: () => `${leite.pessoa.rg().replace(/./g, '').replace('-', '')}`,
  randomProcesso: () => `${leite.empresa.cnpj()}`,
  randomPhone: () => leite.pessoa.rg().replace(/./g, '').replace('-', ''),
  randomHex: () => `0x${(Math.random() * 100000).toFixed(0)}${(Math.random() * 100000).toFixed(0)}`,
  obra: () => (Math.random() * 100000).toFixed(0),
  art: () => (Math.random() * 100000).toFixed(0),
};

const empresa = {
  razaoSocial: () => `${leite.pessoa.nome({ nomeDoMeio: true })} Razão Social`,
  nomeFantasia: () => 'Apenas um Nome Fantasia LTDA',
  identificacao: () => `${leite.empresa.cnpj()}`,
};

const localizacao = {
  logradouro: () => `${leite.localizacao.logradouro()}`,
  bairro: () => `${leite.localizacao.bairro()}`,
  cep: () => `${leite.localizacao.cep()}`,
  cidade: () => `${leite.localizacao.cidade()}`,
  complemento: () => `${leite.localizacao.complemento()}`,
  estado: () => `${leite.localizacao.estado()}`,
  numero: () => `${utils.getRandomInt(0, 450)}`,
};

const pessoa = {
  identificacao: `${leite.pessoa.cpf()}`,
};

const fields = {
  logradouro: localizacao.logradouro,
  bairro: localizacao.bairro,
  cep: localizacao.cep,
  cidade: localizacao.cidade,
  complemento: localizacao.complemento,
  numero: localizacao.numero,
  estado: localizacao.estado,

  email: utils.email,
  telefone: utils.telefone,

  utils: {
    reais: utils.randomReais,
    date: utils.randomDate,
    item: utils.randomItem,
    discriminacao: utils.randomDiscriminacao,
    codMunicipio: utils.randomMunicipio,
    cnae: utils.randomCNAE,
    nbs: utils.randomNBS,
    numeroProcesso: utils.randomProcesso,
    hex: utils.randomHex,
    rad: utils.getRandomInt,
    obra: utils.obra,
    art: utils.art,
  },

  empresa: {
    razaoSocial: empresa.razaoSocial,
    nomeFantasia: empresa.nomeFantasia,
    identificacao: empresa.identificacao,
  },

  pessoa: {
    identificacao: pessoa.identificacao,
  },
};

module.exports = fields;
