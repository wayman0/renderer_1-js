/*
 * Renderer 9. The MIT License.
 * Copyright (c) 2022 rlkraft@pnw.edu
 * See LICENSE for details.
*/

/**
   Rasterize a projected geometric {@link Primitive}
   into shaded pixels in a {{@link FrameBuffer.Viewport}.
*/

//@ts-check
import {RastLine, RastPoint, logPrimitive} from "./PipelineExports.js";
import {Model, LineSegment, Primitive, Point} from "../scene/SceneExports.js";
import {Viewport} from "../framebuffer/FramebufferExports.js";

/**@type {boolean} */export var rastDebug = false;
/**@type {boolean} */export var doCLipping = true;

/**
 * Rasterize every clipped primitive into shadded pixels in the viewport
 * 
 * @param {Model} model the model containing the primitives to be rasterized
 * @param {Viewport} vp the viewport to recieve the rasterized primitive
 */
export function rasterize(model, vp)
{
    for(const p of model.primitiveList)
    {
        logPrimitive("3. Rasterize", model, p);

        if(p instanceof LineSegment)
            RastLine(model, p, vp);
        else if(p instanceof Point)
            RastPoint(model, p, vp);
        else
            console.log("Incorrect Primitive: " + p);

            
    }
}

/**
 * Set rastDebug to be the specified value
 * @param {boolean} val the value to set rastDebug to be
 */
export function setRastDebug(val)
{
    rastDebug = val;
}

/**
 * Set doAntiAliasing to be the given value
 * @param {boolean} val the value to set doAntiAliasing to be
 */
export function setDoAntiAliasing(val)
{
    doAntiAliasing = val;
}

/**
 * Set doGamma to be the specified value
 * @param {boolean} val the value to set doGamma to be
 */
export function setDoGamma(val)
{
    doGamma = val;
}