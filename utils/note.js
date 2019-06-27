const fake = require('./fields');
const validator = require('../../smartfilters/stream/validateNF');

const tomador = () => ({
  identificacaoTomador: fake.empresa.identificacao(),
  nif: fake.empresa.identificacao(),
  nomeRazaoTomador: fake.empresa.razaoSocial(),
  logEnd: fake.logradouro(),
  numEnd: fake.numero(),
  compEnd: fake.complemento(),
  bairroEnd: fake.bairro(),
  cidadeEnd: fake.cidade(),
  estadoEnd: fake.estado(),
  paisEnd: undefined,
  cepEnd: fake.cep(),
  email: fake.email(),
  tel: undefined,
});

const obra = () => ({
  codObra: fake.utils.obra(),
  art: fake.utils.art(),
});

const odds = (p = 0.5) => Math.random() > p;

const maybeF = (f, o = { p: 0.5 }) => {
  if (odds(o.p)) {
    if (o.min || o.max) {
      return f(o.min, o.max);
    }
    return f();
  }
  return undefined;
};

class Nota {
  constructor(addr) {
    this.note = {
      json: {
        emissor: addr,
        // substitutes: balbalbabla,
        prestacao: {
          optanteSimplesNacional: String(fake.utils.boolean()),
          competencia: fake.utils.date(),
          baseCalculo: fake.utils.reais(),
          aliqServicos: fake.utils.decimal(0, 0.3), // % of tax
          valIss: fake.utils.reais(),
          valLiquiNfse: fake.utils.reais(),
          valServicos: fake.utils.reais(100, 450),
          valDeducoes: fake.utils.reais(0, 10),
          issRetido: fake.utils.boolean(),
          itemLista: fake.utils.item(),
          discriminacao: fake.utils.discriminacao(),
          codTributMunicipio: this.prefeitura(),
          codServico: String(fake.utils.rad(21, 48)),
          exigibilidadeISS: String(fake.utils.rad(1, 6)),
          incentivoFiscal: fake.utils.boolean(),
          respRetencao: undefined,
          valPis: maybeF(fake.utils.reais, { p: 0.5, min: 0, max: 6 }),
          valCofins: maybeF(fake.utils.reais, { p: 0.5, min: 0, max: 3 }),
          valInss: maybeF(fake.utils.reais, { p: 0.5, min: 0, max: 5 }),
          valIr: maybeF(fake.utils.reais, { p: 0.5, min: 0, max: 7 }),
          valCsll: maybeF(fake.utils.reais, { p: 0.5, min: 0, max: 3 }),
          outrasRetencoes: maybeF(fake.utils.reais, { p: 0.5, min: 0, max: 8 }),
          valTotalTributos: maybeF(fake.utils.reais, { p: 0.5, min: 6, max: 14 }),
          descontoIncond: maybeF(fake.utils.reais, { p: 0.5, min: 0, max: 4 }),
          descontoCond: maybeF(fake.utils.reais, { p: 0.5, min: 0, max: 5 }),
          codCnae: maybeF(fake.utils.cnae),
          codNBS: maybeF(fake.utils.nbs),
          numProcesso: undefined,
          regimeEspTribut: maybeF(fake.utils.rad, { p: 0.5, min: 1, max: 6 }),
          prefeituraIncidencia: this.prefeitura(),
        },
        tomador: maybeF(tomador),
        constCivil: maybeF(obra, 0.95),
      },
    };

    const prest = this.note.json.prestacao;

    if (prest.regimeEspTribut !== undefined) {
      prest.regimeEspTribut = String(prest.regimeEspTribut);
    }

    prest.valIss = this.valIss();

    if (prest.exigibilidadeISS === '6' || prest.exigibilidadeISS === '7') {
      prest.numProcesso = fake.utils.numeroProcesso();
    }

    if (prest.issRetido) {
      prest.respRetencao = String(fake.utils.rad(1, 2));
    }

    if (prest.respRetencao === '2') {
      this.note.json.intermediario = {
        identificacaoIntermed: fake.empresa.identificacao(),
        nomeRazaoIntermed: fake.empresa.razaoSocial(),
        cidadeIntermed: fake.cidade(),
      };
    }

    prest.baseCalculo = this.baseCalculo();
    prest.valLiquiNfse = this.valLiquiNfse();

    this.meta = [
      prest.codTributMunicipio,
      prest.valServicos,
      prest.baseCalculo,
      prest.itemLista,
      String(prest.exigibilidadeISS),
      prest.valIss,
    ];
  }

  prefeitura() {
    return String(1100379);
  }

  valIss() {
    const prest = this.note.json.prestacao;
    return `${(parseInt(prest.valServicos, 10) * parseInt(prest.aliqServicos, 10))}`;
  }

  baseCalculo() {
    const prest = this.note.json.prestacao;
    const valServ = prest.valServicos !== undefined ? parseInt(prest.valServicos, 10) : 0;
    const valDeducoes = prest.valDeducoes !== undefined ? parseInt(prest.valDeducoes, 10) : 0;
    const descontoIncond = prest.descontoIncond !== undefined ? parseInt(prest.descontoIncond, 10) : 0;
    return `${(valServ - (valDeducoes + descontoIncond))}`;
  }

  valLiquiNfse() {
    const prest = this.note.json.prestacao;
    const valServ = prest.valServicos !== undefined ? parseInt(prest.valServicos, 10) : 0;
    const valPis = prest.valPis !== undefined ? parseInt(prest.valPis, 10) : 0;
    const valCofins = prest.valCofins !== undefined ? parseInt(prest.valCofins, 10) : 0;
    const valInss = prest.valInss !== undefined ? parseInt(prest.valInss, 10) : 0;
    const valIr = prest.valIr !== undefined ? parseInt(prest.valIr, 10) : 0;
    const valCsll = prest.valCsll !== undefined ? parseInt(prest.valCsll, 10) : 0;
    const outrasRetencoes = prest.outrasRetencoes !== undefined ? parseInt(prest.outrasRetencoes, 10) : 0;
    const issRetido = prest.issRetido ? parseInt(prest.valIss, 10) : 0;
    const descontoCond = prest.descontoCond !== undefined ? parseInt(prest.descontoCond, 10) : 0;
    const descontoIncond = prest.descontoIncond !== undefined ? parseInt(prest.descontoIncond, 10) : 0;
    return `${(
      valServ
      - valPis
      - valCofins
      - valInss
      - valIr
      - valCsll
      - outrasRetencoes
      - issRetido
      - descontoCond
      - descontoIncond
    ).toFixed(2)}`;
  }
}

module.exports = Nota;

// const a = new Nota('ajsdkifowldpsodkenrmqweoiuzj');
// console.log(a.note.json);
// const results = validator.validateNote(a.note.json);
// const falses = {};
// Object.keys(results).forEach((key) => {
//   if (results[key][1] === false) {
//     falses[key] = [results[key][1], results[key][0]];
//   }
// });
// console.log(falses);
// console.log('pref', a.prefeitura());
