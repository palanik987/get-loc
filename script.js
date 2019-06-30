function getLocation() {
    var msg;
    // checking for support
    if ('geolocation' in navigator) {
        return requestLocation();
    } else {
        // no geolocation :(
        alert('No location support');
    }

    function requestLocation() {
        /**
        getCurrentPosition() below accepts 3 arguments:
        a success callback (required), an error callback  (optional), and a set of options (optional)
        **/

        var options = {
            // enableHighAccuracy = should the device take extra time or power to return a really accurate result, or should it give you the quick (but less accurate) answer?
            enableHighAccuracy: false,
            // timeout = how long does the device have, in milliseconds to return a result?
            timeout: 5000,
            // maximumAge = maximum age for a possible previously-cached position. 0 = must return the current position, not a prior cached position
            maximumAge: 0
        };

        // call getCurrentPosition()
        navigator.geolocation.getCurrentPosition(success, error, options);
        
        // Converts numeric degrees to radians
        function toRad(Value) {
            return Value * Math.PI / 180;
        }
        //This function takes in latitude and longitude of two location and returns the distance between them as the crow flies (in km)
        function calcCrow(lat1, lon1, lat2, lon2) {
            var R = 6371; // km
            var dLat = toRad(lat2 - lat1);
            var dLon = toRad(lon2 - lon1);
            var lat1 = toRad(lat1);
            var lat2 = toRad(lat2);

            var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
                Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(lat1) * Math.cos(lat2);
            var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
            var d = R * c;
            return d;
        }

        function buildTicket(data,lat,lng){
            var songkickTickets = document.createElement('div');
            songkickTickets.className = "total-wrapper";
            for (var i = 0; i < data.length; i++) {
                if(calcCrow(lat,lng,data[i].event.location.lat,data[i].event.location.lng).toFixed(1) <= 15000){
                    var ticket = document.createElement('div');
                    ticket.className = "ticket-wrapper"
                    ticket.innerHTML = data[i].event.start.date +"---"+data[i].event.venue.displayName;
                    songkickTickets.appendChild(ticket);
                }    
            }
            jQuery('body').append(songkickTickets);
        }
        // upon success, do this
        function success(pos) {
            // get longitude and latitude from the position object passed in
            var lng = pos.coords.longitude;
            var lat = pos.coords.latitude;
            var xmlhttp = new XMLHttpRequest();
            var apiKey = 'heMLjOnXj1zuWDXP';
            var artist_id = '2905251';
            var url = 'https://api.songkick.com/api/3.0/artists/' + artist_id + '/calendar/managed_performances.json?apikey=' + apiKey + '&per_page=all';

            var tickets = document.createElement('div');
            tickets.className = "songkick-wrapper";
            xmlhttp.onreadystatechange = function () {
                if (this.readyState == 4 && this.status == 200) {
                    data = JSON.parse(this.responseText).resultsPage.results;
                    totalEntries = JSON.parse(this.responseText).resultsPage.totalEntries;
                    buildTicket(data.performance,lat,lng);
                }
            };
            xmlhttp.open("GET", url, true);
            xmlhttp.send();

        }

        function error(err) {
            return msg = err;
        }
    } // end requestLocation();

} // end getLocation()

// attach getLocation() to button click
jQuery('.check-button').on('click', function () {
    // show spinner while getlocation() does its thing
    console.info(getLocation());
});