/*
 * Renderer Models. The MIT License.
 * Copyright (c) 2022 rlkraft@pnw.edu
 * See LICENSE for details.
*/

/**
   https://www.clear.rice.edu/comp360/lectures/K10188_C001.pdf
*/
//@ts-check
import {LineSegment, Model, Vertex} from "../../scene/SceneExports.js";

export default class Turtle
{
   /**@type {Model} */ model;
   /**@type {String} */ name;
   /**@type {number} */ z;
   /**@type {number} */ xHome;
   /**@type {number} */ yHome;

   /**@type {number} */ #xPos;
   /**@type {number} */ #yPos;
   /**@type {number} */ #heading;
   /**@type {boolean} */ #penDown;
   /**@type {number} */ #stepSize;  // see the resize() method

   /**
      @param {Model} model  a reference to the {link Model} that this {@code Turtle} is builing
   */
   static buildModel(model)
   {
      return new Turtle(model, model.name, 0, 0, 0);
   }


   /**
      @param {Model} model  a reference to the {@link Model} that this {@code Turtle} is builing
      @param {string} name   a {@link String} that is a name for this {@code Turtle}
   */
   static buildModelName(model, name)
   {
      return new Turtle(model, name, 0, 0, 0);
   }


   /**
      @param {Model} model  a reference to the {@link Model} that this {@code Turtle} is builing
      @param {number} z      the z-plane for this {@code Turtle}
   */
   static buildModelZ(model, z)
   {
      return new Turtle(model, model.name, 0, 0, z);
   }


   /**
      @param {Model} model  a reference to the {@link Model} that this {@code Turtle} is builing
      @param {string} name   a {@link String} that is a name for this {@code Turtle}
      @param {number} z      the z-plane for this {@code Turtle}
   */
   static buildModelNameZ(model, name, z)
   {
      return new Turtle(model, name, 0, 0, z);
   }

   /**
      @param {Model} model   a reference to the {@link Model} that this {@code Turtle} is builing
      @param {string} name    a {@link String} that is a name for this {@code Turtle}
      @param {number} xHome   the intial x-coordinate for this {@code Turtle}
      @param {number} yHome   the intial y-coordinate for this {@code Turtle}
      @param {number} z       the z-plane for this {@code Turtle}
   */
   constructor(model, name, xHome, yHome, z)
   {
      if(model instanceof Model == false)
         throw new Error("Model must be a model");

      if(typeof name != "string")
         throw new Error("Name must be a string");

      if(typeof xHome != "number" || typeof yHome != "number" || typeof z != "number")
         throw new Error("Xhome, Yhome and z must be numerical");

      if(model == undefined || model == null)
         throw new Error("Model cannot be undefined or null")

      this.model = model;
      this.name = name;
      this.xHome = xHome;
      this.yHome = yHome;
      this.z = z;

      this.#xPos = xHome;
      this.#yPos = yHome;
      this.#heading = 0;
      this.#penDown = true;
      this.#stepSize = 1;
   }


   /**
      Check if this {@code Turtle}'s pen is down.

      @return true if down else false
   */
   isPenDown()
   {
      return this.#penDown;
   }


   /**
      Set this {@code Turtle}'s penDown variable.

      @param {boolean} value  value for this {@code Turtle}'s penDown variable
   */
   setPenDown(value)
   {
      if(typeof value != "boolean")
         throw new Error("value must be a boolean");

      this.#penDown = value;
   }

   /**
    * @param {boolean} val
    */
   set penDown(val)
   {
      if(typeof val != "boolean")
         throw new Error("Val must be a boolean");

      this.#penDown = val;
   }

   /**
      Set this {@code Turtle}'s pen down.
   */
   putPenDown()
   {
      this.#penDown = true;
   }


   /**
      Lift this {@code Turtle}'s pen up.
   */
   putPenUp()
   {
      this.#penDown = false;
   }


   /**
      Get the current x position of this {@code Turtle}.

      @return the x position of this {@code Turtle}
   */
   getXPos()
   {
      return this.#xPos;
   }

   get xPos()
   {
      return this.#xPos;
   }

   /**
      Get the current y position of this {@code Turtle}.

      @return the y position of this {@code Turtle}
   */
   getYPos()
   {
      return this.#yPos;
   }

   get yPos()
   {
      return this.#yPos;
   }

   /**
      Get the current heading of this {@code Turtle}.

      @return the heading in degrees of this {@code Turtle}
   */
   getHeading()
   {
      return this.#heading;
   }

   get heading()
   {
      return this.#heading;
   }

   /**
      Set the heading of this {@code Turtle}.

      @param {number} heading  new heading in degrees for this {@code Turtle}
   */
   setHeading(heading)
   {
      if(typeof heading != "number")
         throw new Error("Heading must be numerical");

      this.#heading = heading;
   }

   set heading(head)
   {
      if(typeof head != "number")
         throw new Error("Head must be numerical");

         this.#heading = head;
   }
   
   /**
      Turn this {@code Turtle} 90 degrees clockwise.
   */
   right()
   {
      this.turn(90);
   }


   /**
      Turn this {@code Turtle} 90 degrees counterclockwise.
   */
   left()
   {
      this.turn(-90);
   }


   /**
      Turn this {@code Turtle} by the given angle in degrees.
      Use positive angles to turn clockwise and negative angles to turn counterclockwise.

      @param {number} degrees  the amount to turn this {@code Turtle} in degrees
   */
   turn(degrees)
   {
      if(typeof degrees != "number")
         throw new Error("degrees must be numerical");

      this.#heading = (this.#heading + degrees) % 360;
   }


   /**
      Turn this {@code Turtle} to face another {@code Turtle}.

      @param {Turtle} turtle  the {@code Turtle} to turn towards
   */
   turnToFace(turtle)
   {
      if(turtle instanceof Turtle == false)
         throw new Error("Turtle must be of type Turtle");

      this.turnToFacePos(turtle.#xPos, turtle.#yPos);
   }


   /**
      Turn this {@code Turtle} towards the given (x, y).

      @param {number} x  the x to turn this {@code Turtle} towards
      @param {number} y  the y to turn this {@code Turtle} towards
   */
   turnToFacePos(x, y)
   {
      if(typeof x != "number" || typeof y != "number")
         throw new Error("All parameters must be numerical");

      const dx = x - this.#xPos;
      const dy = y - this.#yPos;

      if (0 == dx)         // avoid a division by 0
      {
         if (dy > 0)       // if below the turtle
            this.#heading = 180;
         else if (dy < 0)  // if above the turtle
            this.#heading = 0;
      }
      else // dx isn't 0 so can divide by it
      {
         const arcTan = (Math.atan(dy / dx)) / (Math.PI/180);

         if (dx < 0)
            this.#heading = arcTan - 90;
         else
            this.#heading = arcTan + 90;
      }
   }


   /**
      Move this {@code Turtle} to the coordinates (0, 0) and give it the heading of 0 degrees.
   */
   home()
   {
      this.#xPos = this.xHome;
      this.#yPos = this.yHome;
      this.#heading = 0;
   }


   /**
      Move this {@code Turtle} to the given (x, y) location.

      @param {number} x  the x-coordinate to move this {@code Turtle} to
      @param {number} y  the y-coordinate to move this {@code Turtle} to
   */
   moveTo(x, y)
   {
      if(typeof x != "number" || typeof y != "number")
         throw new Error("X and Y must be numerical");

      this.#xPos = x;
      this.#yPos = y;
   }

   /**
      Move this {@code Turtle} backward the given number of units.

      @param {number} [distance=1]  the distance to walk this {@code Turtle} backward, 1 by default
   */
   backward(distance = 1)
   {
      this.forward(-distance);
   }


   /**
      Move this {@code Turtle} forward the given number of units
      in the heading direction. If the pen is down, then add two
      {@link Vertex} objects and a {@link LineSegment} object to
      the underlying {@code Turtle}.

      @param {number} [distance=1]  the distance to walk this {@code Turtle} forward in the heading direction 1 by default
   */
   forward(distance=1)
   {
      if(typeof distance != "number")
         throw new Error("Distance must be numerical");

      const xOld = this.#xPos;
      const yOld = this.#yPos;

      // change the current position
      const heading = this.#heading * (Math.PI/180);// convert to radians

      this.#xPos = xOld + (this.#stepSize * distance * Math.sin((heading)));
      this.#yPos = yOld + (this.#stepSize * distance * Math.cos((heading)));

      if (this.#penDown)
      {
         const index = this.model.vertexList.length;

         const oldVertex = new Vertex(xOld, yOld, this.z);
         const newVertex = new Vertex(this.#xPos, this.#yPos, this.z);

         this.model.addVertex(oldVertex, newVertex);
         this.model.addPrimitive(LineSegment.buildIndices(index, index+1));
      }
   }


   /**
      Same as the forward() method but without building a {@link LineSegment}.
      <p>
      This is part of "Turtle Geometry" as defined by Ronald Goldman.
      <p>
      https://www.clear.rice.edu/comp360/lectures/old/TurtlesGraphicL1New.pdf
      https://people.engr.tamu.edu/schaefer/research/TurtlesforCADRevised.pdf
      https://www.routledge.com/An-Integrated-Introduction-to-Computer-Graphics-and-Geometric-Modeling/Goldman/p/book/9781138381476

      @param {number} distance  the distance to walk this {@code Turtle} forward in the heading direction
   */
   move(distance)
   {
      if(typeof distance != "number")
         throw new Error("Distance must be a number");

      const heading = this.#heading * (Math.PI/180); // convert to radians;
      // change the current position
      this.#xPos = this.#xPos + (this.#stepSize * distance * Math.sin((heading)));
      this.#yPos = this.#yPos + (this.#stepSize * distance * Math.cos((heading)));
   }


   /**
      Change the length of the step size by the factor {@code s}.
      <p>
      This is part of "Turtle Geometry" as defined by Ronald Goldman.

      @param {number} s  scaling factor for the new {@code stepSize}
   */
   resize(s)
   {
      if(typeof s != "number")
         throw new Error("S must be a number");

      this.#stepSize = s * this.#stepSize;
   }


   /**
      For debugging.

      @return {String} representation of this {@code Turtle} object
   */
   toString()
   {
      let result = "";
      result += "Turtle: " + this.name + "\n";
      result += "z-plane: " + this.z + "\n";
      result += "origin: (" + this.#xPos + ", " + this.#yPos + ")\n";
      result += this.model.toString() + "\n";
      return result;
   }
}//Turtle
