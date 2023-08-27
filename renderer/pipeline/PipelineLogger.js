/*
 * Renderer 9. The MIT License.
 * Copyright (c) 2022 rlkraft@pnw.edu
 * See LICENSE for details.
*/

/**
 * methods used by the pipeline stages to log info
 */
//@ts-check
import {Model, Vertex, Primitive, LineSegment, Point} from "../scene/SceneExports.js";
import {Viewport} from "../framebuffer/FramebufferExports.js";
import Color from "../color/Color.js";
import format from "../StringFormat.js";

/**@type {boolean} whether to debug the scene */    export let debugScene = false;
/**@type {boolean} whether to debug the position */ export let debugPosition = false;

/**
 * Use the debug info to determine whether to log info
 * @param {string} message the message to be recorded
 */
export function logMessage(message)
{
    if(debugScene || debugPosition)
        console.log(message);
}

/**
 * Prints a string representation of the given vertex list
 * @param {string} stage the stage of the pipeline
 * @param {Model} model the model being rendered
 */
export function logVertexList(stage, model)
{
    if(debugScene || debugPosition)
    {
        let i = 0; 
        for(const v of model.vertexList)
        {
            console.log(stage + ": vIndex = " + i + ", " + v.toString() + "\n");
            i += 1;
        }
    }
}

/**
 * Prints a string representation of the given primitive list
 * @param {string} stage the stage of the pipeline
 * @param {Model} model the model being rendered 
 */
export function logPrimitiveList(stage, model)
{
    if(debugScene || debugPosition)
    {
        if(model.primitiveList.length == 0)
            console.log(stage + ": []\n");
        else
        {
            for(const p of model.primitiveList)
                console.log(stage + ": " + p.toString() + "\n");
        }
    }
}

/**
 * Prints a string representation of the given primitive
 * @param {string} stage the stage of the pipeline
 * @param {Model} model the model being rendered
 * @param {Primitive} p the primitive to be logged
 */
export function logPrimitive(stage, model, p)
{
    if(debugScene || debugPosition)
    {
        console.log(stage + ": " + p.toString() + "/n");

        for(const vIndex of p.vIndexList)
        {
            const v = model.vertexList[vIndex];
            console.log("   vIndex = " + vIndex + ", " + v.toString() + "\n");
        }
    }
}

/**
 * Prints a string representation of the given pixel being rasterized
 * 
 * @param {string} clippedMessage string specifying whether or not the pixel has been clipped
 * @param {number} xpp horizontal pixel plane coordinate
 * @param {number} ypp vertical pixel plane coordinate
 * @param {number} xvp horizontal viewport coordinate
 * @param {number} yvp vertical viewport coordinate
 * @param {Viewport} vp the viewport the pixel is being set into
 */
export function logPixelMessage(clippedMessage, xpp, ypp, xvp, yvp, vp)
{
    if(debugScene || debugPosition)
    {
        let wVP = vp.width;
        let hVP = vp.height;
        let xVP = vp.vp_ul_x;
        let yVP = vp.vp_ul_y;
        let fb = vp.getFrameBuffer();
        let wFB = fb.width;
        let hFB = fb.height;

        console.log(format("fb_[w=%d,h=%d] vp_[x=%4d, y=%4d, w=%d,h=%d]  (x_pp=%9.4f, y_pp=%9.4f)  (x_vp=%4d, y_vp=%4d)",
                    wFB, hFB,      xVP,   yVP,   wVP, hVP,    xpp,       ypp,         xvp,     yvp));
        console.log(clippedMessage);
    }
}

/**
 * Set debugScene to be the specified value
 * @param {boolean} val the value to set debugScene to be 
 */
export function setDebugScene(val)
{
    debugScene = val;
}

/**
 * Set debugPosition to be the specified value
 * @param {boolean} val the value to set debugPosition to be 
 */
export function setDebugPosition(val)
{
    debugPosition = val;
}



