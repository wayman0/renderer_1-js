/*
 * Renderer Models. The MIT License.
 * Copyright (c) 2022 rlkraft@pnw.edu
 * See LICENSE for details.
*/

/**
   Create a wireframe model of a partial right circular cone with its
   base parallel to the xz-plane and its apex on the positive y-axis.
<p>
   By a partial cone we mean a cone over a circular sector of the
   cone's base and also cutting off the top part of the cone (the
   part between the apex and a circle of latitude) leaving a frustum
   of the (partial) cone.

   @see Cone
   @see ConeFrustum
   @see CircleSector
   @see DiskSector
   @see RingSector
   @see CylinderSector
   @see SphereSector
   @see TorusSector
*/
//@ts-check

import {Model, Vertex, LineSegment} from "../scene/SceneExports.js";
import format from "../StringFormat";

export default class ConeSector extends Model 
{
   /**@type {number} */ #r;
   /**@type {number} */ #h;
   /**@type {number} */ #t;
   /**@type {number} */ #theta1;
   /**@type {number} */ #theta2;
   /**@type {number} */ #n;
   /**@type {number} */ #k;

   /**
      Create a part of the cone with its base in the xz-plane,
      a base radius of {@code r}, height {@code  h}, and apex
      on the y-axis.
   <p>
      If {@code 0 < t < h}, then the partial cone is a frustum
      with its base in the xz-plane and the top of the frustum at
      {@code y = t}.
   <p>
      The partial cone is a cone over the circular sector
      from angle {@code theta1} to angle {@code theta2} (in the
      counterclockwise direction). In other words, the (partial)
      circles of latitude in the model extend from angle
      {@code theta1} to angle {@code theta2} (in the
      counterclockwise direction).
   <p>
      The last two parameters determine the number of lines of longitude
      (not counting one edge of any removed sector) and the number of
      (partial) circles of latitude (not counting the top edge of the
      frustum) in the model.
   <p>
      If there are {@code n} circles of latitude in the model (including
      the bottom edge but not the top edge of the frustum), then each
      line of longitude will have {@code n+1} line segments. If there are
      {@code k} lines of longitude (not counting one edge of any removed
      sector), then each (partial) circle of latitude will have {@code k}
      line segments.
   <p>
      There must be at least four lines of longitude and at least
      two circles of latitude.

      @param {number} [r=1]       radius of the base in the xz-plane
      @param {number} [h=1]       height of the apex on the y-axis
      @param {number} [t=1]       top of the frustum of the come
      @param {number} [theta1=Math.PI/2]    beginning longitude angle of the sector (in radians)
      @param {number} [theta2=3*Math.PI/2]  ending longitude angle of the sector (in radians)
      @param {number} [n=16]       number of circles of latitude around the cone
      @param {number} [k=8]        number of lines of longitude
      @param {string} name         name of the cone sector for use to differentiate between cone and conesector.
   */
   constructor(r=1, h=1, t=1, theta1=Math.PI/2, theta2= 3*Math.PI/2, n=16, k=8, name = format("Cone Sector(%.2f,%.2f,%.2f,%.2f,%.2f,%d,%d)", r, h, t, theta1, theta2, n, k))
   {
      super(undefined, undefined, name);

      if (n < 2)
         throw new Error("n must be greater than 1");
      if (k < 4)
         throw new Error("k must be greater than 3");
      if (h < t)
         throw new Error("h must be greater than or equal to t");

      theta1 = theta1 % (2*Math.PI);
      theta2 = theta2 % (2*Math.PI);
      if (theta1 < 0) theta1 = 2*Math.PI + theta1;
      if (theta2 < 0) theta2 = 2*Math.PI + theta2;
      if (theta2 <= theta1) theta2 = theta2 + 2*Math.PI;

      this.#r = r;
      this.#h = h;
      this.#t = t;
      this.#theta1 = theta1;
      this.#theta2 = theta2;
      this.#n = n;
      this.#k = k;

      // Create the cone's geometry.

      const deltaH = t / (n - 1),
            deltaTheta = (theta2 - theta1) / (k - 1);

      // An array of indexes to be used to create line segments.
      //final int[][] indexes = new int[n][k];
      const indexes = new Array(n);
      for(let i = 0; i < indexes.length; i+= 1)
         indexes[i] = new Array(k);

      // Create all the vertices (from the bottom up).
      let index = 0;
      for(let j = 0; j < k; ++j) // choose an angle of longitude
      {
         const c = Math.cos(theta1 + j * deltaTheta),
               s = Math.sin(theta1 + j * deltaTheta);
         for(let i = 0; i < n; ++i) // choose a circle of latitude
         {
            const slantRadius = r * (1 - i * deltaH / h);
            
            this.addVertex(new Vertex( slantRadius * c,
                                       i * deltaH,
                                       slantRadius * s) );
            indexes[i][j] = index++;
         }
      }

      this.addVertex( new Vertex(0, 0, 0) ); // bottom center
      const bottomCenterIndex = index;
      ++index;

      // Create all the horizontal (partial) circles of latitude around the cone.
      for(let i = 0; i < n; ++i)
      {
         for(let j = 0; j < k - 1; ++j)
            this.addPrimitive(LineSegment.buildVertex(indexes[i][j], indexes[i][j+1]));
      }

      // Create the slanted lines of longitude from the base to the
      // top circle of latitude, and the triangle fan in the base.
      for(let j = 0; j < k; ++j)
      {
         this.addPrimitive(LineSegment.buildVertex(bottomCenterIndex, indexes[0][j]));

         for(let i = 0; i < n - 1; ++i)
            this.addPrimitive(LineSegment.buildVertex(indexes[i][j], indexes[i+1][j]));
      }
   }
}//ConeSector
