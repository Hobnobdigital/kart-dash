/**
 * MenuScene — character select & instruction screen.
 */
export default class MenuScene extends Phaser.Scene{
    constructor(){
        super('Menu');
    }

    create(){
        const { width, height } = this.scale;

        // Title
        this.add.text(width/2, height*0.15, 'KART DASH', {
            fontSize: 56, color:'#ffffff', fontStyle:'bold', stroke:'#000', strokeThickness:4
        }).setOrigin(0.5);

        // Characters to pick
        const chars = ['Mario','Luigi','Toad','Princess','Bowser'];
        const spacing = width / (chars.length + 1);

        chars.forEach((name, idx)=>{
            const x = spacing * (idx + 1);
            const y = height * 0.45;
            const sprite = this.add.image(x, y, name).setScale(1.4).setInteractive({ useHandCursor:true });
            this.add.text(x, y + 60, name, { fontSize:18, color:'#ffffff' }).setOrigin(0.5);

            sprite.on('pointerup', ()=>{
                if(this.sound.get('menu_click')) this.sound.play('menu_click');
                this.scene.start('Game', { character: name });
            });
        });

        // Footer instructions
        this.add.text(width/2, height*0.9, 'Tap / Click a kart to start\nPress P to pause in‑game', {
            fontSize: 20, color:'#aaaaaa', align:'center'
        }).setOrigin(0.5);
    }
}
