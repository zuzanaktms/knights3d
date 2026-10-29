import { Matrix4, Quaternion, Vector3 } from 'three';

function clone( source ) {
	const sourceLookup = new Map();
	const cloneLookup = new Map();
	const clone = source.clone();
	parallelTraverse( source, clone, function ( sourceNode, clonedNode ) {
		sourceLookup.set( clonedNode, sourceNode );
		cloneLookup.set( sourceNode, clonedNode );
	} );
	clone.traverse( function ( node ) {
		if ( ! node.isSkinnedMesh ) return;
		const clonedMesh = node;
		const sourceMesh = sourceLookup.get( clonedMesh );
		const sourceBones = sourceMesh.skeleton.bones;
		const clonedBones = [];
		for ( let i = 0; i < sourceBones.length; i ++ ) {
			const sourceBone = sourceBones[ i ];
			const clonedBone = cloneLookup.get( sourceBone );
			if ( clonedBone ) {
				clonedBones.push( clonedBone );
			} else {
				console.warn( 'THREE.SkeletonUtils: Bone not found.', sourceBone );
			}
		}
		clonedMesh.bind( new sourceMesh.skeleton.constructor( clonedBones, sourceMesh.skeleton.boneInverses ), clonedMesh.matrixWorld );
	} );
	return clone;
}

function parallelTraverse( a, b, callback ) {
	callback( a, b );
	for ( let i = 0; i < a.children.length; i ++ ) {
		parallelTraverse( a.children[ i ], b.children[ i ], callback );
	}
}

export { clone };
