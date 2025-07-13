/**
 * @file Домашка по FP ч. 2
 *
 * Подсказки:
 * Метод get у инстанса Api – каррированый
 * GET / https://animals.tech/{id}
 *
 * GET / https://api.tech/numbers/base
 * params:
 * – number [Int] – число
 * – from [Int] – из какой системы счисления
 * – to [Int] – в какую систему счисления
 *
 * Иногда промисы от API будут приходить в состояние rejected, (прямо как и API в реальной жизни)
 * Ответ будет приходить в поле {result}
 */

import * as R from 'ramda';
import Api from '../tools/api';

const api = new Api();

const validateNumber = R.allPass([
  R.pipe(R.length, R.lt(R.__, 10)),
  R.pipe(R.length, R.gt(R.__, 2)),
  R.test(/^[0-9.]+$/),
  R.pipe(Number, R.lt(0))
]);

const processSequence = ({value, writeLog, handleSuccess, handleError}) => {
  writeLog(value);

  if (!validateNumber(value)) {
    handleError('ValidationError');
    return;
  }

  const num = Math.round(Number(value));
  writeLog(num);

  Promise.resolve(num)
    .then(num => 
      api.get('https://api.tech/numbers/base')({
        from: 10,
        to: 2,
        number: num
      })
    )
    .then(R.prop('result'))
    .then(binary => {
      writeLog(binary);
      return binary.length;
    })
    .then(length => {
      writeLog(length);
      return length * length;
    })
    .then(squared => {
      writeLog(squared);
      return squared % 3;
    })
    .then(async remainder => {
      writeLog(remainder);
      return api.get(`https://animals.tech/${remainder}`)({});
    })
    .then(R.prop('result'))
    .then(handleSuccess)
    .catch(() => handleError('API Error'));
};

export default processSequence;