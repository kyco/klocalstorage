klocalstorage
=============
####Version: 1.0.3

A plug and play local storage viewer.

How to install
--------------

#####Recommended:

Bower: `bower install klocalstorage --save-dev`

Include the minified CSS file in the `<head>` and the minified JS file before
the closing `</body>` tag. The IDs are important, don't remove them.

    <link id="klocalstorage_style" rel="stylesheet" href="dist/klocalstorage.min.css">
    <script id="klocalstorage_script" src="dist/klocalstorage.min.js"></script>

#####Quick and dirty:

Include this script tag before the closing `</body>` tag.

    <script id="klocalstorage_script" src="https://klocalstorage.herokuapp.com/app.js"></script>

Usage
-----

If it is up and running correctly you will see a little "+" in the top right corner.

![Successfully running](https://www.kycosoftware.com/uploads/klocalstorage/screenshot2.png)

Clicking the "+" will open and refresh the localStorage viewer. The viewer makes use
of JSONEditor so you will be able to easily navigate your localStorage. Editing a
value and then hitting the "Save" button will save the value. You can edit multiple
objects and arrays (you can also do this in text view or tree view). Hitting the "Delete"
button will remove the item from localStorage. You can undo a "Delete" with a "Restore".
To close klocalstorage click away from it or click the little "-" in the top right corner.

![Viewing localstorage](https://www.kycosoftware.com/uploads/klocalstorage/screenshot.png)

Support
-------

For bugs or improvements please use the [issues tab](https://github.com/kyco/klocalstorage/issues)
or email [support@kycosoftware.com](mailto:support@kycosoftware.com).
