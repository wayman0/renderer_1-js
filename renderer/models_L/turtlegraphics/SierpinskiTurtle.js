/*
 * Renderer Models. The MIT License.
 * Copyright (c) 2022 rlkraft@pnw.edu
 * See LICENSE for details.
*/

/**
   https://www.clear.rice.edu/comp360/lectures/fall2008/TurtleFractalsL2New.pdf#page=5
*/

//@ts-check
import {Turtle} from "./TurtleExports.js";
import {Model} from "../../scene/SceneExports.js";

export default class SierpinskiTurtle extends Turtle
{
   /**
      @param {Model} model   a reference to the {@link Model} that this {@code Turtle} is builing
      @param {number} n       number of levels for the Sierpinski triangle
      @param {number} length  side length
   */
   static buildModelLength(model, n, length)
   {
      return new SierpinskiTurtle(model, n, length, 0.0, 0.0, 0.0);
   }


   /**
      @param {Model} model   a reference to the {@link Model} that this {@code Turtle} is builing
      @param {number} n       number of levels for the Sierpinski triangle
      @param {number} length  side length
      @param {number} xPos    the intial x-coordinate for this {@link Turtle}
      @param {number} yPos    the intial y-coordinate for this {@link Turtle}
   */
   static buildModelLengthPos(model, n, length, xPos, yPos)
   {
      return new SierpinskiTurtle(model, n, length, xPos, yPos, 0.0);
   }


   /**
      @param {Model} model   a reference to the {@link Model} that this {@code Turtle} is builing
      @param {number} n       number of levels for the Sierpinski triangle
      @param {number} length  side length
      @param {number} xPos    the intial x-coordinate for this {@link Turtle}
      @param {number} yPos    the intial y-coordinate for this {@link Turtle}
      @param {number} z       the z-plane for this {@code Turtle}
   */
   constructor(model, n, length, xPos, yPos, z)
   {
      super(model, model.name, xPos, yPos, z);
      this.#sierpinski(n, length);
   }


   /**
    * @param {number} level 
    * @param {number} length 
    */
   #sierpinski(level, length)
   {
      if (0 == level)
      {
         // draw an equlateral triangle
         for (let i = 0; i < 3; ++i)
         {
            this.forward(length);
            this.turn(120);
         }
      }
      else
      {
         for (let i = 0; i < 3; ++i)
         {
            this.resize(0.5);
            this.#sierpinski(level - 1, length);
            this.resize(2.0);
            this.move(length);
            this.turn(120);
         }
      }
   }

}//SierpinskiTurtle
