/*
 * Renderer Models. The MIT License.
 * Copyright (c) 2022 rlkraft@pnw.edu
 * See LICENSE for details.
*/

/**
   Create an x and y axis in the xy-plane, along with "tick marks".
*/
//@ts-check

import {LineSegment, Model, Vertex} from "../scene/SceneExports.js";
import format from "../StringFormat.js";

export default class Axes2D extends Model
{
   /**
      Create an x-axis from {@code xMin} to {@code xMax}
      and a y-axis from {@code yMin} to {@code yMax}.
   <p>
      The {@code z} parameter is so that we can put the axis just above
      or just below the xy-plane (say {@code z=0.01} or {@code z=-0.01}).
      This way, the axes can be just in front of or just behind whatever
      is being drawn in the xy-plane.

      @param {number} [xMin=-1]    left end point for the x-axis
      @param {number} [xMax=1]     right end point for the x-axis
      @param {number} [yMin=-1]    bottom end point for the y-axis
      @param {number} [yMax=1]     top end point for the y-axis
      @param {number} [xMarks=5]  number of evenly spaced tick marks on the x-axis
      @param {number} [yMarks=5]  number of evenly spaced tick marks on the y-axis
      @param {number} [z=0]       offset of the axes away from the xy-plane
   */
   constructor(xMin=-1, xMax=1, yMin=-1, yMax=1, xMarks=5, yMarks=5, z=0)
   {
      super(undefined, undefined, format("Axes 2D(%.2f,%.2f,%.2f,%.2f)", xMin,xMax,yMin,yMax));

      // x-axis
      this.addVertex(new Vertex(xMin, 0, z),
                    new Vertex(xMax, 0, z));
      this.addPrimitive(new LineSegment([0, 1]));

      // y-axis
      this.addVertex(new Vertex(0, yMin, z),
                    new Vertex(0, yMax, z));
      this.addPrimitive(new LineSegment([2, 3]));

      let index = 4;

      // Put evenly spaced tick marks on the x-axis.
      let xDelta = (xMax - xMin)/xMarks;
      let yDelta = (yMax - yMin)/50;
      for (let x = xMin; x <= xMax; x += xDelta)
      {
         this.addVertex(new Vertex(x,  yDelta/2, z),
                        new Vertex(x, -yDelta/2, z));
         this.addPrimitive(new LineSegment([index+0, index+1]));
         index += 2;
      }

      // Put evenly spaced tick marks on the y-axis.
      yDelta = (yMax - yMin)/yMarks;
      xDelta = (xMax - xMin)/50;
      for (let y = yMin; y <= yMax; y += yDelta)
      {
         this.addVertex(new Vertex( xDelta/2, y, z),
                        new Vertex(-xDelta/2, y, z));
         this.addPrimitive(new LineSegment([index+0, index+1]));
         index += 2;
      }
   }
}//Axes2D
