/*
 * Renderer 9. The MIT License.
 * Copyright (c) 2022 rlkraft@pnw.edu
 * See LICENSE for details.
*/

/**
   A {@code Position} data structure represents a group of geometric objects
   positioned (both location and orientation) in three-dimensional space as
   part of a {@link Scene}. A {@code Position} is a recursive data structure.
   Every {@code Position} object contains a {@link List} of nested
   {@code Position} objects. The list of nested {@code Position}s lets us
   define what are called hierarchical, or nested, scenes. These are scenes
   that are made up of groups of models and each group can be moved around
   in the scene as a single unit while the individual models in the group
   can also be moved around within the group.
<p>
   A {@code Position} object holds references to a {@link Model} object,
   a {@link Matrix} object, and a {@code List} of {@code Position} objects.
   A {@code Position}'s {@code List} of {@code Position} objects creates
   a tree data structure of {@code Position} objects. A {@code Position}'s
   {@link Model} object represents a geometric shape in the {@link Scene}.
   The role of a {@code Position}'s  {@link Matrix} can be understood two
   ways. First, the {@link Matrix} determines the {@link Model}'s location
   and orientation within the local coordinate system determined by the
   {@code Position}'s parent {@code Position} (in the {@link Scene}'s forest
   of {@code Position} objects). Second, the {@link Matrix} determines a new
   local coordinate system within which the {@link Model} (and all the nested
   models lower in the tree) is plotted. The two ways of understanding a
   {@code Position}'s  {@link Matrix} correspond to reading a matrix
   transformation expression
   <pre>{@code
                T * v
   }</pre>
   from either right-to-left or left-to-right.
<p>
   When the renderer renders a {@code Position} object, the renderer
   traverses the tree of {@code Position}s rooted at the given
   {@code Position}. The renderer does a recursive, pre-order
   depth-first-traversal of the tree. As the renderer traverses the tree,
   it accumulates a "current-transformation-matrix" that multiplies each
   {@code Position}'s {@link Matrix} along the path from the tree's root
   {@code Position} to wherever the traversal is in the tree (this is the
   "pre-order" step in the traversal). The {@code ctm} is the current
   model-to-view transformation {@link Matrix}. The first stage of the
   rendering pipeline, {@link renderer.pipeline.Model2View}, multiplies every
   {@link Vertex} in a {@link Model}'s vertex list by this {@code ctm}, which
   converts the coordinates in each {@link Vertex} from the model's own local
   coordinate system to the {@code Camera}'s view coordinate system (which is "shared"
   by all the other models). Multiplication by the {@code ctm} has the effect
   of "placing" the model in view space at an appropriate location (using the
   translation part of the {@code ctm}) and in the appropriate orientation
   (using the rotation part of the {@code ctm}). Notice the difference between
   a {@code Position}'s {@code ctm} and the {@code Position}'s {@link Matrix}.
   At any specific node in the {@link Scene}'s forest of {@code Position} nodes,
   the {@code Position}'s {@link Matrix} places the {@code Position}'s
   {@link Model} within the local coordinate system of the {@code Position}'s
   parent {@code Position}. But the {@code Position}'s {@code ctm} places the
   {@code Position}'s {@link Model} within the {@link Camera}'s view coordinate
   system.
*/
//@ts-check
import {Camera, Model, Scene, Vertex, Vector} from "./SceneExports.js";

export default class Position
{
   /**@type {Model} this positions model*/ #model;
   /**@type {Vector} this positions position */ #translation
   /**@type {string} this positions string*/#name;
   /**@type {boolean} whether to render this position*/visible;
   /**@type {boolean} whether to output info on this position*/debug;

   /**
    * Construct a position with the given data.
    * 
    * @param {Model} [model=new Model()] this positions model
    * @param {Vector} [vector = new Vector(0, 0, 0)] this positions matrix
    * @param {string} [name=""] this positions name
    * @param {boolean} [visible=true] whether to render this position
    * @param {boolean} [debug=false] whether to debug this position
    */
   constructor(model = new Model(), vector = new Vector(0, 0, 0), name = "", nestedPositions = new Array(), visible = true, debug = false)
   {
      if(model instanceof Model == false)
         throw new Error("Model has to be a model");
      
      if(vector instanceof Vector == false)
         throw new Error("Vector has to be a Vector");

      if(typeof name != "string")
         throw new Error("Name has to be a string");

      if(typeof visible != "boolean" || typeof debug != "boolean")
         throw new Error("Visible and Debug must be booleans");

      this.#model = model;
      this.#translation = vector;
      this.#name = name;
      this.visible = visible;
      this.debug = debug;
   }

   /**
    * Build a position with this model and the models name 
    * positioned using the identity matrix
    * @param {Model} model
    * @returns {Position} the new position
    */
   static buildFromModel(model)
   {
      return new Position(model, new Vector(0, 0, 0), model.getName());
   }

   /**
    * Build a position with a default model, 
    * positions using the identity matrix,
    * with the given name
    * @param {string} name
    * @returns {Position} the new position
    */
   static buildFromName(name)
   {
      return new Position(new Model(), new Vector(0, 0, 0), name);
   }

   /**
    * Build a position with the given model and name
    * positioned with the identity matrix
    * @param {Model} model
    * @param {string} name
    * @returns {Position} the new position
    */
   static buildFromModelName(model, name)
   {
      return new Position(model, new Vector(0, 0, 0), name);
   }

   /**
    * Get the name of this position
    * @returns {string} this positions name
    */
   getName()
   {
      return this.#name;
   }

   /**
    * Get the name of this position
    * @returns {string} this positions name
    */
   get name() {return this.#name;}

   /**
    * Get the model of this position
    * @returns {Model} return this positions model
    */
   getModel()
   {
      return this.#model;
   }

   /**
    * Get the model of this position
    * @returns {Model} this positions model
    */
   get model() {return this.#model;}

   /**
    * Set this positions model to be the given model
    * @param {Model} model
    */
   setModel(model)
   {
      if(model instanceof Model == false)
         throw new Error("Model must be a Model");

      if(model == undefined)
         throw new Error("Model cannot be null or undefined")

      this.#model = model;
   }

   /**
    * Set this positions model to be the given model
    * @param {Model} mod
    */
   set model(mod)
   {
      if(mod instanceof Model == false)
         throw new Error("Model must be a model");

      if(mod == undefined)
         throw new Error("Model cannot be null or undefined");

      this.#model = mod;
   }

   /**
    * Get this positions matrix
    * @returns {Vector} this positions matrix
    */
   getTranslation()
   {
      return this.#translation;
   }

   /**
    * Get this positions translation vector
    * @returns {Vector} this positions matrix
    */
   get translation() {return this.#translation;}

   
   /**
    * DO NOT USE, for compatibility with previous renderers
    * @param {number} dx translation amount for the x direction
    * @param {number} dy translation amount for the y direction
    * @param {number} dz translation amount for the z direction
    */
   translate(dx, dy, dz)
   {
      if(typeof dx != "number" || typeof dy != "number" || typeof dz != "number")
         throw new Error("dx, dy, and dz must be numerical");

      this.#translation = new Vector(dx, dy, dz);

      return this;
   }

   /**
    * For debugging purposes.
    * @returns {string} representation of this position
    */
   toString()
   {
      let result = "";
      result += "Position: " + this.#name + "\n";
      result += "This Position's visibility is: " + this.visible + "\n";
      result += "This Position's translation is\n";
      result += this.#translation.toString() + "\n";
      result += "This Position's Model is\n";
      result += (null == this.#model || undefined == this.#model) ? "null\n" : this.#model.toString();

      return result;
   }

   /**
    * For testing purposes.
    */
   static main()
   {
      
      console.log("Creating p1 = new Position.");
      console.log("Creating p2 = Position.buildFromModel(new Model())");
      console.log("Creating p3 = Position.buildFromName('p2')");
      console.log("Creating p4 = Position.buildFromModelName(new Model(), 'p4')");
      const p1 = new Position();
      const p2 = Position.buildFromModel(new Model());
      const p3 = Position.buildFromName("p3");
      const p4 = Position.buildFromModelName(new Model(), "p4");

      console.log("");
      console.log("p1: ");
      console.log(p1.toString());

      
      console.log("");
      console.log("p2: ");
      console.log(p2.toString());

      
      console.log("");
      console.log("p3: ");
      console.log(p3.toString());

      
      console.log("");
      console.log("p4: ");
      console.log(p4.toString());

//    ------------------------------------------------------

      console.log("");
      console.log("p1.getName(): ");
      console.log(p1.getName());

      console.log("");
      console.log("p1.name");
      console.log(p1.name);


      console.log("");
      console.log("p2.getName(): ");
      console.log(p2.getName());

      console.log("");
      console.log("p2.name");
      console.log(p2.name);

      console.log("");
      console.log("p3.getName(): ");
      console.log(p3.getName());

      console.log("");
      console.log("p3.name");
      console.log(p3.name);

      console.log("");
      console.log("p4.getName(): ");
      console.log(p4.getName());

      console.log("");
      console.log("p4.name");
      console.log(p4.name);

//    ----------------------------------------------------
      // outputs function data instead of model.toString
      console.log("");
      console.log("p1.getModel(): ");
      console.log(p1.getModel().toString());

      console.log("");
      console.log("p1.model");
      console.log(p1.model.toString());

      console.log("");
      console.log("p2.getModel(): ");
      console.log(p2.getModel().toString());

      console.log("");
      console.log("p2.model");
      console.log(p2.model.toString());

      console.log("");
      console.log("p3.getModel(): ");
      console.log(p3.getModel().toString());

      console.log("");
      console.log("p3.model");
      console.log(p3.model.toString());

      console.log("");
      console.log("p4.getModel(): ");
      console.log(p4.getModel().toString());

      console.log("");
      console.log("p4.model");
      console.log(p4.model.toString());

//    ---------------------------------------------------

      /*
      console.log("");
      console.log("p1.setModel(new Model()): ");
      p1.setModel(new Model());
      console.log(p1.toString());
      */
      console.log("");
      console.log("p1.model = (new Model()): ");
      p1.model = new Model();
      console.log(p1.toString());

      /*
      console.log("");
      console.log("p3.setModel(new Model()): ");
      p3.setModel(new Model());
      console.log(p3.toString());
      */

      console.log("");
      console.log("p3.model = (new Model()): ");
      p3.model = (new Model());
      console.log(p3.toString());
// _--------------------------------------------------

      console.log("");
      console.log("p1.getTranslation(): ");
      console.log(p1.getTranslation());

      console.log("");
      console.log("p1.translation");
      console.log(p1.translation);

      console.log("");
      console.log("p2.getTranslation(): ");
      console.log(p2.getTranslation());

      console.log("");
      console.log("p3.getTranslation(): ");
      console.log(p3.getTranslation());

      console.log("");
      console.log("p4.getTranslation(): ");
      console.log(p4.getTranslation());

// --------------------------------------------------

      /*
      console.log("");
      console.log("p1.setMatrix(Matrix.translate(1, 1, 1)): ");
      p1.setMatrix(Matrix.translate(1, 1, 1));
      console.log(p1.toString());
      */

      console.log("");
      console.log("p1.matrix = (Matrix.translate(1, 1, 1)): ");
      p1.translate(1, 1, 1);
      console.log(p1.toString());
   }
}