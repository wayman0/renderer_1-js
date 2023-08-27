/*
 * Renderer 9. The MIT License.
 * Copyright (c) 2022 rlkraft@pnw.edu
 * See LICENSE for details.
*/

/**
   Rasterize a clipped {@link LineSegment} into shaded pixels
   in a {@link FrameBuffer}'s viewport and (optionally)
   anti-alias and gamma-encode the line at the same time.
<p>
   This pipeline stage takes a clipped {@link LineSegment}
   with vertices in the {@link Camera}'s view rectangle and
   rasterizezs the line segment into shaded, anti-aliased
   pixels in a {@link FrameBuffer}'s viewport. This rasterizer
   will linearly interpolate color from the line segment's two
   endpoints to each rasterized (and anti-aliased) pixel in
   the line segment.
<p>
   This rasterization algorithm is based on
<pre>
     "Fundamentals of Computer Graphics", 3rd Edition,
      by Peter Shirley, pages 163-165.
</pre>
<p>
   This rasterizer implements a simple version of Xiaolin_Wu's
   anti-aliasing algorithm. See
     <a href="https://en.wikipedia.org/wiki/Xiaolin_Wu's_line_algorithm" target="_top">
              https://en.wikipedia.org/wiki/Xiaolin_Wu's_line_algorithm</a>
*/

//@ts-check
import {rastDebug, logMessage, logPixel} from "./PipelineExports.js";
import {Model, LineSegment} from "../scene/SceneExports.js";
import {Viewport} from "../framebuffer/FramebufferExports.js";
import Color from "../color/Color.js";
import format from "../StringFormat.js";
import { doCLipping } from "./Rasterize.js";

/**
 *  Rasterize a clipped {@link LineSegment} into anti-aliased, shaded pixels
    in the {@link FrameBuffer.Viewport}.

 * @param {Model} model the model containing the linesegment
 * @param {LineSegment} ls the linesegment to be rasterized
 * @param {Viewport} vp the viewport to set the pixels in
 */
export default function rastLine(model, ls, vp)
{

    // all colors will be in float form
    const     CLIPPED = "Clipped: ";
    const NOT_Clipped = "         ";
    const c = Color.white;

    const bg = Color.convert2Float(vp.bgColorVP);
    const w = vp.width;
    const h = vp.height;

    const vIndex0 = ls.vIndexList[0];
    const vIndex1 = ls.vIndexList[1];
    const v0 = model.vertexList[vIndex0];
    const v1 = model.vertexList[vIndex1];

    let x0 = .5 + w/2.001 * (v0.x + 1);
    let y0 = .5 + h/2.001 * (v0.y + 1);
    let x1 = .5 + w/2.001 * (v1.x + 1);
    let y1 = .5 + h/2.001 * (v1.y + 1);
    
    if(rastDebug)
    {
        logMessage(format("(x0_pp, y0_pp) = (%9.4f, %9.4f)", x0, y0));
        logMessage(format("(x1_pp, y1_pp) = (%9.4f, %9.4f)", x1, y1));
    }

    x0 = Math.round(x0), x1 = Math.round(x1);
    y0 = Math.round(y0), y1 = Math.round(y1);

    //x0 = Math.trunc(x0), x1 = Math.trunc(x1);
    //y0 = Math.trunc(y0), y1 = Math.trunc(y1);
    
    //console.log("(%d, %d), (%d, %d)", x0, y0, x1, y1);

    if( (x0 == x1) && (y0 == y1))
    {
        const x0VP = (Math.trunc(x0)) -1;
        const y0VP = h- (Math.trunc(y0));

        if(!doCLipping || (x0VP >= 0 && x0VP <w && y0VP >= 0 && y0VP < h))
        {
            if(rastDebug)
                logPixel(NOT_Clipped, x0, y0, x0VP, y0VP, vp);

            vp.setPixelVP(x0VP, y0VP, Color.convert2Float(Color.white));
        }
        else if(doCLipping && rastDebug)
            logPixel(CLIPPED, x0, y0, x0VP, y0VP, vp);

        return;
    }

    if(Math.abs(y1-y0) > Math.abs(x1-x0))
    {
        if(x1 < x0)
        {
            const tempX = x0;
            const tempY = y0;
            x0=x1;
            y0=y1;
            x1=tempX;
            y1=tempY;
        }
    

        const m = (y1 - y0)/(x1-x0);
        
        if(rastDebug)
        {
            logMessage("Slope m    = " + m);
            logMessage(format("(x0_vp, y0_vp) = (%9.4f, %9.4f)", x0-1, h-y0));
            logMessage(format("(x1_vp, y1_vp) = (%9.4f, %9.4f)", x1-1, h-y1));
        }

        let y = y0;

        for(let x = Math.trunc(x0); x < Math.trunc(x1); x += 1, y += m)
        {
            const xVP = x - 1;
            const yVP = h - (Math.trunc(Math.round(y)));

            if(!doCLipping || (xVP >= 0 && xVP < w && yVP >= 0 && yVP < h))
            {    if(rastDebug)
                    logPixel(NOT_Clipped, x, y, xVP, yVP, vp);

                vp.setPixelVP(xVP, yVP, c);
            }
            else if(doCLipping && rastDebug)
                logPixel(CLIPPED, x, y, xVP, yVP, vp);
        }
    }
    else
    {
        if(y1 < y0)
        {
            const tempx = x0; 
            const tempy = y0;
            x0 = x1;
            x1 = tempx;
            y0 = y1;
            y1 = tempy;
        }

        const m = (x1 - x0) / (y1 -y0);

        if(rastDebug)
        {
            logMessage("Slope m = " + m + " (so 1/m = " + 1/m + ")");
            logMessage(format("(x0_vp, y0_vp) = (%9.4f, %9.4f)", x0-1,h-y0));
            logMessage(format("(x1_vp, y1_vp) = (%9.4f, %9.4f)", x1-1,h-y1));
        }

        let x = x0;

        for(let y = Math.trunc(y0); y < Math.trunc(y1); x += m, y += 1)
        {
            const xVP = Math.trunc(Math.round(x)) - 1;
            const yVP = h-y;

            if(!doCLipping || (xVP >= 0 && xVP < w && yVP >= 0 && yVP < h))
            {
                if(rastDebug)
                    logPixel(NOT_Clipped, x, y, xVP, yVP, vp);
                
                vp.setPixelVP(xVP, yVP, c);
            }
            else if(doCLipping && rastDebug)
                logPixel(CLIPPED, x, y, xVP, yVP, vp);
        }
    }
}