/*
 * Renderer Models. The MIT License.
 * Copyright (c) 2022 rlkraft@pnw.edu
 * See LICENSE for details.
*/

/**
   https://michael0x2a.com/blog/turtle-examples#example-8-jumping-around-and-changing-speed
*/

//@ts-check

import {Turtle} from "./TurtleExports.js";
import {Model} from "../../scene/SceneExports.js";

export default class NinjaTurtle extends Turtle
{
   /**
      @param {Model} model  a reference to the {@link Model} that this {@code Turtle} is builing
      @param {number} n      number of radial lines
   */
   static buildModelLines(model, n)
   {
      return new NinjaTurtle(model, n, 0.0, 0.0, 0.0);
   }


   /**
      @param {Model} model  a reference to the {@link Model} that this {@code Turtle} is builing
      @param {number} n      number of radial lines
      @param {number} xPos   the intial x-coordinate for this {@link Turtle}
      @param {number} yPos   the intial y-coordinate for this {@link Turtle}
   */
   static buildModelPos(model, n, xPos, yPos)
   {
      return new NinjaTurtle(model, n, xPos, yPos, 0.0);
   }


   /**
      @param {Model} model  a reference to the {@link Model} that this {@code Turtle} is builing
      @param {number} n      number of radial lines
      @param {number} xPos   the intial x-coordinate for this {@link Turtle}
      @param {number} yPos   the intial y-coordinate for this {@link Turtle}
      @param {number} z      the z-plane for this {@code Turtle}
   */
   constructor(model, n, xPos, yPos, z)
   {
      super(model, model.name, xPos, yPos, z);
      this.#ninja(n);
   }

   /**
    * @param {number}  n 
    */
   #ninja(n)
   {
      for (let i = 0; i < n; ++i)
      {
         this.forward(1.0);
         this.turn(30);
         this.forward(0.2);
         this.turn(-60);
         this.forward(0.5);
         this.turn(30);

         this.putPenUp();
         this.moveTo(this.xHome, this.yHome);
         this.putPenDown();

         this.turn(360 / n);
      }
   }

}//NinjaTurtle
