import TouchButtons from '../ui/touchButtons.js';
import PausePanel from '../ui/pausePanel.js';

/**
 * GameScene — endless side‑scrolling runner with power‑ups.
 */
export default class GameScene extends Phaser.Scene{
    constructor(){
        super('Game');
    }

    init(data){
        this.selectedChar = data.character || 'Mario';
    }

    create(){
        const { width, height } = this.scale;

        /*** Background ******************************************************/
        this.sky   = this.add.image(width/2, height/2, 'sky').setDisplaySize(width, height);
        this.hills = this.add.tileSprite(width/2, height*0.75, width, height*0.5, 'hills');
        this.track = this.add.tileSprite(width/2, height*0.9,  width, height*0.2, 'track');

        /*** Lanes & player **************************************************/
        this.lanes = [height*0.55, height*0.68, height*0.81];
        this.currentLane = 1;
        this.player = this.physics.add.image(80, this.lanes[this.currentLane], this.selectedChar).setDepth(1);
        this.player.setCollideWorldBounds(true);

        /*** Groups **********************************************************/
        this.obstacles = this.physics.add.group();
        this.items     = this.physics.add.group();

        /*** Collisions ******************************************************/
        this.physics.add.overlap(this.player, this.obstacles, this.onHit, null, this);
        this.physics.add.overlap(this.player, this.items, this.onPickup, null, this);

        /*** Input ***********************************************************/
        this.cursors = this.input.keyboard.createCursorKeys();
        new TouchButtons(this);
        this.events.on('move-left', ()=>this.changeLane(-1));
        this.events.on('move-right',()=>this.changeLane( 1));

        // Pause panel
        this.pausePanel = new PausePanel(this);

        /*** Mechanics vars **************************************************/
        this.score = 0;
        this.speed = 220;            // base obstacle speed
        this.spawnInterval = 1500;
        this.lastSpawn = 0;
        this.levelTimer = 0;
        this.invincible = false;

        /*** HUD *************************************************************/
        this.hud = this.add.text(12,12,'Score 0',{fontSize:22,color:'#ffffff'}).setDepth(5).setScrollFactor(0);

        /*** Music ***********************************************************/
        this.music = this.sound.add('bg1',{loop:true,volume:0.4});
        this.music.play();
    }

    /* Lane change *********************************************************/
    changeLane(dir){
        this.currentLane = Phaser.Math.Clamp(this.currentLane + dir, 0, this.lanes.length-1);
        this.tweens.add({
            targets:this.player,
            y:this.lanes[this.currentLane],
            duration:130,
            ease:'Sine.easeInOut'
        });
    }

    /* Spawners ************************************************************/
    spawnObstacle(){
        const y = Phaser.Utils.Array.GetRandom(this.lanes);
        const obs = this.physics.add.image(this.scale.width + 60, y, 'obstacle');
        obs.setVelocityX(-this.speed);
        this.obstacles.add(obs);
    }
    spawnItem(){
        const y = Phaser.Utils.Array.GetRandom(this.lanes);
        const types = ['star','ghost','banana'];
        const type = Phaser.Utils.Array.GetRandom(types);
        const itm = this.physics.add.image(this.scale.width + 40, y, type);
        itm.setData('type', type);
        itm.setVelocityX(-this.speed);
        this.items.add(itm);
    }

    /* Main loop ***********************************************************/
    update(time, delta){
        if(this.pausePanel.container.visible) return;

        // Keyboard lane change
        if(Phaser.Input.Keyboard.JustDown(this.cursors.left )) this.changeLane(-1);
        if(Phaser.Input.Keyboard.JustDown(this.cursors.right)) this.changeLane( 1);

        // Spawn loop
        this.lastSpawn += delta;
        this.levelTimer += delta;
        if(this.lastSpawn > this.spawnInterval){
            this.lastSpawn = 0;
            this.spawnObstacle();
            if(Math.random()<0.55) this.spawnItem();
        }

        // Difficulty ramp every 30 s
        if(this.levelTimer > 30000){
            this.levelTimer = 0;
            this.speed += 45;
            this.spawnInterval = Math.max(650, this.spawnInterval - 120);
            // sync velocities
            this.obstacles.children.iterate(o=>o.setVelocityX(-this.speed));
            this.items.children.iterate(i=>i.setVelocityX(-this.speed));
        }

        // Background parallax
        this.hills.tilePositionX += this.speed * delta * 0.0004;
        this.track.tilePositionX += this.speed * delta * 0.0008;

        // Score
        this.score += delta * 0.06;
        this.hud.setText('Score ' + Math.floor(this.score));
    }

    /* Collisions **********************************************************/
    onHit(player, obs){
        if(this.invincible) return;
        this.sound.play('collision');
        this.gameOver();
    }
    onPickup(player, itm){
        const type = itm.getData('type');
        itm.destroy();
        this.sound.play('pickup');

        if(type === 'star'){
            this.player.setTint(0xf39c12);
            this.sound.play('boost');
            this.speed += 160;
            this.time.delayedCall(5000, ()=>{
                this.speed -= 160;
                this.player.clearTint();
            });
        }else if(type === 'ghost'){
            this.invincible = true;
            this.player.setAlpha(0.4);
            this.sound.play('invincible');
            this.time.delayedCall(4000, ()=>{
                this.invincible = false;
                this.player.setAlpha(1);
            });
        }else if(type === 'banana'){
            this.speed = Math.max(120, this.speed - 120);
            this.sound.play('skid');
            this.cameras.main.shake(230, 0.006);
        }

        // re‑sync velocities
        this.obstacles.children.iterate(o=>o.setVelocityX(-this.speed));
        this.items.children.iterate(i=>i.setVelocityX(-this.speed));
    }

    /* End‑game *************************************************************/
    gameOver(){
        this.physics.pause();
        this.music.stop();
        this.sound.play('game_over');
        this.add.text(this.scale.width/2, this.scale.height/2,
            'Game Over', {fontSize:48,color:'#ff0000'}).setOrigin(0.5);
        this.time.delayedCall(2200, ()=> this.scene.start('Menu'));
    }
}