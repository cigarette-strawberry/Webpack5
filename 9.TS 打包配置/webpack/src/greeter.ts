import * as _ from "lodash"; // 注意这里！

class Greeter {
    greeting: string;
    constructor(message: string) {
        this.greeting = message;
    }
    greet() {
        return _.join(["Hello, ", this.greeting], "");
    }
}

export default Greeter;