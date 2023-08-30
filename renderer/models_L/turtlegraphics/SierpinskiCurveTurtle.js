/*
 * Renderer Models. The MIT License.
 * Copyright (c) 2022 rlkraft@pnw.edu
 * See LICENSE for details.
*/

/**
   https://en.wikipedia.org/wiki/Sierpi%C5%84ski_curve#Arrowhead_curve
*/
//@ts-check

import {Turtle} from "./TurtleExports.js";
import {Model} from "../../scene/SceneExports.js";

export default class SierpinskiCurveTurtle extends Turtle
{
   /**
      @param {Model} model   a reference to the {@link Model} that this {@code Turtle} is builing
      @param {number} n       number of levels for the Sierpinski curve
      @param {number} length  side length
      @param {number} [xPos=0]    the intial x-coordinate for this {@link Turtle}
      @param {number} [yPos=0]    the intial y-coordinate for this {@link Turtle}
      @param {number} [z=0]       the z-plane for this {@code Turtle}
   */
   constructor(model, n, length, xPos=0, yPos=0, z=0)
   {
      super(model, model.name, xPos, yPos, z);
      this.#curve(n, length, 60);
   }

   /**
    * 
    * @param {number} n 
    * @param {number} length 
    * @param {number} angle 
    */
   #curve(n, length, angle)
   {
      if ( 0 == n )
      {
         this.forward(length);
      }
      else
      {
         this.turn(angle);
         this.#curve(n - 1, length / 2.0, -angle);
         this.turn(-angle);
         this.#curve(n - 1, length / 2.0,  angle);
         this.turn(-angle);
         this.#curve(n - 1, length / 2.0, -angle);
         this.turn(angle);
      }
   }
}//SierpinskiCurveTurtle


/* Wikipedia version.
   public SierpinskiCurveTurtle(final Model model, final int n, final double length,
                                final double xPos, final double yPos, final double z)
   {
      super(model, xPos, yPos, z);
      if ( 0 == n % 2 )  // n is even
      {
         curve(n, length, 60);
      }
      else  // n is odd
      {
         turn(60);
         curve(n, length, -60);
      }
   }

   private void curve(final int n, final double length, final int angle)
   {
      if ( 0 == n )
      {
         forward(length);
      }
      else
      {
         curve(n - 1, length / 2.0, -angle);
         turn(angle);
         curve(n - 1, length / 2.0,  angle);
         turn(angle);
         curve(n - 1, length / 2.0, -angle);
      }
   }
*/
