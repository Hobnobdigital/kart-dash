/**
 * BootScene — preloads all game assets and transitions to Menu.
 */
export default class BootScene extends Phaser.Scene{
    constructor(){
        super('Boot');
    }

    preload(){
        // Progress bar (simple)
        const { width, height } = this.scale;
        const barBg = this.add.rectangle(width/2, height/2, 320, 40, 0x222222);
        const barFg = this.add.rectangle(width/2 - 150, height/2, 0, 24, 0x00ff00).setOrigin(0,0.5);

        this.load.on('progress', p=> barFg.width = 300 * p);

        /** Sprites ***********************************************************/
        this.load.setPath('assets/sprites');
        ['Mario','Luigi','Toad','Princess','Bowser','obstacle','star','ghost','banana']
            .forEach(key => this.load.image(key, key + '.png'));

        /** Background layers *************************************************/
        this.load.setPath('assets/background');
        ['sky','hills','track'].forEach(key => this.load.image(key, key + '.png'));

        /** UI icons/buttons **************************************************/
        this.load.setPath('assets/ui');
        ['btn_left','btn_right','btn_pause','icon_star','icon_ghost','icon_banana']
            .forEach(key => this.load.image(key, key + '.png'));

        /** Audio *************************************************************/
        this.load.setPath('assets/audio');
        const audioKeys = ['bg1','bg2','bg3','pickup','collision','boost','invincible','skid','menu_click','game_over'];
        audioKeys.forEach(key => this.load.audio(key, [key+'.mp3', key+'.ogg', key+'.wav']));

        // reset path
        this.load.setPath('');

        this.load.on('complete', ()=> {
            barBg.destroy(); barFg.destroy();
            this.scene.start('Menu');
        });
    }

    create(){
        // create is not used; transition happens in load complete
    }
}