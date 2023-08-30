/*
 * Renderer Models. The MIT License.
 * Copyright (c) 2022 rlkraft@pnw.edu
 * See LICENSE for details.
*/

/**
   https://www.clear.rice.edu/comp360/lectures/fall2008/TurtleFractalsL2New.pdf#page=6
*/

//@ts-check

import {Turtle} from "./TurtleExports.js";
import {Model} from "../../scene/SceneExports.js";

export default class PolygasketTurtle extends Turtle
{
   /**
      @param {Model} model  a reference to the {@link Model} that this {@code Turtle} is builing
      @param {number} n      number of sides in the N-gon
      @param {number} m      number of levels for the Polygasket
      @param {number} [xPos=0]   the intial x-coordinate for this {@link Turtle}
      @param {number} [yPos=0]   the intial y-coordinate for this {@link Turtle}
      @param {number} [z=0]      the z-plane for this {@code Turtle}
   */
   constructor(model, n, m, xPos=0, yPos=0, z=0)
   {
      super(model, model.name, xPos, yPos, z);
      this.#polygasket(n, m);
   }

   /**
   * @param {number} n 
   * @param {number} level 
   */
   #polygasket(n, level)
   {
      if (0 == level)
      {
         // draw a N-gon
         for (let i = 0; i < n; ++i)
         {
            this.forward(1);
            this.turn(360.0/n);
         }
      }
      else
      {
         for (let i = 0; i < n; ++i)
         {
            this.resize(0.5);
            this.#polygasket(n, level - 1);
            this.resize(2.0);
            this.move(1);
            this.turn(360.0/n);
         }
      }
   }
}//PolygasketTurtle
