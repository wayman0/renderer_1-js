/*
 * Renderer 1. The MIT License.
 * Copyright (c) 2022 rlkraft@pnw.edu
 * See LICENSE for details.
*/

/**
   Transform each {@link Vertex} of a {@link Model} from the model's
   (private) local coordinate system to the {@link Camera}'s (shared)
   coordinate system.
<p>
   For each {@code Vertex} object in a {@code Model} object, use a
   {@link Position}'s translation {@link Vector} to translate the
   object's {@code Vertex} coordinates from the model's coordinate
   system to the camera's coordinate system.
<p>
   Return a new {@code Model} object, which contains all the translated
   vertices from the original model, to the renderer. The original model
   object, which belongs to the client program, remains unchanged. So the
   renderer gets the mutated model and the client sees its model as being
   preserved.
*/

//@ts-check
import {Model, Position, Vertex} from "../scene/SceneExports.js";

export default function model2camera(position)
{
    const mod = position.model;
    const trans = position.translation;
    const newVertexList = new Array(mod.vertexList.length());

    for(const v of mod.vertexList)
        newVertexList.push(trans.plus(v));

    return new Model(newVertexList, 
                     mod.primitiveList,
                     position.name + "::" + mod.name, 
                     mod.visible);
}

