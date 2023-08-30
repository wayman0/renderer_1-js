/*
 * Renderer Models. The MIT License.
 * Copyright (c) 2022 rlkraft@pnw.edu
 * See LICENSE for details.
*/

//@ts-check

import {Turtle} from "./TurtleExports.js";
import {Model} from "../../scene/SceneExports.js";

export default class PentagasketTurtle extends Turtle
{
   /**
      @param {Model} model  a reference to the {@link Model} that this {@code Turtle} is builing
      @param {number} n      number of levels for the Pentagasket
      @param {number} [xPos=0]   the intial x-coordinate for this {@link Turtle}
      @param {number} [yPos=0]   the intial y-coordinate for this {@link Turtle}
      @param {number} [z=0]      the z-plane for this {@code Turtle}
   */
   constructor(model, n, xPos=0, yPos=0, z=0)
   {
      super(model, model.name, xPos, yPos, z);
      this.#pentagasket(n);
   }

   /**
    * @param {number} level 
    */
   #pentagasket(level)
   {
      if (0 == level)
      {
         // draw a pentagon
         for (let i = 0; i < 5; ++i)
         {
            this.forward(1);
            this.turn(72);
         }
      }
      else
      {
         for (let i = 0; i < 5; ++i)
         {
            this.resize(0.5);
            this.#pentagasket(level - 1);
            this.resize(2.0);
            this.move(1);
            this.turn(72);
         }
      }
   }
}//PentagasketTurtle
