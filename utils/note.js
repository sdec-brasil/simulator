const fake = require('./fields');

const tomador = () => ({
  id: undefined,
  nif: undefined,
  nomeRazao: undefined,
  logEnd: undefined,
  numEnd: undefined,
  compEnd: undefined,
  bairroEnd: undefined,
  cidadeEnd: undefined,
  estadoEnd: undefined,
  paisEnd: undefined,
  cepEnd: undefined,
  email: undefined,
  tel: undefined,
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
  return undefined;
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
          issRetido: String(fake.utils.rad(1, 2)),
          itemLista: fake.utils.item(),
          discriminacao: fake.utils.discriminacao(),
          codMunicipioIncidencia: this.municipio(),
          codServico: String(fake.utils.rad(21, 48)),
          exigibilidadeISS: String(fake.utils.rad(1, 6)),
          simplesNacional: String(fake.utils.rad(1, 2)),
          incentivoFiscal: String(fake.utils.rad(1, 2)),
          respRetencao: undefined,
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
          numProcesso: undefined,
          regimeEspTribut: `${odds() ? fake.utils.rad(1, 6) : undefined}`,
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
      prest.codMunicipioIncidencia,
      prest.valServicos,
      prest.baseCalculo,
      prest.itemLista,
      String(prest.exigibilidadeISS),
      prest.valIss,
    ];
  }

  municipio() {
    // Just to fix 4 cities to test it properly
    const rad = Math.random();
    if (rad > 0.75) {
      return String(8539612);
    } if (rad > 0.5) {
      return String(6593759);
    } if (rad > 0.25) {
      return String(1537967);
    }
    return String(2597738);
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
    const valServ = Number(prest.valServicos);
    const valPis = Number(prest.valPis);
    const valCofins = Number(prest.valCofins);
    const valInss = Number(prest.valInss);
    const valIr = Number(prest.valIr);
    const valCsll = Number(prest.valCsll);
    const outrasRetencoes = Number(prest.outrasRetencoes);
    const issRetido = Number(prest.issRetido);
    const descontoCond = Number(prest.descontoCond);
    const descontoIncond = Number(prest.descontoIncond);
    return `${(valServ - valPis - valCofins - valInss - valIr - valCsll - outrasRetencoes - issRetido - descontoCond - descontoIncond).toFixed(2)}`;
  }
}

module.exports = Nota;
