/*
 * Renderer Models. The MIT License.
 * Copyright (c) 2022 rlkraft@pnw.edu
 * See LICENSE for details.
*/

/**
   https://commons.wikimedia.org/wiki/File:Turtle_Graphics_Spiral.svg
*/
//@ts-check

import {Turtle} from "./TurtleExports.js";
import {Model} from "../../scene/SceneExports.js";

export default class SpiralTurtle extends Turtle
{
   /**
      @param {Model} model  a reference to the {@link Model} that this {@code Turtle} is builing
      @param {number} n      number of spirals
      @param {number} [xPos=0]   the intial x-coordinate for this {@link Turtle}
      @param {number} [yPos=0]   the intial y-coordinate for this {@link Turtle}
      @param {number} [z=0]      the z-plane for this {@code Turtle}
   */
   constructor(model, n, xPos = 0, yPos = 0, z = 0)
   {
      super(model, model.name, xPos, yPos, z);

      this.#spiral(n);
   }


   /**
    * @param {number} n 
    */
   #spiral(n)
   {
      for (let i = 0; i < n; ++i)
      {
         this.forward( 1.0 - (i/n) );
         this.turn(121);
      }
   }

}//NinjaTurtle
