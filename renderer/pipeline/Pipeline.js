/*
 * Renderer 9. The MIT License.
 * Copyright (c) 2022 rlkraft@pnw.edu
 * See LICENSE for details.
*/

/**
   This renderer takes as its input a {@link Scene} data structure
   and a {@link FrameBuffer.Viewport} within a {@link FrameBuffer}
   data structure. This renderer mutates the {@link FrameBuffer.Viewport}
   so that it is filled in with the rendered image of the geometric
   scene represented by the {@link Scene} object.
<p>
   This implements our eigth rendering pipeline. This renderer
   implements "hierarchical scenes" by recursively traversing the
   DAG of nested {@link Position}s below each of a {@link Scene}'s
   {@link Position} objects. As the renderer traverses deeper into
   the DAG of nested {@link Position}s, it accumulates a "current
   transformation matrix" that transforms each {@link Vertex} from a
   {@link Model}'s local coordinate system to the {@link Camera}'s
   (shared) view coordinate system. The recursive traversal of the
   scene's DAG is not a new pipeline stage, so there are still six
   pipeline stages.
*/

//@ts-check
import {Camera, Model, Position, Scene, Vertex} from "../scene/SceneExports.js";
import {check} from "../scene/util/UtilExports.js";
import {FrameBuffer} from "../framebuffer/FramebufferExports.js";
import {model2camera, project, rasterize, logMessage, logVertexList, logPrimitiveList, setDebugScene} from "./PipelineExports.js";
import Color from "../color/Color.js";

/**@type {Color} */ export var DEFAULT_COLOR = Color.white;

/**
 *  Mutate the {@link FrameBuffer}'s default {@link FrameBuffer.Viewport}
    so that it holds the rendered image of the {@link Scene} object.
 * @param {Scene} scene the scene to be rendererd
 * @param {FrameBuffer} fb the parent framebuffer of the viewport to have the scene rendered into
 */
export default function render(scene, fb)
{
    if(scene instanceof Scene == false)
        throw new Error("Scene must be of type scene.");

    if(fb instanceof FrameBuffer == false)
        throw new Error("fb must be of type Framebuffer");

    setDebugScene(scene.debug);

    logMessage("\n== Begin Rendering of Scene: " + scene.name + " ==");

    for(const position of scene.positionList)
    {
        if(position.visible)
        {
            logMessage("==== Render Position: " + position.name + " ====");
            logMessage ("---- Translation Vector = " + position.getTranslation());

            if(position.getModel().visible)
            {
                logMessage("====== Render Model: " + position.getModel().name + " ======");
                
                check(position.getModel());

                logVertexList("0. Model    ", position.getModel());

                const model1 = model2camera(position);
                logVertexList("1. Camera   ", model1);

                const model2 = project(model1, scene.camera);
                logVertexList("2. Projected", model2);
                logPrimitiveList("2. Projected", model2);

                rasterize(model2, fb.vp);
                logMessage("====== End Model: " + position.getModel().name + " ======");
            }
            else
                logMessage("====== Hiden Model: " + position.getModel().name + " ======");
            
            logMessage("==== End Position: " + position.name + " ====");
        }
        else
            logMessage("==== Hidden Position: " + position.name + " ====");
    }
    logMessage("== End Rendering of Scene ==");
}