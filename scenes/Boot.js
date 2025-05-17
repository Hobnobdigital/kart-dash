export default class BootScene extends Phaser.Scene{
    constructor(){
        super('Boot');
    }

    preload(){
        console.log("Boot scene preload started");
        
        // Progress bar (simple)
        const { width, height } = this.scale;
        const barBg = this.add.rectangle(width/2, height/2, 320, 40, 0x222222);
        const barFg = this.add.rectangle(width/2 - 150, height/2, 0, 24, 0x00ff00).setOrigin(0,0.5);

        this.load.on('progress', p=> {
            barFg.width = 300 * p;
            console.log(`Loading progress: ${Math.round(p * 100)}%`);
        });
        
        // Add error handling for asset loading
        this.load.on('loaderror', (file) => {
            console.error(`Error loading asset: ${file.src}`);
        });

        /** Sprites ***********************************************************/
        this.load.setPath('assets/sprites');
        // Use lowercase filenames to match actual files
        ['mario','luigi','toad','princess','bowser','obstacle','star','ghost','banana']
            .forEach(key => {
                console.log(`Loading sprite: ${key}`);
                this.load.image(key, key + '.png');
            });

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
            console.log("All assets loaded successfully");
            barBg.destroy(); barFg.destroy();
            this.scene.start('Menu');
        });
    }

    create(){
        console.log("Boot scene create function called");
        // create is not used; transition happens in load complete
    }
}
