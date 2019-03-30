const err = (error) => {
  throw new Error(error);
};

const validAddress = (address) => {
  // spec: https://www.multichain.com/developers/address-key-format/
  // more: https://stackoverflow.com/questions/21559851/bitcoin-address-form-validation-javascript-and-php
  return true;
};

const isDate = (string) => {
  return /(201[0-7]|200[0-9]|[0-1][0-9]{3})(1[0-2]|0[1-9])(3[01]|[0-2][1-9]|[12]0)/.test(string)
};

const isMoney = (string) => {
  return isFloat(string);
};

const isFloat = (string) => {
  var floatRegex = /^-?\d+([.,]?\d+)?$/;
  if (!floatRegex.test(val))
      return false;

  val = parseFloat(val);
  if (isNaN(val))
      return false;
  return true;
};

const isInt = (val) => {
  var intRegex = /^-?\d+$/;
  if (!intRegex.test(val))
      return false;

  var intVal = parseInt(val, 10);
  return parseFloat(val) == intVal && !isNaN(intVal);
}

const validateNotaFiscal = (nota) => {
  const keys = Object.keys(nota);

  if (keys.length > 5) {
    err('A NFSD não pode ter mais que 5 chaves na raíz.');
  }

  if (keys[0] !== 'emissor' || !validAddress(nota.emissor)) {
    err('O primeiro campo da nota é obrigatoriamente para o emissor e corresponde a um endereço válido da rede.');
  }

  if (keys[1] !== 'prestacaoServico') {
    err('O segundo campo da nota é obrigatoriamente identificado como \'prestacaoServico\'');
  }

  const prestacao = nota.prestacaoServico;
  const prestacaoKeys = Object.keys(prestacao);

  if (prestacaoKeys.length > 24 || prestacaoKeys.length < 9) {
    err('A identificação da prestação de serviço tem entre 9 e 24 campos somente.');
  }

  if (!prestacaoKeys.includes('competencia') || isDate(prestacao.competencia)) {
    err('O campo )
  }

};

export default validateNotaFiscal;
