/*
 * Renderer 1. The MIT License.
 * Copyright (c) 2022 rlkraft@pnw.edu
 * See LICENSE for details.
*/

/**
   Convert a {@link Model} object into a point cloud {@link Model}.
<p>
   See <a href="https://en.wikipedia.org/wiki/Point_cloud" target="_top">
                https://en.wikipedia.org/wiki/Point_cloud</a>
*/
//@ts-check

import {Model, Point} from "../SceneExports.js";

/**
 * Method that converts a given model into a new model 
 * made up of only point primitives
 * 
 * @param {Model} model 
 * @param {number} [pointSize = 0] the diameter of the points
 * @return a Model that is a point cloud
 */
export default function make(model, pointSize = 0)
{
   if(model instanceof Model == false)
      throw new Error("Model must be a model");

   if(typeof pointSize != "number")
      throw new Error("Point size must be a number");

   const pointCloud = new Model(model.vertexList, new Array(), "PointCloud: " + model.name, model.visible);

   const indices = new Array(model.vertexList.length);

   for(const p of model.primitiveList)
   {
      for(const i of p.vIndexList)
         indices[i] = true;
   }

   for(let i = 0; i < indices.length; ++i)
   {
      if(indices[i])
         pointCloud.addPrimitive(new Point(i));
   }

   for(const p of pointCloud.primitiveList)
      /**@type {Point}*/ (p).radius = pointSize;

   return pointCloud;
}