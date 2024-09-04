import java.util.Stack;

public class ExpressionEvaluator {

    private static int gcd(int a, int b) {
        if (b == 0) return a;
        return gcd(b, a % b);
    }

    private static String simplifyFraction(int numerator, int denominator) {
        int gcd = gcd(numerator, denominator);
        if (denominator == 1) return String.valueOf(numerator / gcd);
        return String.format("%s/%s", numerator / gcd, denominator / gcd);
    }

    public static String evaluate(String expression) {
        Stack<Integer> values = new Stack<>();
        Stack<Character> operators = new Stack<>();

        for (int i = 0; i < expression.length(); ++i) {
            char c = expression.charAt(i);

            if (Character.isWhitespace(c)) continue;

            if (Character.isDigit(c)) {
                StringBuilder sb = new StringBuilder();
                while (i < expression.length() && Character.isDigit(expression.charAt(i))) {
                    sb.append(expression.charAt(i++));
                }
                --i;
                values.push(Integer.parseInt(sb.toString()));
            } else if (c == '(') {
                operators.push(c);
            } else if (c == ')') {
                while (operators.peek() != '(') {
                    System.out.println(values);
                    values.push(applyOp(operators.pop(), values.pop(), values.pop()));
                }
                operators.pop();
            } else if ('+' == c || '-' == c || '*' == c || '/' == c) {
                while (!operators.empty() && hasPrecedence(operators.peek(), c))
                    values.push(applyOp(operators.pop(), values.pop(), values.pop()));
                operators.push(c);
            }
        }

        while (!operators.empty())
            values.push(applyOp(operators.pop(), values.pop(), values.pop()));

        int num = values.pop();
        if (values.empty()) return String.valueOf(num);
        int denom = values.pop();
        if (denom == 0) return "ERROR";
        return simplifyFraction(num, denom);
    }

    private static boolean hasPrecedence(char op1, char op2) {
        if ((op1 == '*' || op1 == '/') && (op2 == '+' || op2 == '-')) return false;
        else return true;
    }

    private static int applyOp(char op, int b, int a) {
        switch (op) {
            case '+':
                return a + b;
            case '-':
                return a - b;
            case '*':
                return a * b;
            case '/':
                if (b == 0) return 0;
                return a / b;
        }
        return 0;
    }

    public static void main(String[] args) {
        System.out.println(evaluate("1+5*718")); // 4318
        System.out.println(evaluate("1/(0-5)")); // -1/5
        System.out.println(evaluate("1*(3*4/(8-(7+0)))")); // 12
    }
}
