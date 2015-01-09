var collections = ['users','tasks'];

function initCollections(collections){
	if (collections != null){
			for (var i = 0; i < collections.length; i++) {
			db.createCollection(collections[i]);
		};	
	}
}