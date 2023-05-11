import _ from 'lodash'

class Greeter {
  constructor(message) {
    this.greeting = message
  }
  greet() {
    return _.join(['Hello ', this.greeting], '')
  }
}

export default Greeter
