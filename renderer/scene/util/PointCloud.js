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

import {Model} from "../SceneExports.js";

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

}