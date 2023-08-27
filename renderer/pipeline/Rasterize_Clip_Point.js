/*
 * Renderer 9. The MIT License.
 * Copyright (c) 2022 rlkraft@pnw.edu
 * See LICENSE for details.
*/

/**
   Rasterize a clipped {@link Point} into shaded pixels
   in a {@link FrameBuffer.Viewport}, but do not rasterize
   any part of the {@link Point} that is not contained in
   the {@link Camera}'s view rectangle.
*/

//@ts-check
import {rastDebug, logMessage, logPixelMessage} from "./PipelineExports.js";
import {Model, Point, LineSegment, Primitive} from "../scene/SceneExports.js";
import {Viewport} from "../framebuffer/FramebufferExports.js";
import Color from "../color/Color.js";
import format from "../StringFormat.js";

/**
 * rasterize a point into shaded pixels in a viewport
 * @param {Model} model the model containing the point
 * @param {Point} pt the point to be rasterized
 * @param {Viewport} vp the viewport to recieve the rasterized point
 */
export default function rastPoint(model, pt, vp)
{
    const CLIPPED = " : Clipped";
    const NOT_CLIPPED = "";

    // all pixels will be logged in float form.
    const bg = Color.convert2Float(vp.bgColorVP);  //vp.bgColorVP.convert2Float();

    const w = vp.width;
    const h = vp.height;

    const vIndex = pt.vIndexList[0];
    const v = model.vertexList[vIndex];

    let x = .5 + w/2.001 * (v.x + 1);
    let y = .5 + h/2.001 * (v.y + 1);

    if(rastDebug)
        logMessage(format("(x_pp, y_pp) = (%9.4f, %9.4f)", x, y));

    x = Math.round(x);
    y = Math.round(y);
    
    const radius = pt.radius;

    //this is wrong, the cast has higher precedence
    //for(let y_ = Math.trunc(y - radius); y_ <= Math.trunc(y + radius); ++y_)
    for(let y_ = (Math.trunc(y))-radius; y_ <= (Math.trunc(y)) + radius; ++y)
    {
        for(let x_ = (Math.trunc(x)) - radius; x_ <= (Math.trunc(x)) + radius; ++x_)
        {
            if(rastDebug)
            {
                let clippedMessage;

                if(x_ > 0 && x_ <= w && y_ > 0 && y_ <= h)
                    clippedMessage = NOT_CLIPPED;
                else
                    clippedMessage = CLIPPED;

                logPixelMessage(clippedMessage, x, y, x_-1, h -y_, vp);
            }
            
            if(x_ > 0 && x_ <= w && y_ > 0 && y_ <= h)
                vp.setPixelVP(x_-1, h-y_, Color.convert2Float(Color.white));  
        }
    }
}