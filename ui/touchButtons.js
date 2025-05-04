/**
 * TouchButtons — semi‑transparent left/right tap zones for mobile.
 * Emits `move-left` and `move-right` events on the scene.
 */
export default class TouchButtons{
    constructor(scene){
        this.scene = scene;
        // Exit early if not on a touch device
        if(!scene.sys.game.device.input.touch){ return; }

        const { width, height } = scene.scale;
        const zoneHeight = height * 0.22;   // bottom 22% of screen
        const alpha = 0.25;

        // Draw hint rectangles
        const graphics = scene.add.graphics({ alpha });
        graphics.fillStyle(0xffffff);
        graphics.fillRect(0, height - zoneHeight, width / 2, zoneHeight);
        graphics.fillRect(width / 2, height - zoneHeight, width / 2, zoneHeight);
        graphics.setDepth(5);

        // Add a pointer for multi‑touch safety
        scene.input.addPointer(1);

        // Pointer handler
        scene.input.on('pointerdown', pointer=>{
            if(pointer.y < height - zoneHeight) return; // ignore upper taps
            if(pointer.x < width/2){
                scene.events.emit('move-left');
            }else{
                scene.events.emit('move-right');
            }
        });
    }
}