import * as THREE from 'three';
import { MeshBasicMaterial } from 'three';
import Main from '../main';
import StatusPanel from '../misc/statusPanel';

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
        return MouseCastHandler.raycaster.intersectObjects(Main.scene.children.filter((child) => {
            return !child.name.includes("enviroment")
        }));
    }

    public static init() {

        let lastSelectedObject: THREE.Mesh;
        let debugObject: THREE.Mesh;

        MouseCastHandler.canvas.addEventListener('mousemove', (event) => {
            const intersections = MouseCastHandler.castMousePosition(event);
            if (intersections.length > 0) {

                // find the selected object
                const selectedObject = intersections[0].object as THREE.Mesh;
                
                // if the selected object is the same as the last selected object, return
                if (lastSelectedObject && lastSelectedObject.uuid === selectedObject.uuid) return;

               if (lastSelectedObject) {
                     // show the last selected object
                    lastSelectedObject.visible = true;
                    Main.scene.remove(debugObject);
                }

                lastSelectedObject = selectedObject;

                // hide the last selected object
                selectedObject.visible = false;

                debugObject = selectedObject.clone();
                debugObject.name = `debug_${selectedObject.name}`;
                debugObject.visible = true;
                debugObject.material = new MeshBasicMaterial({ color: 0xff0000, wireframe: true });

                Main.scene.add(debugObject);

                StatusPanel.status = `${selectedObject.name} | ${selectedObject.uuid} | ${selectedObject.position.x}, ${selectedObject.position.y}, ${selectedObject.position.z}`

                // update the mouse position
                this.lastMosePosition.copy(this.mouse);
                return;
            }

            this.lastMosePosition.copy(this.mouse);
        });
    }
    
}