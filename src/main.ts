import { Simulation } from './simulation'
import './style.scss'

let simulation = new Simulation();
simulation.init();
document.getElementsByTagName("main")[0].style.opacity = "1";
