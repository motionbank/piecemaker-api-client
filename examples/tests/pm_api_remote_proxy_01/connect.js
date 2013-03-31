
var parentWindow = null, parentWindowOrigin = null;

jQuery(function(){

    var allowedOrigins = ['http://moba-lab.local','http://lab.motionbank.org'];
    var sketch;
    
    window.addEventListener( 'message', function(msg){
//        if ( allowedOrigins.indexOf( msg.origin ) !== -1 ) {
            if ( msg.data.command === 'setWindow' ) {
                parentWindow = msg.source;
                parentWindowOrigin = msg.origin;
                
                var findSketchAndSetWindow = function () {
                    sketch = Processing.getInstanceById(getProcessingSketchId());
                    if ( sketch ) {
                        sketch.proxyAvailable( parentWindow, parentWindowOrigin );
                    } else {
                        setTimeout( findSketchAndSetWindow, 100 );
                    }
                }
                setTimeout( findSketchAndSetWindow, 100 );
            }
//        } else {
//            console.log( 'Rejected message from origin: '+msg.origin );
//        }
    }, true);
});
