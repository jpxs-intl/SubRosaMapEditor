import * as THREE from 'three';
import { MeshBasicMaterial } from 'three';
import Main from '../main';

export default class MouseCastHandler {

    public static canvas = document.getElementById('c') as HTMLCanvasElement;
    public static raycaster = new THREE.Raycaster();
    public static mouse = new THREE.Vector2();
    public static lastMosePosition = new THREE.Vector2();

    private static _debugSphere: THREE.Mesh = new THREE.Mesh(
        new THREE.SphereGeometry(5, 32, 32),
        new THREE.MeshBasicMaterial({ color: 0xff0000 })
    );

    public static getMousePosition(event: MouseEvent): THREE.Vector2 {
        const rect = MouseCastHandler.canvas.getBoundingClientRect();
        MouseCastHandler.mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
        MouseCastHandler.mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
        return MouseCastHandler.mouse;
    }

    public static castMousePosition(event: MouseEvent): THREE.Intersection[] {
        MouseCastHandler.getMousePosition(event);
        MouseCastHandler.raycaster.setFromCamera(MouseCastHandler.mouse, Main.camera);
        return MouseCastHandler.raycaster.intersectObjects(Main.scene.children);
    }

    public static init() {

        MouseCastHandler.canvas.addEventListener('mousemove', (event) => {
            const intersections = MouseCastHandler.castMousePosition(event);
            if (intersections.length > 0) {
                // create a point where the ray intersects the plane
                const point = intersections[0].point;
                point.setY(0);

                if (Main.DEBUG) {
                    this._debugSphere.position.copy(point);
                    Main.scene.add(this._debugSphere);
                }

                // update the mouse position
                this.lastMosePosition.copy(this.mouse);
                return;
            }

            this.lastMosePosition.copy(this.mouse);
        });
    }
    
}