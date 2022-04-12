import { Controller } from "./Controller.js";

export let controller = new Controller();


document.querySelector('#input-container').addEventListener('submit',(event) => controller.submit(event));