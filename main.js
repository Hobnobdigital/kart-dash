import BootScene from './scenes/Boot.js';
import MenuScene from './scenes/Menu.js';
import GameScene from './scenes/Game.js';

const config = {
    type: Phaser.AUTO,
    parent: 'gameContainer',
    width: 480,
    height: 800,
    backgroundColor: '#000000',
    scale: { mode: Phaser.Scale.FIT, autoCenter: Phaser.Scale.CENTER_BOTH },
    physics: { default: 'arcade', arcade: { debug: false } },
    scene: [BootScene, MenuScene, GameScene]
};

window.addEventListener('load', ()=> new Phaser.Game(config));