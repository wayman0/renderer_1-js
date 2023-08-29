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
   */
   static buildModelLevels(model, n)
   {
      return new PentagasketTurtle(model, n, 0.0, 0.0, 0.0);
   }


   /**
      @param {Model} model  a reference to the {@link Model} that this {@code Turtle} is builing
      @param {number} n      number of levels for the Pentagasket
      @param {number} xPos   the intial x-coordinate for this {@link Turtle}
      @param {number} yPos   the intial y-coordinate for this {@link Turtle}
   */
   static buildModelPos(model, n, xPos, yPos)
   {
      return new PentagasketTurtle(model, n, xPos, yPos, 0.0);
   }


   /**
      @param {Model} model  a reference to the {@link Model} that this {@code Turtle} is builing
      @param {number} n      number of levels for the Pentagasket
      @param {number} xPos   the intial x-coordinate for this {@link Turtle}
      @param {number} yPos   the intial y-coordinate for this {@link Turtle}
      @param {number} z      the z-plane for this {@code Turtle}
   */
   constructor(model, n, xPos, yPos, z)
   {
      super(model, model.name, xPos, yPos, z);
      this.#pentagasket(n);
   }


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
