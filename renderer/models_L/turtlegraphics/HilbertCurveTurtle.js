/*
 * Renderer Models. The MIT License.
 * Copyright (c) 2022 rlkraft@pnw.edu
 * See LICENSE for details.
*/

/**
   https://inventwithpython.com/recursion/chapter9.html#calibre_link-350
*/
//@ts-check

import {Turtle} from "./TurtleExports.js";
import {Model} from "../../scene/SceneExports.js";

export default class HilbertCurveTurtle extends Turtle
{
   /**
      @param {Model} model   a reference to the {@link Model} that this {@code Turtle} is builing
      @param {number} n       number of levels for the Hibert curve
      @param {number} length  side length
      @param {number} [xPos=0]    the intial x-coordinate for this {@link Turtle}
      @param {number} [yPos=0]    the intial y-coordinate for this {@link Turtle}
      @param {number} [z=0]       the z-plane for this {@code Turtle}
   */
   constructor(model, n, length, xPos=0, yPos=0, z=0)
   {
      super(model, model.name, xPos, yPos, z);
      this.#curve(n, 90, length / Math.pow(2, n));
   }

   /**
    * 
    * @param {number} n 
    * @param {number} angle 
    * @param {number} length 
    */
   #curve(n, angle, length)
   {
      this.#curveQuadrant(n, angle, length);
      this.forward(length);
      this.#curveQuadrant(n, angle, length);
      this.turn(-angle);
      this.forward(length);
      this.turn(-angle);
      this.#curveQuadrant(n, angle, length);
      this.forward(length);
      this.#curveQuadrant(n, angle, length);
      this.turn(-angle);
      this.forward(length);
      this.turn(-angle);
   }

   /**
    * @param {number} n 
    * @param {number} angle 
    * @param {number} length 
    */
   #curveQuadrant(n, angle, length)
   {
      if (n > 0)
      {
         this.turn(angle);
         this.#curveQuadrant(n - 1, -angle, length);
         this.forward(length);
         this.turn(-angle);
         this.#curveQuadrant(n - 1,  angle, length);
         this.forward(length);
         this.#curveQuadrant(n - 1,  angle, length);
         this.turn(-angle);
         this.forward(length);
         this.#curveQuadrant(n - 1, -angle, length);
         this.turn(angle);
      }
   }

}//HilbertCurveTurtle
