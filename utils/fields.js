const leite = require('leite');
const bip39 = require('bip39');

const utils = {
  randomReais: () => (Math.random() * 10000).toFixed(2),
  getRandomInt: (min, max) => Math.floor(Math.random() * (max - min + 1)) + min,
  telefone: () => leite.pessoa.rg().replace(/./g, '').replace('-', ''),
  email: () => `${leite.pessoa.email()}`,
  randomDate: () => leite.pessoa.nascimento({ formato: 'YYYYMMDD' }),
  randomItem: () => `${this.getRandomInt(1, 99)}.${this.getRandomInt(1, 99)}`,
  randomDiscriminacao: () => bip39.generateMnemonic(),
  randomMunicipio: () => `${this.getRandomInt(1000000, 9999999)}`,
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
  nomeFantasia: () => `${leite.pessoa.nome({ nomeDoMeioAbreviado: true })} LTDA`,
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

export default {
  logradouro: () => localizacao.logradouro,
  bairro: () => localizacao.bairro,
  cep: () => localizacao.cep,
  cidade: () => localizacao.cidade,
  complemento: () => localizacao.complemento,
  numero: () => localizacao.numero,
  estado: () => localizacao.estado,

  email: () => utils.email,
  telefone: () => utils.telefone,

  utils: {
    reais: () => utils.randomReais,
    date: () => utils.randomDate,
    item: () => utils.randomItem,
    discriminacao: () => utils.randomDiscriminacao,
    codMunicipio: () => utils.randomMunicipio,
    cnae: () => utils.randomCNAE,
    nbs: () => utils.randomNBS,
    numeroProcesso: () => utils.randomProcesso,
    hex: () => utils.randomHex,
    rad: (a, b) => utils.getRandomInt(a, b),
    obra: () => utils.obra,
    art: () => utils.art,
  },

  empresa: {
    razaoSocial: () => empresa.razaoSocial,
    nomeFantasia: () => empresa.nomeFantasia,
    identificacao: () => empresa.identificacao,
  },
};
