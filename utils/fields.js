const leite = require('leite');

// randomInt :: (Int A, Int B) -> (Int C) | A < C < B
const getRandomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

const telefone = () => leite.pessoa.rg().replace(/./g, '').replace('-', '');

const email = () => `${leite.pessoa.email()}`;

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

  numero: () => `${getRandomInt(0, 450)}`,
};


export default {
  logradouro: () => localizacao.logradouro,
  bairro: () => localizacao.bairro,
  cep: () => localizacao.cep,
  cidade: () => localizacao.cidade,
  complemento: () => localizacao.complemento,
  numero: () => localizacao.numero,
  estado: () => localizacao.estado,

  email: () => email,
  telefone: () => telefone,

  empresa: {
    razaoSocial: () => empresa.razaoSocial,
    nomeFantasia: () => empresa.nomeFantasia,
    identificacao: () => empresa.identificacao,
  },
};
