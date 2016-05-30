# DynamicLoader


Dependencies
	NodeHttp

Work
	. Client request one item html/js/css
	. Server add this request for this client on the pool, and send the first refresh
	. Server add watcher for this request and send refresh's when modify detected
	. Client receive the refresh message, and request the item in normal way