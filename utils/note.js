const fake = require('./fields');

const tomador = () => ({
  id: '',
  nif: '',
  nomeRazao: '',
  logEnd: '',
  numEnd: '',
  compEnd: '',
  bairroEnd: '',
  cidadeEnd: '',
  estadoEnd: '',
  paisEnd: '',
  cepEnd: '',
  email: '',
  tel: '',
});

const obra = () => ({
  codObra: fake.utils.obra,
  art: fake.utils.art,
});

const odds = (p = 0.5) => Math.random() > p;

const maybeF = (f, o = { p: 0.5 }) => {
  if (odds(o.p)) {
    if (o.min || o.max) {
      return f(o.min, o.max);
    }
    return f();
  }
  return '';
};

class Nota {
  constructor(addr) {
    this.note = {
      json: {
        emissor: addr,
        prestacao: {
          competencia: fake.utils.date(),
          baseCalculo: fake.utils.reais(),
          aliqServicos: fake.utils.reais(0, 0.3),
          valIss: fake.utils.reais(),
          valLiquiNfse: fake.utils.reais(),
          valServicos: fake.utils.reais(100, 450),
          valDeducoes: fake.utils.reais(0, 10),
          issRetido: fake.utils.rad(1, 2),
          itemLista: fake.utils.item(),
          discriminacao: fake.utils.discriminacao(),
          codTributMunicipio: fake.utils.codMunicipio(),
          exigibilidadeISS: fake.utils.rad(1, 6),
          simplesNacional: fake.utils.rad(1, 2),
          incentivoFiscal: fake.utils.rad(1, 2),
          respRetencao: '',
          valPis: maybeF(fake.utils.reais, { p: 0.5, min: 0, max: 6 }),
          valCofins: maybeF(fake.utils.reais, { p: 0.5, min: 0, max: 3 }),
          valInss: maybeF(fake.utils.reais, { p: 0.5, min: 0, max: 5 }),
          valIr: maybeF(fake.utils.reais, { p: 0.5, min: 0, max: 7 }),
          valCsll: maybeF(fake.utils.reais, { p: 0.5, min: 0, max: 3 }),
          outrasRetencoes: maybeF(fake.utils.reais, { p: 0.5, min: 0, max: 8 }),
          valtotalTributos: maybeF(fake.utils.reais, { p: 0.5, min: 6, max: 14 }),
          descontoIncond: maybeF(fake.utils.reais, { p: 0.5, min: 0, max: 4 }),
          descontoCond: maybeF(fake.utils.reais, { p: 0.5, min: 0, max: 5 }),
          codCnae: maybeF(fake.utils.cnae),
          codNBS: maybeF(fake.utils.nbs),
          numProcesso: '',
          regimeEspTribut: `${odds() ? fake.utils.rad(1, 6) : ''}`,
        },
        tomador: maybeF(tomador),
        constCivil: maybeF(obra, 0.95),
      },
    };

    const prest = this.note.json.prestacao;

    prest.valIss = this.valIss();

    if (prest.exigibilidadeISS === 6 || prest.exigibilidadeISS === 7) {
      prest.numProcesso = fake.utils.numeroProcesso();
    }

    if (prest.issRetido === 1) {
      prest.responsavelRetencao = fake.utils.rad(1, 2);
    }

    if (prest.responsavelRetencao === 2) {
      this.note.json.intermediario = {
        id: fake.empresa.identificacao(),
        nomeRazao: fake.empresa.razaoSocial(),
        cidade: fake.cidade(),
      };
    }

    prest.baseCalculo = this.baseCalculo();
    prest.valLiquiNfse = this.valLiquiNfse();

    this.meta = [
      prest.codTributMunicipio,
      prest.valServicos,
      prest.baseCalculo,
      prest.itemLista,
      prest.exigibilidadeISS,
      prest.valIss,
    ];
  }

  valIss() {
    const prest = this.note.json.prestacao;
    return `${(Number(prest.valServicos) * Number(prest.aliqServicos)).toFixed(2)}`;
  }

  baseCalculo() {
    const prest = this.note.json.prestacao;
    return `${(prest.valServicos - prest.valDeducoes - prest.descontoIncond).toFixed(2)}`;
  }

  valLiquiNfse() {
    const prest = this.note.json.prestacao;
    return `${(prest.valServicos - prest.valPis - prest.valCofins - prest.valInss - prest.valIr - prest.valCsll - prest.outrasRetencoes - prest.issRetido - prest.descontoIncond - prest.descontoIncond).toFixed(2)}`;
  }
}

module.exports = Nota;
