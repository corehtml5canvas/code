This is the source code from the book Core HTML5 Canvas, published by
Prentice-Hall in May 2012. See LICENSE.txt for the minimal restrictions on its
use. (Yes, you can use any of the code in commercial products as long as you're
not using it for education material such as books, videos, presentations, etc.)

YOU MUST CONFIGURE YOUR BROWSER TO RUN SOME EXAMPLES LOCALLY:

    The following examples perform image manipulation and will therefore result
    in security exceptions when you run them on your local filesystem. See the
    Security section of the Images chapter in Core HTML5 Canvas for information
    on bypassing the browser's security so you can run those examples:

        example-4.9
        example-4.13
        example-4.14
        example-4.15
        example-4.16
        example-4.18
        example-4.20


Overview........................................................................

You can access all of the examples by loading index.html in an HTML5-capable
browser.

The examples are grouped by chapter, and mostly by example number. For instance,
here are the directories that you'll find in the ch08 directory:

   example-8.1
   example-8.10
   example-8.19
   example-8.2
   example-8.20
   example-8.8

   section-8.1.1
   section-8.3
   section-8.4.1.6

The example numbers correspond to listings in the book. Many listings in the
book are partial listings, so example numbers will often jump around, which
is the case for chapter 8 above, which has several partial listings between
example-8.2 and example-8.8.

Some examples do not have listings. I discuss the examples in the book, and
perhaps show a little of their code, but not enough for a full listing, so
you can find those listings by their sections instead, as is the case for
the last three examples in chapter 8 listed above.

Some examples that you have downloaded are slightly different from the
listings in the book; for example, I have put all images shared among examples
in shared/images, and I've modified the examples to use those images to save
space in the zip file. I've also added the security fix for Firefox discussed in
section 4.8 to several of the examples so the examples run without intervention.


Browser Anomolies...............................................................

The latest browser versions that I've tested this code with:

   Firefox 12.0
   Chrome 20.0
   Safari 5.0.5
   Opera 11.6.2
   IE9/10

Known Bugs:

1. Opera and IE9/10 do not implement arcTo() correctly (see bit.ly/HVvnT8), which
   affects the following examples:

      example-2.20
      example-4.22
      section-6.3.2
      example-7.1
      section-8.1.1 
      example-10.4 (Opera, in addition to incorrectly drawing the arcs, is incredibly slow here)
      example-10.7

2. Opera does not fill text correctly, affecting the following examples: example-3.1, example-3.5.
3. Firefox does not fill text with a gradient correctly in example-3.2.
4. Paragraphs do not indent correctly in Firefox and Opera in example-3.18.
5. Opera does not redraw the image as you drag the slider in example-4.6.
6. Firefox and Opera draw watermark text with the wrong colors in example-4.8.
7. Firefox and Chrome draw the bomb at the wrong scale.


Performance.....................................................................

HTML5 Canvas performance varies significantly between devices and operating
systems, but in general it's very good. When the book was released, performance
was still pitiful on Android, but pretty kickass on iOS5. See http://bit.ly/HsyFOG
on an iPad for some examples.

When you run some of the more intense examples in the book, especially games
such as the bucket game and pinball, those examples will run slowly if you have
a million tabs and browser windows open, which is always the case for me.
So when you run those examples, close your other windows and tabs.


Thank You.......................................................................

Thank you for downloading the code. I hope you find it, and the book, useful.


David Geary
