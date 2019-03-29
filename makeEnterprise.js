/* eslint-disable quote-props */
const { cloneDeep } = require('lodash');
const Leite = require('leite');

const leite = new Leite();

const templateEnterpriseRegistry = {
  'json': {
    'razaoSocial': '',
    'nomeFantasia': '',
    'identificacao': '',
    'logradouroEndereco': '',
    'numeroEndereco': '',
    'complementoEndereco': '',
    'bairroEndereco': '',
    'cidadeEndereco': '',
    'estadoEndereco': '',
    'paisEndereco': '',
    'cepEndereco': '',
    'email': '',
    'telefone': '',
    'enderecoBlockchain': '',
  },
};

function fakePhone() {
  return leite.pessoa.rg().replace('.', '').replace('-', '');
}

exports.f = function makeEnterprise(addr) {
  const enterprise = cloneDeep(templateEnterpriseRegistry);

  enterprise.json.enderecoBlockchain = addr;
  enterprise.json.bairroEndereco = `${leite.localizacao.bairro()}`;
  enterprise.json.cepEndereco = `${leite.localizacao.cep()}`;
  enterprise.json.cidadeEndereco = `${leite.localizacao.cidade()}`;
  enterprise.json.complementoEndereco = `${leite.localizacao.complemento()}`;
  enterprise.json.email = `${leite.pessoa.email()}`;
  enterprise.json.estadoEndereco = `${leite.localizacao.estado()}`;
  enterprise.json.logradouroEndereco = `${leite.localizacao.logradouro()}`;
  enterprise.json.nomeFantasia = `${leite.pessoa.nome({ nomeDoMeioAbreviado: true })} LTDA`;
  enterprise.json.numeroEndereco = `${Math.floor(Math.random() * 20) * 13}`;
  enterprise.json.razaoSocial = `${leite.pessoa.nome({ nomeDoMeio: true })} Razão Social`;
  enterprise.json.telefone = `${fakePhone()}`;
  enterprise.json.identificacao = `${leite.empresa.cnpj()}`;

  return enterprise;
};
