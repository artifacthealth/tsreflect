import Calculator = require("./calculator");

class CalculatorService implements Calculator {

    add(x: number, y: number): number {

        return x + y;
    }

    subtract(x: number, y: number): number {

        return x - y;
    }

}

export = CalculatorService;