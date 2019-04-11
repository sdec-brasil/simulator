/* eslint-disable quote-props */
const { cloneDeep } = require('lodash');
const Leite = require('leite');
const bip39 = require('bip39');

const leite = new Leite();

const templateNF = {
  'json': {
    'emissor': '',
    'prestacaoServico': {
      'competencia': '',
      'valorServicos': '',
      'valorDeducoes': '',
      'valorPis': '',
      'valorCofins': '',
      'valorInss': '',
      'valorIr': '',
      'valorCsll': '',
      'outraRetencoes': '',
      'valorTotalTributos': '',
      'descontoIncondicionado': '',
      'descontoCondicionado': '',
      'issRetido': '',
      'responsavelRetencao': '',
      'itemLista': '',
      'codigoCnae': '',
      'codigoTributacaoMunicipio': '',
      'codigoNBS': '',
      'discriminacao': '',
      'exigibilidadeISS': '',
      'numeroProcesso': '',
      'regimeEspecialTributacao': '',
      'optanteSimplesNacional': '',
      'incentivoFiscal': '',
    },
    'tomadorServico': {
      'identificacao': '',
      'nif': '',
      'nomeRazaoSocial': '',
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
    },
    'intermediarioServico': {
      'identificacao': '',
      'nomeRazao': '',
      'cidade': '',
    },
    'construcaoCivil': {
      'codigoObra': '',
      'art': '',
    },
  },
};

// randomReais :: () -> String
const randomReais = () => (Math.random() * 10000).toFixed(2);

// randomInt :: (Int A, Int B) -> (Int C) | A < C < B
const getRandomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

// randomDate :: () -> String
const randomDate = () => leite.pessoa.nascimento({ formato: 'YYYYMMDD' });

// randomItem :: () -> String
const randomItem = () => `${getRandomInt(1, 99)}.${getRandomInt(1, 99)}`;

// randomDiscriminacao :: () -> String
const randomDiscriminacao = () => bip39.generateMnemonic();

// randomMunicipio :: () -> String
const randomMunicipio = () => `${getRandomInt(1000000, 9999999)}`;

// randomCNAE :: () -> String
const randomCNAE = () => `${leite.empresa.cnpj()}`;

// randomNBS :: () -> String
const randomNBS = () => `${leite.pessoa.rg().replace(/./g, '').replace('-', '')}`;

// randomProcesso : () -> String
const randomProcesso = () => `${leite.empresa.cnpj()}`;

// randomPhone :: () -> String
const randomPhone = () => leite.pessoa.rg().replace(/./g, '').replace('-', '');

// makeNotes :: String -> NF Object
exports.n = function makeNotes(addr) {
  const nf = cloneDeep(templateNF);
  nf.json.emissor = addr;
  // Prestação de Serviço: Obrigatórios
  nf.json.prestacaoServico.competencia = randomDate();
  nf.json.prestacaoServico.valorServicos = randomReais();
  nf.json.prestacaoServico.issRetido = `${Math.random() > 0.5 ? '1' : '2'}`;
  nf.json.prestacaoServico.itemLista = randomItem();
  nf.json.prestacaoServico.discriminacao = randomDiscriminacao();
  nf.json.prestacaoServico.codigoTributacaoMunicipio = randomMunicipio();
  nf.json.prestacaoServico.exigibilidadeISS = `${getRandomInt(1, 6)}`;
  nf.json.prestacaoServico.optanteSimplesNacional = `${Math.random() > 0.5 ? '1' : '2'}`;
  nf.json.prestacaoServico.incentivoFiscal = `${Math.random() > 0.5 ? '1' : '2'}`;
  // Prestação de Serviço: Opcionais
  nf.json.prestacaoServico.valorDeducoes = `${Math.random() > 0.5 ? randomReais() : ''}`;
  nf.json.prestacaoServico.valorPis = `${Math.random() > 0.5 ? randomReais() : ''}`;
  nf.json.prestacaoServico.valorCofins = `${Math.random() > 0.5 ? randomReais() : ''}`;
  nf.json.prestacaoServico.valorInss = `${Math.random() > 0.5 ? randomReais() : ''}`;
  nf.json.prestacaoServico.valorIr = `${Math.random() > 0.5 ? randomReais() : ''}`;
  nf.json.prestacaoServico.valorCsll = `${Math.random() > 0.5 ? randomReais() : ''}`;
  nf.json.prestacaoServico.outraRetencoes = `${Math.random() > 0.5 ? randomReais() : ''}`;
  nf.json.prestacaoServico.valorTotalTributos = `${Math.random() > 0.5 ? randomReais() : ''}`;
  nf.json.prestacaoServico.descontoIncondicionado = `${Math.random() > 0.5 ? randomReais() : ''}`;
  nf.json.prestacaoServico.descontoCondicionado = `${Math.random() > 0.5 ? randomReais() : ''}`;
  nf.json.prestacaoServico.responsavelRetencao = `${nf.json.prestacaoServico.issRetido === 1 ? getRandomInt(1, 2) : ''}`;
  nf.json.prestacaoServico.codigoCnae = `${Math.random() > 0.5 ? randomCNAE() : ''}`;
  nf.json.prestacaoServico.codigoNBS = `${Math.random() > 0.5 ? randomNBS() : ''}`;
  nf.json.prestacaoServico.numeroProcesso = `${Math.random() > 0.5 ? randomProcesso() : ''}`;
  nf.json.prestacaoServico.regimeEspecialTributacao = `${Math.random() > 0.5 ? getRandomInt(1, 6) : ''}`;
  // Tomador do Serviço: Opcional
  if (Math.random() > 0.5) {
    nf.json.tomadorServico.identificacao = `${leite.pessoa.rg().replace(/./g, '').replace('-', '')}`;
    nf.json.tomadorServico.nif = '';
    nf.json.tomadorServico.nomeRazaoSocial = `${leite.pessoa.nome()}`;
    nf.json.tomadorServico.logradouroEndereco = `${leite.localizacao.logradouro()}`;
    nf.json.tomadorServico.numeroEndereco = `${getRandomInt(0, 110)}`;
    nf.json.tomadorServico.complementoEndereco = `${leite.localizacao.complemento()}`;
    nf.json.tomadorServico.bairroEndereco = `${leite.localizacao.bairro()}`;
    nf.json.tomadorServico.cidadeEndereco = `${leite.localizacao.cidade()}`;
    nf.json.tomadorServico.estadoEndereco = `${leite.localizacao.estado()}`;
    nf.json.tomadorServico.paisEndereco = '';
    nf.json.tomadorServico.cepEndereco = `${leite.localizacao.cep()}`;
    nf.json.tomadorServico.email = `${leite.pessoa.email()}`;
    nf.json.tomadorServico.telefone = randomPhone();
  }
  if (nf.json.prestacaoServico.responsavelRetencao === 2) {
    nf.json.intermediarioServico.identificacao = `${leite.empresa.cnpj()}`;
    nf.json.intermediarioServico.nomeRazao = `${leite.pessoa.nome({ nomeDoMeio: true })} Razão Social`;
    nf.json.intermediarioServico.cidade = `${leite.localizacao.cidade()}`;
  }
  if (Math.random() > 0.95) {
    nf.json.construcaoCivil.codigoObra = (Math.random() * 100000).toFixed(0);
    nf.json.construcaoCivil.art = (Math.random() * 100000).toFixed(0);
  }
  return nf;
};

exports.m = function makeMeta() {
  const meta = [randomMunicipio(), randomReais(), randomReais(), Math.random().toString(), randomReais()];
  if (Math.random() > 0.9) {
    meta.push(`0x${(Math.random() * 100000).toFixed(0)}${(Math.random() * 100000).toFixed(0)}`);
  }
  return meta;
};
