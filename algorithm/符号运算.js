
// function evaluate(expression) {
//   const stack = [];
//   const values = [];
//   const operators = ['+', '-', '*', '/'];
//   for (let i = 0; i < expression.length; i++) {
//     const char = expression[i];
//     if (/\s/.test(char)) continue;
//     if (char === ')') {
//       while (stack[stack.length - 1] !== '(') {
//         values.push(applyOp(stack.pop(), values.pop(), values.pop()));
//       }
//       stack.pop();
//     } else if (char === '(') {
//       stack.push(char);
//     } else if (!isNaN(parseInt(char))) {
//       let num = '';
//       while (i < expression.length && !isNaN(parseInt(expression[i]))) {
//         num += expression[i++];
//       }
//       i--;
//       values.push(num);
//     } else if (operators.includes(char)) {
//       while (operators.length && precedence(stack[stack.length - 1], char)) {
//         values.push(applyOp(stack.pop(), values.pop(), values.pop()));
//       }
//       stack.push(char);
//     }
//   }
//   while (stack.length) {
//     values.push(applyOp(stack.pop(), values.pop(), values.pop()));
//   }
//   let num = values.pop();
//   if (values.length === 0) {
//     return;
//   }
//   let denom = values.pop();
//   if (denom === 0) {
//     return 'error';
//   }
//   return simplifyFraction(num, denom);
// }

// function simplifyFraction(num, denom) {
//   let gcdVal = gcd(num, denom);
//   if (denom === 1) return (num / gcdVal).toString();
//   return `${num / gcdVal}/${denom / gcdVal}`;
// }
// function gcd(a, b) {
//   if (b === 0) return a;
//   return gcd(b, a % b);
// }
// function precedence(op1, op2) {
//   if ((op1 === '*' || op1 === '/') && (op2 === '+' || op2 === '-'))
//     return false;
//   return true;
// }

// function applyOp(op, b, a) {
//   switch (op) {
//     case '+':
//       return a + b;
//     case '-':
//       return a - b;
//     case '*':
//       return a * b;
//     case '/':
//       return a / b;
//     default:
//       return 0;
//   }
// }

// console.log(evaluate('5*(11+3*4/(2-2*8))'));
// console.log(evaluate('1+5*718'));
// console.log(evaluate('1/(0-5)'));

function gcd(a, b) {
  if (b === 0) return a;
  return gcd(b, a % b);
}

function simplifyFraction(numerator, denominator) {
  let gcdVal = gcd(numerator, denominator);
  if (denominator === 1) return (numerator / gcdVal).toString();
  return `${numerator / gcdVal}/${denominator / gcdVal}`;
}

function evaluate(expression) {
  let values = [];
  let operators = [];

  for (let i = 0; i < expression.length; i++) {
      let c = expression[i];

      if (/\s/.test(c)) continue;

      if (!isNaN(parseInt(c))) {
          let num = '';
          while (i < expression.length && !isNaN(parseInt(expression[i]))) {
              num += expression[i++];
          }
          i--;
          console.log(num);
          values.push(parseInt(num));
      } else if (c === '(') {
          operators.push(c);
      } else if (c === ')') {
          while (operators[operators.length - 1] !== '(') {
            console.log(operators,values);
              values.push(applyOp(operators.pop(), values.pop(), values.pop()));
          }
          operators.pop();
      } else if (['+', '-', '*', '/'].includes(c)) {
          while (operators.length && precedence(c, operators[operators.length - 1]))
              values.push(applyOp(operators.pop(), values.pop(), values.pop()));
          operators.push(c);
      }
  }

  while (operators.length)
      values.push(applyOp(operators.pop(), values.pop(), values.pop()));

  let num = values.pop();
  if (values.length === 0) return num.toString();
  let denom = values.pop();
  if (denom === 0) return "ERROR";
  return simplifyFraction(num, denom);
}

function precedence(op1, op2) {
  if ((op1 === '*' || op1 === '/') && (op2 === '+' || op2 === '-')) return false;
  return true;
}

function applyOp(op, b, a) {
  switch (op) {
      case '+': return a + b;
      case '-': return a - b;
      case '*': return a * b;
      case '/': return a / b;
  }
  return 0;
}

console.log(evaluate("1+5*718")); // 4318
console.log(evaluate("1/(0-5)")); // -1/5
console.log(evaluate("1*(3*4/(8-(7+0)))")); // 12
