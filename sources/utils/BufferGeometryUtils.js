import { BufferAttribute, BufferGeometry, Float32BufferAttribute, InterleavedBuffer, InterleavedBufferAttribute, Vector3, MathUtils } from 'three';

function toTrianglesDrawMode( geometry, drawMode ) {
	if ( drawMode === 4 ) return geometry;
	const index = geometry.getIndex();
	const position = geometry.getAttribute( 'position' );
	if ( index === null ) {
		if ( position === undefined ) return geometry;
		const indices = [];
		for ( let i = 0; i < position.count; i ++ ) indices.push( i );
		geometry.setIndex( indices );
	}
	const numberOfTriangles = geometry.index.count - 2;
	const newIndices = [];
	if ( drawMode === 6 ) {
		for ( let i = 1; i <= numberOfTriangles; i ++ ) {
			newIndices.push( geometry.index.getX( 0 ) );
			newIndices.push( geometry.index.getX( i ) );
			newIndices.push( geometry.index.getX( i + 1 ) );
		}
	} else if ( drawMode === 5 ) {
		for ( let i = 0; i < numberOfTriangles; i ++ ) {
			if ( i % 2 === 0 ) {
				newIndices.push( geometry.index.getX( i ) );
				newIndices.push( geometry.index.getX( i + 1 ) );
				newIndices.push( geometry.index.getX( i + 2 ) );
			} else {
				newIndices.push( geometry.index.getX( i + 2 ) );
				newIndices.push( geometry.index.getX( i + 1 ) );
				newIndices.push( geometry.index.getX( i ) );
			}
		}
	}
	const newGeometry = geometry.clone();
	newGeometry.setIndex( newIndices );
	return newGeometry;
}

export { toTrianglesDrawMode };
