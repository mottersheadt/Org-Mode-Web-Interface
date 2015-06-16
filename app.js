var $content		= $('#content');

var base_dir		= '/wiki'
var org;

var path		= base_dir + '/' + ( get_param( 'file' ) || get_param( 'f' ) || 'home.org' );
if( path[ path.length-1 ] == '/' ) {
    // Remove slash at the end of path
    path		= path.substring(0, path.length - 1)
}

var Parser		= new Org.Parser();

var fetch_file	= function( path, callback ) {
    console.log( 'Fetching ', path )
    $.ajax( {
	url: path,
	dataType: "text",
	success: function( result ) {
	    $('.404-error').addClass('hidden')
	    org		= result;
	    if( callback )
		callback();
	},
	error: function( a, b, c ) {
	    $('.404-error').removeClass('hidden');
	    $('.404-error .file-name').html( path );
	    console.log( "Call Error", arguments );
	}
    } )
}

fetch_file( path, function() {
    var data		= Parser.parse( org );
    $content.html(html);
} );


// var to_html		= function( org ) {
//     var data		= Parser.parse( org );
//     console.log('Parsed', data)
//     return data.convert( Org.ConverterHTML, {
// 	suppressSubScriptHandling: false,
// 	suppressAutoLink: false
//     }).toString();
// }

