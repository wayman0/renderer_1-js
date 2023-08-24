/*
 * Renderer 9. The MIT License.
 * Copyright (c) 2022 rlkraft@pnw.edu
 * See LICENSE for details.
*/

/**
   A {@code Vector} object holds four doubles, which makes it a vector
   in 4-dimensional space.
<p>
   In computer graphics, we use 4-dimensional homogeneous coordinates
   to represent vectors (and points) in 3-dimensional space.
<p>
   Unlike a homogeneous {@link Vertex}, a homogeneous {@code Vector} usually
   has its fourth coordinate set to 0.
*/

// @ts-check
import format from "../StringFormat.js";
import {Vertex} from "./SceneExports.js";

export default class Vector
{
   /** @type {number} x the x value of this Vector*/ x;
   /** @type {number} y the y value of this Vector*/ y;
   /** @type {number} z the z value of this Vector*/ z;

   /**
    * Create a new {@code Vector} using the given x, y, z, and w coordinates
    * If no w is given uses the default value of 1.
    * 
    * @param {number} x x coordinate of the new {@code Vector}
    * @param {number} y y coordinate of the new {@code Vector}
    * @param {number} z z coordinate of the new {@code Vector}
    */
   constructor(x, y, z) // should w be 1 or 0?
   {
      if(typeof x != "number" || typeof y != "number" || 
         typeof z != "number")
            throw new Error("All parameters must be numerical.");
   
      this.x = x;
      this.y = y; 
      this.z = z; 
   }

   // if do @param {{x: number, y: number, z: number, w: number;}} v the ...
   // when the function is hovered over it gives the object structure and then says its 
   // type is a Vector instead of vertex, how do I fix this?
   /**
    * Create a new {@this Vector} from a {@link Vertex}
    * @param {Vertex} v the vertex to convert into a {@code Vector}
    * @returns the new {@code Vector} created from a {@link Vertex }
    */
   static buildVertex(v)
   {
      if(v instanceof Vertex == false)
         throw new Error("V is not a Vertex");

      return new Vector(v.x, v.y, v.z);
   }

   /**
    * The dot-product of two {@code Vector}s which returns a scalar
    * @param {Vector} v the vector to multiply with this {@code Vector}
    * @returns  {number} that is the dot product of this {@code Vector} and @param {Vector} v
    * 
    */
   dotProduct(v)
   {
      if(v instanceof Vector == false)
         throw new Error("V is not a Vector");
      
      return (this.x * v.x) + (this.y * v.y) + (this.z * v.z);
   }

   /**
    * The cross product of two {@code Vector}s returns a (new) {@code Vector}
    * @param {Vector} v the vector to mutliply with this {@code Vector}
    * @returns  {Vector} the new {@code Vector} that is the cross product of this {@code Vector} and @param {Vector} v
    */
   crossProduct(v)
   {
      if(v instanceof Vector == false)
         throw new Error("V is not a Vector");
      
         return new Vector(this.y*v.z - this.z*v.y, this.z*v.x - this.x*v.z, this.x*v.y - this.y*v.x);
   }

   /**
    * A scalar times a {@code Vector} returns a (new) {@code Vector}
    * 
    * @param {number} s the number to multiply this {@code Vector} by 
    * @returns {Vector} a new {@code Vector} that is the scalar times this {@code Vector}
    */
   timesScalar(s)
   {
      if(typeof s != "number")
         throw new Error("S has to be numerical");

      return new Vector(this.x * s, this.y * s, this.z * s);
   }

   /**
    * A {@code Vector} plus a {@code Vector} returns a (new) {@code Vector}
    * @param {Vector} v the vector to add to this {@code Vector}
    * @returns {Vector} a new {@code Vector} object that is the sum of this {@code Vector} and v
    */
   plusVector(v)
   {
      if(v instanceof Vector == false)
         throw new Error("V is not a vector");

      return new Vector(this.x + v.x, this.y + v.y, this.z + v.z);
   }

   /**
    * A {@code Vector} minus a {@code Vector} returns a (new) {@code Vector}
    * @param {Vector} v the vector to subtract from this {@code Vector}
    * @returns {Vector} a new {@code Vector} that is this {@code Vector} minus v
    */
   minusVector(v)
   {
      if(v instanceof Vector == false)
         throw new Error("V is not a vector");
      
      return new Vector(this.x - v.x, this.y - v.y, this.z - v.z);
   }

   /**
    * Return the normalized version of this {@code Vector}
    * <p>
    * That is, return the {@code Vector} with length 1 that 
    * points in the same direction as this {@code Vector}
    * 
    * @returns {Vector}a new {@code Vector} that has length one and has the same direction of this {@code Vector}
    */
   normalize()
   {
      const norm = Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z);

      return new Vector(this.x/norm, this.y/norm, this.z/norm);
   }

   /**
    * A {@code Vector} plus a {@link Vertex } returns a new {@link Vertex }
    * The vector translates the vertex to a new location.
    * @param {Vertex} v the vertex to add to this {@code Vector}
    * @returns {Vertex} a new {@link Vertex } that is the translation of {@code v} by this {@code Vector}
    */
   plusVertex(v)
   {
      if(v instanceof Vertex == false)
         throw new Error("V is not a vertex");

      return new Vertex(this.x + v.x, this.y + v.y, this.z + v.z);
   }

   /**
    * MUTATE this {@code Vector} to contain the product of {@code Vector}
    * with the scalar {@code s}
    * 
    * @param {number} s the number to multiply this {@code Vector} by 
    * @returns {Vector} a reference to this {@code Vector} for method chaining.
    */
   timesEqualsScalar(s)
   {
      if(typeof s != "number")
         throw new Error("S is not a number");

      this.x *= s;
      this.y *= s;
      this.z *= s;

      return this;
   }

   /**
    * MUTATE this {@code Vector} to contain the sum of this {@code Vector}
    * with the {@code Vector} {@code v}
    * @param {Vector} v the vector to add to this {@code Vector}
    * @returns {Vector} a reference to this {@code Vector} for method chaining.
    */
   plusEqualsVector(v)
   {
      if(v instanceof Vector == false)
         throw new Error("V is not a vector");

      this.x += v.x;
      this.y += v.y;
      this.z += v.z;
      
      return this;
   }

   /**
    * MUTATE this {@code Vector} to contain the differenceo of this {@code Vector}
    * with the {@code Vector} {@code v}
    * @param {Vector} v the vector to subtract form this {@code Vector}
    * @returns {Vector} a reference to this {@code Vector} for method chaining.
    */
   minusEqualsVector(v)
   {
      if(v instanceof Vector == false)
         throw new Error("V is not a Vector");

      this.x -= v.x;
      this.y -= v.y;
      this.z -= v.z;

      return this;
   }

   /**
    * MUTATE this {@code Vector} to contain the normalized version of 
    * this {@code Vector}
    * <p>
    * that is mutate this {@code Vector} to have length 1
    * 
    * @returns {Vector} a reference to this {@code Vector} for method chaining 
    */
   normalizeEquals()
   {
      const norm = Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z);
      
      this.x /= norm;
      this.y /= norm;
      this.z /= norm;

      return this;
   }   

   /**
    * For debugging.
    * 
    * @returns {string} the string representation of this {@code Vector}
    */
   toString()
   {
      // width = 3;
      // precision = 5;
      return format("[x, y, z] = [%3.5d, %3.5d, %3.5d]", this.x, this.y, this.z);
      //  return "[x,y,z,w]=[" + this.x + ", " + this.y + ", " + this.z + ", " + this.w + "]";      
   }

   static main()
   {
      console.log("Creating new Vector v1 = new Vector(1, 1, 1)");
      const v1 = new Vector(1, 1, 1);

      console.log("Creating Vector v2 from buildVertex(vertex1 = new Vertex(2, 2, 2))");
      const vertex1 = new Vertex(2, 2, 2);
      const v2 = Vector.buildVertex(vertex1);

      console.log("");
      console.log("Creating dotProdV = v1.dotProduct(v2): ")
      const dotProdV = v1.dotProduct(v2);
      console.log(dotProdV);

      console.log("");
      console.log("Creating crossProdV = v1.crossProduct(v2): ");
      const crossProdV = v1.crossProduct(v2);
      console.log(crossProdV.toString());

      console.log("");
      console.log("Creating timesNum = v1.timesScalar(5): ");
      const timesNum = v1.timesScalar(5);
      console.log(timesNum.toString());

      console.log("");
      console.log("Creating plusVect = v1.plusVector(v2): ");
      const plusVect = v1.plusVector(v2);
      console.log(plusVect.toString());

      console.log("");
      console.log("Creating minusVect = v1.minusVector(v2): ");
      const minusVect = v1.minusVector(v2);
      console.log(minusVect.toString());

      console.log("");
      console.log("Creating v1Norm = v1.normalize(): ");
      const v1Norm = v1.normalize();
      console.log(v1Norm.toString());

      // note plusVert is a vertex not vector
      console.log("");
      console.log("Creating plusVert = v1.plusVertex(vertex1): ");
      const plusVert = v1.plusVertex(vertex1);
      console.log(plusVert.toString());

      console.log("");
      console.log("v1.timesEqualsScalar(2): ");
      v1.timesEqualsScalar(2);
      console.log(v1.toString());

      console.log("");
      console.log("v1.plusEqualsVector(v2): ");
      v1.plusEqualsVector(v2);
      console.log(v1.toString());

      console.log("");
      console.log("v1.minusEqualsVector(v2): ");
      v1.minusEqualsVector(v2);
      console.log(v1.toString());

      console.log("");
      console.log("v1.normalizeEquals(): ");
      v1.normalizeEquals();
      console.log(v1.toString());
   }
}