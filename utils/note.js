/* eslint-disable quote-props */
import fake from './fields';

const tomador = () => ({
  identificacao: '',
  nif: '',
  nomeRazaoSocial: '',
  logradouroEndereco: '',
  numeroEndereco: '',
  complementoEndereco: '',
  bairroEndereco: '',
  cidadeEndereco: '',
  estadoEndereco: '',
  paisEndereco: '',
  cepEndereco: '',
  email: '',
  telefone: '',
});

const obra = () => ({
  codigoObra: fake.utils.obra,
  art: fake.utils.art,
});

const odds = (p = 0.5) => Math.random() > p;

const maybeF = (f, p = 0.5) => {
  if (odds(p)) {
    return f();
  }
  return '';
};

export default enterprise => ({
  meta: [
    fake.utils.codMunicipio, fake.utils.reais,
    fake.utils.reais, fake.utils.reais,
    fake.utils.reais, fake.utils.hex],

  note: {
    json: {
      emissor: enterprise.addr,
      prestacaoServico: {
        competencia: fake.utils.date(),
        valorServicos: fake.utils.reais(),
        valorDeducoes: fake.utils.reais(),
        issRetido: fake.rad(1, 2),
        itemLista: fake.utils.item(),
        discriminacao: fake.utils.discriminacao(),
        codigoTributacaoMunicipio: fake.utils.codMunicipio(),
        exigibilidadeISS: fake.utils.rad(1, 6),
        optanteSimplesNacional: fake.utils.rad(1, 2),
        incentivoFiscal: fake.utils.rad(1, 2),

        valorPis: maybeF(fake.utils.reais),
        valorCofins: maybeF(fake.utils.reais),
        valorInss: maybeF(fake.utils.reais),
        valorIr: maybeF(fake.utils.reais),
        valorCsll: maybeF(fake.utils.reais),
        outraRetencoes: maybeF(fake.utils.reais),
        valorTotalTributos: maybeF(fake.utils.reais),
        descontoIncondicionado: maybeF(fake.utils.reais),
        descontoCondicionado: maybeF(fake.utils.reais),
        responsavelRetencao: `${this.note.json.prestacaoServico.issRetido === 1 ? fake.utils.rad(1, 2) : ''}`,
        codigoCnae: maybeF(fake.utils.cnae),
        codigoNBS: maybeF(fake.utils.nbs),
        numeroProcesso: maybeF(fake.utils.numeroProcesso),
        regimeEspecialTributacao: `${odds() ? fake.rad(1, 6) : ''}`,
      },
      tomadorServico: maybeF(tomador),
      intermediarioServico: {
        identificacao: `${this.note.json.prestacaoServico.responsavelRetencao === 2 ? fake.empresa.identificacao() : ''}`,
        nomeRazao: `${this.note.json.prestacaoServico.responsavelRetencao === 2 ? fake.empresa.razaoSocial() : ''}`,
        cidade: `${this.note.json.prestacaoServico.responsavelRetencao === 2 ? fake.cidade() : ''}`,
      },
      construcaoCivil: maybeF(obra, 0.95),
    },
  },
});
