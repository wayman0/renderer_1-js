/*
 * Renderer 9. The MIT License.
 * Copyright (c) 2022 rlkraft@pnw.edu
 * See LICENSE for details.
*/

/**
   This {@code Camera} data structure represents a camera
   located at the origin, looking down the negative z-axis,
   with a near clipping plane.
<p>
   This {@code Camera} has a configurable "view volume" that
   determines what part of space the camera "sees" when we use
   the camera to take a picture (that is, when we render a
    {@link Scene}).
    <p>
       This {@code Camera} can "take a picture" two ways, using
       a perspective projection or a parallel (orthographic)
       projection. Each way of taking a picture has a different
       shape for its view volume. The data in this data structure
       determines the shape of each of the two view volumes.
    <p>
       For the perspective projection, the view volume (in view
       coordinates!) is an infinitely long pyramid that is formed
       by the pyramid with its apex at the origin and its base in
       the plane {@code z = -near} with edges {@code x = left},
       {@code x = right}, {@code y = top}, and {@code y = bottom}.
       The perspective view volume's shape is set by the
       {@link projPerspective} method.
    <p>
       For the orthographic projection, the view volume (in view
       coordinates!) is an infinitely long rectangular cylinder
       parallel to the z-axis and with sides {@code x = left},
       {@code x = right}, {@code y = top}, and {@code y = bottom}
       (an infinite parallelepiped). The orthographic view volume's
       shape is set by the {@link projOrtho} method.
    <p>
       When the graphics rendering {@link renderer.pipeline.Pipeline}
       uses this {@code Camera} to render a {@link Scene}, the renderer
       only "sees" the geometry from the scene that is contained in this
       camera's view volume. (Notice that this means the orthographic
       camera will see geometry that is behind the camera. In fact, the
       perspective camera also sees geometry that is behind the camera.)
       The renderer's {@link renderer.pipeline.NearClip} and
       {@link renderer.pipeline.Clip} pipeline stages are responsible
       for making sure that the scene's geometry that is outside of this
       camera's view volume is not visible.
    <p>
       The plane {@code z = -near} (in view coordinates) is the camera's
       image plane. The rectangle in the image plane with corners
       {@code (left, bottom, -near)} and {@code (right, top, -near)} is
       the camera's view rectangle. The view rectangle is like the film
       in a real camera, it is where the camera's image appears when you
       take a picture. The contents of the camera's view rectangle (after
       it gets "normalized" to camera coordinates by the renderer's
       {@link renderer.pipeline.View2Camera} stage) is what gets rasterized,
       by the renderer's {@link renderer.pipeline.Rasterize}
       pipeline stage, into a {@link renderer.framebuffer.FrameBuffer}'s
       {@link renderer.framebuffer.FrameBuffer.Viewport}.
    <p>
       For both the perspective and the parallel projections, the camera's
       near plane is there to prevent the camera from seeing what is "behind"
       the near plane. For the perspective projection, the near plane also
       prevents the renderer from incorrectly rasterizing line segments that
       cross the camera plane, {@code z = 0}.
    */
    
    //@ts-check
    import format from "../StringFormat.js";
    
    export default class Camera
    {
        /**@type {boolean} perspective whether the camera is projecting ortho or perspective*/ perspective;
        
        /**
         * Set up this {@code Camera}'s view volume as a specified by {@param} persp
         * 
         * @param {boolean} [persp=true] whether to project perspective or orthographic
         */
        constructor(persp = true)
        {
            if(typeof persp != "boolean")
                throw new Error("Perspective must be a boolean");
    
            if(persp)
                this.projPerspective();
            else
                this.projOrtho();
        }
    
        /**
         * Set up this {@code Camera}'s view volume as a perspective projection
         * of an infinite view pyramid extending along the negative z-axis.
         * 
         */    
        projPerspective()
        {
            this.perspective = true;
        }
    
        /**
         * Set up this {@code Camera}'s view volume as a parallel (orthographic)
           projection of an infinite view parallelepiped extending along the
           z-axis.
         */
        projOrtho()
        {
            this.perspective = false;
        }
    
        /**
          For debugging.
    
          @return {string} representation of this {@code Camera} object
        */
        toString()
        {
            let result = "";
            result += "Camera: \n";
            result += "  perspective = " + this.perspective + "\n";
            return result;
        }
    
        /**
         * Method for testing camera class
         */
        static main()
        {
            console.log("Creating cam1 = new Camera()");
            const cam1 = new Camera();
            console.log("cam1: ");
            console.log(cam1.toString());
    
            console.log("");
            console.log("cam1.projOrtho(): ");
            cam1.projOrtho();
            console.log(cam1.toString());

            console.log("");
            console.log("Creating cam2 = new Camera(false)");
            const cam2 = new Camera(false);
            console.log("cam2: ");
            console.log(cam2.toString());
    
            console.log("");
            console.log("cam2.projPerspective(): ");
            cam2.projPerspective();
            console.log(cam2.toString());
        }
    }