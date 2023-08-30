/*
 * Renderer Models. The MIT License.
 * Copyright (c) 2022 rlkraft@pnw.edu
 * See LICENSE for details.
*/

/**
   Create a positive x, y, and z axis in 3-dimensional space.
*/

import {Model, LineSegment, Vertex} from "../scene/SceneExports.js";
import format from "../StringFormat.js";

export default class Axes3D extends Model
{
   /**
      Create an x, y, and z axis with the
      given endpoints for each axis.

      @param {number} [xMin=-1]  left endpoint of the x-axis
      @param {number} [xMax=1]  right endpoint of the x-axis
      @param {number} [yMin=-1]  bottom endpoint of the y-axis
      @param {number} [yMax=1]  top endpoint of the y-axis
      @param {number} [zMin=-1]  back endpoint of the z-axis
      @param {number} [zMax =1] front endpoint of the z-axis
   */
   constructor(xMin=-1, xMax=1, yMin=-1, yMax=1, zMin=-1, zMax=1)
   {
      super(undefined, undefined, format("Axes 3D(%.2f,%.2f,%.2f,%.2f%.2f,%.2f)", xMin,xMax,yMin,yMax,zMin,zMax));

      this.addVertex(new Vertex(xMin, 0,    0),
                new Vertex(xMax, 0,    0),
                new Vertex( 0,  yMin,  0),
                new Vertex( 0,  yMax,  0),
                new Vertex( 0,   0,   zMin),
                new Vertex( 0,   0,   zMax));

      this.addPrimitive(new LineSegment([0, 1]),
                        new LineSegment([2, 3]),
                        new LineSegment([4, 5]));
   }
}//Axes3D
