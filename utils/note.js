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

const maybeF = (f, p = 0.5) => {
  if (odds(p)) {
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
          aliqServicos: fake.utils.reais(),
          valIss: fake.utils.reais(),
          valLiquiNfse: fake.utils.reais(),
          valServicos: fake.utils.reais(),
          valDeducoes: fake.utils.reais(),
          issRetido: fake.utils.rad(1, 2),
          itemLista: fake.utils.item(),
          discriminacao: fake.utils.discriminacao(),
          codTributMunicipio: fake.utils.codMunicipio(),
          exigibilidadeISS: fake.utils.rad(1, 6),
          simplesNacional: fake.utils.rad(1, 2),
          incentivoFiscal: fake.utils.rad(1, 2),
          respRetencao: '',
          valPis: maybeF(fake.utils.reais),
          valCofins: maybeF(fake.utils.reais),
          valInss: maybeF(fake.utils.reais),
          valIr: maybeF(fake.utils.reais),
          valCsll: maybeF(fake.utils.reais),
          outrasRetencoes: maybeF(fake.utils.reais),
          valtotalTributos: maybeF(fake.utils.reais),
          descontoIncond: maybeF(fake.utils.reais),
          descontoCond: maybeF(fake.utils.reais),
          codCnae: maybeF(fake.utils.cnae),
          codNBS: maybeF(fake.utils.nbs),
          numProcesso: maybeF(fake.utils.numeroProcesso),
          regimeEspTribut: `${odds() ? fake.utils.rad(1, 6) : ''}`,
        },
        tomador: maybeF(tomador),
        constCivil: maybeF(obra, 0.95),
      },
    };

    let prest = this.note.json.prestacao;

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

    prest.baseCalculo = baseCalculo();
    prest.valLiquiNfse = valLiquiNfse();
    prest

    this.meta = [
      prest.codTributMunicipio,
      prest.valServicos,
      prest.baseCalculo,
      prest.itemLista,
      prest.exigibilidadeISS,
      prest.valIss
    ];
  }

  baseCalculo () {
    let prest = this.note.json.prestacao;
    return (prest.valServicos - prest.valDeducoes - prest.descontoIncond);
  }

  valLiquiNfse () {
    let prest = this.note.json.prestacao;
    return (prest.valServicos - prest.valPis - prest.valCofins - prest.valInss - prest.valIr - prest.valCsll - prest.outrasRetencoes - prest.issRetido - prest.descontoIncond - prest.descontoIncond)
  }
}

module.exports = Nota;
