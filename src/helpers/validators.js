import * as R from 'ramda'
/**
 * @file Домашка по FP ч. 1
 *
 * Основная задача — написать самому, или найти в FP библиотеках функции anyPass/allPass
 * Эти функции/их аналоги есть и в ramda и в lodash
 *
 * allPass — принимает массив функций-предикатов, и возвращает функцию-предикат, которая
 * вернет true для заданного списка аргументов, если каждый из предоставленных предикатов
 * удовлетворяет этим аргументам (возвращает true)
 *
 * anyPass — то же самое, только удовлетворять значению может единственная функция-предикат из массива.
 *
 * Если какие либо функции написаны руками (без использования библиотек) это не является ошибкой
 */

// 1. Красная звезда, зеленый квадрат, все остальные белые.
export const validateFieldN1 = ({star, square, triangle, circle}) => {
    if (triangle !== 'white' || circle !== 'white') {
        return false;
    }

    return star === 'red' && square === 'green';
};

// 2. Как минимум две фигуры зеленые.
export const validateFieldN2 = R.pipe(
    R.values,
    R.map(R.equals('green')),
    R.sum,
    R.lte(2)
);

// 3. Количество красных фигур равно кол-ву синих.
export const validateFieldN3 = (props) => {
    const colors = R.values(props);

    const reds = R.filter(R.equals('red'));
    const blues = R.filter(R.equals('blue'));
    
    const counts = (filterFn) => R.length(filterFn(colors));

    return R.equals(counts(reds), counts(blues));
};

// 4. Синий круг, красная звезда, оранжевый квадрат треугольник любого цвета
export const validateFieldN4 = (props) => {
    console.log(props);
    const correctionCheck = R.allPass([
        R.propEq('circle', 'blue'),
        R.propEq('star', 'red'),
        R.propEq('square', 'orange')
    ]);

    return correctionCheck(props);
};

// 5. Три фигуры одного любого цвета кроме белого (четыре фигуры одного цвета – это тоже true).
export const validateFieldN5 = (props) => {
    const colors = R.values(props);
    
    const countColor = color => R.pipe(
        R.filter(R.equals(color)),
        R.length,
        R.lte(3)
    );
    
    return R.anyPass([
        countColor('blue'),
        countColor('red'),
        countColor('orange'),
        countColor('green')
    ])(colors);
};

// 6. Ровно две зеленые фигуры (одна из зелёных – это треугольник), плюс одна красная. Четвёртая оставшаяся любого доступного цвета, но не нарушающая первые два условия
export const validateFieldN6 = (props) => {
    const entries = R.toPairs(props);
    const colors = R.values(props);

    const countColor = (color) => R.filter(R.equals(color), colors).length;
    const hasShapeWithColor = (shape, color) => 
        R.any(([s, c]) => s === shape && c === color, entries);

    return R.allPass([
        () => countColor('green') === 2,
        () => hasShapeWithColor('triangle', 'green'),
        () => countColor('red') === 1
    ])();
};

// 7. Все фигуры оранжевые.
export const validateFieldN7 = (props) => {
    return R.all((color) => color === 'orange')(R.values(props));
};

// 8. Не красная и не белая звезда, остальные – любого цвета.
export const validateFieldN8 = R.pipe(
    R.prop('star'),   
    R.allPass([
        R.complement(R.equals('white')),
        R.complement(R.equals('red'))
    ])
);

// 9. Все фигуры зеленые.
export const validateFieldN9 = (props) => {
    return R.all((color) => color === 'green')(R.values(props));
};

// 10. Треугольник и квадрат одного цвета (не белого), остальные – любого цвета
export const validateFieldN10 = (props) => {
  const triangleColor = props.triangle;
  const squareColor = props.square;

  return R.allPass([
    () => triangleColor === squareColor,           
    () => triangleColor !== 'white',                                             
  ])();
};