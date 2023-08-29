/*
 * Renderer 1. The MIT License.
 * Copyright (c) 2022 rlkraft@pnw.edu
 * See LICENSE for details.
*/

/**
   Several static utility methods for checking
   and/or debugging a {@link Model}.
*/

//@ts-check

import {Model} from "../SceneExports.js";
/**
 * Determine if there are any obvious problems with the {@link Model}
      to be rendered. The purpose of these checks is to make the renderer
      a bit more user friendly. If a user makes a simple mistake and tries
      to render a {@link Model} that is missing vertices or line segments,
      then the user gets a helpful error message.
 * @param {Model} model 
 */
export function check(model)
{
    let err = false;

    if(model.vertexList.length == 0 && model.primitiveList.length != 0)
    {
        console.log("***Warning: this model does not have any vertices.");
        err = true;
    }

    if(model.vertexList.length != 0 && model.primitiveList.length == 0)
    {
        console.log("***Warning: this model does not have any primitives");
        err = true;
    }

    if(err)
        console.log(model.toString);
}

/**
 * Check each {@link Primitive} in the {@link Model} to make sure that
      each index in the {@link Primitive}'s {@code vIndexList} refers to a
      valid {@link Vertex} in the {@link Model}'s {@code vertexList}.

 * @param {Model} model 
 * @return true if no problem is found false if an invalid index is found
 */
export function checkPrimitives(model)
{
    const numVertices = model.vertexList.length;
    let result = true;

    for(const p of model.primitiveList)
    {
        for(let i = 0; i < p.vIndexList.length; ++i)
        {
            if(i >= numVertices)
            {
                console.log("This primitive has invalide indexes");
                console.log(p.toString());
                result = false;
            }
        }
    }

    return result;
}