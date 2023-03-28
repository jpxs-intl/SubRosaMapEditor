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
    )

    public static getMousePosition(event: MouseEvent): THREE.Vector2 {
        const rect = MouseCastHandler.canvas.getBoundingClientRect();
        MouseCastHandler.mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
        MouseCastHandler.mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
        return MouseCastHandler.mouse;
    }

    public static castMousePosition(event: MouseEvent): THREE.Intersection[] {
        MouseCastHandler.getMousePosition(event);
        MouseCastHandler.raycaster.setFromCamera(MouseCastHandler.mouse, Main.camera);
        return MouseCastHandler.raycaster.intersectObjects(Main.scene.children.filter((child) => child.name !== 'debug' && child.name !== "environment"));
    }

    public static init() {

        MouseCastHandler.canvas.addEventListener('mousemove', (event) => {
            const intersections = MouseCastHandler.castMousePosition(event);
            if (intersections.length > 0) {
                // create a point where the ray intersects the plane
                const point = intersections[0].point;

                // if (Main.DEBUG) {
                //     this._debugSphere.position.copy(point);
                //     const sphereObject = new THREE.Object3D();
                //     sphereObject.name = 'debug';
                //     sphereObject.add(this._debugSphere);
                //     Main.scene.add(sphereObject);
                // }

                // find the selected object
                const selectedObject = intersections[0].object;
                
                // create a temporary wireframe object to show the selected object
              

                

                // update the mouse position
                this.lastMosePosition.copy(this.mouse);
                return;
            }

            this.lastMosePosition.copy(this.mouse);
        });
    }
    
}