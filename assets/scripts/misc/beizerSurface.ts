import * as THREE from "three";
import { BlockFile, Surface } from "../typings/blockFile";

export default class BezierSurface {
  public static fromBlockSurface(surface: Surface, color: number, divisions: number = 5) {
    const controlPoints = BezierSurface.formatSurfaceDataToVector(surface);

    let bezierCurveModel: THREE.Vector3[][] = [];

    for (let i = 0; i < controlPoints.length; i++) {
      let bezier = new THREE.CubicBezierCurve3(
        controlPoints[i][0],
        controlPoints[i][1],
        controlPoints[i][2],
        controlPoints[i][3]
      );
      bezierCurveModel.push(bezier.getPoints(divisions));
    }

    console.log(bezierCurveModel);

    let bezierCurvesVertices = new Float32Array(240 * divisions);

    let arrayIndex = 0;
    // calculating full bezier model (16 bezier curves in one direction, each containing 5 vertices)

    // 16 control points, 5 divisions
    // 16 * 5 = 80 bezier curves
    for (let i = 0; i <= divisions; i++) {
      let bezier = new THREE.CubicBezierCurve3(
        bezierCurveModel[0][i],
        bezierCurveModel[1][i],
        bezierCurveModel[2][i],
        bezierCurveModel[3][i]
      );

      bezier.getPoints(divisions).forEach((point) => {
        bezierCurvesVertices.set([point.x, point.y, point.z], arrayIndex);
        arrayIndex += 3;
      });
    }

    // now we've got full bezier model, it's time to create bezier surface and add it to the scene
    var bezierSurfaceVertices = bezierCurvesVertices;
    var bezierSurfaceFaces: number[] = [];

    // creating faces from vertices
    var v1, v2, v3, v4, v5, v6; // vertex indices in bezierSurfaceVertices array
    for (var i = 0; i < divisions; i++) {
      for (var j = 0; j < divisions; j++) {
        v1 = i * (divisions + 1) + j;
        v2 = (i + 1) * (divisions + 1) + j;
        v3 = i * (divisions + 1) + (j + 1);
        v4 = (i + 1) * (divisions + 1) + j;
        v5 = (i + 1) * (divisions + 1) + (j + 1);
        v6 = i * (divisions + 1) + (j + 1);

        bezierSurfaceFaces.push(v1, v2, v3, v4, v5, v6);
      }
    }

    let geometry = new THREE.BufferGeometry();

    geometry.setIndex(bezierSurfaceFaces);
    geometry.setAttribute("position", new THREE.BufferAttribute(bezierSurfaceVertices, 3));

    let bezierSurfaceMaterial = new THREE.MeshBasicMaterial({ color });

    let bezierSurface = new THREE.Mesh(geometry, bezierSurfaceMaterial);
    bezierSurface.material.side = THREE.DoubleSide;

    return bezierSurface;
  }

  public static formatSurfaceDataToVector(surface: Surface) {
    let surfaceVectors: THREE.Vector3[][] = [];

    surface.data.forEach((pointGroup, index) => {
      pointGroup.forEach((point) => {
        if (!surfaceVectors[index]) {
          surfaceVectors[index] = [new THREE.Vector3(point.vertex[0], point.vertex[1], point.vertex[2])];
        } else {
          surfaceVectors[index].push(new THREE.Vector3(point.vertex[0], point.vertex[1], point.vertex[2]));
        }
      });
    });

    return surfaceVectors;
  }
}
