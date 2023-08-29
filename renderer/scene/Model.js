/*
 * Renderer 9. The MIT License.
 * Copyright (c) 2022 rlkraft@pnw.edu
 * See LICENSE for details.
*/

/**
   A {@code Model} object represents a distinct geometric object in a
   {@link Scene}. A {@code Model} data structure is mainly a {@link List}
   of {@link Vertex} objects, a {@link List} of {@link Primitive} objects,
   and a list of {@link Color} objects.
<p>
   Each {@link Vertex} object contains the xyz-coordinates, in the
   {@code Model}'s own coordinate system, for one point from the
   {@code Model}.
<p>
   Each {@link Color} object represents a color associated to one
   (or more) {@link Vertex} objects.
<p>
   The {@link Vertex} objects represents points from the geometric object
   that we are modeling. In the real world, a geometric object has an infinite
   number of points. In 3D graphics, we "approximate" a geometric object by
   listing just enough points to adequately describe the object. For example,
   in the real world, a rectangle contains an infinite number of points, but
   it can be adequately modeled by just its four corner points. (Think about
   a circle. How many points does it take to adequately model a circle? Look
   at the {@link renderer.models_L.Circle} model.)
<p>
   Each {@link Primitive} object is either a {@link LineSegment} or a
   {@link Point}.
<p>
   Each {@link LineSegment} object contains four integers, two integers that
   are the indices of two {@link Vertex} objects from the {@code Model}'s
   vertex list, and two integers that are indices of two {@link Color}
   objects from the {@link Model}'s color list. The two vertices are the
   line segment's two endpoints, and each of the two colors is associated
   with one of the two endpoints.
<p>
   Each {@link Point} object contains two integers, one integer index of
   a {@link Vertex} from the {@code Model}'s vertex list, and one integer
   index of a {@link Color} from the {@code Model}'s color list.
<p>
   We use {@link LineSegment} objects to represent the space between the
   model's vertices. For example, while a rectangle can be approximated by
   its four corner points, those same four points could also represent two
   parallel line segments, or they could represent two lines that cross each
   other. By using four line segments that connect around the four points,
   we get a good, unambiguous representation of a rectangle.
<p>
   If we modeled a circle using just points, we would probably need to use
   hundreds of points. But if we connect every two adjacent points with a
   short line segment, we can get a good model of a circle with just a few
   dozen points.
<p>
   Our {@code Model}'s represent geometric objects as a "wire-frame" of line
   segments, that is, a geometric object is drawn as a collection of "edges".
   This is a fairly simplistic way of doing 3D graphics and we will improve
   this in later renderers.
<p>
   See
<br> <a href="https://en.wikipedia.org/wiki/Wire-frame_model" target="_top">
              https://en.wikipedia.org/wiki/Wire-frame_model</a>
<br>or
<br> <a href="https://www.google.com/search?q=computer+graphics+wireframe&tbm=isch" target="_top">
              https://www.google.com/search?q=computer+graphics+wireframe&tbm=isch</a>
*/

//@ts-check
import {Vertex, Primitive, LineSegment, Point} from "./SceneExports.js";

export default class Model
{
    /**@type {Vertex[]} #vertexList the array of vertexes for this model */#vertexList;

    // should the type of primitive list be made into
    // @type{LineSegment[]|Point[]} 
    // or would that be a problem if a model contains a combo of points and linesegments

    /**@type {Primitive[]} #primitiveList the array of primitives for this model */#primitiveList;
    /**@type {string} #name the name for this model */#name;
    /**@type {boolean} visible whether or not this model should be "seen" */visible;

    /**
     * Construct a {@code Model} with all the given data. 
     * 
     * @param {Vertex[]} [vList=new Array()] an array of {@link Vertex}s for this model
     * @param {Primitive[]} [pList=new Array()] an array of {@link Primitive}s for this model
     * @param {string} [name=""] the name for this model
     * @param {boolean} [vis=true] whether this model should be seen by the renderer
     */
    constructor(vList= new Array(), pList= new Array(), name = "", vis = true)
    {
        if( Array.isArray(vList) == false)
            throw new Error("Vertex list must be array");

        if(Array.isArray(pList) == false)
            throw new Error("Primitive list must be array");
        
        if(typeof name != "string")
            throw new Error("Name must be a string");

        if(typeof vis != "boolean")
            throw new Error("Visible is not a boolean");

        let vertexLength = 0;    
        this.#vertexList = new Array()   
        for(let x = 0; x < vList.length; x += 1)
        {
            if(vList[x] instanceof Vertex == false)
            {
                this.#vertexList.length = vertexLength;
                throw new Error("Vertex List must contain Vertexes");
            }
            else
            {
                this.#vertexList.push(vList[x]);
                vertexLength += 1;
            }
        }

        let primitiveLength = 0;
        this.#primitiveList = new Array();
        for(let x = 0; x < pList.length; x += 1)
        {
            if(pList[x] instanceof Primitive == false)
            {
                this.#primitiveList.length = primitiveLength;
                throw new Error("Primitive List mut contain Primitives")
            }
            else
            {
                this.#primitiveList.push(pList[x]);
                primitiveLength += 1;
            }
        }

        this.#name = name;
        this.visible = vis;
    }

    /**
     * Create an empty model with the given name
     * 
     * @param {string} [name=""] the name of the model
     * @returns {Model} an empty model with the specified name
     */
    static buildName(name = "")
    {
        return new Model(new Array(), new Array(), name);
    }

    /**
     * @returns {Vertex[]} returns a reference to this models array of vertexes
     */
    getVertexList()
    {
        return this.#vertexList;
    }

    /**
     * @returns {Vertex[]} returns a reference to this models array of vertexes
     */
    get vertexList() {return this.#vertexList;}

    /**
     * @returns {Primitive[]} returns a reference to this models array of primitives
     */
    getPrimitiveList()
    {
        return this.#primitiveList;
    }

    /**
     * @returns {Primitive[]} returns a reference to this models array of primitives
     */
    get primitiveList() {return this.#primitiveList;}
    
    /**
     * @returns {string} returns a reference to this models name
     */
    getName()
    {
        return this.#name;
    }

    /**
     * @returns {string} returns a reference to this models name
     */
    get name() {return this.#name;}

    /**
     * @param {string} name the new name for this model
     */
    setName(name = "")
    {
        if(typeof name != "string")
            throw new Error("Name must be a string");

        this.#name = name;
    }

    /**
     * @param {string} n the new name for this model
     */
    set name(n)
    {
        if(typeof n != "string")
            throw new Error("Name must be a string");

        this.#name = n;
    }

    /**
     * Get the {@link Vertex} at the specified index in this models vertexList
     * 
     * @param {number} [index=0] the index into this models vertexList
     * @returns {Vertex} the vertex at the specified index
     */
    getVertex(index = 0)
    {
        if(typeof index != "number" )
            throw new Error("Index must be numerical");
        else
            return this.#vertexList[index];
    }
    
    /**
     * Add the vertex(s) to this models vertex list
     * @param  {...Vertex} vArray the vertexes to be added to the model
     */
    addVertex(... vArray)
    {
        for(let v of vArray)
        {
            if(v instanceof Vertex == false)
                throw new Error("Can only add Vertexes");
            else
                this.#vertexList.push(v);
        }
    }

     /**
     * Get the {@link Primitive} at the specified index in this models primitive list
     * 
     * @param {number} [index=0] the index into this models primitive list
     * @returns {Primitive} the primitive at the specified index
     */
    getPrimitive(index = 0)
    {
        if(typeof index != "number" )
            throw new Error("Index must be numerical");
        else
            return this.#primitiveList[index];
    }

    /**
     * Add the primitive(s) to this models primitive list
     * @param  {...Primitive} pArray the primitives to be added to the model
     */
    addPrimitive(... pArray)
    {
        for(let p of pArray)
        {
            if(p instanceof Primitive == false)
                throw new  Error("Can only add primitives");
            else
                this.#primitiveList.push(p);
        }
    }

    /**
     * For debugging.
     * @returns {string} the string representation of this model
     */
    toString()
    {
        let result = "";
        result += "Model: " + this.#name + "\n";
        result += "This Model's visibility is: " + this.visible + "\n";
        result += "Model has " + this.#vertexList.length + " vertices.\n";
        result += "Model has " + this.#primitiveList.length + " primitives.\n";
        
        let i = 0;
        for (let v of this.#vertexList)
        {
            result += i + ": " + v.toString() + "\n";
            ++i;
        }
        
        i = 0;
        for (let p of this.#primitiveList)
        {
            result += i + ": " + p.toString() + "\n";
            ++i;
        }

        return result;
    }

    /**
     * Method for testing the class
     */
    static main()
    {
        console.log("Creating m1 = new Model(): ");
        const m1 = new Model();
        console.log(m1.toString());

        console.log("");
        console.log("Creating m2 = buildName('Model 2'): ");
        const m2 = Model.buildName("Model 2");
        console.log(m2.toString());

        console.log("");
        console.log("m1.getVertexList(): ");
        console.log(m1.getVertexList());
        
        console.log("");
        console.log("m1.vertexList(): ");
        console.log(m1.vertexList);

        console.log("");
        console.log("m1.getPrimitiveList(): ");
        console.log(m1.getPrimitiveList());

        console.log("");
        console.log("m1.primitiveList(): ");
        console.log(m1.primitiveList);

        console.log("");
        console.log("m1.getName(): ");
        console.log(m1.getName());

        console.log("");
        console.log("m1.name(): ");
        console.log(m1.name);

        console.log("");
        console.log("m1.setName('Model 1')");
        m1.setName("Model 1");
        console.log(m1.toString())

        console.log("");
        console.log("m1.addVertex(new Vertex(0, 0, 0): ");
        m1.addVertex(new Vertex(0, 0, 0));
        console.log(m1.toString());

        console.log("");
        console.log("m1.addVertex(new Vertex(1, 0, 0), new Vertex(-1, 0, 0), new Vertex(0, 1, 0), new Vertex(0, -1, 0)): ");
        m1.addVertex(new Vertex(1, 0, 0),
                    new Vertex(-1, 0, 0),
                    new Vertex(0, 1, 0),
                    new Vertex(0, -1, 0));
        console.log(m1.toString());

        console.log("");
        console.log("m1.getVertex(0).toString(): ");
        console.log(m1.getVertex(0).toString());

        console.log("");
        console.log("m1.getVertex(3).toString(): ");
        console.log(m1.getVertex(3).toString());

        console.log("");
        console.log("m1.addPrimitive(new Point(0, 0)")
        m1.addPrimitive(new Point(0));
        console.log(m1.toString());

        console.log("");
        console.log("m1.addPrimitive(new ls(1, 3, 1, 3), new ls(1, 4, 1, 4), new ls(2, 3, 2, 3), new ls(2, 4, 2, 4)): ");
        m1.addPrimitive(LineSegment.buildVertex(1, 3),
                        LineSegment.buildVertex(1, 4),
                        LineSegment.buildVertex(2, 3),
                        LineSegment.buildVertex(2, 4,));
        console.log(m1.toString());

        console.log("");
        console.log("m1.getPrimitive(0): ");
        console.log(m1.getPrimitive(0).toString());

        console.log("");
        console.log("m1.getPrimitive(3): ");
        console.log(m1.getPrimitive(3).toString());
    }
}