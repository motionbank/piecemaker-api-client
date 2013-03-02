// -----------------------------------------------
//  class EventTimeCluster
// -----------------------------------------------
//  fjenett 2013
//	http://motionbank.org/
//	http://piecemaker.org/
// -----------------------------------------------
//	version: ##version##
//	build: ##build##
// -----------------------------------------------

var EventTimeClusters = (function(){

	// ------------------------------------
	// class EventTimeCluster
	// ------------------------------------

	var EventTimeCluster = function () {
		this._from = this._to = null;
		this.events = [];
		this.videos = [];
		this.allEvents = [];
	}

	EventTimeCluster.prototype.from = function () {
		return this._from;
	}

	EventTimeCluster.prototype.to = function () {
		return this._to;
	}

	EventTimeCluster.prototype.overlapsWith = function ( event ) {
		if ( !this._from || !this._to ) return false;
		return !(event.happened_at.getTime() > this._to || event.finished_at.getTime() < this._from);
	}

	EventTimeCluster.prototype.add = function ( event ) {

		if ( this.allEvents.indexOf(event) == -1 ) {
			this.allEvents.push( event );
		}

		var eventFrom = event.happened_at;

		if ( !this._from || (eventFrom.getTime() < this._from.getTime()) ) {
			this._from = new Date( eventFrom.getTime() );
		}

		var eventTo = event.finished_at;

		if ( !this._to || (eventTo.getTime() > this._to.getTime()) ) {
			this._to = new Date(eventTo.getTime());
		}

		if ( 'event_type' in event ) {
			if ( this.events.indexOf(event) == -1 ) this.events.push(event);
		} else {
			if ( this.videos.indexOf(event) == -1 ) this.videos.push(event);
		}
	}

	EventTimeCluster.prototype.addAll = function ( events ) {
		for ( var i = 0, k = events.length; i < k; i++ ) {
			this.add( events[i] );
		}
	}

	EventTimeCluster.prototype.getAll = function () {
		return this.allEvents;
	}

	EventTimeCluster.prototype.getVideos = function () {
		return this.videos;
	}

	EventTimeCluster.prototype.getEvents = function () {
		return this.events;
	}

	EventTimeCluster.prototype.toString = function () {
		return "EventTimeCluster: " + this._from + " " + this._to;
	}

	// ------------------------------------
	// class EventTimeClusters
	// ------------------------------------

	var EventTimeClusters = function () {}

	EventTimeClusters.clusterEvents = function ( ungroupedEvents ) {

		var clusters = [];

		for ( var i = 0, k = ungroupedEvents.length; i < k; i++ )
		{
			var be = ungroupedEvents[i];			
			var inCluster = false;

			for ( var ii = 0, kk = clusters.length; ii < kk; ii++ )
			{
				var vc = clusters[ii];

				if ( vc.overlapsWith(be) )
				{
					vc.add( be );
					inCluster = true;
					break;
				}
			}

			if ( !inCluster )
			{
				var c = new EventTimeCluster();
				clusters.push( c );
				c.add( be );
			}
		}

		return clusters;
	}

	return EventTimeClusters;
})();