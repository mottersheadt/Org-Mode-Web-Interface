function get_param(name) {
    name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
    var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
	results = regex.exec(location.search);
    return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
}

var base_dir		= '/wiki'
var org;

var path		= base_dir + '/' + ( get_param( 'file' ) || get_param( 'f' ) || 'index.org' );
if( path[ path.length-1 ] == '/' ) {
    // Remove slash at the end of path
    path		= path.substring(0, path.length - 1)
}

var Parser		= new Org.Parser();

var to_html		= function( org ) {
    // console.log( 'To HTML ', org )
    var data	= Parser.parse( org );
    return data.convert(Org.ConverterHTML, {
	suppressSubScriptHandling: false,
	suppressAutoLink: false
    }).toString();
}

var fetch_file	= function( path, callback ) {
    console.log( 'Fetching ', path )
    $.ajax( {
	url: path,
	dataType: "text",
	success: function( result ) {
	    $('.404-error').addClass('hidden')
	    org		= result;
	    if( callback ) {
		callback();
	    }
	},
	error: function( a, b, c ) {
	    $('.404-error').removeClass('hidden');
	    $('.404-error .file-name').html( path );
	    console.log( "Call Error", arguments );
	}
    } )
}

fetch_file( path, function() {
    var html		= to_html( org );
    $('#html-page').html( html )
} );

