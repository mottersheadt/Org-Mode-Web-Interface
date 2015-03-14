// Default org -> html conversion map
var default_map = {
    directive: function (p,n,html) {
	if (n.directiveName === 'title:')
	    return '<div class="header"><h1>'+html+'</h1></div>';
	else if (n.directiveName === 'quote')
	    return '<blockquote>'+html+'</blockquote>';
	else if (n.directiveName === 'src')
	    return '<pre>'+html+'</pre>';
	else if (n.directiveName === 'example')
	    return '<pre>'+html+'</pre>';
	else
	    console.log(n);
	return html;
    },
    header: function (p,n,html) {
	var l = n.level;
	return '<h'+l+'>'+html+'</h'+l+'>';
    },
    text: function (p, n, html) {
	// text should do a HTML convert so that '<' becomes '&thing;'
	return n.value !== undefined ? n.value : '<span style="color: #C00;">No value for text</span>';
    },
    inlineContainer: function (p, n, html) {
	return html;
    },
    paragraph: function (p, n, html) {
	return '<p>'+html+'</p>';
    },
    bold: function (p, n, html) {
	return '<b>'+html+'</b>';
    },
    underline: function (p, n, html) {
	return '<u>'+html+'</u>';
    },
    link: function (p, n, html) {
	if( n.src.substr(0,7) == 'http://' ||
	    n.src.substr(0,8) == 'https://' )
	    return '<a target="_blank" href="' + n.src + '">'+html+'</a>';

	return '<a href="?f=' + n.src + '">'+html+'</a>';
    },
    code: function (p, n, html) {
	return '<code>'+html+'</code>';
    },
    preformatted: function (p, n, html) {
	return '<pre>'+html+'</pre>';
    },
    table: function (p, n, html) {
	console.log(n);
	return '<table class="table table-striped">'+html+'</table>';
    },
    tableRow: function (p, n, html) {
	return '<tr>'+html+'</tr>';
    },
    tableCell: function (p, n, html) {
	return '<td>'+html+'</td>';
    },
    unorderedList: function (p, n, html) {
	return '<ul>'+html+'</ul>';
    },
    orderedList: function (p, n, html) {
	return '<ol>'+html+'</ol>';
    },
    listElement: function (p, n, html) {
	return '<li>'+html+'</li>';
    },
    "default": function (p, n, html) {
	console.log('Not handling node type:', n.type);
	return html || '';
    }
}

var current_header_layer = 0;
var wrap_html		= false;
var scrum_map		= {
    directive: function (p,n,html) {
	if (n.directiveName === 'title:')
	    return '<div class="header"><h1>'+html+'</h1></div>';
	else if (n.directiveName === 'quote')
	    return '<blockquote>'+html+'</blockquote>';
	else if (n.directiveName === 'src')
	    return '<pre>'+html+'</pre>';
	else if (n.directiveName === 'example')
	    return '<pre>'+html+'</pre>';
	else
	    console.log(n);
	return html;
    },
    header: function (p,n,html) {
	var l		= n.level;
	var elem	= '';

	var diff	=  l - current_header_layer;
	
	for( i=0; i <= diff + 1; i++ )
	    elem	+= '</div>';

	current_header_layer = l
	
	switch( l ) {
	case 1:
	    elem	+= '<div class="print-hide"><h1>'+html+'</h1>';
	    break;
	case 2:
	    elem	+= '<h2 class="print-hide">'+html+'</h2>';
	    break;
	case 3:
	    elem	+= '<hr/><div class="story card"><div class="card-title">'+html+'</div>';
	    break;
	case 4:
	    elem	+= '<div class="task card"><div class="card-title">'+html+'</div>';
	    break;
	}
	return elem;
    },
    text: function (p, n, html) {
	var regex	= /^:(\w+):/;
	
	// Check if element is inside of a list element
	if ( n.value && regex.test( n.value.trim() ) ) {
	    var array	= n.value.split(':');
	    var cls	= array[1];
	    var value	= array[2].trim();
	    return '<div class="scrum-number '+ cls.toLowerCase() +'">'+ value +'</div>';
	}
	// text should do a HTML convert so that '<' becomes '&thing;'
	return n.value !== undefined ?
	    '<p>'+n.value+'</p>'
	    : '<span style="color: #C00;">No value for text</span>';
    },
    inlineContainer: function (p, n, html) {
	return html;
    },
    paragraph: function (p, n, html) {
	return '<p>'+html+'</p>';
    },
    bold: function (p, n, html) {
	return '<b>'+html+'</b>';
    },
    underline: function (p, n, html) {
	return '<u>'+html+'</u>';
    },
    link: function (p, n, html) {
	if( n.src.substr(0,7) == 'http://' ||
	    n.src.substr(0,8) == 'https://' )
	    return '<a target="_blank" href="' + n.src + '">'+html+'</a>';

	return '<a href="?f=' + n.src + '">'+html+'</a>';
    },
    code: function (p, n, html) {
	return '<code>'+html+'</code>';
    },
    preformatted: function (p, n, html) {
	return '<pre>'+html+'</pre>';
    },
    table: function (p, n, html) {
	return '<table class="table table-condensed table-striped">'+html+'</table>';
    },
    tableRow: function (p, n, html) {
	return '<tr>'+html+'</tr>';
    },
    tableCell: function (p, n, html) {
	return '<td>'+html+'</td>';
    },
    unorderedList: function (p, n, html) {
	return '<ul>'+html+'</ul>';
    },
    orderedList: function (p, n, html) {
	return '<ol>'+html+'</ol>';
    },
    listElement: function (p, n, html) {
	return '<li>'+html+'</li>';
    },
    "default": function (p, n, html) {
	console.log('Not handling node type:', n.type);
	return '';
    }
}

function Converter(parsed, map) {
    var html		= '';
    var nodes		= parsed.nodes || [];

    switch( map ) {
    case 'scrum':
	map	= scrum_map
	break;
    default:
	map	= default_map;
    }

    
    for (var k in nodes) {
	var node	= nodes[k];
	html		+= recursive( node, 'children', function(parents, node, end, innerHTML) {
	    if ( map[node.type] !== undefined ) {
		html	= map[node.type](parents, node, innerHTML);
	    }
	    else if (map['default'] !== undefined) {
		html	= map['default'](parents, node, innerHTML);
	    }
	    else {
		html	= innerHTML || node.value || '';
	    }
	    return html;
	});
    }
    
    return html;
}

function recursive(node, key, callback, parents) {
    var end			= false;
    var elements		= [];
    if (node[key].length !== 0) {
	if (parents === undefined)
	    parents		= [node.type];
	else
	    parents.push(node.type);
	for (var i in node[key]) {
	    elements.push( recursive(node[key][i], key, callback, parents) );
	}
    }
    else
	end			= true;
    return callback(parents || [], node, end, elements.join(''));
}

