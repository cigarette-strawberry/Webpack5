
import Greeter from "./greeter";
let greeter = new Greeter("JavaScript!");

let button = document.createElement("button");
button.textContent = "Say Hello";
button.onclick = function () {
    alert(greeter.greet());
};

document.body.appendChild(button);