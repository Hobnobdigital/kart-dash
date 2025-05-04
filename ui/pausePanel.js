/**
 * PausePanel — lightweight overlay that pauses physics & music.
 */
export default class PausePanel{
    constructor(scene){
        this.scene = scene;
        const { width, height } = scene.scale;

        this.container = scene.add.container(width/2, height/2).setDepth(20).setVisible(false);

        const bg = scene.add.rectangle(0, 0, width*0.65, height*0.4, 0x000000, 0.85);
        const title = scene.add.text(0, -60, 'PAUSED', { fontSize: 42, color:'#ffffff', fontStyle:'bold' }).setOrigin(0.5);
        const resumeBtn = this.createBtn(0, 0, 'Resume', '#00ff00', ()=>this.hide());
        const quitBtn   = this.createBtn(0, 70, 'Quit', '#ff5555', ()=>scene.scene.start('Menu'));

        this.container.add([bg, title, resumeBtn, quitBtn]);

        // Keyboard shortcut
        scene.input.keyboard.on('keydown-P', ()=> this.toggle(), this);
    }

    createBtn(x, y, label, color, cb){
        const txt = this.scene.add.text(x, y, label, { fontSize: 28, color, backgroundColor:'#222', padding:{x:16,y:8} })
                      .setOrigin(0.5).setInteractive({ useHandCursor:true });
        txt.on('pointerup', cb);
        return txt;
    }

    show(){
        this.scene.physics.pause();
        if(this.scene.music) this.scene.music.pause();
        this.container.setVisible(true);
    }
    hide(){
        this.container.setVisible(false);
        this.scene.physics.resume();
        if(this.scene.music) this.scene.music.resume();
    }
    toggle(){
        this.container.visible ? this.hide() : this.show();
    }
}