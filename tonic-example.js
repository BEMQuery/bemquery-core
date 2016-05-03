require( 'bemquery-selector-converter/package.json' );
require( 'bemquery-selector-engine/package.json' );
require( 'bemquery-core/package.json' );

var fs = require( 'fs' ),
	url = require( 'url' ),
	endpoint = 'https://tonicdev.io' + process.env.TONIC_ENDPOINT_PATH;

exports.tonicEndpoint = function( request, response ) {
	const package = url.parse( request.url, true ).query.package;

	response.end( fs.readFileSync( require.resolve( 'bemquery-' + package ) ) );
};



`<!DOCTYPE html>
	<html lang="en">
		<head>
			<meta charset="UTF-8">
			<title>Tonic Example</title>
		</head>
		<body>
			<p>Example</p>

			<script src="${endpoint}?package=selector-converter"></script>
			<script src="${endpoint}?package=selector-engine"></script>
			<script src="${endpoint}?package=core"></script>
			<script>
				const bemQuery = bemquery.default( 'block element' );

				bemQuery.each( ( elem ) => {
					console.log( elem );
				} );
			</script>
		</body>
	</html>`;
