
               Basic Renderer


A "renderer" is a collection of algorithms that takes as its input a
Scene data structure and produces as its output a FrameBuffer data
structure.

                           Renderer
                       +--------------+
       Scene           |              |         FrameBuffer
       data     ====>  |  Rendering   |  ====>     data
     structure         |  algorithms  |          structure
                       |              |
                       +--------------+

A Scene data structure contains information that describes a "virtual scene"
that we want to take a "picture" of. The renderer is kind of like a digital
camera and the FrameBuffer is like the camera's film. The renderer takes a
picture of the Scene and stores the picture in the FrameBuffer data structure.
The FrameBuffer holds the pixel information that describes the picture of the
scene.

The rendering algorithms can be implemented in hardware (a graphics card
or GPU) or in software. In this class we will write a software renderer
using the Java programming language.

Our software renderer is made up of four "packages" of Java classes.
Each package is contained in its own directory. The name of the directory
is the name of the package.

The first package is the collection of input data structures. This is called
the "scene" package. The data structure files in the scene package are:
   Scene.java
   Camera.java
   Position.java
   Model.java
   Primitive.java
   LineSegment.java
   Point.java
   Vertex.java
   Vector.java

The second package is the output data structure. It is called the
"framebuffer" package and contains the file
   FrameBuffer.java.

The third package is a collection of algorithms that manipulate the
data structures from the other two packages. This package is called
the "pipeline" package. The algorithm files are:
   Pipeline.java
   Model2Camera.java
   Projection.java
   Rasterize.java
   Rasterize_Clip_Line.java
   Rasterize_Clip_Point.java

The fourth package is a library of geometric models. This package is
called the "models_L" package. It contains a number of files for geometric
shapes such as sphere, cylinder, cube, cone, pyramid, tetrahedron,
dodecahedron, and mathematical curves and surfaces.

There is also a fifth package, a collection of client programs that use
the renderer. These files are in a package called clients_r1.

Here is a brief description of the data structures from the scene and
framebuffer packages.

   A Scene object has a Camera object and a List of Position objects.

   A Camera object has a boolean which determines if the camera is a
   perspective camera or an orthographic camera.

   A Position object has a Model object and a Vector object.

   A Vector object has three doubles, the x, y, z coordinates of
   a vector in 3-dimensional space. A Vector represents a location
   in 3-dimensional space (the location of the Model that is in
   a Position with the Vector).

   A Model object has a List of Vertex objects and a List of
   Primitive objects.

   A Vertex object has three doubles, the x, y, z coordinates of
   a point in 3-dimensional space.

   A Primitive object is either a LineSegment object or a Point object.

   A LineSegment object has an array of two integers. The two
   integers are indices into the Model's list of vertices. This
   lets a LineSegment object represent the two endpoints of a
   line segment in 3-dimensional space.

   A Point object is a single integer index into the Model's list
   of vertices. This lets a Point object represent a single point
   in 3-dimensional space.

   A FrameBuffer object represents a two-dimensional array of pixel data.
   Pixel data represents the red, green, and blue colors of each pixel
   in the image that the renderer produces. The FrameBuffer also defines
   a sub-array of pixel data called a Viewport.


Packages, imports, classpath
============================

Before we go into the details of what is in each renderer package, let
us review some of the details of how the Java programming language uses
packages.

But first, let us review some of the details of how Java classes are
defined and how the Java compiler compiles them.

A Java class is defined in a text file with the same name as the class
but with the filename extension ".java". When the compiler compiles the
class definition, it produces a binary (machine readable) version of the
class and puts the binary code in a file with the same name as the class
but with the file name extension ".class".

Every Java class will make references to other Java classes. For example,
here is a simple Java class called SimpleClass that should be stored in
a text file called SimpleClass.java.

import java.util.Scanner;
public class SimpleClass {
   public static void main(String[] args) {
      Scanner in = new Scanner(System.in);
      int n = in.nextInt();
      System.out.println(n);
   }
}

This class refers to the Scanner class, the String class, the System
class, the InputStream class, the PrintStream class, and, in fact, many
other classes. When you compile the source file SimpleClass.java, the
compiler produces the binary file SimpleClass.class. As the compiler
compiles SimpleClass.java, the compiler checks for the existence of all
the classes referred to by SimpleClass.java. For example, while compiling
SimpleClass.java the compiler looks for the file Scanner.class. If it
finds it, the compiler continues with compiling SimpleClass.java. But if
Scanner.class is not found, then the compiler looks for the text file
Scanner.java. If the compiler finds Scanner.java, the compiler compiles it
to produce Scanner.class, and then continues with compiling SimpleClass.java.
If the compiler cannot find Scanner.java, then you get a compiler error from
compiling SimpleClass.java. The same goes for all the other classes referred
to by SimpleClass.java.

Here is an important question. When the compiler sees, in the compiling of
SimpleClass.java, a reference to the Scanner class, how does the compiler
know where it should look for the files Scanner.class or Scanner.java?
These files could be anywhere on your computer's storage drive. Should the
compiler search your computer's entire storage drive for the Scanner class?
The answer is no, for two reasons (one kind of obvious reason and one kind
of subtle reason). The obvious reason is that the computer's storage drive
is very large and searching it is time consuming. If the compiler has to
search your entire drive for every class reference, it will take way too
long to compile a Java program. The subtle reason is that it is very common
for computer systems to have multiple versions of Java on the storage drive.
If the compiler searched the whole storage drive for classes, it might find
classes from different versions of Java and then try to use them together,
which does not work. All the class files must come from the same version of
Java.

The compiler needs help in finding Java classes so that it does not choose
classes from different versions of Java and so that it only needs to look
in certain, controlled places on the computer's storage drive.

Part of the solution to helping the compiler find class definitions are the
import statements at the beginning of a class definition.

An import statement tells the Java compiler how to find a class definition.
In SimpleClass.java, the import statement
   import java.util.Scanner;
tells the compiler to find a folder named "java" and then within that folder
find a folder named "util" and then within that folder find a class file
named Scanner.class or a source file named Scanner.java.

The folders in an import statement are called "packages". In Java, a package
is a folder on your computer's storage drive that contains a collection of
Java class files or Java source files. The purpose of a package is to organize
Java classes. In a large software project there will always be many classes.
Having all the classes from a project (maybe thousands of them) in one folder
would make understanding the project's structure and organization difficult.
Combining related classes into a folder helps make the project's structure
clearer.

The import statement
   import java.util.Scanner;
tells us (and the compiler) that Java has a package named "java" and a
sub-package named "java.util". The Scanner class is in the package
"java.util" (notice that the package name is "java.util", not "util").
Look at the Javadoc for the Scanner class.
   https://docs.oracle.com/en/java/javase/17/docs/api/java.base/java/util/Scanner.html
The very beginning of the documentation page tells us the package that
this class is in.

What about the class String? Where does the compiler look for the String
class? Notice that there is no import statement for the String class. Look
at the Javadoc for the String class.
   https://docs.oracle.com/en/java/javase/17/docs/api/java.base/java/lang/String.html
The String class is in a package named "java.lang". The java.lang package
is automatically imported for us by the Java compiler. This package contains
classes that are so basic to the Java language the all Java programs will
need them, so these classes are all placed in one package and that package
gets automatically imported by the Java compiler.

We still haven't fully explained how the Java compiler finds the Scanner
class. The import statement
   import java.util.Scanner;
tells the compiler to find a folder called "java" and the Scanner class
will be somewhere inside that folder. But where does the compiler find
the "java" folder? Should it search your computer's entire storage drive
for a folder called "java"? Obviously not, but we seem to be right back
to the problem that we started with. Where does the compiler look on
your computer's storage drive? The answer is another piece of the Java
system, something called the "classpath".

The "classpath" is a list of folder names that the compiler starts its
search from when it searches for a package. A classpath is written as
a string of folder names separated by semicolons (or colons on a Linux
computer). A (Windows) classpath might look like this.

   "C:\myProject;C:\youLibrary\utils;D:\Important\Classes"

This classpath has three folder names in its list. A Linux classpath
might look like this.

   "/myProject:/youLibrary/utils:/Important/Classes"

When you compile a Java source file, you can specify a classpath on the
compiler command-line.

> javac -cp C:\myProject;C:\youLibrary\utils;D:\Important\Classes  MyProgram.java

The Java compiler will only look for packages that are subfolders of the
folders listed in the classpath.

The Java compiler has some default folders that it always uses as part of
the classpath, even if you do not specify a value for the classpath. The
JDK that you install on your computer is always part of the compiler's
classpath. So Java packages like "java.lang" and "java.util" (and many
other packages), which are part of the JDK, are always in the compiler's
classpath.

If you do not specify a classpath, then the compiler's default classpath
will include the directory containing the file being compiled (the "current
directory"). However, if you DO specify a classpath, then the compiler will
NOT automatically look in the current directory. Usually, when someone gives
the compiler a classpath, they explicitly include the "current directory"
in the classpath list. In a classpath, the name you use for the "current
directory" is a single period, ".". So a classpath that explicitly includes
the current directory might look like this.

> javac -cp .;C:\myProject;C:\youLibrary\utils;D:\Important\Classes  MyProgram.java

You can put the "." anywhere in the classpath, but most people put it at the
beginning of the classpath to make it easier to read. A common mistake is to
specify a classpath but forget to include the current directory in it.

Here is an example of an import statement from our renderer.

   import renderer.scene.util.DrawSceneGraph;

This import statement says that there is a folder named renderer with a
subfolder named scene with a subfolder named util that contains a file
named DrawSceneGraph.java. The file DrawSceneGraph.java begins with a
line of code called a "package statement".

   package renderer.scene.util;

A package statement must come before any import statements.

So a class file contains a "package statement" declaring where that class
file should be located. Any Java program that wants to use that class (a
"client" of that class) should include an "import statement" that matches
the "package statement" from the class. When the client is compiled, we
need to give the compiler a "classpath" that includes the package name
used in the package and import statements.

A Java class is not required to have a package statement. A class without
a package statement becomes part of a special package called the "unnamed
package". The "unnamed package" is always automatically imported by the
compiler. The unnamed package is used mostly for simple test programs or
simple programs demonstrating an idea, or examples programs in introductory
programming courses. The unnamed package is never used for library classes
or classes that need to shared as part of a large project.

There is still more to learn about how the Java compiler finds and compiles
Java classes. For example, we have not yet said anything about jar files.
Later we will see how, and why, to use jar files.

https://docs.oracle.com/javase/tutorial/java/package/index.html
https://docs.oracle.com/javase/tutorial/java/package/QandE/packages-questions.html

https://en.wikipedia.org/wiki/Classpath

https://docs.oracle.com/javase/specs/jls/se17/html/jls-7.html#jls-7.4.2

https://en.wikipedia.org/wiki/JAR_(file_format)


FrameBuffer (interface)
=======================

A FrameBuffer object holds an array of pixel data that represents an
image that can be displayed on a computer's screen.

We are going to take the view that a FrameBuffer is an "abstract data
type" with a public interface and a private implementation.

The public interface that a FrameBuffer object presents to its clients
is a two-dimensional array of colored pixels. A FrameBuffer constructor
determines the dimensions of the array of pixels (once a FrameBuffer is
constructed, its dimensions are immutable). A FrameBuffer object has
methods that allow the color of any pixel to be set or retrieved. There
is much more to the FrameBuffer interface, but his is the core part
(read the Javadocs for the FrameBuffer class to see the whole interface).

Each pixel in a FrameBuffer represents the color of a single "dot" in a
computer's display. We are going to take the view that a Color is another
abstract data type (with a public interface and a private implementation).
The Color class is defined for us by the Java class library. A Color object
has three components, the amount of red, green, and blue that is mixed
into the color represented by the object.

FrameBuffer (implementation)
============================

When you use an abstract data type, you normally don't need to know the
details of its (private) implementation. But since our goal is to write
the implementation of a renderer, we need to determine the details of our
implementation of the FrameBuffer interface. Since a FrameBuffer appears
to its clients to be a two-dimensional array of Colors, you might expect
the FrameBuffer class to be implemented as a two-dimensional array of
Color objects, Color[][]. But that would not be a good implementation.
We shall implement the FrameBuffer class as a one-dimensional array of
integers, int[]. This array is called the FrameBuffer's pixel_buffer.

Remember that a Color object has three components, the amount of red,
green, and blue that make up a color. The human eye can see several
hundred shades of each primary color, red, green, and blue. Since our
eyes see several hundred shades of red, it is convenient to use 8 bits
(256 distinct values) to represent shades of red. Similarly for shades
of green and blue. So we need 24 bits to represent a shade of color
(notice that there are 256^3 = 2^24 = 16,777,216 distinct color shades).
A Java int is 32 bits, so we can fit the three bytes of red, green, and
blue data into a single int (and have 8 bits left over for later use).
A Java int is much more compact (in the computer's memory) that a Java
Color object. That is one reason why our FrameBuffer implementation will
use an array of (primitive) int instead of the more obvious array of Color
objects.

If a FrameBuffer has dimensions h rows by w columns of pixels, then the
FrameBuffer's array holds h*w integers. Our implementation of the
FameBuffer interface does NOT store its pixel data as a two-dimensional
h-by-w array of integers (nor is it stored as a three-dimensional
h-by-w-by-3 array of bytes). Our implementation of the FrameBuffer
interface will store its pixel data as a one-dimensional h*w array of
integers. This one-dimensional array is the "row major" form of the
two-dimensional data, meaning that the first w integers in the
one-dimensional array are the pixels from the image's first row. The
next w integers in the array are the pixels from the image's second row,
etc. The first w integers (the first row of pixels) is displayed as the
top row of pixels in the image on the computer's screen.

Here is a picture of a very small h-by-w FrameBuffer (with h = 4 and
w = 7) and its array-of-rows pixel array below it. Four rows and seven
columns means there are 28 pixels.

   0   1  2  3  4  5  6
  +--+--+--+--+--+--+--+
0 |  |  |  |  |  |  |  |
  +--+--+--+--+--+--+--+
1 |  |  |  |  |  |  |  |
  +--+--+--+--+--+--+--+
2 |  |  |  |##|  |  |  |
  +--+--+--+--+--+--+--+
3 |  |  |  |  |  |  |  |
  +--+--+--+--+--+--+--+


  |       row 0        |       row 1        |       row 2        |       row 3        |
  +--+--+--+--+--+--+--+--+--+--+--+--+--+--+--+--+--+--+--+--+--+--+--+--+--+--+--+--+
  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |##|  |  |  |  |  |  |  |  |  |  |
  +--+--+--+--+--+--+--+--+--+--+--+--+--+--+--+--+--+--+--+--+--+--+--+--+--+--+--+--+
   0  1  2  3  4  5  6  7  8  9  10 11 12 13 14 15 16 17 18 19 20 21 22 23 24 25 26 27

Let us see how we would translate a two-dimensional pixel address, (x, y),
into a one-dimensional index. Consider the pixel at (3, 2) (column 3 and
row 2) which is marked in the above picture. In the one-dimensional array,
this pixel needs to skip over two whole rows (of 7 pixels each) and then
skip over three more pixels. So the index of this pixel is 2 * 7 + 3 = 17.
In general, in a FrameBuffer with width w, a pixel at address (x, y) needs
to skip over y rows (of w pixels each) and then skip over an additional x
pixels, so the pixel has an index in the one-dimensional pixel array given
by

   index = (y * w) + x

This formula is used by the setPixelFB() method in the FrameBuffer class.

https://docs.oracle.com/en/java/javase/11/docs/api/java.desktop/java/awt/Color.html
https://en.wikipedia.org/wiki/Framebuffer
https://en.wikipedia.org/wiki/Pixel
https://en.wikipedia.org/wiki/Row-_and_column-major_order


Viewport
========

The FrameBuffer class also defines a Viewport class which represents a
rectangular sub-array of the pixel data in the FrameBuffer. A Viewport
is the active part of the FrameBuffer; its the part of the FrameBuffer
that the renderer writes data into. A Viewport has width and height
dimensions, w and h, with w <= m and h <= n. Quite often a Viewport will
be the whole FrameBuffer. Viewports that are smaller than the whole
FrameBuffer are used to implement special effects like "split screen"
(two independent images in the FrameBuffer), or "picture in a picture"
(a smaller picture superimposed on a larger picture). In future renderers
(starting with renderer 7), another use of a Viewport is when we want to
display an image with an aspect ratio different than the FrameBuffer's.

https://en.wikipedia.org/wiki/Split_screen_(computer_graphics)
https://en.wikipedia.org/wiki/Picture-in-picture


Viewport (implementation)
=========================

The Viewport class is implemental as a non-static nested class
(also called an inner class) within the FrameBuffer class. Inner
classes are not often covered in Java textbooks but they are fairly
common in the design of larger software systems.

A nested class is a class defined inside the definition of some
other class (the outer class). Here is a (very) brief outline of
the FrameBufer class and its inner Viewport class.

   class Framebuffer
   {
      final int width;   // instance variables
      final int height;
      final int[] pixel_buffer;

      public Framebuffer(int width, int height)
      {
         this.width = width;
         this.height = height;
         this.pixel_buffer = new int[width*height];
      }

      public class Viewport // inner class
      {
         final int x;  // instance variables for inner class
         final int y;
         final int width;
         final int height;
         public Viewport(int x, int y, int width, int height)
         {
            this.x = x;
            this.y = y;
            this.width = width;
            this.height = height;
         }
      }
   }

A nested class is defined in a way that is similar to how methods are
defined. A method is nested within a class definition and a method has
access to all the fields and other methods defined in the class. The same
is true for a nested class; it has access to all the fields and methods
defined in its outer class. But this is a very subtle idea. In order that
a nested class have access to the instance fields of its outer class, the
nested class must be instantiated with respect to a specific instance of
the outer class. In other words, an instance of the inner class cannot
have access to the fields of every and any instance of the outer class.
It would only make sense for an instance of the inner class to have access
to the fields of a specific instance of the outer class. For example, here
is the code for instantiating a FrameBuffer object and an associated
Viewport object.

   FrameBuffer fb = new FrameBuffer(100, 100);

   FrameBuffer.Viewport vp = fb.new Viewport(20, 20, 50, 50);

The FrameBuffer.Viewport notation is because the ViewPort class is a member
class of the FrameBuffer class. The fb.new notation is what specifies that
the new instance of the Viewport class must be tied to the fb instance of
FrameBuffer.

The Viewport object vp has access to the fields of the FrameBuufer
object fb. In particular, the Viewport has access to the pixel_buffer
of the FrameBuffer (a Viewport object does not itself store any pixel
data!). When we tell a Viewport to access a pixel, using either the
getPixelVP() or setPixleVP() methods, those Viewport methods end up
accessing the FrameBuffer's pixel_buffer.

Let us look at an illustration of a FrameBuffer and a Viewport.
Here is code that instantiates a FrameBuffer that has 5 rows by 8
columns of pixels with a Viewport that has 3 row and 4 columns and
with the Viewport's upper left-hand corner is at pixel (2, 1) in
the FrameBuffer.

   FrameBuffer fb = new FrameBuffer(8, 5);
   FrameBuffer.Viewport vp = fb.new Viewport(2, 1, 4, 3);

Here is a representation of this FrameBuffer and its Viewport.

   0   1  2  3  4  5  6  7
  +--+--+--+--+--+--+--+--+
0 |  |  |  |  |  |  |  |  |
  +--+--+--+--+--+--+--+--+
1 |  |  |##|##|##|##|  |  |
  +--+--+--+--+--+--+--+--+
2 |  |  |##|##|##|##|  |  |
  +--+--+--+--+--+--+--+--+
3 |  |  |##|##|##|##|  |  |
  +--+--+--+--+--+--+--+--+
4 |  |  |  |  |  |  |  |  |
  +--+--+--+--+--+--+--+--+

Here is how the rows of the Viewport are positioned within the
FrameBuffer's one-dimensional array-of-rows pixel_buffer. Notice
that the Viewport's rows are NOT contiguous within the pixel array.

|         row 0         |         row 1         |         row 2         |         row 3         |         row 4         |
+--+--+--+--+--+--+--+--+--+--+--+--+--+--+--+--+--+--+--+--+--+--+--+--+--+--+--+--+--+--+--+--+--+--+--+--+--+--+--+--+
|  |  |  |  |  |  |  |  |  |  |##|##|##|##|  |  |  |  |##|##|##|##|  |  |  |  |##|##|##|##|  |  |  |  |  |  |  |  |  |  |
+--+--+--+--+--+--+--+--+--+--+--+--+--+--+--+--+--+--+--+--+--+--+--+--+--+--+--+--+--+--+--+--+--+--+--+--+--+--+--+--+
 0  1  2  3  4  5  6  7  8  9  10 11 12 13 14 15 16 17 18 19 20 21 22 23 24 25 26 27 28 29 30 31 32 33 34 35 36 37 38 39

Given a Viewport pixel with coordinates (i, j), we know that its Framebuffer
coordinates are (x + i, y + j). From that FrameBuffer coordinate we know that
the (i, j) pixel from the Viewport has the following index in the FrameBuffer's
pixel_buffer.

    index = (y + j) * w + (x + i)

For example, consider pixel (2, 1) in the Viewport.

   0   1  2  3  4  5  6  7
  +--+--+--+--+--+--+--+--+
0 |  |  |  |  |  |  |  |  |
  +--+--+--+--+--+--+--+--+
1 |  |  |##|##|##|##|  |  |
  +--+--+--+--+--+--+--+--+
2 |  |  |##|##|@@|##|  |  |
  +--+--+--+--+--+--+--+--+
3 |  |  |##|##|##|##|  |  |
  +--+--+--+--+--+--+--+--+
4 |  |  |  |  |  |  |  |  |
  +--+--+--+--+--+--+--+--+

It is pixel (x + i, y + j) = (2 + 2, 1 + 1) = (4, 2) in the FrameBuffer.

 |         row 0         |         row 1         |         row 2         |         row 3         |         row 4         |
 +--+--+--+--+--+--+--+--+--+--+--+--+--+--+--+--+--+--+--+--+--+--+--+--+--+--+--+--+--+--+--+--+--+--+--+--+--+--+--+--+
 |  |  |  |  |  |  |  |  |  |  |##|##|##|##|  |  |  |  |##|##|@@|##|  |  |  |  |##|##|##|##|  |  |  |  |  |  |  |  |  |  |
 +--+--+--+--+--+--+--+--+--+--+--+--+--+--+--+--+--+--+--+--+--+--+--+--+--+--+--+--+--+--+--+--+--+--+--+--+--+--+--+--+
  0  1  2  3  4  5  6  7  8  9  10 11 12 13 14 15 16 17 18 19 20 21 22 23 24 25 26 27 28 29 30 31 32 33 34 35 36 37 38 39

That FrameBuffer pixel has array index = (y + j) * w + (x + i) = (1 + 1) * 8 + (2 + 2) = 20.


https://docs.oracle.com/javase/tutorial/java/javaOO/nested.html


Scene
=====

A Scene object represents a collection of geometric shapes positioned
in three dimensional space. A Scene object holds a List of Position objects.
Each Position object holds a Model object (which represents a geometric
shape) and a Vector object (which represents a location in 3D space). Each
Model is positioned, by its Vector, in front of a Camera which is located
at the origin and looks down the negative z-axis. Each Model object in a
Scene object represents a distinct geometric shape in the scene. A Model
object is a list of Vertex objects and a list of Primitive objects. A
Primitive is either a LineSegment or a Point. Each LineSegment object
refers to two of the Model's Vertex objects. The Vertex objects represent
points in the model's own coordinate system. The model's line segments
represent the geometric object as a "wire-frame", that is, the geometric
object is drawn as a collection of "edges". This is a fairly simplistic
way of doing 3D graphics and we will improve this in later renderers.

https://en.wikipedia.org/wiki/Wire-frame_model
https://www.google.com/search?q=3d+graphics+wireframe&tbm=isch


Camera
======

A Camera object represents a camera located at the origin of 3-dimensional
space looking down the negative z-axis. The 3-dimensional space looks
like this.

                  y-axis
                   |
                 2 +              -z-axis
                   |               /
                   |              /
                   |          -2 +
                   |      |     /
                   |      |    /     This 3D space is called "camera space".
                   |      |   /
                   |      |  /
                 1 +      | /
                   |      |/
                   |   -1 +------------ z = -1 is the Camera's "Image Plane"
                   |     /
                   |    /
                   |   /
                   |  /
                   | /
            Camera |/
--+----------------+----------------+---------> x-axis
 -1               /0                1
                 / |
                /  |
               /
            z-axis

We call this 3-dimensional space "camera space". The xy-plane of camera
space is parallel to the computer screen. The positive x-axis extends to
the right on the computer's screen and the positive y-axis extends upwards
on the computer's screen. The negative z-axis extends into the computer
screen and the positive z-axis extends out of the computer screen. Since
the camera is at the origin and is "looking" down the z-axis in the
negative direction, the camera cannot "see" anything that is positioned
with a positive z-coordinate.

A Camera object has associated to it a "view volume" that determines what
part of camera space the camera can "see" when we use the camera to take
a picture (that is, when we render a Scene).

A camera can "take a picture" two ways, using a "perspective projection"
or a "parallel (orthographic) projection". Each way of taking a picture
has a different shape for its view volume.

For the perspective projection, the view volume is an infinitely long
pyramid that is formed by the pyramid with its apex at the origin and its
base in the plane z = -1 with edges x = -1, x = +1, y = -1, and y = +1.

https://math.hws.edu/graphicsbook/c3/projection-frustum.png

For the orthographic projection, the view volume is an infinitely long
rectangular cylinder parallel to the z-axis and with sides x = -1, x = +1,
y = -1, and y = +1 (an infinite parallelepiped).

https://math.hws.edu/graphicsbook/c3/projection-parallelepiped.png

When the graphics rendering pipeline uses a Camera to render a Scene, the
renderer "sees" only the geometry from the scene that is contained in the
camera's view volume. (Notice that this means the orthographic camera will
see geometry that is behind the camera. In fact, the perspective camera also
sees geometry that is behind the camera.) The renderer's Rasterize
pipeline stage is responsible for making sure that the scene's geometry
that is outside of the camera's view volume is not visible (any geometry
outside of the view volume gets "clipped" off).

The plane z = -1 is the camera's image plane. The rectangle in the image
plane with corners (-1, -1, -1) and (+1, +1, -1) is the camera's view
rectangle.

                      View Rectangle
              (in the Camera's image plane, z = -1)

                          y-axis
                            |
                            |     (+1,+1,-1)
                  +-------------------+
                  |         |         |
                  |         |         |
                  |         |         |
                  |         |         |
                  |         |         |
               ---|---------+---------|------ x-axis
                  |         |         |
                  |         |         |
                  |         |         |
                  |         |         |
                  |         |         |
                  +-------------------+
             (-1,-1,-1)     |
                            |
                            |

The view rectangle is like the film in a real camera; it is where the
camera's image appears when you take a picture. Taking a picture means
that the models in the scene get projected flat onto the view rectangle
by the camera. The contents of the camera's view rectangle (after the
projection) is what gets rasterized, by the renderer's Rasterize pipeline
stage, into a FrameBuffer's viewport.

https://glumpy.readthedocs.io/en/latest/_images/projection.png
https://webglfundamentals.org/webgl/frustum-diagram.html
https://threejs.org/examples/#webgl_camera
https://math.hws.edu/graphicsbook/demos/c3/transform-equivalence-3d.html


Model, LineSegment & Vertex
===========================

A Model object represents a distinct geometric object in a Scene. A
Model data structure is mainly a list of Vertex objects and another
list of Primitive objects (which are either LineSegment or Point objects).

The Vertex objects represents points from the geometric object that we
are modeling. In the real world, a geometric object has an infinite number
of points. In 3D graphics, we "approximate" a geometric object by listing
just enough points to adequately describe the object. For example, in the
real world, a rectangle contains an infinite number of points, but it
can be adequately modeled by just its four corner points. (Think about
a circle. How many points does it take to adequately model a circle?)

Each LineSegment object contains two integers that are the indices
of two Vertex objects from the Model's vertex list. Each Vertex object
contains the xyz-coordinates, in the camera coordinate system, for one
of the line segment's two endpoints.

We use the LineSegment objects to "fill in" some of the space between
the model's vertices. For example, while a rectangle can be approximated
by its four corner points, those same four points could also represent
just two parallel line segments or a Z figure. By using four line segments
that connect around the four points, we get a good representation of a
rectangle.

Here is a simple example. Here are four vertices that are the four corners
of a square.

   Vertex v0 = new Vertex(0, 0, 0),
          v1 = new Vertex(1, 0, 0),
          v2 = new Vertex(1, 1, 0),
          v3 = new Vertex(0, 1, 0);

Create a Model and put those vertices in the model.

   Model m = new Model();
   m.addVertex(v0, v1, v2, v3);

So far the model has four vertices in it, but we have not yet specified
how those vertices are connected to each other, so the model is not ready
to be rendered.

These four LineSegment objects would make the model into a square.

   m.addPrimitive(new LineSegment(0, 1),  // connect v0 to v1
                  new LineSegment(1, 2),  // connect v1 to v2
                  new LineSegment(2, 3),  // connect v3 to v3
                  new LineSegment(3, 0)); // connect v3 back to v0

On the other hand, these three LineSegment objects would instead make
the four vertices into a Z shape.

   m.addPrimitive(new LineSegment(3, 2),  // connect v3 to v2
                  new LineSegment(2, 0),  // connect v2 to v0
                  new LineSegment(0, 1)); // connect v0 to v1

Draw pictures of the vertices and line segments to make sure you see
how the code creates the models.

If we want our model to be just four points, with no connecting line
segments, then we can use Point primitives instead of LineSegmnt
primitives. A Point object contains just one integer that is the
index of a Vertex object from the Model's vertex list.

   m.addPrimitive(new Point(0),   // v0 by itself
                  new Point(1),   // v1 by itself
                  new Point(2),   // v2 by itself
                  new Point(3));  // v3 by itself

We can mix Point and LineSegment primitives in a Model. The following
model has one diagonal line segment with a point on either side of it.

   m.addPrimitive(new Point(1),           // v1 by itself
                  new LineSegment(0, 2),  // connect v0 to v2
                  new Point(3));          // v3 by itself

If we model a circle using just points, we would probably need to
draw hundreds of points to get a solid looking circle (with no gaps
between points around the circumference). But if we connect every two
adjacent points around the circumference of the circle with a short
line segment, we can get a good model of a circle with just a few
dozen points (look at the Circle.java class in the renderer.models_L
package).

Our models represent geometric objects as a "wire-frame" of line
segments, that is, a geometric object is drawn as a collection of
"edges". This is a fairly simplistic way of doing 3D graphics and we
will improve this in later renderers.

https://en.wikipedia.org/wiki/Wire-frame_model
https://www.google.com/search?q=computer+graphics+wireframe&tbm=isch


Position
========

A Position object is an object with a reference to a Model and a reference
to a Vector. Each Position object in a Scene represents the Model located
in camera space at the location determined by the Vector.

Suppose that we want to model a square in 3-dimensional space. We can
do that with these four vertices in the xy-plane.
   (0, 0, 0)
   (1, 0, 0)
   (1, 1, 0)
   (0, 1, 0)
But if we think of these vertices as being in camera space, then the camera
cannot see the square because the square is not in front of the camera. In
order for the camera to see our square, we need the square to be positioned
within the camera's view volume. We could just change the four vertices so
that they represent a square within the camera's view volume, but modern
graphics renderers have a better solution to positioning objects in front
of the camera.

First, we consider all the Vertex objects in a Model to have coordinates in
what we call "model space" (instead of camera space). So the four vertices
shown above are not coordinates in camera space, they are coordinates in the
square model's own model space. Second, we associate to every Model in a
Scene a Vector that sets the location of the model in camera space. We use
the vector to set the model's location by adding the vector to each vertex
in the model and getting a new vertex in camera space. We can think of the
vector as translating each vertex of the model from the model's private
coordinate system into a vertex in the camera's coordinate system.

For example, if we associate with our model the Vector with coordinates
(2, 0, -3), then that vector specifies that our square model's vertices
become
   (2, 0, -3)
   (3, 0, -3)
   (3, 1, -3)
   (2, 1, -3)
which should put the square in front of the camera.

As we will see below, the actual addition of the position's vector to each of
the model's vertices is done by one of the steps in the rendering algorithms.


Scene Tree Data Structure
=========================

When you put all of the above information together, you see that
a Scene object is the root of a simple tree data structure.

            Scene
           /     \
          /       \
    Camera         List<Position>
                  /       |      \
                 /        |       \
         Position      Position    Position
         /  \           /    \          /  \
        /    \         /      \        /    \
  Vector    Model   Vector   Model   Vector  Model
                            /     \
                           /       \
                          /         \
               List<Vertex>          List<Primitive>
                 /      \                   /      \
                /        \                 /        \
           Vertex        Vertex      LineSegment   LineSegment
           /  |  \       /  |  \          |            |
          /   |   \     /   |   \         |            |
         x    y    z   x    y    z      int[2]       int[2]


https://en.wikipedia.org/wiki/Scene_graph


Renderer
========

Here is a brief overview of how the rendering algorithms process a Scene
data structure to produce the pixels that fill in a viewport within the
FrameBuffer object.

First of all, remember that:
   A Scene object contains a Camera and a list of Position objects.
   A Position object is a Model object and a Vector object.
   A Model object contains lists of Vertex and Primitive (LineSegment or Point) objects.
   A LineSegment object refers to two of the Vertex objects.
   A Vertex object contains the three coordinates of a point in the model.

The main job of the renderer is to "draw" in the FrameBuffer's viewport
appropriate pixels for each LineSgement in each Model from the Scene. The
"appropriate pixels" are the pixels "seen" by the camera. At its top level,
the renderer iterates through the Scene object's list of Position objects, and
for each Model object the renderer iterates through the Model object's list
of LineSegment objects. When the renderer has drilled down to a LineSegment
object, then it can render the line segment into the framebuffer's viewport.

The renderer does its work on a Model object in a "pipeline" of stages.
This simple renderer has just three pipeline stages. The stages that a
Model object passes through in this renderer are
  1. transformation (of the model's vertices from model space to camera space)
  2. projection (of the model's vertices from camera space to the image plane)
  3. rasterizer (of the model's line segments into a Viewport).

To understand the algorithms used in the rendering process, we need to
trace through the rendering pipeline what happens to each Vertex and
LineSegment object from a Model.

Start with a Model's list of vertices.

       v_0 ... v_n     A Model's list of Vertex objects
          \   /
           \ /
            |
            | model coordinates (of v_0 ... v_n)
            |
        +-------+
        |       |
        |   P1  |    Model2Camera transformation (of the vertices)
        |       |
        +-------+
            |
            | camera coordinates (of v_0 ... v_n)
            |
        +-------+
        |       |
        |   P2  |    Projection transformation (of the vertices)
        |       |
        +-------+
            |
            | image plane coordinates (of v_0 ... v_n)
            |
        +-------+
        |       |
        |   P3  |    Viewport transformation (of the vertices)
        |       |
        +-------+
            |
            | pixel-plane coordinates (of v_0 ... v_n)
            |
           / \
          /   \
         /     \
        |   P3  |   Rasterization & clipping (of each line segment)
         \     /
          \   /
           \ /
            |
            |  pixels (for each clipped line segment)
            |
           \|/
    FrameBuffer.ViewPort



Model2Camera
============

For each Position in the Scene, we add the Position's Vector to
every Vertex in the Position's Model. This has the effect of placing
the model where we want it to be in camera space. So, for example,
if our scene included a table model and four chair models, we would
give the table model a vector that placed the table where we want
it to be in front of the camera, then we would give each of the
chairs a vector that would place the chairs around the table.

Here is the code used by the Model2Camera,java file to move the
vertices in a model.

      final Model model = position.getModel();
      final Vector translate = position.getTranslation();

      // Replace each Vertex object with one that
      // contains camera coordinates.
      for (final Vertex v : model.vertexList)
      {
         newVertexList.add( translate.plus(v) );
      }

This code is given a reference to a Position object which holds references
to a Vector object and a Model object. The code iterates through all the
Vertex objects from the Model object's vertex list and for each Vertex the
code places a reference to a translated version of the vertex in a new
vertex list.

The new vertex list ends up holding references to all the new, translated,
vertices while the model's original vertex list still holds references to
the model's original vertices. It is important that we not change the
model's original vertex list because if we did, then, when the renderer
returns to the client program, the client would see all its models mutated
by the renderer. This would make writing client program more complicated.
If the client needs to use its models for rendering another scene, it
would need to rebuild all its models. It is better for the client to have
a guarantee from the renderer that the renderer will not make any changes
to the client's scene data structure.

The Model2Camera stage then takes the new vertex list and uses it to build
a new Model object.

      return new Model(newVertexList,
                       model.primitiveList,
                       position.getName() + "::" + model.getName(),
                       model.visible);

Notice that, along with getting a new vertex list, the new Model object
holds a reference to the original model's primitive list. Since we have
not (yet) made any changes to the primitive list, there is no need to
make a copy of it. If the renderer can use the original primitive list
without mutating it, then there is no reason to take the time (and the
memory space) to make a copy of the primitive list. So the new Model
and the original Model share the primitive list. This is an example of
a memory management technique that is a combination of "copy-on-write"
and "persistent data structures". When the renderer creates a new Model
object, it makes a copy of the original Model's vertex list (because it
needs to write new values in the vertices) but it persists the original
Model's primitive list (because it hasn't changed).

The new Model also gets renamed slightly. The new model's name is the
concatenation of the position's name with the original model's name.
This new name can be helpful when debugging.

The new Model object is returned to the renderer for use in the next
rendering stage, the projection stage.

https://en.wikipedia.org/wiki/Copy-on-write
https://en.wikipedia.org/wiki/Persistent_data_structure


Projection
==========

The projection stage takes the model's list of (transformed) three-dimensional
vertices and computes the two-dimensional coordinates of where each vertex
"projects" onto the camera's image plane (the plane with equation z = -1).
The projection stage takes the vertices inside of the camera's view volume
and projects them into the camera's view rectangle. Points outside of the
camera's view volume will project to points outside of the camera's view
rectangle.

https://www.scratchapixel.com/images/upload/rendering-3d-scene-overview/perspective4.png
https://glumpy.readthedocs.io/en/latest/_images/projection.png

The projection stage is the most important step in the 3D rendering pipeline.
This is the step that distinguishes a 3D graphics system from a 2D graphics
system. It is this step that gives our final image a sense of three
dimensional depth. This is the step that makes objects that are farther
from the camera appear smaller than objects closer to the camera. Another
way to put this is that projection is what makes an object grow smaller as
it moves away from the camera.

Let us derive the formulas for the perspective projection transformation
(the formulas for the parallel projection transformation are pretty obvious).
We will derive the x-coordinate formula; the y-coordinate formula is similar.

Let (x_c, y_c, z_c) denote a point in the 3-dimensional camera coordinate
system. Let (x_p, y_p, -1) denote the point's perspective projection onto
the camera's image plane, z = -1. Here is a "picture" of just the xz-plane
from camera space. This picture shows the point (x_c, z_c) in camera space
and its projection to the point (x_p, -1) in the image plane.

           x                  /
           |                 /
       x_c +                + (x_c, z_c)
           |               /|
           |              / |
           |             /  |
           |            /   |
           |           /    |
           |          /     |
           |         /      |
           |        /       |
       x_p +       +        |
           |      /|        |
           |     / |        |
           |    /  |        |
           |   /   |        |
           |  /    |        |
           | /     |        |
    Camera +-------+--------+------------> -z
         (0,0)    -1       z_c

We are looking for a formula that computes x_p in terms of x_c and z_c.
There are two similar triangles in this picture that share a vertex at the
origin. Using the properties of similar triangles we have the following
ratios. (Remember that these are ratios of positive lengths, so we write
-z_c, since z_c is on the negative z-axis).

              x_p       x_c
             -----  =  -----
               1       -z_c

If we solve this ratio for the unknown, x_p, we get the projection formula,

              x_p = -x_c / z_c.

The equivalent formula for the y-coordinate is

              y_p = -y_c / z_c.

http://ivl.calit2.net/wiki/images/2/2b/04_ProjectionF15.pdf#page=11
https://www.sumantaguha.com/wp-content/uploads/2022/06/chapter2.pdf#page=26 (Figure 2.51)
https://webglfundamentals.org/webgl/frustum-diagram.html


Rasterization
=============

The rasterizing stage first takes the two-dimensional coordinates of a
vertex in the camera's image plane and computes that vertex's location in a
"logical pixel plane". This is referred to as the "viewport transformation".
The purpose of the logical pixel plane and the viewport transformation is
to make the rasterization stage easier to implement.

The "pixel plane" is a plane of integer valued points. The pixel plane is an
abstraction that represents the idea of making color measurements at discrete,
equally spaced points. The points in the pixel plane are called "logical pixels".
Each logical pixel is an abstraction that represents the idea of making one
color measurement.

A rectangular region of the pixel plane can be used to initialize the color
values of a framebuffer's viewport. Each pixel in the viewport is given the
color from the logical pixel with the same coordinates.

The camera's image plane contains a view rectangle with edges x = -1, x = +1,
y = -1, and y = +1. The pixel plane contains a corresponding logical viewport
rectangle with edges x = 0.5, x = w+0.5, y = 0.5, and y = h+0.5 (where h and
w are the height and width of the framebuffer's viewport).

Recall that the role of the camera's view rectangle is to determine what
part of a scene is visible to the camera. Vertices inside of the camera's
view rectangle should end up as pixels in the framebuffer's viewport.
Another way to say this is that we want only that part of each projected
line segment contained in the view rectangle to be rasterized into the
framebuffer's viewport.

Any vertex inside of the image plane's view rectangle should be transformed
to a logical pixel inside of the pixel plane's logical viewport. Any vertex
outside of the image plane's view rectangle should be transformed to a
logical pixel outside of the pixel plane's logical viewport.


                      View Rectangle
                (in the Camera's image plane)

                          y-axis
                            |
                            |       (+1,+1)
                  +---------|---------+
                  |         |         |
                  |         |         |
                  |         |         |
                  |         |         |
                  |         |         |
               -------------+---------------- x-axis
                  |         |         |
                  |         |         |
                  |         |         |
                  |         |         |
                  |         |         |
                  +---------|---------+
              (-1,-1)       |
                            |
                            |

                            ||
                            ||
                            ||  Viewport Transformation
                            ||
                            ||
                            \/

               Pixel Plane's Logical Viewport
                                               (w+0.5, h+0.5)
      +----------------------------------------------+
      | . . . . . . . . . . . . . . . . . . . . . . .|
      | . . . . . . . . . . . . . . . . . . . . . . .|
      | . . . . . . . . . . . . . . . . . . . . . . .|
      | . . . . . . . . . . . . . . . . . . . . . . .|
      | . . . . . . . . . . . . . . . . . . . . . . .|   The logical pixels
      | . . . . . . . . . . . . . . . . . . . . . . .|   are the points in
      | . . . . . . . . . . . . . . . . . . . . . . .|   the pixel plane with
      | . . . . . . . . . . . . . . . . . . . . . . .|   integer coordinates.
      | . . . . . . . . . . . . . . . . . . . . . . .|
      | . . . . . . . . . . . . . . . . . . . . . . .|
      | . . . . . . . . . . . . . . . . . . . . . . .|
      | . . . . . . . . . . . . . . . . . . . . . . .|
      | . . . . . . . . . . . . . . . . . . . . . . .|
      +----------------------------------------------+
 (0.5, 0.5)

                            ||
                            ||
                            ||  Rasterizer
                            ||
                            ||
                            \/

                         Viewport
                    (in the FrameBuffer)
      (0,0)
        +-------------------------------------------+
        |-|-|-|-|-|-|-|-|-|-|-|-|-|-|-|-|-|-|-|-|-|-|
        |-|-|-|-|-|-|-|-|-|-|-|-|-|-|-|-|-|-|-|-|-|-|
        |-|-|-|-|-|-|-|-|-|-|-|-|-|-|-|-|-|-|-|-|-|-|
        |-|-|-|-|-|-|-|-|-|-|-|-|-|-|-|-|-|-|-|-|-|-|   The physical pixels
        |-|-|-|-|-|-|-|-|-|-|-|-|-|-|-|-|-|-|-|-|-|-|   are the entries in
        |-|-|-|-|-|-|-|-|-|-|-|-|-|-|-|-|-|-|-|-|-|-|   the FrameBuffer
        |-|-|-|-|-|-|-|-|-|-|-|-|-|-|-|-|-|-|-|-|-|-|   array.
        |-|-|-|-|-|-|-|-|-|-|-|-|-|-|-|-|-|-|-|-|-|-|
        |-|-|-|-|-|-|-|-|-|-|-|-|-|-|-|-|-|-|-|-|-|-|
        |-|-|-|-|-|-|-|-|-|-|-|-|-|-|-|-|-|-|-|-|-|-|
        |-|-|-|-|-|-|-|-|-|-|-|-|-|-|-|-|-|-|-|-|-|-|
        |-|-|-|-|-|-|-|-|-|-|-|-|-|-|-|-|-|-|-|-|-|-|
        |-|-|-|-|-|-|-|-|-|-|-|-|-|-|-|-|-|-|-|-|-|-|
        +-------------------------------------------+
                                                (w-1,h-1)


After the viewport transformation of the two vertices of a line segment,
the rasterization stage will convert the given line segment in the pixel
plane into pixels in the framebuffer's viewport. The rasterization stage
computes all the pixels in the framebuffer's viewport that are on the line
segment connecting the transformed vertices v0 and v1. Any point inside
the logical viewport that is on this line segment is rasterized to a pixel
inside the framebuffer's viewport. Any point on this line segment that is
outside the logical viewport should not be rasterized to a pixel in the
framebuffer.

https://acko.net/files/fullfrontal/fullfrontal/webglmath/online.html
http://alvyray.com/Memos/CG/Microsoft/6_pixel.pdf


View Rectangle to Logical Viewport Transformation
=================================================

The view rectangle in the camera's view plane has
       -1 <= x <= 1,
       -1 <= y <= 1.
The logical viewport in the pixel plane has
       0.5 <= x < w + 0.5,
       0.5 <= y < h + 0.5,
where
    w = number of horizontal pixels in the framebuffer's viewport,
    h = number of vertical pixels in the framebuffer's viewport.
We want a transformation (formulas) that sends points from the camera's
view rectangle to proportional points in the pixel plane's logical viewport.

The goal of this transformation is to put a logical pixel with integer
coordinates at the center of each square physical pixel. The logical pixel
with integer coordinates (m, n) represents the square physical pixel with
  m - 0.5 <= x < m + 0.5,
  n - 0.5 <= y < n + 0.5.
Notice that logical pixels have integer coordinates (m,n) with
  1 <= m <= w
  1 <= n <= h.

Let us derive the formulas for the viewport transformation (we will derive
the x-coordinate formula; the y-coordinate formula is similar).

Let x_p denote an x-coordinate in the image plane and let x_vp denote an
x-coordinate in the viewport. If a vertex is on the left edge of the view
rectangle (with x_p = -1), then it should be transformed to the left edge of
the viewport (with x_vp = 0.5). And if a vertex is on the right edge of the
view rectangle (with x_p = 1), then it should be transformed to the right
edge of the viewport (with x_vp =  w + 0.5). These two facts are all we need
to know to find the linear function for the transformation of the x-coordinate.

We need to calculate the slope m and intercept b of a linear function
          x_vp = m * x_p + b
that converts image plane coordinates into viewport coordinates. We know,
from what we said above about the left and right edges of the view rectangle,
that
           0.5 = (m * -1) + b,
       w + 0.5 = (m *  1) + b.
If we add these last two equations together we get
         w + 1 = 2*b
or
         b = (w + 1)/2.
If we use b to solve for m we have
           0.5 = (m * -1) + (w + 1)/2
             1 = -2*m + w + 1
           2*m = w
             m = w/2.
So the linear transformation of the x-coordinate is
       x_vp = (w/2) * x_p + (w+1)/2
            = 0.5 + w/2 * (x_p + 1).
The equivalent formula for the y-coordinate is
       y_vp = 0.5 + h/2 * (y_p + 1).



Rasterizing a LineSegment
=========================

Now we want to discuss the precise algorithm for how the rasterizer
converts a line segment in the pixel-plane into a specific choice of
pixels in the viewport.

Here is a picture of part of a line segment in the pixel-plane with
logical pixel x-coordinates between i and i+3 and with logical pixel
y-coordinates between j and j+6.

     +-------+-------+-------+------/+
     |       |       |       |     / |
 j+6 |   .   |   .   |   .   |   ./  |
     |       |       |       |   /   |
     +-------+-------+-------+--/----+
     |       |       |       | /     |
 j+5 |   .   |   .   |   .   |/  .   |
     |       |       |       /       |
     +-------+-------+------/+-------+
     |       |       |     / |       |
 j+4 |   .   |   .   |   ./  |   .   |
     |       |       |   /   |       |
     +-------+-------+--/----+-------+
     |       |       | /     |       |
 j+3 |   .   |   .   |/  .   |   .   |
     |       |       /       |       |
     +-------+------/+-------+-------+
     |       |     / |       |       |
 j+2 |   .   |   ./  |   .   |   .   |
     |       |   /   |       |       |
     +-------+--/----+-------+-------+
     |       | /     |       |       |
 j+1 |   .   |/  .   |   .   |   .   |
     |       /       |       |       |
     +------/+-------+-------+-------+
     |     / |       |       |       |
  j  |   ./  |   .   |   .   |   .   |
     |   /   |       |       |       |
     +--/----+-------+-------+-------+
        i       i+1     i+2     i+3     logical pixel coordinates

The rasterizing algorithm can "walk" this line segment along either
the x-coordinate axis from i to i+3 or along the y-coordinate axis
from j to j+6. In either case, for each logical pixel coordinate along
the chosen axis, the algorithm should pick the logical pixel closest to
the line segment and turn on the associated physical pixel.

If our line has the equation y = m*x + b, with slope m and y-intercept b
(in pixel-plane coordinates), then walking the line along the x-coordinate
axis means that for each logical pixel x-coordinate i, we compute the
logical pixel y-coordinate
     Math.round( m*i + b ).

On the other hand, walking the line along the y-coordinate axis means we
should use the linear equation x = (y - b)/m and for each logical pixel
y-coordinate j, we compute the logical pixel x-coordinate
    Math.round( (y - b)/m ).

Let us try this algorithm in the above picture along each of the two
logical pixel coordinate axes.

If we rasterize this line segment along the x-coordinate axis, then we
need to chose a logical pixel for each x equal to i, i+1, i+2, and i+3.
Always choosing the logical pixel (vertically) closest to the line, we
get these pixels.

     +-------+-------+-------+------/+
     |       |       |       |#####/#|
 j+6 |   .   |   .   |   .   |###./##|
     |       |       |       |###/###|
     +-------+-------+-------+--/----+
     |       |       |       | /     |
 j+5 |   .   |   .   |   .   |/  .   |
     |       |       |       /       |
     +-------+-------+------/+-------+
     |       |       |#####/#|       |
 j+4 |   .   |   .   |###./##|   .   |
     |       |       |###/###|       |
     +-------+-------+--/----+-------+
     |       |       | /     |       |
 j+3 |   .   |   .   |/  .   |   .   |
     |       |       /       |       |
     +-------+------/+-------+-------+
     |       |#####/#|       |       |
 j+2 |   .   |###./##|   .   |   .   |
     |       |###/###|       |       |
     +-------+--/----+-------+-------+
     |       | /     |       |       |
 j+1 |   .   |/  .   |   .   |   .   |
     |       /       |       |       |
     +------/+-------+-------+-------+
     |#####/#|       |       |       |
  j  |###./##|   .   |   .   |   .   |
     |###/###|       |       |       |
     +--/----+-------+-------+-------+
        i       i+1     i+2     i+3     logical pixel coordinates

Make sure you agree that these are the correctly chosen pixels. Notice
that our rasterized line has "holes" in it. This line has slope strictly
greater than 1. Every time we move one step to the right, we move more
that one step up because the slope is greater than 1, so
   rise/run > 1,
so
   rise > run,
but run = 1, so we always have rise > 1, which causes us to skip over
a pixel when we round our y-coordinate to the nearest logical pixel.

If we rasterize this line segment along the y-coordinate axis, then we
need to chose a logical pixel for each y equal to j, j+1, j+2, j+3, j+4,
j+5 and j+6. Always choosing the logical pixel (horizontally) closest to
the line, we get these pixels.

     +-------+-------+-------+------/+
     |       |       |       |#####/#|
 j+6 |   .   |   .   |   .   |###./##|
     |       |       |       |###/###|
     +-------+-------+-------+--/----+
     |       |       |       |#/#####|
 j+5 |   .   |   .   |   .   |/##.###|
     |       |       |       /#######|
     +-------+-------+------/+-------+
     |       |       |#####/#|       |
 j+4 |   .   |   .   |###./##|   .   |
     |       |       |###/###|       |
     +-------+-------+--/----+-------+
     |       |       |#/#####|       |
 j+3 |   .   |   .   |/##.###|   .   |
     |       |       /#######|       |
     +-------+------/+-------+-------+
     |       |#####/#|       |       |
 j+2 |   .   |###./##|   .   |   .   |
     |       |###/###|       |       |
     +-------+--/----+-------+-------+
     |       |#/#####|       |       |
 j+1 |   .   |/##.###|   .   |   .   |
     |       /#######|       |       |
     +------/+-------+-------+-------+
     |#####/#|       |       |       |
  j  |###./##|   .   |   .   |   .   |
     |###/###|       |       |       |
     +--/----+-------+-------+-------+
        i       i+1     i+2     i+3     logical pixel coordinates

Make sure you agree that these are the correctly chosen pixels. In
each row of logical pixels, we should choose the logical pixel that
is closest (horizontally) to the line.

We see that while we can rasterize a line in either the x-direction or
the y-direction, we should chose the direction based on the slope of the
line. Lines with slope between -1 and +1 should be rasterized in the
x-direction. Lines with slope less than -1 or greater than +1 should be
rasterized in the y-direction.

Here is a pseudo-code summary of the rasterization algorithm. Suppose we are
rasterizing a line from logical pixel (x0, y0) to logical pixel (x1, y1)
(so x0, y0, x1, y1 are all integer values). If the line has slope less than 1,
we use the following loop.

    double y = y0;
    for (int x = x0; x <= x1; x += 1, y += m)
    {
       int x_vp = x - 1;                    // viewport coordinate
       int y_vp = h - (int)Math.round(y);   // viewport coordinate
       vp.setPixelVP(x_vp, y_vp, Color.white);
    }

Notice how x is always incremented by 1 so that it moves from one, integer
valued, logical pixel coordinate to the next, integer valued, logical pixel
coordinate. On the other hand, the slope m need not be an integer. As we
increment x by 1, we increment y by m (since "over 1, up m" means slope = m),
so the values of y need not be integer values, so we need to round each y
value to its nearest logical pixel integer coordinate.

If the line has slope greater than 1, we use the following loop.

    double x = x0;
    for (int y = y0; y <= y1; y += 1, x += m)
    {
       int x_vp = (int)Math.round(x) - 1;   // viewport coordinate
       int y_vp = h - y;                    // viewport coordinate
       vp.setPixelVP(x_vp, y_vp, Color.white);
    }

The above code has a slight simplification in it. When the slope of the line
is greater than 1, we recompute the slope as slope in the y-direction with
    change-in-x / change-in-y
so that the slope becomes less than 1.



Clipping in the Rasterizer
==========================

Remember that the camera has a view volume that determines what the
camera sees in camera space. For the perspective camera, the view
volume is an infinitely long pyramid with its apex at the origin and
its four edges intersecting the camera's image plane, z = -1, at the
points (1, 1, -1), (-1, 1, -1), (-1, -1, -1), and (1, -1, -1). Those
four points are the corners of the camera's view rectangle in the
image plane.

Here is a picture of the yz-plane cross section of the camera's
perspective view volume. The camera is at the origin looking down
the negative z-axis. The camera sees the region of camera space
between the planes y = -z and y = z. These two planes form a 90 angle
where they meet at the origin. This 90 degree angle is called the
camera's "field-of-view". (In this picture you should imagine the
positive x-axis as coming straight out of the page towards you.)


          y            y = -z
          |           /
          |          /
          |         /
        1 +        /|
          |       / |
          |      /  |       camera's view volume
          |     /   |       (and view rectangle)
          |    /    |
          |   /     |
          |  /      |
          | /       |
   -------+---------+-------------> -z axis
   Camera | \       | -1
          |  \      |
          |   \     |
          |    \    |
          |     \   |
          |      \  |
          |       \ |
       -1 +        \|
          |         \
          |          \
          |           \
          |            y = z


Any specific line segment in a scene will either be completely inside
the camera's view volume, completely outside the view volume, or partly
inside and partly outside. In the picture below, the line segment from
vertex v0 to vertex v1 is completely inside the view volume, the line
segment from v2 to v3 is completely outside, and the line segment from
v4 to v5 crosses over an edge of the view volume from inside to outside.


          y            y = -z
          |       v3  /
          |      /   /
          |     /   /     v1
        1 +    /   /       \
          |   /   /         \
          |  /   /           \
          | v2  /             \
          |    /               \
          |   /                 v0
          |  /
          | /
   -------+---------+-------------> -z axis
   Camera | \       -1
          |  \
          |   \
          |    \
          |     \
          |      \
          |       \
       -1 +        \
          |    v5---\-----------v4
          |          \
          |           \
          |            y = z


When part (or all) of a line segment is outside the camera's view
volume, we should clip off the part that is not visible.

We have several choices of when (and how) we can clip line segments.
  1. before projection (in camera coordinates),
  2. after projection (in the view plane),
  3. during rasterization (in the pixel plane).

In this renderer we clip line segments during rasterization. In a
future renderer we will clip line segments in the view plane, after
projection but before rasterization. And then, in an even later
renderer, we will clip line segments in camera space, before projection.

We clip line segments during rasterization by not putting into the
framebuffer any line segment fragment that is out of the framebuffer's
viewport. This works, but it is not such a great technique because it
requires that we compute every fragment of every line segment and then
check if it fits in the viewport. This could be a big waste of CPU
time. If a line segment extends from within the viewport to millions
of pixels outside the viewport, then we would be needlessly computing
a lot of pixels just to discard them. Even worse, if no part of the line
segment is in the view rectangle, we would still be rasterizing the whole
line segment.

https://en.wikipedia.org/wiki/Line_clipping



Turning Clipping Off
====================

In this renderer, line clipping is optional and can be turned off and on.
When clipping is turned off, the renderer acts in a surprising way. When
line clipping is turned off, if a model moves off the right or left side
of the window, it "wraps around" to the other side of the window. But if
a model moves off the top or bottom of the window, then there are a number
of error messages reported in the console window by the FrameBuffer.

For example, suppose a line segment from vertex v0 to vertex v1 looks
like this in the camera's image plane.

                          y-axis
                            |
                            |       (+1,+1)
                  +---------|---------+
                  |         |         |
                  |         |      v0 |
                  |         |        \|
                  |         |         \
                  |         |         |\
               -------------+-----------\----- x-axis
                  |         |         |  \
                  |         |         |   \
                  |         |         |    \
                  |         |         |     v1
                  |         |         |
                  +---------|---------+
              (-1,-1)       |
                            |

If clipping is turned off, then the renderer will draw two line segments
like this in the FrameBuffer (assume that the Viewport is the whole
FrameBuffer).

      (0,0)
        +-------------------------------------------+
        |                                           |
        |                                     \     |
        |                                      \    |
        |                                       \   |
        |                                        \  |
        |                                         \ |
        |                                          \|
        |\                                          |
        | \                                         |
        |  \                                        |
        |   \                                       |
        |    \                                      |
        |                                           |
        |                                           |
        |                                           |
        +-------------------------------------------+
                                                (w-1,h-1)

The cause of this is a combination of two facts. First, a FrameBuffer
stores its pixel data as a one-dimensional array in row-major form.
Second, the setPixel() methods in the FrameBuffer class do not do any
bounds checking. Here is roughly what the setPixelFB() method looks like.

   public void setPixelFB(int x, int y, Color c)
   {
      int index = y * w + x; // translate row and column into 1-dim index
      pixel_buffer[index] = c.getRGB();
   }

The method first translates the column and row address, (x, y), of the pixel
in the two-dimensional framebuffer into its one-dimensional index in the
pixel array, y * w + x, where w is the width of the framebuffer object. What
happens if x, the column number, is greater than w? The method could check
for this condition and throw a "pixel out of bounds" error, but the method
does not check either x nor y. The method just goes ahead and computes the
pixel's index as if there was no problem. What happens to a pixel that is
not actually in the framebuffer?

Here is a picture of a very small, 4-by-8, FrameBuffer and its one-
dimensional, array-of-rows, pixel_buffer. This picture includes a pixel
that is "outside" of the FrameBuffer at the invalid address (2, 9).

   0   1  2  3  4  5  6  7  8  9
  +--+--+--+--+--+--+--+--+
0 |  |  |  |  |  |  |  |  |
  +--+--+--+--+--+--+--+--+
1 |  |  |  |  |  |  |  |  |
  +--+--+--+--+--+--+--+--+   +--+
2 |  |  |  |  |  |  |  |  |   |##|
  +--+--+--+--+--+--+--+--+   +--+
3 |  |  |  |  |  |  |  |  |
  +--+--+--+--+--+--+--+--+

|         row 0         |         row 1         |         row 2         |         row 3         |
+--+--+--+--+--+--+--+--+--+--+--+--+--+--+--+--+--+--+--+--+--+--+--+--+--+--+--+--+--+--+--+--+
|  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |##|  |  |  |  |  |  |
+--+--+--+--+--+--+--+--+--+--+--+--+--+--+--+--+--+--+--+--+--+--+--+--+--+--+--+--+--+--+--+--+
 0  1  2  3  4  5  6  7  8  9  10 11 12 13 14 15 16 17 18 19 20 21 22 23 24 25 26 27 28 29 30 31

Let us translate the pixel address (x, y) = (9, 2), which is slightly past
the right edge of the third row, into an array index. This pixel's index is

   index = (y * w) + x = (2 * 8) + 9 = 25

which puts the pixel near the left edge of the fourth row!

So if setPixel() is asked to set a pixel that is a little bit off the right
edge of a row of pixels, then the method will just compute the appropriate
array entry in the one-dimensional array-of-rows and set a pixel that is
just a bit to the right of the left edge of the FrameBuffer and one row down
from the row it was supposed to be in! If you let a model move to the right
for a very long time, you will notice that it is slowly moving down the
FrameBuffer (and if you move a model to the left for a very long time, you
will notice that it is slowly moving up the FrameBuffer).



QUESTION: How does a Viewport react to a line segment that extends outside of
the Viewport's boundary? Does the line segment wrap to the opposite edge of
the Viewport? (Hint: Look at the setPixelVP() method in the Viewport class.)


https://en.wikipedia.org/wiki/Robustness_principle


   public void setPixelFB(int x, int y, Color c)
   {
      int index = y * width + x;
      try
      {
         pixel_buffer[index] = c.getRGB();
      }
      catch(ArrayIndexOutOfBoundsException e)
      {
         System.err.println("FrameBuffer: Bad pixel coordinate"
                          + " (" + x + ", " + y +")"
                          + " [w="+width+", h="+height+"]");
      }
   }

